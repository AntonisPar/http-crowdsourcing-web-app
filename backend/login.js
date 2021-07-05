import CryptoJS from 'crypto-js'
import path from 'path'

export function login(app,connection,path) {
    app.get('/', function (request, response) {
        response.sendFile(path.join('/Users/tsac/Projects/http-crowdsourcing/html/login.html'));
    });
    app.post('/api', function (req, res) {
        var username = req.body.username;
        var password = CryptoJS.SHA1(req.body.password);
        if (username && password) {
            connection.query("select username,passwd from User where username = ?", [username], (error, response) => {
                if (response) {
                    if( response[0].passwd === CryptoJS.enc.Hex.stringify(password)){
                        console.log(username);
//                        fetch('/usertest',
//                        {
//                            method: 'POST',
//                            body: username
//                        })
//                        .then(function(res){ return res.json(); })
                        res.redirect('/har.html');
                    }
                }
            });
        }

    });
}
