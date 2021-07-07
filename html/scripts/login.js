var signupButton = document.getElementById("loginBut");
var loginBut= document.getElementById("sub");



function usernameCookie(){
    var user = document.getElementById("username").value;
    document.cookie = "username="+user;
}

function redirect_signup() {
  window.location.replace("http://localhost:3000/signup.html");
}

loginBut.onclick=usernameCookie;