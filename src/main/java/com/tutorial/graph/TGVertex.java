package com.tutorial.graph;

import com.tutorial.task.Task;

public interface TGVertex extends Task {
    String getID();
//    change this to not just be String but custom data type in the future?
    String getName();
    String getDescription();
}
