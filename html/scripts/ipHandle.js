var but = document.getElementById('ip');
var mapDiv = document.getElementById('mapid');
mapDiv.style.height = '600px'

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

async function handleIP(){
    var cookies = JSON.parse(document.cookie);
    var mycords = await myCords()
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
                    console.log(heatmapData)
                    console.log(mycords)
                    const mymap = L.map('mapid').setView([mycords['lat'], mycords['lon']], 8);
                    
                    
                    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery å© <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/light-v10',
                        tileSize: 512,
                        zoomOffset: -1,
                        accessToken: 'pk.eyJ1IjoiYW50b25pc3BhciIsImEiOiJja3F0bjQzaTcxbTd4MndwYjE2MzlrdjR4In0.UUjjgTbF_NA4GXUtbC8ACA'
                    }).addTo(mymap);
                    
                    var heatMapPoints = [];
                    Max = Math.max.apply(Math, heatmapData.map(function(heatmapData) { return heatmapData.visits; }));
                    for(var i in heatmapData){
                      if (heatmapData.hasOwnProperty(i)){
                        temp = heatmapData[i].visits/Max;
                        heatMapPoints.push([heatmapData[i].lat,heatmapData[i].lon,temp])
                        console.log(temp);
                      }
                    } 
                    console.log(heatMapPoints);
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
                    // console.log(heatmapData);
                    // Max = Math.max.apply(Math, heatmapData.map(function(heatmapData) { return heatmapData.visits; }));
                    // console.log(Max);
                    // for(var i in heatmapData){
                    //     if (heatmapData.hasOwnProperty(i)){
                    //         var heat = L.heatLayer([
                    //             [heatmapData[i].lat,heatmapData[i].lon,heatmapData[i].visits],
                    //         ], {max: 280.0,minOpacity: 0.1,gradient:{
                    //           '0': 'Navy',
                    //           '0.25': 'Blue',
                    //           '0.5': 'Green',
                    //           '0.75': 'Yellow',
                    //           '1': 'Red'
                    //         }}).addTo(mymap);

                    //     }
                    // }
                    
                    
                })

        })
}

function redirect(){

    window.location.replace('http://localhost:3000/heatmap.html');


}

if(typeof(but) != 'undefined' && but != null){
but.onclick = redirect;
};