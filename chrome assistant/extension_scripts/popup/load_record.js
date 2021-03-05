var sendLoadMessageWithTutorial = function(response) {
    console.log(response.val()[$("#formName").val()]);
    var r = response.val()[$("#formName").val()];
    chrome.runtime.sendMessage({command: COMMANDS.LOADTUTORIAL, DAG: r.DAG, tutorial_name: r.name, description: r.description, id: r.root_node_id});
}

$(document).ready(function() {
    let loaded = false;

    chrome.runtime.sendMessage({command: COMMANDS.GETLOADSTATUS}, function(response){
        if(response) {
            $("#continue").css({"visibility":"visible"});
        }
        else {
            $("#continue").css({"visibility":"hidden"});
        }
    });

    $("#searchR").on('click', async function(e) {

        //Loads the record into the frame and sends for the background

        // clear to reset the current background state
        chrome.runtime.sendMessage({command: COMMANDS.RESET});
        // chrome.runtime.sendMessage({command: COMMANDS.REMOVE_INTERFACE})

        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.REMOVE_INTERFACE}, function(response) {
                console.log('Start action sent');
            });//end send message
        });//end query

        // pass sendLoadMessageWithTutorial as a callback to getFromDatabase
        getFromDatabase(sendLoadMessageWithTutorial);
        loaded = true;
 
        if(loaded) {
            // $("#searchR").prop("disabled", true);        // should stay enabled so that you can search again.
            $("#beginR").prop("disabled", false);
            $("#continue").css({"visibility":"hidden"});
        }
        // add a display of tutorial title and description
    });
    $("#beginR").on('click', function(e) {
        console.log("Entering load record function");
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.LOAD}, function(response) {
                console.log('Start action sent');
            });//end send message
        });//end query

        chrome.browserAction.setPopup({
			popup: "./html/loaded_record.html"
		});
		//Changes page immediately
		window.location.href="/html/loaded_record.html";
        // tell main to add next btton and go to first page.
    });

    $("#continue").on('click', function(e) {
        console.log("Continuing tutorial playback function");
        
        chrome.browserAction.setPopup({
			popup: "./html/loaded_record.html"
		});
		//Changes page immediately
		window.location.href="/html/loaded_record.html";
        // tell main to add next btton and go to first page.
    });

    $("#back_button").on('click', function() {
        //send data to server
		console.log("back_button click");
		chrome.browserAction.setPopup({
			popup: "./html/popup.html"
		});
		//Changes page immediately
		window.location.href="/html/popup.html";
    });
});