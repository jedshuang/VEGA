package com.cli;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.native_messaging.main.Application;
import com.native_messaging.protocol.NativeMessagingHelper;
import com.native_messaging.protocol.NativeResponse;

import util.annotations.Column;
import util.annotations.Row;
import util.models.ATerminalModel;

public class ATutorialTerminal extends ATerminalModel {

	public ATutorialTerminal() {
		super();
		addOutput("VEGA GUI Started");
	}

    @Row(2)
	@Column(0)
	public void next() {
		setInput("next");
	}
	
	public void load(String aTutorial) {
		setInput("load " + aTutorial);
	}
    
    @Override
	public void setInput(String string) {
		super.setInput(string);
		// Parse the message, we use the {message: ''} json to pass message.
		ObjectMapper mapper = new ObjectMapper();

		NativeResponse response = new NativeResponse();
		response.setMessage(string);
		Application.log("response object: " + response);

		String responseJson = null;
		try {
			responseJson = mapper.writeValueAsString(response);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		Application.log("response Json: " + responseJson);

		try {
			NativeMessagingHelper.sendMessage(responseJson);
		} catch (IOException e) {
			Application.log("app.sendMessage error");
			e.printStackTrace();
		}
		Application.log("app.sendMessage success ");

		this.addOutput("My output");
//		this.clear();
	}
    
}
