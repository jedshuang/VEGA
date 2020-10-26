/*
* Author: Connor Hamlet and Jacob Smith
* Funcitonality: This is the content script for our google chrome extension. 
* This is the script responsible for displaying the save button and the "Next" button.
*/
//x and y of mouse pointer
var x = 0;
var y = 0;
//This element is the element that currently have a border around it when it is selected. 
var unborderedElementPointerHTML = null;
//The x and y coordinates of the mouse has to be constantly maintained in order to select an html element.
$(window).mouseover(function(e) {
    x = e.clientX, y = e.clientY;
});


var student_view = null;
//This message asks the background if you are in "load mode"<p>Since the index is zero-based, the first list item is returned:</p>

$(document).ready(function() {
    retrieveItemfromBackgroundScript();
    
    //Needs to retrieve ephermal background state
    chrome.runtime.sendMessage({command: COMMANDS.GETRECORDINGSTATE}, function(response) {
        //sends a message to the recording_content_state, which turns off
        if(response.state == true){
            document.addEventListener("keydown", detect_element_selection);
        } else {
            document.removeEventListener("keydown", detect_element_selection);
        }
    });
});

function retrieveItemfromBackgroundScript(){
      chrome.runtime.sendMessage({command: COMMANDS.GETLOADSTATUS}, function(response) {
        /*
            response from background script:
            response = true or false
        */
        //if false, you are not in "load mode"
            if(response == false){
                console.log("Not in load mode");
            }else{
                createTutorialControlInterface();
                //Message asks background if you are on the correct link
                get_dag(function(tutorial){
                    //If urls match, load the html 

                    if(window.location["href"] == get_current_node(tutorial).url) {
                        //Message asks background for html and moves to next item. 
                        //TODO: Present the user with choice instead of going with 0th edge 
                        loadHTMLContent(tutorial);
                        // get_next_node(tutorial, function(response){
                        //     if(response==null) return;
                        //     var tutorialResult = JSON.parse(response.tutorial);
                        //     tutorialResult.DAG = graphlib.json.read(tutorialResult.DAG);
                            
                        //     loadHTMLContent(tutorialResult);
                        // }); //end of shift command msg 
                    }//end of null check
                }); //end peek send msg
            } //end else
    }); //end first reponse function
    }

//Creates the button for the "save" button 
/** 
 * reauthored by Jacob Smith 
 * 11/21/2019
 */
