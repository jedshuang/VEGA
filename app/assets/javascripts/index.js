export let myStorage = window.localStorage;


$(function() {
    let jwt = myStorage.getItem("jwt")
    console.log(jwt);
});