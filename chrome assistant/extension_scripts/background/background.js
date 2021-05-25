// This is the main JSON object which holds a tutorial. 

"use strict";

var tutorial = new recording();
function recording(){
  this.DAG = new graphlib.Graph().setGraph({});
  this.current_node_id = null;
  this.root_node_id = null;
  this.tutorial_name = "";
  this.description = "";
}
recording.prototype.toJSON = function (key){
  return {DAG: exportDAG(this), current_node_id:this.current_node_id, root_node_id:this.root_node_id, tutorial_name:this.tutorial_name, description:this.description }; // everything that needs to get stored
 };


function Node(title_text, url, entered_text, inserted_html){
  this.title_text = title_text;
  this.url = url;
  this.entered_text = entered_text;
  this.html = inserted_html;
}

//On inserting a new node, generate a random id, and insert into the DAG.
//First inserted node is the root node. 
function insertNewNode(tutorial, node_value){/*Input: Node object*/
  var rand_id = Math.random().toString(36).slice(2);
  tutorial.DAG.setNode(rand_id, {shape:'circle', id:rand_id, node_value },{label:node_value.title_text} );
  if(tutorial.root_node_id == null){
    tutorial.current_node_id = tutorial.root_node_id = rand_id;
    return;
  }else{
    tutorial.DAG.setEdge(tutorial.current_node_id, rand_id);
    tutorial.current_node_id = rand_id;
  }
  console.log(tutorial);
}

function exportDAG(tutorial){
  return graphlib.json.write(tutorial.DAG);
}

function importDAG(tutorial, json){
  tutorial = JSON.stringify(json);
  tutorial.DAG = graphlib.json.read(tutorial.DAG);
}

//Retrieve a list of node ids stemming from the specified node_id
function getOutEdges(tutorial, node_id){ /*Input: String */
  //raw edges look like: [{v:, w:},{v:,w: },{v:,w:}]
  var raw_edges = tutorial.DAG.outEdges(node_id);
  var string_edges = [];
  raw_edges.forEach( function(raw_edge){
    string_edges.push(raw_edge.w);
  });
  return string_edges; /* Output: Array of String node ids */
}
function sendUpdateMessage() {
  chrome.runtime.sendMessage({command: COMMANDS.UPDATETUTORIAL, 'tutorial': tutorial}, function(response) {
    //sends a message to the recording_content_state, which sets the tutorial name
    });
}


//This global variable is meant to maintain the button state across refreshed pages. For example, when you
//advance to the next link, you will maintain the button on the bottom right.  
//This should probably be cleaned up and not be global. 
var load_status = false;

// let recording_state = false;
//"html" : <html here>
//"entered_text" : This is the text the professor entered

