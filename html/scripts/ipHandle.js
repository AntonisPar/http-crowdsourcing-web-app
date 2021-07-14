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
            var endpoint = "http://ip-api.com/batch?fields=query,lat,lon,status,isp"
            var j = 0;
            for(var i in data){
                if (i !== '')
                    ips[j] = i
                j++
            }
            console.log(ips)
            fetch(endpoint,
                {
                    method: 'POST',
                    body: JSON.stringify(ips)
                })
                .then(response => ( response.json()))
                .then(geo => {
                    for(var i in geo){
                        geo[i]['visits'] = data[geo[i]['query']]
                    }
                    console.log(geo)
                })

        })
    
}

but.onclick = handleIP;
