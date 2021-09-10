var subBut = document.getElementById('sub');

function getInfo(){

    //
    document.getElementById('new_username').placeholder="Current Username: " + JSON.parse(document.cookie)['username']

    fetch("/info",
        {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('num_of_entries').innerHTML = data[0]['entryNum']
            var lastDate = data[0]['lastDate'].split("T")[0]
            document.getElementById('last_upload').innerHTML = lastDate
        })
    
}



function changeSettings(){
    var error_alert = document.getElementById("alert_error");
    var success_alert = document.getElementById("alert_success");
    var passFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var new_pass = document.getElementById('new_pass').value
    var confirm_pass = document.getElementById('confirm_pass').value

//    if(new_pass === 'undefined' && confirm_pass ==='undefined')
//    {
//        var fields = {
//            "new_name": document.getElementById('new_username').value,
//            "new_pass": document.getElementById('old_pass').value,
//            "confirm_pass": document.getElementById('old_pass').value,
//            "old_pass": document.getElementById('old_pass').value,
//            }
//
//        fetch("/settings",
//            {
//            method: 'POST',
//            headers: {
//          'Content-Type': 'application/json'
//          // 'Content-Type': 'application/x-www-form-urlencoded',
//        },
//            body: JSON.stringify(fields)
//        })
//        .then( res => res.text())
//        .then( data => {
//            
//            console.log(data)
//            if(data === "1"){
//                success_alert.innerHTML="Settings changed succesfully";
//                document.cookie = JSON.stringify({"username": fields[new_name]});
//                success_alert.style.display="block"
//                setTimeout(function(){ success_alert.style.display="none"; }, 6000);
//                getInfo();
//            }
//            
//            else if (data === "3"){
//                error_alert.innerHTML ="Incorrect Old Password";
//                error_alert.style.display="block"
//                setTimeout(function(){ error_alert.style.display="none"; }, 6000);
//            }
//        })
//    }
//    else
//    {
        var fields = {
            "new_name": document.getElementById('new_username').value,
            "new_pass": document.getElementById('new_pass').value,
            "confirm_pass": document.getElementById('confirm_pass').value,
            "old_pass": document.getElementById('old_pass').value,
    }

    if(!passFormat.test(fields['new_pass'])){
        error_alert.innerHTML = "New Password has incorrect format";
        error_alert.style.display="block"
        setTimeout(function(){ error_alert.style.display="none"; }, 6000);
    }
    else if(fields['new_pass'] !== fields['confirm_pass']){

       error_alert.innerHTML = "The passwords you enetered are different";
       error_alert.style.display="block"
       setTimeout(function(){ error_alert.style.display="none"; }, 6000);
    }

    else {

        fetch("/settings",
            {
            method: 'POST',
            headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
            body: JSON.stringify(fields)
        })
        .then( res => res.text())
        .then( data => {
            
            console.log(data)
            if(data === "1"){
                success_alert.innerHTML="Settings changed succesfully";
                document.cookie = JSON.stringify({"username": fields['new_name']});
                success_alert.style.display="block"
                setTimeout(function(){ success_alert.style.display="none"; }, 6000);
                getInfo();
            }
            
            else if (data === "3"){
                error_alert.innerHTML ="Incorrect Old Password";
                error_alert.style.display="block"
                setTimeout(function(){ error_alert.style.display="none"; }, 6000);
            }
        })
    }
//  }
}

getInfo()
subBut.onclick = changeSettings; 
