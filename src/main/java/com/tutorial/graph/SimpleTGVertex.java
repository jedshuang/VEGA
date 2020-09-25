package com.tutorial.graph;

import org.json.simple.JSONObject;

public abstract class SimpleTGVertex implements TGVertex {
    String id;
    String name;
    String description;

    @Override
    public String getID() {
        return id;
    }

    @Override
    public String getDescription() {
        return description;
    }

    // should data be part of task?
    @Override
    public String getName() {
        return name;
    }

    protected SimpleTGVertex(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    protected SimpleTGVertex(String id, JSONObject nodeJSONObj) {
        String name = (String) nodeJSONObj.get("name"),
                description = (String) nodeJSONObj.get("description");
        this.id = id;
        this.name = name;
        this.description = description;
    }


}
