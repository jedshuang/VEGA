// $(function() {
// $(".draggable").draggable({ cancel: null }); 
// $(".draggable").find(":input").on('mousedown', function (e) {
//     var mdown = new MouseEvent("mousedown", {
//         screenX: e.screenX,
//         screenY: e.screenY,
//         clientX: e.clientX,
//         clientY: e.clientY,
//         view: window
//     });
// $(this).closest('.draggable')[0].dispatchEvent(mdown);
// }).on('click', function (e) {
//     var $draggable = $(this).closest('.draggable');
//     if ($draggable.data("preventBehaviour")) {
//         e.preventDefault();
//         $draggable.data("preventBehaviour", false)
//     }
// });
// });
// test writing for the create_popup_box method
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
    created_element.append(title);
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
    buttonHoverInCSS(saveButton);
    buttonHoverInCSS(cancelButton);
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
    //Hanldes the click function for newly created save button
    $(saveButton).click(function(){
        //When you click the save button, this reverts the green block of text back to normal. 
        if(unborderedElementPointerHTML!=null) {
            //This replace with function, removes the element with the green border if one already exists. 
            $(elementOnMouseOver).replaceWith($(unborderedElementPointerHTML).prop('outerHTML'));
        }
        chrome.runtime.sendMessage({command: "record_action", html:unborderedElementPointerHTML, entered_text:$(description).text(), title_text:$(title).val(), url:window.location["href"]}, 
            function(response) {
                //    alert(response.msg +" : "+ response.enteredText + " : "+ window.location["href"]);
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
    });
}   