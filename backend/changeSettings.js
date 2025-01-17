var SHA1 =require( 'crypto-js/sha1.js');

module.exports.changeSettings =  function changeSettings(app, connection) {
    app.get('/info', function (request, response) {
        var name = JSON.parse(request.headers.cookie);
        connection.query('SELECT COUNT(entryId) as entryNum  FROM Entry where username=(?) ; SELECT uploadDate FROM Entry WHERE username=(?) ORDER BY uploadDate DESC LIMIT 1', [name['username'],name['username']], function(err,result,fields){
            if (err) 
            {
                response.sendStatus(404)
            }
            else if(result[1].length===0)
            {
                response.sendStatus(404)
            }
            else{
                entryNum = result[0][0]['entryNum'];
                lastDate = result[1][0]['uploadDate'];
                var info = [{
                    "entryNum": entryNum,
                    "lastDate": lastDate
                }]

                response.send(info)
                }
            }
      );
            
    });

    app.post('/settings', function (request, response) {

        var username = request.body.new_name;
        var conf_pass = SHA1(request.body.confirm_pass).toString();
        var password = SHA1(request.body.new_pass).toString();
        var old_pass = SHA1(request.body.old_pass).toString()
        var cookie = JSON.parse(request.headers.cookie)
        

        connection.query('SELECT username FROM User WHERE username=(?)', [username],function(err,name,fields){
            if(Object.keys(name).length !== 0 && username !== cookie['username'])
                response.send("Username exists")
            else
                connection.query('SELECT passwd FROM User WHERE username=(?)', [cookie['username']],function(err,pass,fields){
                    if(pass[0]['passwd'] === old_pass){
                        connection.query('UPDATE User SET username=(?), passwd=(?) WHERE username=(?)', [username,password,cookie['username']],function(err,res,fields){
                                if(err) console.log(err);
                            });
                            response.send("Successful change")
                    }
                    else 
                        response.send("Incorrect old pass")
                    
                });

            });
        });

}
