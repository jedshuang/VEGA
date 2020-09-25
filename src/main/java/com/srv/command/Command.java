package com.srv.command;

public interface Command {
//    Response execute(); // implement this later for more sophisticated communication
    String execute();  // String returned is the result response from the server
}
