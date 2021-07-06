var SHA1 =require( 'crypto-js/sha1.js');

module.exports.signup =  function signup(app, connection) {
    app.get('/', function (request, response) {
        response.sendFile(path.resolve('html/signup.html'));
    });

    app.post('/signup', function (request, response) {

        var username = request.body.username;
        var e_mail = request.body.email;
        var password = SHA1(request.body.password).toString();

        console.log(username, password, e_mail);

        connection.query('INSERT INTO User (username, e_mail, passwd) VALUES (?, ?, ?)', [username, e_mail, password]);

        response.send('COOL');
    });
}
