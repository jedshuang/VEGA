package com.tutorial.web;

import com.tutorial.graph.TGVertex;
import com.tutorial.task.BrowserTask;
import com.tutorial.graph.SimpleTGVertex;
import org.json.simple.JSONObject;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class WebTGVertex extends SimpleTGVertex implements BrowserTask {
    private URI uri;

    // open a browser and go to the url
    @Override
    public void execute() {
        // need to use the data to highlight parts of the web page
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(this.uri);
            }
        } catch (IOException ie) {
            ie.printStackTrace();
        }
    }

    @Override
    public URI getURI() {
        return uri;
    }

    @Override
    public void setURI(URI uri) {
        this.uri = uri;
    }

    public WebTGVertex(URI uri, String id, String name, String description) {
        super(id, name, description);
        this.uri = uri;
    }

    public WebTGVertex(String nodeID, JSONObject nodeJSONObj) {
        super(nodeID, nodeJSONObj);
        try {
            URI uri = new URI((String) nodeJSONObj.get("url"));
            this.uri = uri;
        } catch (URISyntaxException uriException) {
        }
    }


}
