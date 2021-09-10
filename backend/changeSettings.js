var SHA1 =require( 'crypto-js/sha1.js');

module.exports.changeSettings =  function changeSettings(app, connection) {
    app.get('/info', function (request, response) {
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

        var username = request.body.new_name;
        var conf_pass = SHA1(request.body.confirm_pass).toString();
        var password = SHA1(request.body.new_password).toString();
        var old_pass = SHA1(request.body.old_pass).toString()
        var cookie = JSON.parse(request.headers.cookie)

        //console.log( username, conf_pass ,password ,old_pass )
        connection.query('SELECT passwd FROM User WHERE username=(?)', [cookie['username']],function(err,pass,fields){
            if(pass[0]['passwd'] === old_pass){
                    connection.query('UPDATE User SET username=(?), passwd=(?) WHERE username=(?)', [username,  password,cookie['username']],function(err,res,fields){
                        if(err) console.log(err);
                    });
                    response.send("1")
            }
            else response.send("3")
            

        });


    });
}