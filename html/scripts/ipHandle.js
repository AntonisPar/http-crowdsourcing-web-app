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
            console.log(responseData)
            var j = 0;
            for(var i in responseData){
                if (i !== '')
                    ips[j] = i.match(/\w.*\w/)[0].toString();
                j++
            }
            console.log(ips)
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
                    console.log(heatmapData)
                })

        })

}

but.onclick = handleIP;