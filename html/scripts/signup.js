var log_red = document.getElementById("red_but");
var sub_but = document.getElementById("sub");

function signup()
{
    var emailFormat = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    var passFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value ;

    if(emailFormat.test(email) && passFormat.test(password)){

        formInfo = {

            "username" : document.getElementById('username').value,
            "email"    : email,
            "password" : password
        }

        fetch('/signup', 
            {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json'
                        },
                body: JSON.stringify(formInfo)
            })
        .then(res => res.text())
        .then(data => {
            if ( data === 'true')
                document.getElementById("mes").innerHTML= "Successful Signup";
            else if ( data === 'exist')
                document.getElementById("mes").innerHTML ="Username Already Exists";
        })

    }
    else {
        
        document.getElementById("mes").innerHTML = "Invalid email address format or password!";
    }

}


function redirect(){
  window.location.replace("http://localhost:3000/login.html");
}

sub_but.onclick=signup;
log_red.onclick = redirect;
