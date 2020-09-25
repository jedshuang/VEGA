package com.tutorial.selector;

import com.tutorial.Tutorial;

import java.util.HashMap;
import java.util.Map;

public class SimpleTutorialSelector implements TutorialSelector {


    Map<String, Tutorial> tutorials;
    Tutorial selectedTutorial;
    private static TutorialSelector selectorSingleton = null;
    private SimpleTutorialSelector(){
        tutorials = new HashMap<String, Tutorial>();
    }
    public static TutorialSelector getTutorialSelector(){
        if(selectorSingleton == null)
            selectorSingleton = new SimpleTutorialSelector();
        return selectorSingleton;
    }
    @Override
    public void register(Tutorial tg) {
        tutorials.put(tg.getName(), tg);
    }

    @Override
    public void unregister(String name) {
        tutorials.remove(name);
    }

    @Override
    public void save(String path) {
    }

    @Override
    public Tutorial select(String name) {
        selectedTutorial = tutorials.getOrDefault(name, null);
        return selectedTutorial;
    }

    @Override
    public Tutorial getCurrentTutorial() {
        return selectedTutorial;
    }
}
