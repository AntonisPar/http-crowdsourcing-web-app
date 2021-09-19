var CryptoJS = require('crypto-js');

module.exports.login =  function login(app,connection,path) {
    app.get('/', function (request, response) {
        response.sendFile(path.resolve('html/login.html'));
    });
    app.post('/login', function (request, response) {
        var username = request.body['username'];
        var password = CryptoJS.SHA1(request.body['password']); //encrypt sent password
        if (username && password) {
            connection.query("select username,passwd,isAdmin from User where username = ?", [username], (error, result) => {
                if (result.length !==0) {
                    if( result[0].passwd === CryptoJS.enc.Hex.stringify(password)){
                        if(result[0].isAdmin === 0)
                            response.send('/har.html');
                        else if(result[0].isAdmin === 1)
                            response.send('/mainAdmin.html');
                    }
                    else 
                        response.send("fail")
                }
                else 
                    response.send("fail")
            });
        }
        else
            response.send("empty")

    });
}
