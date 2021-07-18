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
    var element = document.getElementById("main");
    var passFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var fields = {
        "new_name": document.getElementById('new_username').value,
        "new_password": document.getElementById('new_password').value,
        "confirm_pass": document.getElementById('confirm_pass').value,
        "old_pass": document.getElementById('old_pass').value,

    }

    if(!passFormat.test(fields['new_password'])){
        var passFormTag = document.createElement("p")
        passFormTag.appendChild(document.createTextNode("Password incorrect Format"))
        element.appendChild(passFormTag)
    }
    else if(fields['new_password'] !== fields['confirm_pass']){

        var confPassTag = document.createElement("p") 
        var text = document.createTextNode("The passwords you enetered are different")
        confPassTag.appendChild(text)
        element.appendChild(confPassTag)
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
            var tag = document.createElement("p");
            if(data === "1"){
                var text = document.createTextNode("settings changed succesfully")
                tag.appendChild(text)
            }
            
            else if (data === "3"){
                var text = document.createTextNode("Incorrect Password")
                tag.appendChild(text)
            }

            element.appendChild(tag)
            
        })
    }
}

subBut.onclick = changeSettings;
