var CryptoJS = require('crypto-js');
var path = require('path');

module.exports.login =  function login(app,connection,path) {
 app.get('/', function (request, response) {
        response.sendFile(path.resolve('html/login.html'));
    });
    app.post('/login', function (req, res) {
        var username = req.body['username'];
        console.log(req.body['username'])
        var password = CryptoJS.SHA1(req.body['password']);
        if (username && password) {
            connection.query("select username,passwd,isAdmin from User where username = ?", [username], (error, response) => {
                if (response) {
                    if( response[0].passwd === CryptoJS.enc.Hex.stringify(password)){
                        if(response[0].isAdmin === 0)
                        //res.redirect('/main.html');
                            res.send('/main.html');
                        else
                            res.send('/mainAdmin.html');
                    }
                    else 
                        res.send("fail")
                }
                else 
                    res.send("fail")
            });
        }
        else
            res.send("empty")

    });
}
