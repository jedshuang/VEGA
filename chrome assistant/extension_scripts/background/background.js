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
//Get: this returns the first itme in the stack
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
            break;
          }
          tutorial.current_node_id = request.next_id;
          sendResponse({msg: "Background: sending over entire DAG", tutorial:JSON.stringify(tutorial)});  
          // call postInteractionEvent with data from request.data as parameters
          postInteractionEvent.apply(this, request.data);
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
          tutorial = new recording();
          load_status = false;
          console.log(tutorial);
          break;
        case COMMANDS.GETLOADSTATUS:
          sendResponse(load_status);
          break; 

        case COMMANDS.SETLOADSTATUS:
          load_status = request.value;
          sendResponse(load_status);
          break;
        // case "get_recording_state":
        //   return sendResponse({state: recording_state});
        // case "set_recording_state":
        //   recording_state = request.state;
        default: 
        break;
    }


  });