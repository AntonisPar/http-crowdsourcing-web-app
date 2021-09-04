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
    var message = document.createElement('p')
    message.innerHTML = resText
    document.getElementById('div').appendChild(message)

}

document.getElementById('confirm').onclick = onConfirmClick
