package com.tutorial.graph;

import java.util.List;
import java.util.Map;

public interface TutorialGraph{
    Map<String, List<String>> getAdjacencyList();
    void addVertex(TGVertex v);
    void removeVertex(TGVertex v);
    TGVertex getVertex(String vertexID);
    void addEdge(TGEdge e);
    void removeEdge(TGEdge e);
    TGEdge getEdge(String edgeID);
    void setStartingNode(String nodeID);
    void setDefaultStartingNode();
    void setCurrentVertex(String nodeID);
    TGVertex getCurrentVertex();
    TGVertex next();

    /**
     * these methods might need to be in a separate interface for user interaction?
     **/
    // should eventually interact with the JCommander's ls method
    // displays all the nodes in the tutorial graph
    String listNodes();
    // displays all the available next nodes for the current node
    String listNodes(String nodeID);


}