function create_popup_box(top, left, borderedElement, popup_ID) {
    // let created_element = `<div id='${popup_ID}'></div>`;
    // consider removing title for individual steps?
    let title = $(`<input id="VEGA_title" class="editable" type="text" placeholder="Title"></input>`);
    let description = $(`<textarea id="VEGA_description" class="editable" contenteditable="true" placeholder="Description"></textarea>`);
    let saveButton = $(`<div id="VEGA_save" class="VEGA_button">
                            <p>Save</p>
                        </div>`);
    let cancelButton = $(`<div id="VEGA_cancel" class="VEGA_button">
                            <p>Cancel</p>
                        </div>`); 
    let created_element = $(`<div id='${popup_ID}'></div>`);
    created_element.append(title, description, saveButton, cancelButton);
    // add CSS in this section
    created_element.css({
        'background-color':'rgba(0,0,0,0.6)',
        'padding'         : '15px',
        'border-radius'   : '10px',
        'width'           : '200px'
    });
    title.css({
        'background-color':'#ededed',
        'height'    : '14x',
        'width'     :'188px',
        'max-height': '20px',
        'font-size' : '16px',
        'color'     : 'black',
        'border'    :  'black solid',
        'margin-bottom': '0.4em',
        'padding'   :   '4px',
        'border-radius': '8px'
    });
    description.css({
        'background-color':'#ededed',
        'height'    : 'auto',
        'min-height': '35px',
        'font-size' : '12px',
        'color'     : 'black',
        'border'    : 'black solid',
        'padding'   : '4px',
        'border-radius':'8px'
    });
    let buttonHoverInCSS = function(button) {
        button.css({
            'background-color' : 'rgb(18, 175, 114)',
            'border-radius' : '1.4em',
            'color'         : "white",
            'width'         : "75px",
            'height'        :"30px",
            'margin-top'    :"3px"   
        });
    };
    let buttonHoverOutCSS = function(button) {
        button.css({
            'background-color' : 'rgb(18, 226, 169)',
            'border-radius' : '1.4em',
            'color'         : "white",
            'width'         : "75px",
            'height'        :"30px",
            'margin-top'    :"3px" 
        });
    }
    buttonHoverOutCSS(saveButton);
    buttonHoverOutCSS(cancelButton);
    $(saveButton).add(cancelButton).find('p').css({
        'line-height': '28px',
        'font-size': '18px',
        'text-align': 'center'
    });
    saveButton.hover(buttonHoverInCSS(saveButton), buttonHoverOutCSS(cancelButton));
    cancelButton.hover(buttonHoverInCSS(cancelButton), buttonHoverOutCSS(cancelButton));
    $(created_element).draggable({
        // //start: function(){}
        stop: function (){
           //focus on the title if its empty, otherwise the description
            if($(title).val().length == 0){
                $(title).focus();
            }else{
                $(description).focus();
            }
        }    
    });
    //Don't let the user drag when either text box is in focus
    $(title).add(description).focusin(function(){
        $(created_element).draggable({
            cancel: ".editable"
        });
    });
    $(title).add(description).focusout(function(){
        $(created_element).draggable({
            cancel: ""
        });
    });
    //Append the created element to the body
    created_element
        .resizable()
        .css({
            'position'          : 'absolute',
            'z-index'           : '2000000',
            'border'            : 'black'
        })
        .offset({top: top, left: left})
        .appendTo('body');
    //When you click on the textbox, give keyboard focus. 
    $(description).click(function(){
        $(description).focus();
    });
    //When you click on the textbox, give keyboard focus. 
    $(title).click(function(){
        $(title).focus();
    });
    //Handles the click function for newly created save button
    $(saveButton).click(function(){
        //When you click the save button, this reverts the green block of text back to normal. 
        if(unborderedElementPointerHTML!=null) {
            //This replace with function, removes the element with the green border if one already exists. 
            $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
        }
        chrome.runtime.sendMessage({command: COMMANDS.RECORDACTION, html:unborderedElementPointerHTML, entered_text:$(description).val(), title_text:$(title).val(), url:window.location["href"]}, 
            function(response) {
                //    alert(response.msg +" : "+ response.enteredText + " : "+ window.location["href"]);
            });
        // chrome.runtime.sendMessage({command: "update_record"}, function(response){

        // });
        created_element.remove();
    });
    $(cancelButton).on('click', function() {
        //When you click the cancel button, this reverts the green block of text back to normal. 
        if(unborderedElementPointerHTML!=null) {
            //This replace with function, removes the element with the green border if one already exists. 
            $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
        }
        created_element.remove();
    });
}  
function create_info_box(top, left, borderedElement, popup_ID, node) {
    // let created_element = `<div id='${popup_ID}'></div>`;
    // consider removing title for individual steps?
    let title = $(`<h1 id="VEGA_title"><strong>${node.title_text}</strong></h1>`);
    let description = $(`<p id="VEGA_description">${node.entered_text}</p>`);
    /*let saveButton = $(`<div id="VEGA_save" class="VEGA_button">
                            <p>Save</p>
                        </div>`);
    let cancelButton = $(`<div id="VEGA_cancel" class="VEGA_button">
                            <p>Cancel</p>
                        </div>`); */
    let created_element = $(`<div id='${popup_ID}'></div>`);
    created_element.append(title, description);//, saveButton, cancelButton);
    // add CSS in this section
    created_element.css({
        'background-color':'rgba(0,0,0,0.6)',
        'padding'         : '15px',
        'border-radius'   : '10px',
        'width'           : '200px'
    });
    title.css({
        'height'    : '14x',
        'width'     :'188px',
        'max-height': '20px',
        'font-size' : '16px',
        'color'     : 'white',
        'margin-bottom': '0.4em',
        'padding'   :   '4px',
        'border'    : 'none',
        // 'border-radius': '8px'
    });
    description.css({
        'height'    : 'auto',
        'min-height': '35px',
        'font-size' : '12px',
        'color'     : 'white',
        'padding'   : '4px',
        'border-radius':'8px'
    });
    let buttonHoverInCSS = function(button) {
        button.css({
            'background-color' : 'rgb(18, 175, 114)',
            'border-radius' : '1.4em',
            'color'         : "white",
            'width'         : "75px",
            'height'        :"30px",
            'margin-top'    :"3px"   
        });
    };
    let buttonHoverOutCSS = function(button) {
        button.css({
            'background-color' : 'rgb(18, 226, 169)',
            'border-radius' : '1.4em',
            'color'         : "white",
            'width'         : "75px",
            'height'        :"30px",
            'margin-top'    :"3px" 
        });
    }
    // buttonHoverOutCSS(saveButton);
    // buttonHoverOutCSS(cancelButton);
    // $(saveButton).add(cancelButton).find('p').css({
    //     'line-height': '28px',
    //     'font-size': '18px',
    //     'text-align': 'center'
    // });
    // saveButton.hover(buttonHoverInCSS(saveButton), buttonHoverOutCSS(cancelButton));
    // cancelButton.hover(buttonHoverInCSS(cancelButton), buttonHoverOutCSS(cancelButton));
    $(created_element).draggable({
        // //start: function(){}
        stop: function (){
           //focus on the title if its empty, otherwise the description
            if($(title).val().length == 0){
                // $(title).focus();
            }else{
                // $(description).focus();
            }
        }    
    });
    //Don't let the user drag when either text box is in focus
    // $(title).add(description).focusin(function(){
    //     $(created_element).draggable({
    //         cancel: ".editable"
    //     });
    // });
    // $(title).add(description).focusout(function(){
    //     $(created_element).draggable({
    //         cancel: ""
    //     });
    // });
    //Append the created element to the body
    created_element
        .resizable()
        .css({
            'position'          : 'absolute',
            'z-index'           : '2000000',
            'border'            : 'black'
        })
        .offset({top: top, left: left})
        .appendTo($('body'));
    //When you click on the textbox, give keyboard focus. 
    // $(description).click(function(){
    //     $(description).focus();
    // });
    //When you click on the textbox, give keyboard focus. 
    // $(title).click(function(){
    //     $(title).focus();
    // });
    //Hanldes the click function for newly created save button
   /* $(saveButton).click(function(){
        //When you click the save button, this reverts the green block of text back to normal. 
        if(unborderedElementPointerHTML!=null) {
            //This replace with function, removes the element with the green border if one already exists. 
            $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
        }
        chrome.runtime.sendMessage({command: "record_action", html:unborderedElementPointerHTML, entered_text:$(description).text(), title_text:$(title).val(), url:window.location["href"]}, 
            function(response) {
                //    alert(response.msg +" : "+ response.enteredText + " : "+ window.location["href"]);
            });
        chrome.runtime.sendMessage({command: "update_record"}, function(response){

        });
        created_element.remove();
    });
    $(cancelButton).on('click', function() {
        //When you click the cancel button, this reverts the green block of text back to normal. 
        if(unborderedElementPointerHTML!=null) {
            //This replace with function, removes the element with the green border if one already exists. 
            $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
        }
        created_element.remove();
    });*/
    return created_element;
}  
//detect element selection is an event listener, which we can add and remove. 
var detect_element_selection = function(event) {
        
        if(event.keyCode == 81 && event.ctrlKey){ // Ctrl + Q
        //This popup id is the unique ID for all of the SAVE button popups. 
                var popup_ID = "4iufbw";
                //If a popup already exists, delete the old one. 
                if(document.body.contains( document.getElementById(popup_ID) )){
                    if(unborderedElementPointerHTML!=null) {
                        //This replace with function, removes the element with the green border if one already exists. 
                        $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
                    }
                    document.getElementById(popup_ID).remove();
                }
        elementOnMouseOver = document.elementFromPoint(x, y);
        unborderedElementPointerHTML = elementOnMouseOver.outerHTML;
            if(elementOnMouseOver.style.border == "" && elementOnMouseOver.tagName != "input"){
    			elementOnMouseOver.style.border = "thick solid green";
                var edit_box = create_popup_box($(elementOnMouseOver).offset().top, $(elementOnMouseOver).offset().left+50, elementOnMouseOver, popup_ID);
               }
        }

}

