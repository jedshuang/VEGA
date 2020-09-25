package com.srv.command;

import com.beust.jcommander.Parameter;
import com.tutorial.Tutorial;
import com.tutorial.selector.SimpleTutorialSelector;
import com.tutorial.selector.TutorialSelector;

public class StartCommand implements Command {

    @Override
    public String execute() {
        TutorialSelector selector = SimpleTutorialSelector.getTutorialSelector();
        if(selector.getCurrentTutorial() == null){
            // append usage information
            return "Select a tutorial to start first!";
        }
        Tutorial currentTutorial = selector.getCurrentTutorial();
        currentTutorial.start();
        // append usage information
        return String.format("Tutorial %s started! enter print to view the graph, next to go to next node", currentTutorial.getName());
    }

    // this doesn't do anything yet
    @Parameter(names = {"-h", "--help"}, help = true)
    private boolean help;
}
