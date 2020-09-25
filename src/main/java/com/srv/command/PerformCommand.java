package com.srv.command;

import com.beust.jcommander.Parameter;
import com.tutorial.Tutorial;
import com.tutorial.exception.TutorialNotStartedException;
import com.tutorial.selector.SimpleTutorialSelector;
import com.tutorial.selector.TutorialSelector;

public class PerformCommand implements Command{
    @Override
    public String execute() {
        TutorialSelector selector = SimpleTutorialSelector.getTutorialSelector();
        if(selector.getCurrentTutorial() == null){
            // append usage information
            return "Select a tutorial!";
        }
        Tutorial currentTutorial = selector.getCurrentTutorial();
        try{
            currentTutorial.perform();
        }catch(TutorialNotStartedException te){
            return "Start the current tutorial first!";
        }

        // append usage information
        return null;
    }

    // this doesn't do anything yet
    @Parameter(names = {"-h", "--help"}, help = true)
    private boolean help;
}
