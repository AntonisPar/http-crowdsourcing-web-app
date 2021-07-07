var signupButton = document.getElementById("signBut");
var loginBut= document.getElementById("sub");



function usernameCookie(){
    var user = document.getElementById("username").value;
    var cookieObj = {
        "username": user,
    } ;
    document.cookie = JSON.stringify(cookieObj);
}

function redirect_signup() {
  window.location.replace("http://localhost:3000/signup.html");
}

loginBut.onclick=usernameCookie;
