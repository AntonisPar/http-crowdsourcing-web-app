var SHA1 =require( 'crypto-js/sha1.js');

module.exports.changeSettings =  function changeSettings(app, connection) {
    app.get('/info', function (request, response) {
        var name = request.headers;
        connection.query('SELECT COUNT(entryId) AS entryNum FROM Entry where username=(?)', [name['username']], function(err,result,fields){
            if (err) throw  err;
            for(i in result[0]){
                console.log(i)
            }
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
