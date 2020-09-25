package com.tutorial;

import com.tutorial.exception.TutorialNotStartedException;
import com.tutorial.graph.TutorialGraph;
import com.tutorial.graph.TGVertex;

import java.util.Date;

public interface Tutorial {
    TutorialGraph getGraph();
    void start();
    void perform() throws TutorialNotStartedException;

    void next() throws TutorialNotStartedException;
    void back() throws TutorialNotStartedException;

    String getDescription();
    String getCreator();
    Date getDate();
    String getName();
    void setDescription(String description);
    void setLabel(String label);
    String print();
}
