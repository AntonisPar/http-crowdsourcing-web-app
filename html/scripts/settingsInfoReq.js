var subBut = document.getElementById('sub');

async function getInfo(){
    var response = await fetch('/info',{
        method: 'GET'
    });
    if(!response.ok)
        throw new Error().info='You have not upload anything yet';
    else
        return await response.json()
}

async function showInfo(){

    document.getElementById('new_username').placeholder="Current Username: " + JSON.parse(document.cookie)['username']

    try{
        var info = await getInfo()
    }
    catch(e){
        document.getElementById('num_of_entries').innerHTML = e
        document.getElementById('last_upload').innerHTML = e
        return 0;
    }

    document.getElementById('num_of_entries').innerHTML = info[0]['entryNum']
    if(info[0]['lastDate'].includes("T"))
    {
        var lastDate = info[0]['lastDate'].split("T")[0]
        document.getElementById('last_upload').innerHTML = lastDate
    }
    else
        document.getElementById('last_upload').innerHTML = info[0]['lastDate']
}



function changeSettings(){
    var error_alert = document.getElementById("alert_error");
    var success_alert = document.getElementById("alert_success");
    var passFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var new_pass = document.getElementById('new_pass').value
    var confirm_pass = document.getElementById('confirm_pass').value
    if(new_pass === '' && confirm_pass ==='')
    {
    var fields = {
            "new_name": document.getElementById('new_username').value,
            "new_pass": document.getElementById('old_pass').value,
            "confirm_pass": document.getElementById('old_pass').value,
            "old_pass": document.getElementById('old_pass').value,
            }
    }
    else if(document.getElementById('new_username').value === '')
    {
    var fields = {
            "new_name": JSON.parse(document.cookie)['username'],
            "new_pass": document.getElementById('new_pass').value,
            "confirm_pass": document.getElementById('confirm_pass').value,
            "old_pass": document.getElementById('old_pass').value,
            }

    }
    else 
    {
    var fields = {
            "new_name": document.getElementById('new_username').value,
            "new_pass": document.getElementById('new_pass').value,
            "confirm_pass": document.getElementById('confirm_pass').value,
            "old_pass": document.getElementById('old_pass').value,
            }
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
        },
            body: JSON.stringify(fields)
        })
        .then( res => res.text())
        .then( data => {
            
            if(data === "1"){
                success_alert.innerHTML="Settings changed succesfully";
                document.cookie = JSON.stringify({"username": fields['new_name']});
                success_alert.style.display="block"
                setTimeout(function(){ success_alert.style.display="none"; }, 6000);
            }
            
            else if (data === "2"){
                error_alert.innerHTML ="Username Exists";
                error_alert.style.display="block"
                setTimeout(function(){ error_alert.style.display="none"; }, 6000);
            }

            else if (data === "3"){
                error_alert.innerHTML ="Incorrect Old Password";
                error_alert.style.display="block"
                setTimeout(function(){ error_alert.style.display="none"; }, 6000);
            }
        })
    }
  
}

showInfo()
subBut.onclick = changeSettings;
