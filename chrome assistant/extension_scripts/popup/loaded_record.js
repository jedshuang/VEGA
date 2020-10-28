$(document).ready(function() {
    
    chrome.runtime.sendMessage({command: COMMANDS.PEEK}, function(response) {
        // var current_tutorial = JSON.parse(response.tutorial);
        // current_tutorial.DAG = graphlib.json.read(current_tutorial.DAG); 
        console.log("PEEK response");
        console.log(JSON.parse(response.tutorial));
        $("#tutorial_title").text(JSON.parse(response.tutorial).tutorial_name);
        $("#tutorial_description").text(JSON.parse(response.tutorial).description);
    });

    $("#quit").on('click', function(e) {
        console.log("Quitting tutorial");
                // chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
                //     // since only one tab should be active and in the current window at once
                //     // the return variable should only have one entry
                //     chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.LOAD}, function(response) {
                //         console.log('Start action sent');
                //     });//end send message
                // });//end query
        // tell main to add next btton and go to first page.



        // set the popup to the popup.html
        // send reset command, remove interface
        chrome.runtime.sendMessage({command: COMMANDS.RESET});
        // reload the page
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.REMOVE_INTERFACE}, function(response) {
                console.log('Start action sent');
            });//end send message
        });//end query
        // chrome.runtime.sendMessage({command: COMMANDS.REMOVE_INTERFACE});
        // location.reload();
        chrome.browserAction.setPopup({
			popup: "./html/popup.html"
		});
		//Changes page immediately
		window.location.href="/html/popup.html";
    });
    $("#back_button").on('click', function() {
        //send data to server
		console.log("back_button click");
		chrome.browserAction.setPopup({
			popup: "./html/load_record.html"
		});
		//Changes page immediately
		window.location.href="/html/load_record.html";
    });
});

// function get_dag(callback){
//     chrome.runtime.sendMessage({command: COMMANDS.PEEK}, function(response) {
//         var current_tutorial = JSON.parse(response.tutorial);
//         current_tutorial.DAG = graphlib.json.read(current_tutorial.DAG); 
//        callback(current_tutorial);
//     });
// } //end peek send msg

function get_dag() {
    chrome.runtime.sendMessage({command: COMMANDS.PEEK}, function(response) {
        // var current_tutorial = JSON.parse(response.tutorial);
        // current_tutorial.DAG = graphlib.json.read(current_tutorial.DAG); 
        $("$tutorial_title").text(response.tutorial.tutorial_name);
    });
}