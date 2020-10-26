$(document).ready(function() {
    let loaded = false;
    $("#searchR").on('click', async function(e) {
        // e.preventDefault();
        // console.log("hello");
        // will not be loading from here but rather from server
        // chrome.runtime.sendMessage({command: "load"}, function(response) {
        //     console.log("received response from load command");
        // });
        //Loads the record into the frame and sends for the background

        // clear to reset the current background state
        chrome.runtime.sendMessage({command: COMMANDS.RESET});
        chrome.runtime.sendMessage({command: COMMANDS.REMOVE_INTERFACE})

        var test = function(response) {
            console.log(response.val()[$("#formName").val()]);
            var r = response.val()[$("#formName").val()];
            chrome.runtime.sendMessage({command: COMMANDS.LOADRECORD, DAG: r.DAG, tutorial_name: r.name, description: r.description, id: r.root_node_id});
        }
        getFromDatabase(test);
        loaded = true;
        // try {
        //     let name = $("#formName").val();
        //     let r = await axios({
        //         method: 'get',
        //         url: `http://localhost:3000/public/DAGs/${name}`
        //     });
        //     console.log(r);
        //     console.log($(this) + "clicked");
            // chrome.runtime.sendMessage({command: COMMANDS.LOADRECORD, DAG: r.data.result.DAG, tutorial_name: r.data.result.name, description: r.data.result.description, id: r.data.result.root_node_id});
            // loaded = true;
            
        
        // });//end click


        // chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        //     // since only one tab should be active and in the current window at once
        //     // the return variable should only have one entry
        //     chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:'load'}, function(response) {
        //        console.log('Start action sent');
        //    });//end send message
        //  });//end query
        // console.log("goodbye");
        // this is where we query the db for a given id.
        //let tutorial = await...
        // loaded gets true if tutorial not null;
        // pass tutorial to background. 
    // } catch(e) {
    //     console.log(e);
    // }
        if(loaded) {
            $("#searchR").prop("disabled", true);
            $("#beginR").prop("disabled", false);
        }
        // add a display of tutorial title and description
    });
    $("#beginR").on('click', function(e) {
        console.log("Entering load record function");
                chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
                    // since only one tab should be active and in the current window at once
                    // the return variable should only have one entry
                    chrome.tabs.sendMessage(arrayOfTabs[0].id, {command:COMMANDS.LOAD}, function(response) {
                        console.log('Start action sent');
                    });//end send message
                });//end query
        // tell main to add next btton and go to first page.
    });
    $("#back_button").on('click', function() {
        //send data to server
		console.log("back_button click");
		chrome.browserAction.setPopup({
			popup: "./html/popup.html"
		});
		//Changes page immediately
		window.location.href="/html/popup.html";
    });
});