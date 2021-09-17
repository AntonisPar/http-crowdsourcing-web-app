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

function mapButClick()
{
    if(mapDiv.innerHTML==='')
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

    mymap = L.map('map').setView([view.lat, view.lon], 20);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 12,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoidHNhYyIsImEiOiJja3M0MndvNDAwZ2xtMndsbHQwOHM1Z2FkIn0.atMs4AwoOm-9J30apCN_Vw",
    }).addTo(mymap);


    while(Object.keys(initMapData).length !== 0)
    {
        var mapData=new Object()
        var mapKey =Object.keys(initMapData)[0]
        mapData[mapKey] = new Array();
        try
        {
            if (initMapData[mapKey].length-100 > limit)
            {
                limit = limit +100;
                var serverCords = await getReqDest(initMapData[mapKey].slice(idx,limit));
            }
            else 
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


        for(let j=0; j<Object.keys(serverCords).length; j++)
        {
            mapData[mapKey][j] ={ 'cords' :serverCords[j].lat.toString() + ',' + serverCords[j].lon.toString(),
                                  'visits':initMapData[mapKey][j+idx].visits
            }
        }
    
        L.marker([parseFloat(mapKey.split(',')[0]), parseFloat(mapKey.split(',')[1])]).addTo(mymap)
        var maxVisits = Math.max.apply(Math, initMapData[mapKey].map(function(o) { return o.visits; }))
        for(var j in mapData[mapKey])
        {
            let line = [[parseFloat(mapKey.split(',')[0]), parseFloat(mapKey.split(',')[1])],[parseFloat(mapData[mapKey][j].cords.split(',')[0]),parseFloat(mapData[mapKey][j].cords.split(',')[1])]]

            L.polyline(line,{weight: (mapData[mapKey][j].visits/maxVisits) > 0.2 ? (mapData[mapKey][j].visits/maxVisits) : 0.2 }).addTo(mymap);

            delete initMapData[mapKey][parseInt(j)+idx]
        }
    idx =limit
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
