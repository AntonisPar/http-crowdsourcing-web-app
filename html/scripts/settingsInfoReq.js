function getInfo(){
    var cookies = JSON.parse(document.cookie);

    fetch("/user_settings",
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