var loginBut= document.getElementById("sub");
var scrollBut = document.getElementById("scroll");



function usernameCookie(){
    var user = document.getElementById("username").value;
    var cookieObj = {
        "username": user,
    } ;
    document.cookie = JSON.stringify(cookieObj);
}

function showBut(){
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        scrollBut.style.display = "none";
      } else {
        scrollBut.style.display = "inline";
      }
}

function scrollToLogin() {
    var log = document.getElementById("login");
    log.scrollIntoView();
}


window.onscroll = function() {showBut()};
scrollBut.onclick = scrollToLogin;
loginBut.onclick=usernameCookie;
