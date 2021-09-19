var mapDiv = document.getElementById('map')
var polyBut = document.getElementById('polyline')
var message = document.getElementById('alert');
var idx = 0;
var limit = 0;
mapDiv.style.display = 'none';
mapDiv.style['margin-top']='5%'
mapDiv.style.height='550px'
mapDiv.style.width='100%'
const timer = ms => new Promise(res => setTimeout(res, ms))
var mymap;

// "Polyline Map" button's on-click funtion
function mapButClick()
{
    if(mapDiv.innerHTML==='') //if the button gets pressed for the first time
        createMap();

    if(mapDiv.style.display === 'none')
    {
        document.getElementById('viewInfo').style.display='none'
        document.getElementById('timingDiv').style.display='none'
        document.getElementById('headersDiv').style.display='none'
        mapDiv.style.display='block'
    }
    else
        mapDiv.style.display = 'none';
}

// Fetch data from back-end.
// The data contain each server's IP with the number of requests sent to it
// for each user.
async function getMapData()
{
    let response = await fetch('/polyline',
        {
            method: 'GET'
        });
    if(!response.ok)
        throw new Error('An error occured');
    else
        return await response.json()

}

// Function that returns the lat,lon of the server IPs that are
// in the data sent from back-end.
async function getReqDest(ips)
{
    var endpoint = "http://ip-api.com/batch?fields=query,lat,lon"
    var ip = [];
    for(let i=0; i<ips.length; i++)
        ip.push(ips[i].ip)
    

    var dest = await fetch(endpoint,
        {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(ip)
        });
    if(!dest.ok)
        throw new Error('Problem with the IP-api');
    else
        return await dest.json();
}

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

// Function that creates the map layer and polyline layer
// based on the data from back-end and Ip-api
async function createMap()
{
    
    message.style.display='none'
    try{
        var initMapData = await getMapData();
    }
    catch(e){
        message.innerHTML=e;
        message.style.display='block'
        console.log(e)
        return 0;
    }
    try{
        var view = await myCords();
    }
    catch(e){
        message.innerHTML=e;
        message.style.display='block'
        console.log(e)
        return 0;
    }
    if(mapDiv.classList.length!==0)
    {
        mymap.invalidateSize()
        return;

    }

    // Create the map and the map layer and center it on the admin's current location
    mymap = L.map('map').setView([view.lat, view.lon], 20);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery � <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 12,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoidHNhYyIsImEiOiJja3M0MndvNDAwZ2xtMndsbHQwOHM1Z2FkIn0.atMs4AwoOm-9J30apCN_Vw",
    }).addTo(mymap);


    // Bottleneck the requests sent to the Ip-api to avoid fetch abortions
    // Make 15 requests per minute with (max) 100 IPs in each request
    // While loop will continue for all Users
    while(Object.keys(initMapData).length !== 0)
    {
        var mapData=new Object()
        var mapKey =Object.keys(initMapData)[0] //current processing User's lat,lon
        mapData[mapKey] = new Array(); //create new key in object and the value is an empty array
        try
        {
            if (initMapData[mapKey].length-100 > limit) //if there are at least 100 more IPs in the object
            {
                limit = limit +100;
                var serverCords = await getReqDest(initMapData[mapKey].slice(idx,limit));
            }
            else //else if there are less than 100 IPs
            { 
                idx = limit
                var serverCords = await getReqDest(initMapData[mapKey].slice(idx,));
            }
        }
        catch(e){
            message.innerHTML=e;
            console.log(e)
            message.style.display='block'
            return 0;
        }

        // Initialize current processing User's object with
        // the lat,lon of each of the servers and the number of requests to each server 
        for(let j=0; j<Object.keys(serverCords).length; j++)
        {
            mapData[mapKey][j] ={ 'cords' :serverCords[j].lat.toString() + ',' + serverCords[j].lon.toString(),
                                  'visits':initMapData[mapKey][j+idx].visits
            }
        }
    
        //add a marker for current processing User to the map
        L.marker([parseFloat(mapKey.split(',')[0]), parseFloat(mapKey.split(',')[1])]).addTo(mymap)

        // Normalize the thickness of the lines and add them on the map 
        var maxVisits = Math.max.apply(Math, initMapData[mapKey].map(function(o) { return o.visits; }))
        for(var j in mapData[mapKey])
        {
            let line = [[parseFloat(mapKey.split(',')[0]), parseFloat(mapKey.split(',')[1])],[parseFloat(mapData[mapKey][j].cords.split(',')[0]),parseFloat(mapData[mapKey][j].cords.split(',')[1])]]

            L.polyline(line,{weight: (mapData[mapKey][j].visits/maxVisits) > 0.2 ? 3*(mapData[mapKey][j].visits/maxVisits) : 0.2 }).addTo(mymap);

            delete initMapData[mapKey][parseInt(j)+idx]
        }
    idx =limit
    //if all the lines for the server IPs for a User are done getting rendered on the map
    //remove him from object and reset the indexes for the next User to be processed
    if(Object.keys(initMapData[mapKey]).length === 0)
    {
        delete initMapData[mapKey]
        idx=0;
        limit=0;
    }
    await timer(4000)
    }
}

polyBut.onclick = mapButClick;
