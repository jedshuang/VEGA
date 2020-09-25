package com.cli;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileReader;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.net.UnknownHostException;

public class TutorialClient {

    Socket client = null;
    private static final String CONFIG_FILE_DIR = ".tutorial-config";
    private static final String CONFIG_FILE_NAME = "tutservd.json";
    Integer serverPort;

    private TutorialClient() {
    }

    private void sendCommandToServer(String[] args) {
        try {
            ObjectOutputStream oos = new
                    ObjectOutputStream(client.getOutputStream());
            oos.writeObject(args);
            ObjectInputStream ois = new ObjectInputStream(client.getInputStream());
            Object response = ois.readObject();
            if (response == null) {
                return;
            }
            System.out.println((String) response);
            // Closing either the input or the output stream of a Socket closes the other stream and the Socket.
            oos.close();
            // Don't know if this is necessary
            client.close();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return;
        }
    }

    private void setServerConfiguration() throws IOException, ParseException {
        final String projectDirectory = System.getenv("APOLLO");
        JSONParser jsonParser = new JSONParser();
        FileReader configFile = new FileReader(projectDirectory.concat("/" + CONFIG_FILE_DIR + "/").concat(CONFIG_FILE_NAME));
        JSONObject configJSON = (JSONObject) jsonParser.parse(configFile);
        serverPort = Integer.parseInt((String) configJSON.get("port"));
    }

    private boolean initialize() {
        try {
            setServerConfiguration();
            client = new Socket("localhost", serverPort);
            return true;
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (IOException e) {
            if (serverPort == null)
                e.printStackTrace();
            else
                System.err.printf("Cannot connect to the apollo server at port %d. Is the apollo server running?\n", serverPort);
        } catch (ParseException e) {
            System.err.println("Cannot locate server configuration file at project directory");
            e.printStackTrace();
        }
        return false;
    }

    public static void main(String[] args) {
        TutorialClient client = new TutorialClient();
        if (!client.initialize())
            return;
        client.sendCommandToServer(args);
    }
}
