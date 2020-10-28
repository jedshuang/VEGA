let connect = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	  const port = chrome.tabs.connect(tabs[0].id);
	  port.postMessage({ function: 'html' });
	  port.onMessage.addListener((response) => {
		html = response.html;
		title = response.title;
		description = response.description;
	  });
	});
  };
$( document ).ready(function() {

	// postToDatabase();
	

	//Loads the record into the frame
	$("#load_record").on("click", function(){
		//send data to server
		console.log("load_record click");
		chrome.browserAction.setPopup({
			popup: "./html/load_record.html"
		});
		//Changes page immediately
		window.location.href="/html/load_record.html";
	});

	$("#newR").on("click", function(){
		console.log("newR click");
		chrome.runtime.sendMessage({command: COMMANDS.GETRECORDINGSTATE}, function(response) {
			//sends a message to the recording_content_state, which turns off
			if(response.state == true){
				chrome.browserAction.setPopup({
					popup: "./html/recording.html"
				});
				//Changes page immediately
				window.location.href="/html/recording.html";
			}
			else {
				chrome.browserAction.setPopup({
					popup: "./html/new_record.html"
				});
				//Changes page immediately
				window.location.href="/html/new_record.html";
			}
	
		});
		
	});
	$("#connect").on("click", function(){
		console.log("connect click");
		chrome.runtime.sendMessage({command: "connect"}, function(response) {
			console.log("Connect message sent");
		});
		
	});
	// If recording or if a tutorial is loaded, then the opposite button should be disabled
	chrome.runtime.sendMessage({command: COMMANDS.GETLOADSTATUS}, function(response) {
        //sends a message to the recording_content_state, if recording disable the load_record button
        if(response == true){
            $('#newR').attr("disabled", true);
        }
    });


	chrome.runtime.sendMessage({command: COMMANDS.GETRECORDINGSTATE}, function(response) {
        //sends a message to the recording_content_state, if recording disable the load_record button
        if(response.state == true){
            $('#load_record').attr("disabled", true);
        }
    });
	// //Clear button clears list
	// $("#clear_record").click(function(){
	// 	//send data to server
	// 	chrome.runtime.sendMessage({command: "clear"}, 
	// 		function(response) {
	// 			console.log(response);
	// 		});
	// });

});