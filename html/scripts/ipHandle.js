var but = document.getElementById('ip');
var mapDiv = document.getElementById('mapid');
mapDiv.style.height = '600px'
const timer = ms => new Promise(res => setTimeout(res, ms))
var limit =0 
var idx=0;

async function myCords()
{
    var endpoint = "http://ip-api.com/json?fields=lat,lon"
    let myCords = await fetch(endpoint, {
        method: 'POST'
    })
    if(!myCords.ok)
        throw new Error('Problem with the IP-api');
    else
        return await myCords.json();
}

async function getServerCords(ips){
    
    var endpoint = "http://ip-api.com/batch?fields=query,lat,lon,status,isp"
    let response = await fetch(endpoint,
                {
                    method: 'POST',
                    body: JSON.stringify(ips)
                });
    if(!response.ok)
        throw new Error('Problem with the IP-api');
    else
        return await response.json()
}

async function ipInfo(){
    let ipData = await fetch("/ipInfo",
        {
            method: 'GET',
        });
    if(!ipData.ok)
        throw new Error('There was a problem with the query')
    else 
        return  await ipData.json()
}

async function handleIP()
{
    mapDiv.class = ''
    mapDiv.innerHTML = ''
    var mycords = await myCords()
    var responseData = await ipInfo()
    var ips = [];
    for(var i in responseData)
    {
        if (i !== '')
            ips.push(i)
    }
                
    const mymap = L.map('mapid').setView([mycords['lat'], mycords['lon']], 8);
                        
                        
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery å© <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW50b25pc3BhciIsImEiOiJja3F0bjQzaTcxbTd4MndwYjE2MzlrdjR4In0.UUjjgTbF_NA4GXUtbC8ACA'
    }).addTo(mymap);

    while(ips.length !== 0)
    {
        try
        {
            if (ips.length-100 > limit)
            {
                limit = limit +100;
                var heatmapData = await getServerCords(ips.slice(idx,limit));
                ips.splice(idx, limit)
            }
            else 
            { 
                idx = limit
                var heatmapData = await getServerCords(ips.slice(idx,));
                ips.splice(idx, )
            }
        }
        catch(e)
        {
            //message.innerHTML=e;
            //message.style.display='block'
            return 0;
        }

        console.log(limit,idx)
        for(var i in heatmapData){
            heatmapData[i]['visits'] = responseData[heatmapData[i]['query']]
        }
                        
        var heatMapPoints = [];
        Max = Math.max.apply(Math, heatmapData.map(function(heatmapData) { return heatmapData.visits; }));
        for(var i in heatmapData){
            if (heatmapData.hasOwnProperty(i)){
                temp = heatmapData[i].visits/Max;
                heatMapPoints.push([heatmapData[i].lat,heatmapData[i].lon,temp])
            }
        } 
        var heat = L.heatLayer(heatMapPoints,{
                radius: 25,
                minOpacity : 0.4,
                gradient : {
                    '0': 'Violet',
                    '0.13': 'Violet',
                    '0.14': 'Navy',
                    '0.25': 'Navy',
                    '0.26': 'Green',
                    '0.5': 'Green',
                    '0.51': 'Orange',
                    '0.61': 'Orange',
                    '0.62': 'Yellow',
                    '0.75': 'Yellow',
                    '0.76': 'Red',
                    '1': 'Red'
                }}).addTo(mymap);    
        idx =limit
        await timer(10000)
                

    }
}


function redirect(){

    window.location.replace('http://localhost:3000/heatmap.html');


}

if(typeof(but) != 'undefined' && but != null){
but.onclick = redirect;
};
