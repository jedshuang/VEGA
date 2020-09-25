package com.tutorial.task;

import java.net.URI;

public interface BrowserTask extends Task {
    URI getURI();
    void setURI(URI uri);
}
