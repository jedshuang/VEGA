package com.tutorial.exception;

public class TutorialNotStartedException extends RuntimeException {
    public TutorialNotStartedException(String errorMessage){
        super(errorMessage);
    }
    public TutorialNotStartedException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
}
