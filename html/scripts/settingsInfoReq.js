function getInfo(){
    var cookies = JSON.parse(document.cookie);
    console.log()

    fetch("/info",
        {
            method: 'GET',
            headers: cookies
        })
        .then(function(res){ console.log(res) })
    
}