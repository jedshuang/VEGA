package com.tutorial;

import com.tutorial.graph.TutorialGraph;

import java.util.Date;

public abstract class AbstractTutorial implements Tutorial {
    TutorialGraph tutorialGraph;
    String name;
    String description;
    String creator;
    Date date;
    String label;
    protected boolean hasStarted;

    public String getDescription() {
        return this.description;
    }

    public String getCreator() {
        return this.creator;
    }

    public Date getDate() {
        return this.date;
    }

    public String getName() {
        return this.name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public TutorialGraph getGraph() {
        return tutorialGraph;
    }

    public String print(){
        // print some additional information about the tutorial maybe
        return tutorialGraph.toString();
    }

    public AbstractTutorial(String name, String description, String creator, String label, Date date, TutorialGraph tutorialGraph) {
        this.name = name;
        this.description = description;
        this.creator = creator;
        this.label = label;
        this.date = date;
        this.tutorialGraph = tutorialGraph;
        this.hasStarted = false;
    }


}
