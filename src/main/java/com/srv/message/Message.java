package com.srv.message;

// message to be exchanged between server and client
public interface Message {
    Response getResponse();
    Request getRequest();
}
