export let myStorage = window.localStorage;


$(function() {
    let jwt = myStorage.getItem("jwt")

    console.log(jwt);
    if (jwt){
        console.log("here");
        $("#login-button").replaceWith('<a href="app/views/logout.html"><button class="button" id="logout-button">logout</button></a>')
    }
});