//This background listener listens for comamnds from the content script. The commands are:
//Get: this returns the first item in the stack
//Send: This adds an item to the stack
//Save: Right now this saves the recording stream and merges it into the DAG. In the future, a visualizaiton should\
//merge the DAG.
//Clear: This empties all of the items in the DAG and recording stream. (Say)
var user = null;
chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    switch(request.command){
        case COMMANDS.SIGNIN:
          user = request.user;
          console.log(user);
          break;
        case COMMANDS.SIGNOUT:
          if(recording_enabled) {
            sendResponse(false);
          }
          else {
            user = null;
            sendResponse(true);
          }
          break;
        case COMMANDS.ISUSERSIGNEDIN:
          console.log(user);
          sendResponse(user != null);
          break;
        case COMMANDS.GETUSERSIGNEDIN:
          console.log("User" + user);
          sendResponse(user);
          break;
        case COMMANDS.LOADRECORD:
          console.log(request);
          tutorial.DAG = graphlib.json.read(request.DAG);
          tutorial.current_node_id = request.id;
          tutorial.root_node_id = request.id;
          tutorial.tutorial_name = request.tutorial_name;
          tutorial.description = request.description;
          console.log(tutorial);
        case COMMANDS.LOADTUTORIAL:
          loadTutorial(request);
          break;
        case COMMANDS.UPDATETITLEDESC: 
          console.log("updateTitleDesc: " + request.tutorial_name + "\n" + tutorial.description);
          tutorial.tutorial_name = request.tutorial_name;
          tutorial.description = request.description;
          sendResponse({msg: "adding name", tutorial:exportDAG(tutorial)});  
          break;
            
        case COMMANDS.PEEK: 
          sendResponse({msg: "Background: sending over entire DAG", tutorial:JSON.stringify(tutorial)});  
          // sendResponse({msg: "Background: sending over entire DAG", tutorial:tutorial.toJSON()});  
          break;

        case COMMANDS.GETNEXT:
          if(typeof tutorial.DAG.node(request.next_id) == "undefined" ){
            sendResponse({msg: "Out of steps!", tutorial:null}); 
            sendMessageToTerminal("Thank you for completing the tutorial " + tutorial.tutorial_name + "!"); 
            break;
          }
          tutorial.current_node_id = request.next_id;
          sendResponse({msg: "Background: sending over entire DAG", tutorial:JSON.stringify(tutorial)});  
          // call postInteractionEvent with data from request.data as parameters
          postInteractionEvent.apply(this, request.data);
          let currNode = get_current_node(tutorial);
          sendMessageToTerminal("Now at step: \"" + currNode.title_text + "\"\nInstructions: " + currNode.entered_text + "\nURL: " + currNode.url);
          break;

        case COMMANDS.GETPREV:
          console.log("Prev button clicked");
          if(typeof tutorial.DAG.node(request.prev_id) == "undefined" ){
            sendResponse({msg: "Out of steps!", tutorial:null});  
            break;
          }
          tutorial.current_node_id = request.prev_id;
          sendResponse({msg: "Background: sending over entire DAG", tutorial:JSON.stringify(tutorial)});  
          postInteractionEvent.apply(this, request.data);
          break;

        case COMMANDS.GETOPTIONS:
          console.log("Get options called");
          break;
        //This case is only used when recording steps. Adds a step to tutorial.
        case COMMANDS.RECORDACTION:
          console.log("Record action called");
          insertNewNode(tutorial, new Node(request.title_text, request.url, request.entered_text, request.html));
          sendResponse({msg: "Background: Message received", enteredText:request.entered_text});
          // sendUpdateMessage();
          break;

        //Sends the tutorial object to the content script
        case COMMANDS.SAVE:
          console.log("Save hit");
          //When the tutorial s the current node id is set to the root node ID to be the starting place. 
          tutorial.current_node_id = tutorial.root_node_id;
          sendResponse("Save complete");
          // let r = axios.post("http://localhost:3000/public/DAGs/", {
            
          //   "2" : {
          //     name: tutorial.tutorial_name,
          //     description: tutorial.description,
          //     maker: "VEGA",
          //     DAG: exportDAG(tutorial),
          //     date: "2019"
          //   }

          // });
          console.log("SAVING");
          console.log(user.user.uid);
          var data = {};
          data[tutorial.tutorial_name] = {
            name: tutorial.tutorial_name,
            description: tutorial.description,
            root_node_id: tutorial.root_node_id,
            maker: user.user.uid,
            DAG: exportDAG(tutorial),
            date: "2019"
            
          };
          console.log(data);
          postToDatabase(data);

          // let r = await axios({
          //   url: `http://localhost:3000/public/DAGs/${tutorial.tutorial_name}`,
          //   method: "post",
          //   data: {data:{
              
          //     name: tutorial.tutorial_name,
          //     description: tutorial.description,
          //     root_node_id: tutorial.root_node_id,
          //     maker: "VEGA",
          //     DAG: exportDAG(tutorial),
          //     date: "2019"
            
          //   }},
          //   type: "merge"
          // })
          // r.then(response => {
          //   console.log(response);
          // }).catch(error => {
          //   console.log(error.response);
          // });\

          console.log(r);

          break; 

        //Deletes the recording
        case COMMANDS.CLEAR:
          // console.log("Background script: clicked clear button");
          tutorial = new recording();
          // load_status = false;
          /**
           * tutorial blank
           * load_status
           */
          sendResponse("Clear complete");
          break; 
        case COMMANDS.RESET:
          reset();
          break;
        case COMMANDS.GETLOADSTATUS:
          sendResponse(load_status);
          break;
        case COMMANDS.SETLOADSTATUS:
          load_status = request.value;
          sendResponse(load_status);
          break;
        case COMMANDS.CONNECT:
          connect();
          break;
        case COMMANDS.DISCONNECT:
          disconnect();
          break;
        // case "get_recording_state":
        //   return sendResponse({state: recording_state});
        // case "set_recording_state":
        //   recording_state = request.state;
        default: 
        break;
    }
  });

  function loadTutorial(request) {
    console.log(request);
    tutorial.DAG = graphlib.json.read(request.DAG);
    tutorial.current_node_id = request.id;
    tutorial.root_node_id = request.id;
    tutorial.tutorial_name = request.tutorial_name;
    tutorial.description = request.description;
    console.log(tutorial);
  }

  function reset() {
    tutorial = new recording();
    load_status = false;
    console.log(tutorial);
  }

  var port = null;

  function connect() {
    var hostName = "com.unccs.research.tutorial_creator";
    // var hostName = "com.google.chrome.example.echo";
    //appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    console.log("Connecting to native messaging host");
    // Send the following message to be echoed by the host
    sendMessageToTerminal("Successfully connected to Chrome extension!");
    // updateUiState();
  }

  var tutorial_to_lookup = "";

  var sendLoadMessageWithTutorial = function(response) {
    // console.log(response.val());
    console.log(tutorial_to_lookup);
    var r = response.val()[tutorial_to_lookup];
    console.log(r);
    loadTutorial({DAG: r.DAG, tutorial_name: r.name, description: r.description, id: r.root_node_id});
  }

  function onNativeMessage(message) {
    //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
    console.log(JSON.stringify(message));
    let request = message[MESSAGE];
    let args = request.split(" ");
    if (args[0] === LOAD) {
      tutorial_to_lookup = message[MESSAGE].substring(5);
      console.log("Tutorial to lookup: " + tutorial_to_lookup);
      //Loads the record into the frame and sends for the background

      // clear to reset the current background state
      reset();
      // chrome.runtime.sendMessage({command: COMMANDS.REMOVE_INTERFACE})

      chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
          // since only one tab should be active and in the current window at once
          // the return variable should only have one entry
          chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.REMOVE_INTERFACE}, function(response) {
              console.log('Load action sent');
          });//end send message
      });//end query

      // pass sendLoadMessageWithTutorial as a callback to getFromDatabase
      getFromDatabase(sendLoadMessageWithTutorial);
      var loaded = true;

      if(loaded) {
          // $("#searchR").prop("disabled", true);        // should stay enabled so that you can search again.
          $("#beginR").prop("disabled", false);
          $("#continue").css({"visibility":"hidden"});
          sendMessageToTerminal("Tutorial loaded successfully!");
      }
      // add a display of tutorial title and description
    } else if (args[0] === START) {
      console.log("Entering load record function");
      chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
          // since only one tab should be active and in the current window at once
          // the return variable should only have one entry
          chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.LOAD}, function(response) {
              console.log('Start action sent');
          });//end send message
      });//end query
      sendMessageToTerminal("Tutorial started successfully!");
      let currNode = get_current_node(tutorial);
      sendMessageToTerminal("Now at step: \"" + currNode.title_text + "\"\nInstructions: " + currNode.entered_text + "\"\nURL: " + currNode.url);
    } else if (args[0] === NEXT) {
      chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.NEXT}, function(response) {
            console.log('Next action sent');
        });
      });//end query
    } else if (args[0] === EXECUTE) {
      let input = message[MESSAGE].substring(8);
      chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.EXECUTE, inputArg: input}, function(response) {
            console.log('Execute action sent');
        });
      });
      sendMessageToTerminal("Step executed successfully!");
    } else if (args[0] === QUIT) {
      console.log("Quitting tutorial");
        // set the popup to the popup.html
        // send reset command, remove interface
        chrome.runtime.sendMessage({command: COMMANDS.RESET});
        // reload the page
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.REMOVE_INTERFACE}, function(response) {
                console.log('Remove interface action sent');
            });//end send message
        });//end query
      chrome.browserAction.setPopup({
        popup: "./html/popup.html"
      });
		//Changes page immediately
		window.location.href="/html/popup.html";
      disconnect();
    } else {
      console.log("Unrecognized command: " + args[0]);
    }
    
  }
  
  function onDisconnected() {
    //appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
    console.log("Disconnected: " + chrome.runtime.lastError.message);
    // updateUiState();
  }

  function disconnect() {
    port.disconnect();
  }

  function sendMessageToTerminal(message) {
    var m = {"message": message};
    port.postMessage(m);
  }

  /*
  * Functions for accessing members of the tutorial object.
  */
  //Input: {DAG: graphlib, current_node_id, root_node_id, name}
  //Output: The value of the node at the current node id.
  //Ex: {url: "some url", entered_text:"some text", title_text:"a title", entered_html:"html"}
  function get_current_node(tutorial){
    return tutorial.DAG.node(tutorial.current_node_id).node_value;
  }