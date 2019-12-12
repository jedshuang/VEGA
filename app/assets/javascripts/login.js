

export const $base = $('#main');

export let myStorage = window.localStorage;


export async function loadSignIn(){
    
    $base.append(renderSignIn());

    $(".submit").on("click", handleLogin);
    $(".sup").on("click", signUpFormRender);
}

export async function signUpFormRender() {
    // event.preventDefault();

    $base.children(".signIn").replaceWith(`<p class="signIn">Sign Up</p>`);
    $base.children(".form1").replaceWith(renderSignUp());
    

    $(".nup").on('click', (e) => {
        e.preventDefault();
        handlesignUp();
    })
    $(".cup").on("click", handlesignUpC);
}

export async function handleLogin(){
    event.preventDefault();
    let jwt = null;
    let us = document.getElementById("us").value;
    let ps = document.getElementById("ps").value;

    let r =  axios.post('http://localhost:3000/account/login',
        {
            name: us,
            pass: ps,
        });

        r.then(response => {
           
            jwt = response.data.jwt;
            myStorage.clear();
            myStorage.setItem("jwt", jwt);
            console.log(us);
            myStorage.setItem("username", us);
            myStorage.setItem("role", response.data.role);
            
            alert("Succesfully signed in")
            location.href = "../../index.html"

            //get request from user git

          }).catch(error => {
            alert(error.response.data.msg);
           if( $("#fail").length == 0 ){
            $base.children(".form1").prepend(`<p class = "wrong" id= "fail"> Username or Password is incorrect </p> `);
            
           } 
          });
    
}

export async function handlesignUp(){
    event.preventDefault();
    let firstn = document.getElementById("place1").value;
    let lastn = document.getElementById("place2").value;
    let emails = document.getElementById("place3").value;
    let ps = document.getElementById("passwords").value;
    let psR = document.getElementById("passwordsR").value;
    let password = null;
    let jwt = null;
    
    
    if(firstn == ''|| lastn == '' || emails == '' || ps == '' || psR == ''){
        alert("All boxes must be filled");
        return;
    }

    let name = firstn + "-" + lastn;

    if(ps !== psR){
        alert("Passwords do not match");
        document.getElementById("passwords").value = '';
        document.getElementById("passwordsR").value = '';
        return;
    } else {
        password = ps;
    }

    let result = axios.post('http://localhost:3000/account/create',
        {
            name: name,
            pass: password,
            data: {
                role: 2,
                email: emails,
            }
    });
    
    result.then(async response => {
        let r =  axios.post('http://localhost:3000/account/login',
        {
            name: name,
            pass: password,
        });
        

        r.then(response => {
            
            jwt = response.data.jwt;
            myStorage.clear();
            console.log(name);
            myStorage.setItem("jwt", jwt);
            myStorage.setItem("username", name);
            myStorage.setItem("role", response.data.role);
           
            alert("Succesfully signed in")
            
            let q = axios.post('http://localhost:3000/user/'+name,
            {
                data: {
                    firstname: firstn,
                    lastname: lastn,
                    email: emails,
                    DAGs: {},
                }
            }, {headers: { Authorization: "Bearer " + jwt }});

            location.href = "../../index.html"
       
          })}).catch(error => {
        let a = error;
        alert(a);
        document.getElementById("place1").value = '';
        document.getElementById("place2").value = '';
        document.getElementById("place3").value = '';
        document.getElementById("passwords").value = '';
        document.getElementById("passwordsR").value = '';
      });

}

export const handlesignUpC = function(){
    event.preventDefault();
    $(".form1").remove();
    loadSignIn();
}

$(function() {
    loadSignIn();
});
// The forms rendered 
export const renderSignIn = function() {

    return `<form id = "form1" class="form1">
            <input id="us" type="text" placeholder="Username">
            <input class= "after" id="ps" type="password" placeholder="Password">
            <div id = "buttons">
            <button class="submit" type='button'>Sign in</button>
            <button class ="sup" type='button' > Sign up</button>
            <p class="forgot"><a href="#">Forgot Password?</p>
            </div>
          </form>`
}
export const renderSignUp = function() {
    return `
    <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
        async defer>
    </script>
    <form onsubmit="return false;" id = "form1" class="form1">
    <input id="place1" class = "place" type="text" placeholder="First Name">
    <input id="place2" class = "place" type="text" placeholder="Last Name">
    <input id="place3" class = "place" type= "text" placeholder="Email">
    <form action="?" method="POST">
      <div id="html_element"></div>
    </form>
    <div id = "makeP">
    <p id= "passwordHeader"> Your password must be 4 characters long</p>
    <input id="passwords" class= "passwords" type= "text" placeholder="Password">
    <input id="passwordsR" class= "passwords" type= "text" placeholder="Re-Enter Password">
    </div>

    <div id = "buttons">
        <button class ="nup" type='button' > Sign up</button>
        <button class ="cup" type='button' > Cancel</button>
    </div>

    `
}