package com.native_messaging.protocol;

import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;

import com.native_messaging.main.Application;

public class NativeMessagingHelper {
    /**
	 * Parse message from System.in
	 * 
	 * @param in
	 *            the input stream
	 * @return the actual String , removed the 4 bytes length.
	 * @throws IOException
	 */
	public static String readMessage(InputStream in) throws IOException {
		byte[] b = new byte[4];
		in.read(b);

		int size = getInt(b);
		Application.log(String.format("The size of message is %d", size));

		if (size == 0) {
			throw new InterruptedIOException("Blocked communication");
		}

		b = new byte[size];
		in.read(b);
		Application.log("read message success," + new String(b, "UTF-8"));
		return new String(b, "UTF-8");
	}

    /**
	 * send response message.
	 * 
	 * preceded with 32-bit message length
	 * 
	 * @param message
	 *            the json string message to send
	 * @throws IOException
	 * 
	 */
	public static void sendMessage(String message) throws IOException {
		System.out.write(getBytes(message.length()));
		System.out.write(message.getBytes("UTF-8"));
		System.out.flush();
	}

	public static int getInt(byte[] bytes) {
		return (bytes[3] << 24) & 0xff000000 | (bytes[2] << 16) & 0x00ff0000 | (bytes[1] << 8) & 0x0000ff00
				| (bytes[0] << 0) & 0x000000ff;
	}

	private static byte[] getBytes(int length) {
		byte[] bytes = new byte[4];
		bytes[0] = (byte) (length & 0xFF);
		bytes[1] = (byte) ((length >> 8) & 0xFF);
		bytes[2] = (byte) ((length >> 16) & 0xFF);
		bytes[3] = (byte) ((length >> 24) & 0xFF);
		return bytes;
	}
}
