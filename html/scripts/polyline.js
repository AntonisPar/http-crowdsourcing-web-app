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
    for(let i=0; i<Object.keys(ips).length; i++)
    {
        if(ips[i].serverIPAddress !== '')
            ip[i] = ips[i].serverIPAddress.match(/\w.*\w/)[0].toString()
    }
    console.log(ip)

    var dest = await fetch(endpoint,
        {
            method: 'POST',
            body: JSON.stringify(ip)
        });
    return await dest.json()
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
    for(let i in data)
    {
        L.marker([data[i].lat, data[i].lon]).addTo(mymap)
    }
}

createMap()
