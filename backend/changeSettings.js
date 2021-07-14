var SHA1 =require( 'crypto-js/sha1.js');

module.exports.changeSettings =  function changeSettings(app, connection) {
    app.get('/user_settings', function (request, response) {
        var name = request.headers;
        connection.query('SELECT COUNT(entryId) as entryNum  FROM Entry where username=(?) ; SELECT uploadDate FROM Entry WHERE username=(?) ORDER BY uploadDate DESC LIMIT 1', [name['username'],name['username']], function(err,result,fields){
            if (err) throw  err;
            entryNum = result[0][0]['entryNum'];
            lastDate = result[1][0]['uploadDate'];
            var info = [{
                "entryNum": entryNum,
                "lastDate": lastDate
            }]

            response.send(info)
            });

            
            
        //response.sendFile(path.resolve('html/profileSettings.html'));
    });

    app.post('/settings', function (request, response) {

        var username = request.body.new_username;
        var password = SHA1(request.body.new_password).toString();
        var cookie = JSON.parse(request.headers.cookie)

        //connection.query('UPDATE User SET username=(?), passwd=(?) WHERE username=(?)', [username,  password,cookie['username']]);

        //response.send('COOL');
    });
}