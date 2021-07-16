var but = document.getElementById('ip');
function handleIP(){
    var cookies = JSON.parse(document.cookie);
    fetch("/ipInfo",
        {
            method: 'GET',
            headers: cookies
        })
        .then(res => res.json())
        .then(responseData => {
            var ips = [];
            var endpoint = "http://ip-api.com/batch?fields=query,lat,lon,status,isp"
            var j = 0;
            for(var i in responseData){
                if (i !== '')
                    ips[j] = i
                j++
            }
            fetch(endpoint,
                {
                    method: 'POST',
                    body: JSON.stringify(ips)
                })
                .then(response => ( response.json()))
                .then(heatmapData => {
                    for(var i in heatmapData){
                        heatmapData[i]['visits'] = responseData[heatmapData[i]['query']]
                    }
                })

        })
    
}

but.onclick = handleIP;
