var loginBut= document.getElementById("loginBut");
var scrollBut = document.getElementById("scroll");

function usernameCookie(){
    var user = document.getElementById("username").value;
    var cookieObj = {
        "username": user,
    };
    document.cookie = JSON.stringify(cookieObj);

    var fields ={ 
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }
        fetch('/login', 
            {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json'
                        },
                body: JSON.stringify(fields)
            })
        .then(res => res.text())
        .then(data => {
            if ( data === 'fail')
                document.getElementById("erMes").innerHTML= "Username or Password incorrect";
            else if ( data === 'empty')
                document.getElementById("erMes").innerHTML ="You need to fill all fields";
            else
                window.location.replace('http://localhost:3000'+data)
        })
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