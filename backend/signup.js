var SHA1 =require( 'crypto-js/sha1.js');

module.exports.signup =  function signup(app, connection) {
    app.get('/', function (request, response) {
        response.sendFile(path.resolve('html/signup.html'));
    });

    app.post('/signup', function (request, response) {

        var username = request.body['username'];
        var e_mail = request.body['email'];
        var password = SHA1(request.body['password']).toString();

        connection.query('SELECT * FROM User WHERE username=(?)', [username], (err,query,fields)=>{
            if(Object.keys(query).length !== 0 ){
                response.send("exist")
            }
            else{

                connection.query('INSERT INTO User (username, e_mail, passwd) VALUES (?, ?, ?)', [username, e_mail, password]);
                response.send("true")
            }
        });

    });
}

