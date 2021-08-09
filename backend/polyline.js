module.exports.polyline =  function polyline(app, connection) {
    app.get('/polyline', function (request, response) {

         connection.query('select username, serverIPAddress as ip, count(serverIPAddress) as count,lat,lon from Entry left join Ip_info on Entry.username=Ip_info.username group by serverIPAddress, Entry.username', function(err,result,fields){
             if (err) throw  err;
             
             console.log(result)
             response.send(result)

            });
    });
}
