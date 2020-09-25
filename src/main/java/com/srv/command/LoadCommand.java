package com.srv.command;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import com.tutorial.Tutorial;
import com.tutorial.graph.SimpleTGEdge;
import com.tutorial.graph.SimpleTutorialGraph;
import com.tutorial.graph.TGVertex;
import com.tutorial.graph.TutorialGraph;
import com.tutorial.selector.SimpleTutorialSelector;
import com.tutorial.selector.TutorialSelector;
import com.tutorial.web.WebTGVertex;
import com.tutorial.web.WebTutorial;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Set;

@Parameters(commandDescription = "load an existing tutorial file")
public class LoadCommand implements Command {

    String tutorialHome;

    public LoadCommand(String tutorialHome) {
        this.tutorialHome = tutorialHome;
    }

    @Override
    public String execute() {
        TutorialSelector selector = SimpleTutorialSelector.getTutorialSelector();
        if (selector.select(graphFile) != null)
            return null;

        JSONParser jsonParser = new JSONParser();
        try {
//            System.out.println(String.format("%s/%s", tutorialHome, graphFile));
            JSONObject jsonObject = (JSONObject) jsonParser.parse(new FileReader(String.format("%s/%s", tutorialHome, graphFile)));
            TutorialGraph tg = new SimpleTutorialGraph();

            JSONObject nodeMap = (JSONObject) jsonObject.get("nodes");
            JSONObject edgeMap = (JSONObject) jsonObject.get("edges");

            // build the tutorial graph
            for (String edgeID : (Set<String>) edgeMap.keySet()) {
                JSONObject edge = (JSONObject) edgeMap.get(edgeID);

                // create the nodes
                String sourceNodeID = (String) edge.get("source");
                String targetNodeID = (String) edge.get("target");
                TGVertex sourceNode = tg.getVertex(sourceNodeID);
                TGVertex targetNode = tg.getVertex(targetNodeID);
                if (sourceNode == null) {
                    JSONObject node = (JSONObject) nodeMap.get(sourceNodeID);
                    sourceNode = new WebTGVertex(sourceNodeID, node);
                    tg.addVertex(sourceNode);
                }

                if (targetNode == null) {
                    JSONObject node = (JSONObject) nodeMap.get(targetNodeID);
                    targetNode = new WebTGVertex(targetNodeID, node);
                    tg.addVertex(targetNode);
                }

                // create edge instance
                tg.addEdge(new SimpleTGEdge(edgeID, sourceNode, targetNode));
            }

            String c = (String) jsonObject.get("creator"),
                    n = (String) jsonObject.get("name"),
                    d = (String) jsonObject.get("description");

            Tutorial sampleTutorial = WebTutorial.Builder.newBuilder().creator(c).description(d).name(n).setGraph(tg).build();
            selector.register(sampleTutorial);
            selector.select(sampleTutorial.getName());
            return String.format("Loaded Tutorial %s", sampleTutorial.getName());
        } catch (ParseException | FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    // need to know how to pass the tutorial home path information to validator or else it can't be used.
    // @Parameter(description = "JSON tutorial file", validateWith = {GraphFileValidator.class}, converter = FileReaderConverter.class, required = true)
    // public FileReader graphFile;

    @Parameter(description = "JSON tutorial file", required = true)
    public String graphFile;

    // this doesn't do anything yet
    @Parameter(names = {"-h", "--help"}, help = true)
    private boolean help;
}