function goToNextURL(){

            // //TODO: Present the user with choice instead of going with 0th edge 
                get_dag(function(tutorial){

                    get_next_node(tutorial, function(response){
                        if(response==null)return;
                        //Converts tutorial into graphlib object
                        tutorial = JSON.parse(response.tutorial);
                        tutorial.DAG = graphlib.json.read(tutorial.DAG);
                        
                    
                        if(typeof(tutorial) != 'undefined' && window.location["href"] != get_current_node(tutorial).url) {
                            window.location = get_current_node(tutorial).url;
                        }else{
                            loadHTMLContent(tutorial);
                        }
                          
                    }); 
                });


}
function goToPrevURL(){
    get_dag(function(tutorial){

        get_prev_node(tutorial, function(response){
            if(response==null)return;
            //Converts tutorial into graphlib object
            tutorial = JSON.parse(response.tutorial);
            tutorial.DAG = graphlib.json.read(tutorial.DAG);
            
        
            if(typeof(tutorial) != 'undefined' && window.location["href"] != get_current_node(tutorial).url) {
                window.location = get_current_node(tutorial).url;
            }else{
                loadHTMLContent(tutorial);
            }
              
        }); 
    });
}

//Displays border on webpage from element stored in background page. 
function loadHTMLContent(tutorial){
            console.log("inside loadHTML content");
            var instructor_text = $('<p id = "sdajck3" href="#">Text box</p>');
            instructor_text[0].innerHTML = get_current_node(tutorial).entered_text;
            instructor_text.css({
                 'position': 'fixed', 
                 'bottom':'5%',
                 'left':'5%',
                 'background-color': '#e60505',
                 'font-size':'12px',
                 'font-family':'sans-serif',
                 'padding' : '.5em 1em',
                 'border':'transparent',
                 'border-radius':'2px',
                 'color'     : 'white'
            });
        
            // instructor_text.appendTo('body');

            //console.log("Searching for element: " 
            var all_elements = document.getElementsByTagName("*");
            // console.log(get_current_node(tutorial));
            let current_node = get_current_node(tutorial);
            console.log(get_current_node(tutorial));
            console.log(get_current_node(tutorial).html);
            //This popup id is the unique ID for all of the SAVE button popups. 
            var popup_ID = "4iufbw";
            if(document.body.contains( document.getElementById(popup_ID) )){
                document.getElementById(popup_ID).remove();
            }
            for (var i = 0, element; element = all_elements[i++];) {
                
                if(element.outerHTML == current_node.html){
                    element.style.border = "thick solid green";
                    let edit_box = create_info_box($(element).offset().top, $(element).offset().left+50, element, popup_ID, current_node);
                    console.log("edit box");
                    console.log(edit_box);
                }
            }
            

            

};
// chrome.runtime.onConnect.addListener((port) => {
//     port.onMessage.addListener((msg) => {
//         console.log("message received in main.js");
//     //   if (msg.function == 'html') {
//     //     port.postMessage({ html: document.documentElement.outerHTML, description: document.querySelector("meta[name=\'description\']").getAttribute('content'), title: document.title });
//     //   }
//     });
//   });
//This listens to the popup script 
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("message received in main");
      console.log(request.command);
      switch(request.command){
        case COMMANDS.LOAD:
            console.log("load message received");
            // if(student_view != "null"){
            //     console.log("not null");
            //     student_view.remove();
            //     student_view = "null";
            //     sendResponse("Action completed");
            // }
            deleteTutorialControlInterface();

            chrome.runtime.sendMessage({command: COMMANDS.SETLOADSTATUS, value: true}, function(response) {
                console.log("Setting load status to: " + response);
            });
            //If urls don't match, go to url. Then, load the tutorial html 
            get_dag(function(tutorial){
                console.log(tutorial);
                // console.log(tutorial.toJSON());
                if(window.location["href"] != get_current_node(tutorial).url) {
                    //Message asks background for html and moves to next item. 
                    window.location = get_current_node(tutorial).url;
                }//end of null check
                else {
                    location.reload();
                }
                loadHTMLContent(tutorial);
                createTutorialControlInterface();
            });

            
            // retrieveItemFromBackgroundScript();
            // createAdvanceLinkButton();
            sendResponse("Action completed");

            break;
        
        case COMMANDS.ENABLE_HOT_KEY:
            document.addEventListener("keydown", detect_element_selection);
            sendResponse({msg: "enabled Ctrl+Q"});
            break;
        case COMMANDS.DISABLE_HOT_KEY:
            document.removeEventListener("keydown", detect_element_selection);
            sendResponse({msg: "disabled Ctrl+Q"});
            break;
        case COMMANDS.GET_AUTH:
            let myStorage = window.localStorage;
            let jwt = myStorage.getItem("jwt");
            console.log(jwt);
        case COMMANDS.REMOVE_INTERFACE:
            deleteTutorialControlInterface();
      }
});
/**
 * This function creates the prev and next buttons for the in page tutorial controls.
 */
