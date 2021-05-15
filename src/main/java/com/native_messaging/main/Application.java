package com.native_messaging.main;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import rx.Observable;
import rx.Observer;
import rx.Subscriber;
import rx.observables.ConnectableObservable;
import rx.schedulers.Schedulers;
import util.models.TerminalModel;

import com.cli.ATutorialTerminal;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.native_messaging.protocol.NativeRequest;
import com.native_messaging.protocol.NativeResponse;
import com.native_messaging.protocol.NativeMessagingHelper;

import bus.uigen.OEFrame;
import bus.uigen.ObjectEditor;


/**
 * Simple Example for Native App, handling Chrome extension native message.
 * 
 * each message is serialized using JSON, UTF-8 encoded and is preceded with 32-bit message length in native byte order
 * 
 * Chrome starts each native messaging host in a separate process and communicates with it using standard input (stdin)
 * and standard output (stdout).
 */
public class Application {

	public final static String MESSAGE = "message";
	private final AtomicBoolean interrompe;
	private final static int TERMINAL_WIDTH = 600;
	private final static int TERMINAL_HEIGHT = 600;

	// Debug log path
	private final static String PATH_LOG = "/tmp/test.log";

	// debug enable flag
	private final static boolean DEBUG_ENABLE = true;

	// Simple log for debug. need to use a more functional library instead. eg. log4j.
	public static void log(String message) {

		if (!DEBUG_ENABLE) {
			return;
		}

		File file = new File(PATH_LOG);

		try {
			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fileWriter = new FileWriter(file.getAbsoluteFile(), true);
			BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();

			bufferedWriter.write(dateFormat.format(date) + ": " + message + "\r\n");
			bufferedWriter.close();
		} catch (Exception e) {
			log("ERROR ==> Method (log)" + e.getMessage());
			e.printStackTrace();
		}
	}

	public Application() {
		this.interrompe = new AtomicBoolean(false);
	}

	// Main
	public static void main(String[] args) {
		log("Starting the app...");

		final Application app = new Application();
		TerminalModel terminal = new ATutorialTerminal();

		ConnectableObservable<String> obs = app.createObservable();
		obs.observeOn(Schedulers.computation()).subscribe(new Observer<String>() {
			public void onCompleted() {
			}

			public void onError(Throwable throwable) {
			}

			// message Handler
			public void onNext(String s) {

				log("===============================");
				log("received data: " + s);

				// Parse the message, we use the {message: ''} json to pass message.
				ObjectMapper mapper = new ObjectMapper();
				NativeRequest request = null;
				try {
					request = mapper.readValue(s, NativeRequest.class);
				} catch (IOException e) {
					e.printStackTrace();
				}
				log("request: " + request);

				NativeResponse response = new NativeResponse();
				response.setMessage(request.getMessage());
				log("response object: " + response);

				String responseJson = null;
				try {
					responseJson = mapper.writeValueAsString(response);
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}
				log("response Json: " + responseJson);

				Map<String, String> map;
				try {
					map = mapper.readValue(responseJson, new TypeReference<Map<String, String>>() {
					});
					terminal.addOutput(map.get(MESSAGE));
				} catch (JsonProcessingException e) {
					e.printStackTrace();
				}

				try {
					NativeMessagingHelper.sendMessage(responseJson);
				} catch (IOException e) {
					log("app.sendMessage error");
					e.printStackTrace();
				}
				log("app.sendMessage success ");
			}
		});

		obs.connect();

		ObjectEditor.setDoPrints(false);
		OEFrame frame = ObjectEditor.edit(terminal);
		frame.setSize(TERMINAL_WIDTH, TERMINAL_HEIGHT);

		while (!app.interrompe.get()) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				break;
			}
		}

		System.exit(0);
	}

	private ConnectableObservable<String> createObservable() {
		ConnectableObservable<String> observable = Observable.create(new Observable.OnSubscribe<String>() {
			@Override
			public void call(Subscriber<? super String> subscriber) {
				subscriber.onStart();
				try {
					while (true) {
						String _s = NativeMessagingHelper.readMessage(System.in);
						subscriber.onNext(_s);
					}
				} catch (InterruptedIOException ioe) {
					log("Blocked communication");
				} catch (Exception e) {
					subscriber.onError(e);
				}
				subscriber.onCompleted();
			}
		}).subscribeOn(Schedulers.io()).publish();

		observable.subscribe(new Observer<String>() {
			public void onCompleted() {
				log("App closed.");
				interrompe.set(true);
			}

			public void onError(Throwable throwable) {
				log("Unexpected error!");
				interrompe.set(true);
			}

			public void onNext(String s) {
			}
		});

		return observable;
	}	

}
