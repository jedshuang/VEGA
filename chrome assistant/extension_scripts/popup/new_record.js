$( document ).ready(function() {/*load data from background script*/
    // $("#startR").prop('disabled', $("#formName").val().length == 0 ? true : false );
    chrome.runtime.sendMessage({command: COMMANDS.GETRECORDINGSTATE}, function(response) {
        //sends a message to the recording_content_state, which turns off
        if(response.state == true){
            // $("#endR").prop('disabled', false);
            $("#startR").prop('disabled', true);
        }

    });
    // $('#formName').bind('keypress', function(){
    //     console.log(this.value);
    //     $('#startR').prop('disabled', this.value == "" ? true : false);     
    // });

});

// $("#form").keyup(function() {
//     print("Keyup detected");
//     if($("#formName").val().length == 0) {
//         $("#startR").prop('disabled', true);
//     }
//     else {
//         $("startR").prop('disabled', false);
//     }
// })
$("#back_button").click(function(){
        chrome.browserAction.setPopup({
            popup: "./html/popup.html"
         });
         //Changes page immediately
         window.location.href="/html/popup.html";
});

/* On click functions for elements in popup.html */
$("#startR").on("click", function(){
        // $("#endR").prop('disabled', false);
        // $(this).prop('disabled', true);
        
        //sends a message to the background script recording_state.js. 
        //This sets recording_enabled to true. 
        // chrome.runtime.sendMessage({command: "start_recording"}, function(response) {
        // //sends a message to the recording_content_state, which turns on the 
        // //hotkey listener
        // });
        chrome.runtime.sendMessage({command: COMMANDS.UPDATETITLEDESC, tutorial_name: $("#form input").val(), description: ""}, function(response) {
            //sends a message to the recording_content_state, which sets the tutorial name
            console.log("Received: " + $("#formName").value);
            });
        chrome.runtime.sendMessage({command: COMMANDS.STARTRECORDING}, function(response) {
                //sends a message to the recording_content_state, which sets the tutorial name
                // console.log("Received: " + $("#formName").value);
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: COMMANDS.ENABLE_HOT_KEY}, function(responsee) {
                console.log("Enable hot key returns: "+ responsee);
            });
        });
        chrome.browserAction.setPopup({
            popup: "./html/recording.html"
         });
         //Changes page immediately
         window.location.href="/html/recording.html";
        

   
});

$("#endR").on('click', function(){
    console.log("endR click");
    $(this).prop('disabled', true);
    $("#startR").prop('disabled', false);
    chrome.runtime.sendMessage({command: COMMANDS.ENDRECORDING}, 
    function(response) {
    //sends a message to the recording_content_state, which turns off
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: COMMANDS.DISABLE_HOT_KEY}, function(responsee) {
                  console.log(responsee);
                });
          });
    });
    chrome.runtime.sendMessage({command: COMMANDS.SAVE}, 
    function(response) {
            console.log(response);
    });
});
