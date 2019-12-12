export let myStorage = window.localStorage;


$(function() {
    let jwt = myStorage.getItem("jwt")
<<<<<<< HEAD
    console.log(jwt);
=======


    console.log(jwt);
    if (jwt){
        console.log("here");
        $("#login-button").replaceWith('<a href="app/views/logout.html"><button class="button" id="logout-button">logout</button></a>')
    }

>>>>>>> afda851412cfa567005d72f6ab2c08ec2c0dc00c
});