function createTutorialControlInterface(){
    //Removes the next button if it already exists
    // if(student_view != "null"){
    //         student_view.remove();
    //         student_view = 'null';
    // }
    deleteTutorialControlInterface();

    student_view = $(`<div id='student_view'></div>`);
    let student_view_next = $('<a id = "student_view_next" href="#">Next</a>');
    let student_view_prev = $('<a id = "student_view_prev" href="#">Prev</a>');
    student_view_prev.appendTo(student_view);
    student_view_next.appendTo(student_view);

    student_view.css({
         'position': 'fixed', 
         'bottom':'5%',
         'right':'5%',
         'background-color': '#0078e7',
         'font-size':'14px',
         'font-family':'sans-serif',
         'padding' : '.5em 1em',
         'border':'transparent',
         'border-radius':'2px',
         'color'     : 'white'
    });
    student_view_next.css({
        'color': 'white',
        'padding': '.5em'
    });
    student_view_prev.css({
        'color': 'white',
        'padding': '.5em'
    });
    student_view.appendTo('body');

    student_view_next.click(function(e){
        e.preventDefault();
        console.log("trigger next");
        goToNextURL();
    });
    student_view_prev.click(function(e){
        e.preventDefault();
        console.log("trigger next");
        goToPrevURL();
    });


}

