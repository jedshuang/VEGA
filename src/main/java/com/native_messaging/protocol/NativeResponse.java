package com.native_messaging.protocol;

// import javax.xml.bind.annotation.XmlElement;

/**
 * A simple JSON Response, JSON with a message field
 */
public class NativeResponse {

	// @XmlElement(name = "message")
	private String message;

	public NativeResponse() {
		super();
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "NativeResponse [message=" + message + "]";
	}

}
