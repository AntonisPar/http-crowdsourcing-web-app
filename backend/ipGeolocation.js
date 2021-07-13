module.exports.ipGeolocation =  function ipGeolocation(app, connection) {
    app.get('/ipInfo', function (request, response) {
        var name = request.headers;
        connection.query('SELECT DISTINCT serverIPAddress as ip  FROM Entry where username=(?)', [name['username']], function(err,result,fields){
            if (err) throw  err;
            var ips = []; 
            for(var i in result){
                ips[i] = result[0]['ip']
            }
            response.send(ips)
            });

            
            
        //response.sendFile(path.resolve('html/profileSettings.html'));
    });
}
