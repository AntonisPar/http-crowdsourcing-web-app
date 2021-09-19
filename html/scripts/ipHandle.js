var but = document.getElementById('ip');
var mapDiv = document.getElementById('mapid');
mapDiv.style.height = '600px'
const timer = ms => new Promise(res => setTimeout(res, ms))
var limit =0 
var idx=0;

// Function that returns the lat,lon of your current IP
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

// Function that returns the lat,lon of the IPs of the servers
// that the user has sent requests to and the user's ISP
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

// Fetch user's server from back-end
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

// Function that creates the map layer and heatmap layer
// based on the data from back-end and Ip-api
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

    // Create the map and the map layer and center it on the user's current location
    const mymap = L.map('mapid').setView([mycords['lat'], mycords['lon']], 8);                
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW50b25pc3BhciIsImEiOiJja3F0bjQzaTcxbTd4MndwYjE2MzlrdjR4In0.UUjjgTbF_NA4GXUtbC8ACA'
    }).addTo(mymap);

    // Bottleneck the requests sent to the Ip-api to avoid fetch abortions
    // Make 15 requests per minute with (max) 100 IPs in each request
    while(ips.length !== 0)
    {
        try
        {
            if (ips.length-100 > limit) //if there are at least 100 more IPs in the ips object
            {
                limit = limit +100;
                var heatmapData = await getServerCords(ips.slice(idx,limit));
                ips.splice(idx, limit) //remove the first 100 elements of the array
            }
            else //else if there are less than 100 IPs
            { 
                idx = limit
                var heatmapData = await getServerCords(ips.slice(idx,));
                ips.splice(idx, ) //remove the rest of the elements of the array
            }
        }
        catch(e)
        {
            console.log(e)
            return 0;
        }

        //for each IP add 'visits' key and add the value
        //of the IP's number of requests sent from the back-end
        for(var i in heatmapData){
            heatmapData[i]['visits'] = responseData[heatmapData[i]['query']]
        }
                        
        // Initialize the data that will be used for the heatmap
        var heatMapPoints = [];
        Max = Math.max.apply(Math, heatmapData.map(function(heatmapData) { return heatmapData.visits; }));
        for(var i in heatmapData){
            temp = heatmapData[i].visits/Max;
            heatMapPoints.push([heatmapData[i].lat,heatmapData[i].lon,temp])
        }
        // Create heatmap layer for the data from the (max 100) server IPs
        // and add it to the map 
        var heat = L.heatLayer(heatMapPoints,{
                radius: 25,
                minOpacity : 0.3,
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
        await timer(4000)
                

    }
}


function redirect(){

    window.location.replace('http://localhost:3000/heatmap.html');


}

if(typeof(but) != 'undefined' && but != null){
but.onclick = redirect;
};
