var but = document.getElementById('ip');
function handleIP(){
    var cookies = JSON.parse(document.cookie);

    fetch("/ipInfo",
        {
            method: 'GET',
            headers: cookies
        })
        .then(res => res.json())
        .then(data => {
            var ips = [];
            var endpoint = "http://ip-api.com/batch?fields=lat,lon,status,isp"
            for(var i in data){
                ips[i] = data[i].match(/(?<=\[).*?(?=\])/)[0].toString();
            }
            fetch(endpoint,
                {
                    method: 'POST',
                    body: JSON.stringify(ips)
                })
                .then(response => ( response.json()))
                .then(data => {
                    console.log(data)
                })

        })
    
}

but.onclick = handleIP;
