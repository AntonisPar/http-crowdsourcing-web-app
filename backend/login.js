var CryptoJS = require('crypto-js');

module.exports.login = function(app,connection,path) {
    app.post('/', function (request, response) {
        var username = request.body.username;
        var password = CryptoJS.SHA1(request.body.password);
        if (username && password) {
            connection.query("select username,passwd from User where username = ?", [username], (error, response) => {
                if (response) {
                    if(response[0].passwd === CryptoJS.enc.Hex.stringify(password)){
                        response.redirect('har.html')
                    }
                }
            });
        }

    });
}
