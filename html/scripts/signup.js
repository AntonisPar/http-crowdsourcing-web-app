var log_red = document.getElementById("red_but");
var sub_but = document.getElementById("sub");
var message = document.getElementById('alert-red');
var success = document.getElementById("alert-green");

function signup()
{
    message.style.display = 'none'
    //Defaut e-mail format
    var emailFormat = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    //Password format: At least 8 TOTAL characters, at least 1 lower-case char, 
    //at least 1 upper-case char, at least 1 number, at least 1 special character
    var passFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var email = document.getElementById('modal_email').value;
    var password = document.getElementById('modal_password').value ;
    var conf_password = document.getElementById('modal_conf_password').value ;

    if(emailFormat.test(email) && passFormat.test(password) && conf_password === password){

        formInfo = { //object to be sent to back-end

            "username" : document.getElementById('modal_username').value,
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
            if ( data === 'true')
            {
                success.innerHTML= "Successful Signup";
                success.style.display = 'block'
                setTimeout(function(){ success.style.display="none"; }, 6000);
            }
            else if ( data === 'exist')
            {
                message.innerHTML ="Username " + formInfo.username + " already exists";
                message.style.display = 'block'
                setTimeout(function(){ message.style.display="none"; }, 10000);
            }
        })

    }
    else {
        
        message.innerHTML = "Invalid email address or password format";
        message.style.display = 'block'
        setTimeout(function(){ success.style.display="none"; }, 10000);
    }

}


function redirect(){
  window.location.href= "http://localhost:3000/login.html";
}

sub_but.onclick=signup;
log_red.onclick = redirect;
