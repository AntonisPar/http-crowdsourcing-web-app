function getInfo(){
    var cookies = JSON.parse(document.cookie);

    fetch("/info",
        {
            method: 'GET',
            headers: cookies
        })
        .then(res => res.json())
        .then(data => {
            var tagEntry = document.createElement("p");
            var tagDate = document.createElement("p");
            var entries = document.createTextNode("Number Of Entries: " + data[0]['entryNum']);
            tagEntry.appendChild(entries);
            var lastDate = data[0]['lastDate'].split("T")[0]
            var date = document.createTextNode("Last Upload Date: " + lastDate);
            tagDate.appendChild(date);
            var element = document.getElementById("main");
            element.appendChild(tagEntry);
            element.appendChild(tagDate);
        })
    
}


var subBut = document.getElementById('sub');

function changeSettings(){
    var fields = {
        "new_name": document.getElementById('new_username').value,
        "new_password": document.getElementById('new_password').value,
        "confirm_pass": document.getElementById('confirm_pass').value,
        "old_pass": document.getElementById('old_pass').value,

    }
    console.log(JSON.stringify(fields))

    fetch("/settings",
        {
        method: 'POST',
        headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
        body: JSON.stringify(fields)
    })
    .then( res => console.log(res.json() ))
    .then( data => {
        var tag = document.createElement("p");
        console.log(data)
        if(data === "yes"){
            var text = document.createTextNode("password changed succesfully")
            tag.appendChild(text)
        }
    })
}

subBut.onclick = changeSettings;
