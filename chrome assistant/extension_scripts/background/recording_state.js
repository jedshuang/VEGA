/* Author: Connor Hamlet
*  This file is responsible for holding the recording state
*  for the extension.
*  The recording_enabled variable is true when the user clicked
*  "Start Recording" in the popup window. 
*  Upon load, the content script will read the recording state from this file
*  and then it will determine whether or not to enable the key presses
*  which select on element (the save box).
*/

var recording_enabled = false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        console.log(request);
      switch(request.command){
          case COMMANDS.STARTRECORDING: 
          recording_enabled = true;
          console.log("background: start_recording received");
          sendResponse({msg: "recording state changed to enabled"});  
          break;

          case COMMANDS.ENDRECORDING:
          recording_enabled = false;
          sendResponse({msg: "recording state changed to disabled"});

          case COMMANDS.GETRECORDINGSTATE:
          sendResponse({state:recording_enabled});
          break;
          default: 
          break;
      }
  
  
    });