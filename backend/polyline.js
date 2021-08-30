module.exports.polyline =  function polyline(app, connection) {
    app.get('/polyline', function (request, response) {

         connection.query('select Entry.username, serverIPAddress as ip, count(serverIPAddress) as count,lat,lon from Entry left join Ip_info on Entry.username=Ip_info.username group by serverIPAddress, Entry.username', function(err,result,fields){
             if (err) throw  err;
             var toSend = {};
             for(var i in result)
             {
                 if((result[i].ip === null) || result[i].ip === '')
                     continue
                 dataObj = {
                     'ip': result[i].ip.match(/\w.*\w/)[0].toString(),
                     'visits': result[i].count,
                 }
                 if(!(Object.keys(toSend).includes(result[i].lat.toString()+ "," + result[i].lon.toString())))
                 {
                     toSend[(result[i].lat.toString() + "," + result[i].lon.toString())] = new Array();
                     toSend[(result[i].lat.toString() + "," + result[i].lon.toString())].push(dataObj)
                 }
                     else 
                        toSend[(result[i].lat.toString() + "," + result[i].lon.toString())].push(dataObj)

             }
             response.send(toSend)

            });
    });
}
