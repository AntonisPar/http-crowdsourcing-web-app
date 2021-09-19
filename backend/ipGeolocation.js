module.exports.ipGeolocation =  function ipGeolocation(app, connection) {
    app.get('/ipInfo', function (request, response) {
        var name = JSON.parse(request.headers.cookie);
        connection.query('SELECT DISTINCT serverIPAddress as ip, count(*) as numReq FROM Entry where username=(?) AND serverIPAddress IS NOT NULL group by serverIPAddress;', [name['username']], function(err,result,fields){
            if (err){
                console.log(err)
            }
            var ips = new Object(); 
            for(var i in result){
                if(result[i]['ip'] !== '') //if IP is not empty, create a key for the IP
                                           //with the value of the total number of requests to that IP
                    ips[result[i]['ip'].match(/\w.*\w/)[0].toString()]=result[i]['numReq']
            }
            response.send(ips)
            });
    });

}
