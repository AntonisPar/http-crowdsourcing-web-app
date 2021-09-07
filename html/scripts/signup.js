var log_red = document.getElementById("red_but");
var sub_but = document.getElementById("sub");
var message = document.getElementById('alert')

function signup()
{
    message.style.display = 'none'
    var emailFormat = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    var passFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value ;
    var conf_password = document.getElementById('conf_password').value ;

    if(emailFormat.test(email) && passFormat.test(password) && conf_password === password){

        formInfo = {

            "username" : document.getElementById('username').value,
            "email"    : email,
            "password" : password,
            "conf_password" : conf_password
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
            console.log(data)
            if ( data === 'true')
            {
                message.innerHTML= "Successful Signup";
                message.style.display = 'block'
            }
            else if ( data === 'exist')
            {
                message.innerHTML ="Username Already Exists";
                message.style.display = 'block'
            }
        })

    }
    else {
        
        message.innerHTML = "Invalid email address format or password!";
        message.style.display = 'block'
    }

}


function redirect(){
  window.location.href= "http://localhost:3000/login.html";
}

sub_but.onclick=signup;
log_red.onclick = redirect;
