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


	

	//Loads the record into the frame
	$("#load_record").on("click", function(){
		//send data to server
		console.log("load_record click");
		chrome.browserAction.setPopup({
			popup: "./html/load_record.html"
		});
		//Changes page immediately
		window.location.href="/html/load_record.html";
		
		
		/* old code for actually starting the recording. Should migrate to load_record.js */
		// chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
		// 	// since only one tab should be active and in the current window at once
		// 	// the return variable should only have one entry
		// 	/**
		// 	 * the data sent willl be of the form 
		// 	 * {
		// 	 *  command: 'load',
		// 	 * 	id: 'someTutID'
		// 	 * }
		// 	 */
		// 	chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:'load'}, function(response) {
		// 		console.log('Start action sent');
		// 	});//end send message
		});//end query

  	//end click

	$("#newR").on("click", function(){
		console.log("newR click");
		chrome.runtime.sendMessage({command: "get_recording_state"}, function(response) {
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
	// //Clear button clears list
	// $("#clear_record").click(function(){
	// 	//send data to server
	// 	chrome.runtime.sendMessage({command: "clear"}, 
	// 		function(response) {
	// 			console.log(response);
	// 		});
	// });

});



