const POSTURL    = "";
const GETURL     = "";

const MESSAGE = "message";
const LOAD = "load";
const START = "start";
const NEXT = "next";
const QUIT = "quit";
const EXECUTE = "execute";

const COMMANDS = {

    //                                           Senders:                                        Purpose:

    // background listening for commands
    SAVE: "save",                               // sent in new_record.js, recording.js          // Post tutorial to database
    LOADTUTORIAL: "loadTutorial",                   // sent in load_record.js                       // Load a record encoded in the request
    UPDATETITLEDESC: "updateTitleDesc",         // sent in new_record.js, recording.js
    PEEK: "peek",                               // sent in main.js, recording.js                // passes the entire tutorial to the sender
    GETNEXT: "get_next",                        // sent in main.js
    GETPREV: "get_prev",                        // sent in main.js
    GETOPTIONS: "get_options",                                                                  // Slated for removal
    RECORDACTION: "record_action",              // sent in main.js
    CLEAR: "clear",                                                                             // (unused) Reset the recording
    RESET: "reset",                             // sent in load_record.js                       // Removes any loaded recordings and resets load_status to false
    GETLOADSTATUS: "get-load-status",           // sent in main.js
    SETLOADSTATUS: "set-load-satus",            // sent in main.js
    SIGNIN: "sign_in",                          // sent in popup.js
    SIGNOUT: "sign_out",                        // sent in popup.js
    ISUSERSIGNEDIN: "is_user_signed_in",        // sent in popup.js
    GETUSERSIGNEDIN: "get_user_signed_in",      // sent in popup.js
    CONNECT: "connect",                         // sent in popup.js
    DISCONNECT: "disconnect",                   // sent in popup.js
    
    // recording_state listening for commands
    STARTRECORDING: "start_recording",          // sent in new_record.js
    ENDRECORDING: "end_recording",              // sent in new_record.js, recording.js
    GETRECORDINGSTATE: "get_recording_state",   // sent in main.js, new_record.js, popup.js

    // main listening for commands
    LOAD: "load",                               // sent in load_record.js
    ENABLE_HOT_KEY: "enable_hot_key",           // sent in new_record.js
    DISABLE_HOT_KEY: "disable_hot_key",         // sent in new_record.js, recording.js
    GET_AUTH: "get_auth",                       // sent in recording.js
    REMOVE_INTERFACE: "remove_interface",       // sent in load_record.js
    NEXT: "next",                               // sent in background.js
    EXECUTE: "execute",                         // sent in background.js

    // recording listening for commands
    UPDATERECORD: "update_record",      
    UPDATETUTORIAL: "update_tutorial"           // sent in background.js

}
const INTERACTION_EVENT = {
    NEXT: "NEXT",           // student clicks next
    PREV: "PREV"            // student clicks previous
}
