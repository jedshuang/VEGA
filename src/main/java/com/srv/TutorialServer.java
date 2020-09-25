package com.srv;

import com.beust.jcommander.ParameterException;
import com.srv.command.*;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import com.beust.jcommander.JCommander;
import com.tutorial.selector.SimpleTutorialSelector;
import com.tutorial.selector.TutorialSelector;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

//import java.net.InetSocketAddress;
//import java.nio.channels.ServerSocketChannel;
//import java.nio.channels.SocketChannel;
//import java.io.IOException;
//import java.util.Set;



public class TutorialServer {
    // configuration file path info for the server
    private static final String CONFIG_FILE_DIR = ".tutorial-config";
    private static final String CONFIG_FILE_NAME = "tutservd.json";
    JSONParser jsonParser;
    // where tutorial json files are stored
    String tutorialHome;
    Integer port;
    // ServerSocketChannel server;
    ServerSocket server;
    TutorialSelector tutorialSelector;
    private TutorialServer() {
        jsonParser = new JSONParser();
        tutorialSelector = SimpleTutorialSelector.getTutorialSelector();
    }

    private void initialize() {
        setTutorialHome();
        createListeningSocket();
    }

    private void createListeningSocket() {
        try {
            // server.configureBlocking(true);
            // server.socket().bind(new InetSocketAddress(port));
            server = new ServerSocket(port);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private JCommander createCmdParser() {
        LoadCommand lc = new LoadCommand(tutorialHome);
        StartCommand sc = new StartCommand();
        NextCommand nc = new NextCommand();
        PerformCommand pc = new PerformCommand();
        JCommander parser = JCommander
                .newBuilder()
                .addCommand("load", lc)
                .addCommand("start", sc)
                .addCommand("next", nc)
                .addCommand("perform", pc)
                .build();
        return parser;
    }

    private void setTutorialHome() {
        // if we want to go with the environment variable approach, change this part
        try {
            final String projectDirectory = System.getenv("APOLLO");
            FileReader configFile = new FileReader(projectDirectory.concat("/" + CONFIG_FILE_DIR + "/").concat(CONFIG_FILE_NAME));
            JSONObject configJSON = (JSONObject) jsonParser.parse(configFile);

            // set tutorial home
            tutorialHome = (String) configJSON.get("tutorial-home");
            if (tutorialHome == null) {
                tutorialHome = System.getenv("TUTORIAL_HOME");
            } else if (tutorialHome.charAt(0) == '~') {
                tutorialHome = System.getProperty("user.home") + tutorialHome.substring(1);
            }

            // set server port
            port = Integer.parseInt((String) configJSON.get("port"));
        } catch (FileNotFoundException fe) {
            fe.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void listenToRequest() {
        try {
            while (true) {
//                SocketChannel sChannel = ssChannel.accept();
                Socket acceptedSocket = server.accept();
                System.out.println("Command Accepted");
                ObjectInputStream receivingStream = new ObjectInputStream(new BufferedInputStream(acceptedSocket.getInputStream()));
                ObjectOutputStream outputStream = new ObjectOutputStream(new BufferedOutputStream(acceptedSocket.getOutputStream()));
                String[] commandArray = (String[]) receivingStream.readObject();
                String response = null;
                // execute the command by JCommander
                JCommander parser = createCmdParser();
                try {
                    parser.parse(commandArray);
                    String parsedCommand = parser.getParsedCommand();
                    // retrieve the corresponding command object passed in
                    JCommander registeredJCommander = parser.getCommands().get(parsedCommand);
                    if (registeredJCommander == null) {
                        String usage = usage(parser);
                        response = usage;
                    } else {
                        Command cmdObject = (Command) registeredJCommander.getObjects().get(0);
                        response = cmdObject.execute();
                    }
                } catch (ParameterException pe) {
                    response = pe.getMessage();
                }

                // write to client
                outputStream.writeObject(response);

                // closing one is suffice probably
                outputStream.close();
                receivingStream.close();
                // don't know if this is necessary
                acceptedSocket.close();
            }
        } catch (IOException | ClassNotFoundException e) {
            // expect client to send object
            e.printStackTrace();
        }

    }

    private String usage(JCommander commander) {
        StringBuilder usageSB = new StringBuilder();
        commander.getUsageFormatter().usage(usageSB);
        return usageSB.toString();
    }


    public static void main(String[] args) {
        TutorialServer server = new TutorialServer();
        server.initialize();
        // use socket to communicate with client
        System.out.println("Listening for client requests");
        server.listenToRequest();
    }
}
