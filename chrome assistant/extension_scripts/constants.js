const POSTURL    = ""
const GETURL     = ""

const COMMANDS = {

    //                                           Senders:                                        Purpose:

    // background listening for commands
    SAVE: "save",                               // sent in new_record.js, recording.js          // Post tutorial to database
    LOADRECORD: "loadRecord",                   // sent in load_record.js                       // Load a record encoded in the request
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

    // recording listening for commands
    UPDATERECORD: "update_record",      
    
    UPDATETUTORIAL: "update_tutorial"           // sent in background.js

}