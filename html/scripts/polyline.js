var mapDiv = document.getElementById('map')
var polyBut = document.getElementById('polyline')
mapDiv.style.height='600px'
mapDiv.style.display = 'none';

function butClick()
{
    if(mapDiv.style.display === 'none')
    {
        document.getElementById('viewInfo').style.display='none'
        document.getElementById('timingDiv').style.display='none'
        mapDiv.style.display = 'block';
        createMap();
    }
    else
        mapDiv.style.display = 'none';
}

async function getMapData()
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
        ip.push(ips[i].ip)
    

    var dest = await fetch(endpoint,
        {
            method: 'POST',
            body: JSON.stringify(ip)
        });
    return await dest.json();
}

async function myCords()
{
    var endpoint = "http://ip-api.com/json?fields=lat,lon"
    let myCords = await fetch(endpoint, {
        method: 'POST'
    })
    return await myCords.json();
}

async function createMap()
{
    var mapData = await getMapData();
    var view = await myCords();

    var mymap = L.map('map').setView([view.lat, view.lon], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 12,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoidHNhYyIsImEiOiJja3M0MndvNDAwZ2xtMndsbHQwOHM1Z2FkIn0.atMs4AwoOm-9J30apCN_Vw",
    }).addTo(mymap);

    for(var i in mapData)
    {
        var httpDest = await getReqDest(mapData[i]);
        for(let j=0; j<Object.keys(httpDest).length; j++)
        {
            mapData[i][j].ip = httpDest[j].lat.toString() + ',' + httpDest[j].lon.toString()
        }
    }
    for(let i in mapData)
    {
        L.marker([parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1])]).addTo(mymap)
        var maxVisits = Math.max.apply(Math, mapData[i].map(function(o) { return o.visits; }))
        for(var j in mapData[i])
        {
            let cords = [[parseFloat(i.split(',')[0]), parseFloat(i.split(',')[1])],[parseFloat(mapData[i][j].ip.split(',')[0]),parseFloat(mapData[i][j].ip.split(',')[1])]]
            L.polyline(cords,{weight: (mapData[i][j].visits/maxVisits) > 0.3 ?(mapData[i][j].visits/maxVisits) : 0.3 }).addTo(mymap);
        }
    }
}

polyBut.onclick = butClick;