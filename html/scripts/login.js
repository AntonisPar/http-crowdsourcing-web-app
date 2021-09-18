var loginBut= document.getElementById("loginBut");
document.cookie = JSON.stringify({});

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
                window.location.href = data
            
        })
}

loginBut.onclick=usernameCookie;
