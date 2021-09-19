var subBut = document.getElementById('sub');

// Function that returns user's current information.
// Current information contain the total number of entries uploaded
// and the last date the user has uploaded.
async function getInfo(){
    var response = await fetch('/info',{
        method: 'GET'
    });
    if(!response.ok)
        throw new Error().info='You have not uploaded anything yet';
    else
        return await response.json()
}

// Function that shows the user's current information (from getInfo) on the page
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


// "Apply Changes" button's on-click function
// 3 possible functionalities:
//      1. Fill all the fields to change current username and password
//      2. Type new username and current password to change ONLY current username
//      3. Type new password and current password to change ONLY current password 
function changeSettings(){
    var error_alert = document.getElementById("alert_error");
    var success_alert = document.getElementById("alert_success");
    //Password format: At least 8 TOTAL characters, at least 1 lower-case char, 
    //at least 1 upper-case char, at least 1 number, at least 1 special character
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


    if( (document.getElementById('new_pass').value.length !== 0) && (!passFormat.test(fields['new_pass']))) {
        error_alert.innerHTML = "New password has incorrect format";
        error_alert.style.display="block"
        setTimeout(function(){ error_alert.style.display="none"; }, 6000);
    }
    else if(fields['new_pass'] !== fields['confirm_pass']){

       error_alert.innerHTML = "Confirm password doesn't match the new password";
       error_alert.style.display="block"
       setTimeout(function(){ error_alert.style.display="none"; }, 6000);
    }
    else { //if all checks are okay

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
            
            if(data === "Successful change"){
                success_alert.innerHTML="Settings changed succesfully";
                document.cookie = JSON.stringify({"username": fields['new_name']});
                success_alert.style.display="block"
                setTimeout(function(){ success_alert.style.display="none"; }, 6000);
                showInfo()
            }
            
            else if (data === "Username exists"){
                error_alert.innerHTML ="Username " + fields['new_name'] + " already exists";
                error_alert.style.display="block"
                setTimeout(function(){ error_alert.style.display="none"; }, 6000);
            }

            else if (data === "Incorrect old pass"){
                error_alert.innerHTML ="Incorrect old password";
                error_alert.style.display="block"
                setTimeout(function(){ error_alert.style.display="none"; }, 6000);
            }
        })
    }
  
}

showInfo()
subBut.onclick = changeSettings;
