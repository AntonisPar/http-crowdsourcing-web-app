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
                    console.log(heatmapData)
                    var testData = {
                      max: 8,
                      data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
                    };
                    
                    var baseLayer = L.tileLayer(
                      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                        attribution: '...',
                        maxZoom: 18
                      }
                    );
                    
                    var cfg = {
                      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                      // if scaleRadius is false it will be the constant radius used in pixels
                      "radius": 2,
                      "maxOpacity": .8,
                      // scales the radius based on map zoom
                      "scaleRadius": true,
                      // if set to false the heatmap uses the global maximum for colorization
                      // if activated: uses the data maximum within the current map boundaries
                      //   (there will always be a red spot with useLocalExtremas true)
                      "useLocalExtrema": true,
                      // which field name in your data represents the latitude - default "lat"
                      latField: 'lat',
                      // which field name in your data represents the longitude - default "lng"
                      lngField: 'lng',
                      // which field name in your data represents the data value - default "value"
                      valueField: 'count'
                    };
                    
                    
                    var heatmapLayer = new HeatmapOverlay(cfg);
                    
                    var map = new L.Map('mapid', {
                      center: new L.LatLng(25.6586, -80.3568),
                      zoom: 4,
                      layers: [baseLayer, heatmapLayer]
                    });
                    
                    heatmapLayer.setData(testData);

        })
    
    })
}

function redirect(){

    window.location.replace('http://localhost:3000/heatmap.html');


}

if(typeof(but) != 'undefined' && but != null){
but.onclick = redirect;
};
                   //console.log(Math.max.apply(Math, heatmapData.map(function(heatmapData) { return heatmapData.visits; })));
                   // for(var i in heatmapData){
                   //     if (heatmapData.hasOwnProperty(i)){
                   //         heatmap.addDataPoint([
                   //             [heatmapData[i].lat,heatmapData[i].lon,(heatmapData[i].visits)],
                   //         ]);

                   //     }
                   // }
