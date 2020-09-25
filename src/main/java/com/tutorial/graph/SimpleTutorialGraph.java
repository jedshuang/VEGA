package com.tutorial.graph;

import java.util.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import com.util.factory.IOFactory;

public class SimpleTutorialGraph implements TutorialGraph {

    Map<String, List<String>> adjacencyList;
    Map<String, TGVertex> vertexMap;
    Map<String, TGEdge> edgeMap;
    Map<String, Integer> indegree;
    TGVertex currentVertex;
    // we assume there's only one entry point to the tutorial
    TGVertex root;

    public SimpleTutorialGraph() {
        this.edgeMap = new HashMap<String, TGEdge>();
        this.vertexMap = new HashMap<String, TGVertex>();
        this.adjacencyList = new HashMap<String, List<String>>();
        this.indegree = new HashMap<String, Integer>();
    }


    @Override
    public String toString(){
        // implement this method later since it's secondary
        StringBuilder str = new StringBuilder();
        Queue<TGVertex> queue = new LinkedList<TGVertex>();
//        queue.add(root);
        while(queue.size() > 0){
            /*
            * 1. search and add nodes of current level, with a null node at the end of queue
            *    to signify the end of level.
            * 2. build a path from the parent nodes' positions (root node is its own parent),
            *    calculate the indices of where every node should be at
            * 3. build the current string
            * */
        }
        return str.toString();
    }

    @Override
    public void setCurrentVertex(String nodeID) {
        currentVertex = vertexMap.get(nodeID);
    }

    @Override
    public TGVertex getCurrentVertex() {
        return currentVertex;
    }

    @Override
    public TGVertex next() {
        List<String> edges = adjacencyList.get(currentVertex.getID());
        if(edges == null || edges.size() == 0){
            // leaf, cannot go any further
            System.out.println("Reach the end of current step.");
        }else if(edges.size() > 1){
            // branch
            String nodeID = promptUserForChoice();
            currentVertex = vertexMap.get(nodeID);
        }else{
            currentVertex = edgeMap.get(edges.get(0)).getTarget();
        }
        return currentVertex;
    }

    // Prompts user for the name of the next node to advance to
    // Note that in this implementation a nodeID cannot be 'ls' as 'ls' is reserved for listing available nodes
    private String promptUserForChoice() {
        System.out.println("Please specify the next node to advance to: ");
        System.out.println(listNodes(currentVertex.getID()));

        Scanner scanner = IOFactory.getSysInScanner();
        String response = scanner.nextLine();

        // TODO: different check here that the node is a valid next node
        while (!vertexMap.containsKey(response)) {
            System.out.println("Please specify a valid next node to advance to ");
            response = scanner.nextLine();
        }
        return response;
    }

    @Override
    public void addEdge(TGEdge e) {
//        if(edgeMap.containsKey(e.getID()))
//            return;

        edgeMap.put(e.getID(), e);
        // add to adjacency list
        List<String> l = adjacencyList.getOrDefault(e.getSource().getID(), new LinkedList<String>());
        l.add(e.getID());
        adjacencyList.put(e.getSource().getID(), l);

        // update in-degree count
        Integer inDegreeCount = indegree.getOrDefault(e.getTarget().getID(), 0);
        indegree.put(e.getTarget().getID(), ++inDegreeCount);
        // need to initialize the indegree of nodes with outdegree
        indegree.putIfAbsent(e.getSource().getID(), 0);
    }

    @Override
    public void removeEdge(TGEdge e) {
        edgeMap.remove(e.getID());
        vertexMap.remove(e.getSource().getID());
        vertexMap.remove(e.getTarget().getID());
        Integer inDegreeCount = indegree.getOrDefault(e.getTarget().getID(), 0);
        indegree.put(e.getTarget().getID(), --inDegreeCount);
    }

    @Override
    public TGEdge getEdge(String edgeID) {
        return edgeMap.containsKey(edgeID) ? edgeMap.get(edgeID): null;
    }

    @Override
    public Map<String, List<String>> getAdjacencyList() {
        return adjacencyList;
    }

    @Override
    public void addVertex(TGVertex v) {
//        if(vertexMap.containsKey(v.getID()))
//            return;
        vertexMap.put(v.getID(), v);
    }

    @Override
    public void removeVertex(TGVertex v) {
        vertexMap.remove(v.getID());
    }

    @Override
    public TGVertex getVertex(String vertexID) {
        return  vertexMap.containsKey(vertexID) ? vertexMap.get(vertexID) : null;
    }

    @Override
    public void setDefaultStartingNode() {
        // set current vertex to be the one with 0 in-degree as starting point
        for(String nodeID : indegree.keySet()){
            if(indegree.get(nodeID) == 0){
                currentVertex = vertexMap.get(nodeID);
                root = vertexMap.get(nodeID);
                break;
            }
        }
    }

    @Override
    public void setStartingNode(String nodeID){
        setDefaultStartingNode();
        setCurrentVertex(nodeID);
    }


    @Override
    public String listNodes() {
        StringBuilder sb = new StringBuilder();
        for(TGVertex v : vertexMap.values()){
            // let node have a name
            sb.append(v.getID() + " ");
        }
        return sb.toString();
    }

    @Override
    public String listNodes(String nodeID) {
        StringBuilder sb = new StringBuilder();
        for(String edgeID : adjacencyList.get(nodeID)){
            // let node have a name
            sb.append(edgeMap.get(edgeID).getTarget().getID() + " ");
        }
        return sb.toString();
    }
}
