var mapDiv = document.getElementById('polyline')
mapDiv.style.height='600px'
async function getData()
{
    let response = await fetch('/polyline',
        {
            method: 'GET'
        });
    return await response.json()

}

async function getReqDest(ips)
{
    var endpoint = "http://ip-api.com/batch?fields=query,lat,lon,status,isp"
    var ip = [];
    for(var i in ips)
    {
        for(var j in ips[i])
            ip.push(ips[i][j].ip)
    }
    console.log(JSON.stringify(ip))

    var dest = await fetch(endpoint,
        {
            method: 'POST',
            body: JSON.stringify(ip)
        });
    return await dest.json();
}

async function createMap()
{
    var mymap = L.map('polyline').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoidHNhYyIsImEiOiJja3M0MndvNDAwZ2xtMndsbHQwOHM1Z2FkIn0.atMs4AwoOm-9J30apCN_Vw",
    }).addTo(mymap);

    var data = await getData()
    var httpDest = await getReqDest(data)
    for(var i in data)
    {
        for(let j=0; j<Object.keys(httpDest).length; j++)
        {
            data[i][j].ip = httpDest[j].lat.toString() + ',' + httpDest[j].lon.toString()
        }
    }
    for(let i in data)
    {
        L.marker([parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1])]).addTo(mymap)
        for(var j in data[i])
        {
            let cords = [[parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1])],[parseFloat(data[i][j].ip.split(',')[0]),parseFloat(data[i][j].ip.split(',')[1])]]
            L.polyline(cords).addTo(mymap);
        }
    }
}

createMap()
