async function sendUsername(username){
    let response = await fetch('/giveAdmin',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'username':username})
    })
        return await response.text();
}


async function onConfirmClick(){

    var username = document.getElementById('username').value;
    var resText = await sendUsername(username);
    var success_message = document.getElementById('success_mess')
    var error_message = document.getElementById('error_mess')

    if(resText === 'User does not exist'){
        error_message.innerHTML = 'User ' + username + ' does not exist.'
        error_message.style.display = 'block'
        setTimeout(function(){ error_message.style.display="none"; }, 6000);
    } 
    else if(resText === 'User is now admin'){
        success_message.innerHTML = 'User ' + username + ' now has Admin privileges.'
        success_message.style.display = 'block'
        setTimeout(function(){ success_message.style.display="none"; }, 6000);
    }

}

document.getElementById('confirm').onclick = onConfirmClick
