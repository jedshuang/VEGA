$( document ).ready(function() {/*load data from background script*/
    // $("#startR").prop('disabled', $("#formName").val().length == 0 ? true : false );
    // chrome.runtime.sendMessage({command: "get_recording_state"}, function(response) {
    //     //sends a message to the recording_content_state, which turns off
    //     if(response.state == true){
    //     }

    // });
    chrome.runtime.sendMessage({command: COMMANDS.PEEK}, function(response) {
        //sends a message to the recording_content_state, which turns off
        let tutorial = JSON.parse(response.tutorial);
        $("#formName").val(tutorial.tutorial_name);
        console.log(JSON.parse(response.tutorial));
    });
});

$("#back_button").on("click", function(){
        chrome.browserAction.setPopup({
            popup: "./html/popup.html"
         });
         //Changes page immediately
         window.location.href="/html/popup.html";
});

/* On click functions for elements in popup.html */
$("#updateTitle").on("click", function(){
        chrome.runtime.sendMessage({command: COMMANDS.UPDATETITLEDESC, tutorial_name: $("#form input").val(), description: $("#formDescription").val()}, function(response) {
        //sends a message to the recording_content_state, which sets the tutorial name
            console.log(response.tutorial);
        });
        
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //     chrome.tabs.sendMessage(tabs[0].id, {command: "enable_hot_key"}, function(responsee) {
        //         console.log("Enable hot key returns: "+ responsee);
        //     });
        // });
        

   
});
$("#finishRecording").on('click', function() {
    console.log("Ending recording?");
    // change recording state to false
    chrome.runtime.sendMessage({command: COMMANDS.ENDRECORDING}, function(response) {
        //sends a message to the recording_state.js, which sets recording to false
        
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: COMMANDS.DISABLE_HOT_KEY}, function(response2) {
          console.log(response2);
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: COMMANDS.GET_AUTH}, function(response2) {
          console.log(response2);
        });
    });
    // chrome.runtime.sendMessage({command: "get_auth"});
    chrome.runtime.sendMessage({command: COMMANDS.SAVE}, 
    function(response) {
            console.log(response);
    });
    chrome.runtime.sendMessage({command: COMMANDS.RESET});
    // push the tutorial object to the server!!
    //****  TODO *****
    console.log("recording.js: Ending Recording");
    chrome.browserAction.setPopup({
        popup: "./html/popup.html"
     });
     //Changes page immediately
     window.location.href="/html/popup.html";
});
$("#cancelRecording").on('click', function() {
    chrome.runtime.sendMessage({command: COMMANDS.ENDRECORDING}, function(response) {
        //sends a message to the recording_state.js, which sets recording to false
        
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: COMMANDS.DISABLE_HOT_KEY}, function(response2) {
          console.log(response2);
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: COMMANDS.GET_AUTH}, function(response2) {
          console.log(response2);
        });
    });
    chrome.runtime.sendMessage({command: COMMANDS.RESET});
    chrome.browserAction.setPopup({
        popup: "./html/popup.html"
     });
     //Changes page immediately
     window.location.href="/html/popup.html";
});
// chrome.runtime.sendMessage({command: "end_recording"}, 
//     function(response) {
//     //sends a message to the recording_content_state, which turns off
//             chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//                 chrome.tabs.sendMessage(tabs[0].id, {command: "disable_hot_key"}, function(responsee) {
//                   console.log(responsee);
//                 });
//           });
//     });
//     chrome.runtime.sendMessage({command: "save"}, 
//     function(response) {
//             console.log(response);
//     });

// $("#endR").on('click', function(){
//     console.log("endR click");
//     $(this).prop('disabled', true);
//     $("#startR").prop('disabled', false);
//     chrome.runtime.sendMessage({command: "end_recording"}, 
//     function(response) {
//     //sends a message to the recording_content_state, which turns off
//             chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//                 chrome.tabs.sendMessage(tabs[0].id, {command: "disable_hot_key"}, function(responsee) {
//                   console.log(responsee);
//                 });
//           });
//     });
//     chrome.runtime.sendMessage({command: "save"}, 
//     function(response) {
//             console.log(response);
//     });
// });


//listen for updates from background
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.command){
            case "update_record":
                console.log("Update tut command received in recording.js");
        }
    }
);