function deleteTutorialControlInterface() {
    if(student_view != null) {
        student_view.remove();
        student_view = null;
    }
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
// //Returns a url object. Url objects have the url, and their step array
// function get_current_url_obj(tutorialObj) {
//     return tutorialObj.urls[tutorialObj.current_url_num];
// }

//This is an asynchronous function
function get_dag(callback){
    chrome.runtime.sendMessage({command: COMMANDS.PEEK}, function(response) {
        var current_tutorial = JSON.parse(response.tutorial);
        current_tutorial.DAG = graphlib.json.read(current_tutorial.DAG); 
       callback(current_tutorial);
    });
} //end peek send msg

function get_next_node(tutorial, callback){
    //console.log(tutorial.DAG.outEdges(tutorial.current_node_id));
   if(typeof(tutorial.DAG.outEdges(tutorial.current_node_id)[0]) == "undefined"){
       //If this statement is reached, there are no more steps in the tutorial.
       alert("Thank you for completing the tutorial!");
       // remove student view
       if(student_view != null) {
           $(document).remove(student_view);
       }
       callback(null);
   }
   else {
   var next_id = tutorial.DAG.outEdges(tutorial.current_node_id)[0].w;
    chrome.runtime.sendMessage({command: COMMANDS.GETNEXT, next_id:next_id}, function(response) {
        callback(response);
    });
    }
}
function get_prev_node(tutorial, callback){
    //console.log(tutorial.DAG.outEdges(tutorial.current_node_id));
   if(typeof(tutorial.DAG.inEdges(tutorial.current_node_id)[0]) == "undefined"){
       //If this statement is reached, there are no more steps in the tutorial.
       alert("At the start");
       // remove student view
       if(student_view != null) {
           $(document).remove(student_view);
       }
       callback(null);
   }
   else{
   var prev_id = tutorial.DAG.inEdges(tutorial.current_node_id)[0].v;
    chrome.runtime.sendMessage({command: COMMANDS.GETPREV, prev_id:prev_id}, function(response) {
        callback(response);
    });
    }
}