package com.native_messaging.protocol;

// import javax.xml.bind.annotation.XmlElement;

/**
 * A simple JSON Request, JSON with a message field
 */
public class NativeRequest {

	// @XmlElement(name = "message")
	private String message;

	public NativeRequest() {
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
		return "NativeRequest [message=" + message + "]";
	}

}
