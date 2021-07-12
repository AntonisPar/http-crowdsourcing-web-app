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
            var date = document.createTextNode("Last Upload Date: " +data[0]['lastDate']);
            tagDate.appendChild(date);
            var element = document.getElementById("main");
            element.appendChild(tagEntry);
            element.appendChild(tagDate);
//            console.log(data[0]['entryNum'])
//            console.log(data[0]['lastDate'])
        })
    
}
