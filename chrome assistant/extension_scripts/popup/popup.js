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
	var signedIn = false;
	var user = null;

	chrome.runtime.sendMessage({ command: COMMANDS.ISUSERSIGNEDIN}, function (response) {
		signedIn = response;
		if(signedIn) {
			$("#firebaseui-auth-container").hide();
			$("#sign_out").show();
			chrome.runtime.sendMessage({ command: COMMANDS.GETUSERSIGNEDIN}, function (response) {
				user = response;
			});
		}
		else {
			$("#sign_out").hide();
			$("#newR").hide();
		}
	});

	
	 // sign in UI
		
	// Initialize the FirebaseUI Widget using Firebase.
	var ui = new firebaseui.auth.AuthUI(firebase.auth());

	const uiConfig = {
		callbacks: {
			signInSuccessWithAuthResult: function (authResult, redirectUrl) {
				console.log("current user");
				console.log(firebase.auth().currentUser);
				user = authResult;
				$("#sign_out").show();
				$("#newR").show();
				chrome.runtime.sendMessage({ command: COMMANDS.SIGNIN, user: authResult }, function (response) {
					// if (response.message === 'success') {
						// window.location.replace('./welcome.html');
					// }
				});
				return false;
			},
			uiShown: function () {
			}
		},
		signInFlow: 'popup',
		// signInSuccessUrl: '<url-to-redirect-to-on-success>',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			{
				provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				customParameters: {
					prompt: 'select_account'
				}
			},
			firebase.auth.EmailAuthProvider.PROVIDER_ID
		],
		// Terms of service url.
		// tosUrl: '<your-tos-url>',
		// Privacy policy url.
		// privacyPolicyUrl: '<your-privacy-policy-url>'
	};

	ui.start('#firebaseui-auth-container', uiConfig);
	
	


	$("#sign_out").on("click", function() {
		console.log("sign_out clicked");
		chrome.runtime.sendMessage({command: COMMANDS.SIGNOUT}, function(response) {
			if(response) {
				user = null;
				signedIn = false;
				$("#firebaseui-auth-container").show();
				$("#sign_out").hide();
				$("#newR").hide();
			}
			else {
				// alert the user that they need to sign out, or end the recording
			}
		});
	});


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
		chrome.runtime.sendMessage({command: COMMANDS.CONNECT}, function(response) {
			console.log("Connect message sent");
		});
		
	});
	$("#disconnect").on("click", function(){
		console.log("disconnect click");
		chrome.runtime.sendMessage({command: COMMANDS.DISCONNECT}, function(response) {
			console.log("Disconnect message sent");
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