package com.tutorial.selector;

import com.tutorial.Tutorial;

public interface TutorialSelector {
    // add a tutorial, using name as id of tutorial
    void register(Tutorial tg);
    // remove a tutorial
    void unregister(String name);
    // when changing state to a tutorial json, update state in memory, might not need this in the future
    // by simply listening to changes in file system
    // path = path to the tutorial json
    void save(String path);
    // select the current tutorial
    Tutorial select(String name);
    // possibly duplicate method with select? a simple getter here might be useful in the future idk
    Tutorial getCurrentTutorial();
}
