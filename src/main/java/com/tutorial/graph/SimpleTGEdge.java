package com.tutorial.graph;

public class SimpleTGEdge implements TGEdge {

    String id;
    TGVertex source;
    TGVertex target;

    public SimpleTGEdge(String id, TGVertex source, TGVertex target){
        this.id = id;
        this.source = source;
        this.target = target;
    }

    @Override
    public String getID() {
        return id;
    }

    @Override
    public TGVertex getSource() {
        return source;
    }

    @Override
    public TGVertex getTarget() {
        return target;
    }
}
