var SHA1 =require( 'crypto-js/sha1.js');

module.exports.signup =  function signup(app, connection) {

    app.post('/signup', function (request, response) {

        var username = request.body['username'];
        var e_mail = request.body['email'];
        var password = SHA1(request.body['password']).toString(); //encode password

        connection.query('SELECT * FROM User WHERE username=(?)', [username], (err,result,fields)=>{
            if(Object.keys(result).length !== 0 ){
                response.send("exist")
            }
            else{

                connection.query('INSERT INTO User (username, e_mail, passwd) VALUES (?, ?, ?)', [username, e_mail, password]);
                response.send("true")
            }
        });

    });
}

