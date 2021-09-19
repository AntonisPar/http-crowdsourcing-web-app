module.exports.polyline =  function polyline(app, connection) {
    app.get('/polyline', function (request, response) {

         connection.query('select Entry.username, serverIPAddress as ip, count(serverIPAddress) as count,lat,lon from Entry left join Ip_info on Entry.username=Ip_info.username group by serverIPAddress, Entry.username', function(err,result,fields){
             if (err) {
                 console.log(err)
                 response.sendStatus(404);
             }
             else{
             
                var toSend = {};
                for(var i in result)
                {
                    if((result[i].ip === null) || result[i].ip === '')
                        continue
                    dataObj = { //contains disticnt IPs that user has requested and the number of requests to the IP
                        'ip': result[i].ip.match(/\w.*\w/)[0].toString(),
                        'visits': result[i].count,
                    }
                    // For every user create a key with his lat,lon and add the IP data as the value
                    if(!(Object.keys(toSend).includes(result[i].lat.toString()+ "," + result[i].lon.toString())))
                    {
                        toSend[(result[i].lat.toString() + "," + result[i].lon.toString())] = new Array();
                        toSend[(result[i].lat.toString() + "," + result[i].lon.toString())].push(dataObj)
                    }
                    else 
                       toSend[(result[i].lat.toString() + "," + result[i].lon.toString())].push(dataObj)

                }
                response.send(toSend)
            }

        });
    });
}
