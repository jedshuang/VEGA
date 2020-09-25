package com.tutorial.web;

import com.tutorial.exception.TutorialNotStartedException;
import com.util.factory.IOFactory;
import com.tutorial.AbstractTutorial;
import com.tutorial.Tutorial;
import com.tutorial.graph.TutorialGraph;

import java.util.Date;
import java.util.Scanner;

public class WebTutorial extends AbstractTutorial {
    // Using a builder pattern here because we might need to read in multiple tutorials and choose one.
    // and builder pattern prevents the error (i.e. incorrect object state from mistakes of inputting parameters)
    // from having too many constructor parameters, since our tutorial has many fields
    // cleaner to read for which value goes to which field
    public static class Builder {
        String name;
        String description;
        String creator;
        Date date;
        String label;
        TutorialGraph graph;

        /*
         * potentially other web tutorial specific stuffs...
         * */

        public static Builder newBuilder() {
            return new Builder();
        }

        private Builder() {
        }

        public Builder creator(String creator) {
            this.creator = creator;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder creationDate(Date date) {
            this.date = date;
            return this;
        }

        public Builder label(String label) {
            this.label = label;
            return this;
        }

        public Builder setGraph(TutorialGraph graph) {
            this.graph = graph;
            return this;
        }

        public Tutorial build() {
            return new WebTutorial(this);
        }

    }


    public WebTutorial(Builder tb) {
        // String name, String description, String creator, String label, Date date
        super(tb.name, tb.description, tb.creator, tb.label, tb.date, tb.graph);
    }


    @Override
    public void start() {
        // the idea is to call this method on the tutorial selected by the tutorial selector
        // in order to traverse through the graph and perform the tasks like next, back, etc. etc.
        this.hasStarted = true;

        /**
         * this method just sets the initial state of the tutorial
         **/

        TutorialGraph graph = this.getGraph();
        // assume the tutorial graph file has a graph
        graph.setDefaultStartingNode();

//        System.out.println("This branch currently only supports the next function.");
//        System.out.println("Start the tutorial from the beginning? (y/n)");
//        Scanner scanner = IOFactory.getSysInScanner();
//        String response = scanner.nextLine();
//        TutorialGraph graph = this.getGraph();
//        if (Character.toLowerCase(response.charAt(0)) == 'y') {
//            // set the currentVertex to the tutorial entry point, set root
//            if (graph != null) {
//                graph.setDefaultStartingNode();
//            } else {
//                System.err.println("Tutorial Graph not loaded");
//            }
//        } else {
//            // change this to just print the options and maybe use arrow keys to choose a node
//            System.out.println("Please specify the node to start from");
//            System.out.println(graph.listNodes());
//            response = scanner.nextLine();
//            graph.setStartingNode(response);
//        }
//
//        System.out.printf("\nTutorial %s started. \n\nCommand: \n" +
//                "next - go to the next node \n" +
//                "perform - perform the current tutorial step \n" +
//                "quit - stop the tutorial\n\n", this.getName());
//        response = scanner.nextLine();
//        while (Character.toLowerCase(response.charAt(0)) != 'q') {
//            if (Character.toLowerCase(response.charAt(0)) == 'n') {
//                next();
//            } else if (Character.toLowerCase(response.charAt(0)) == 'p') {
//                perform();
//            }
//            response = scanner.nextLine();
//        }
    }

    // perform the task at the current vertex, should this just delegate to the graph's perform method (by adding a perform method to graph)?
    @Override
    public void perform() throws TutorialNotStartedException {
        if (!hasStarted) {
            throw new TutorialNotStartedException("Start your tutorial first");
        }
        getGraph().getCurrentVertex().execute();
    }

    @Override
    public void next() throws TutorialNotStartedException{
        if (!hasStarted) {
            throw new TutorialNotStartedException("Start your tutorial first");
        }
        getGraph().next();
    }

    @Override
    public void back() throws TutorialNotStartedException{
        if (!hasStarted) {
            throw new TutorialNotStartedException("Start your tutorial first");
        }
        return;
    }
}
