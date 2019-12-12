export let myStorage = window.localStorage;


$(function() {
    let jwt = myStorage.getItem("jwt")

    // console.log(jwt);
    if (jwt){
        // console.log("here");
        $("#login-button").replaceWith('<a href="#"><button class="button" id="logout-button">logout</button></a>')
    }

    $("#logout-button").click(function(){
        //console.log("hi")
        let confirmation = confirm("Are you sure?");
        if (confirmation){
            localStorage.removeItem('jwt');
            localStorage.removeItem('username');
        }
        $("#logout-button").replaceWith('<a href="#"><button class="button" id="login-button">login</button></a>')
    });

});
