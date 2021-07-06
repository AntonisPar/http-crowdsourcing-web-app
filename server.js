var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var login = require('./backend/login.js');
var signup = require( './backend/signup.js');
var uploadHar  = require('./backend/uploadHar.js');
var app = express()

//app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.static('html'));

//app.use(function (req, res, next) {
//  getRawBody(req, {
//    length: req.headers['content-length'],
//    limit: '50mb',
//    encoding: contentType.parse(req).parameters.charset
//  }, function (err, string) {
//    if (err) return next(err)
//    req.text = string
//    next()
//  })
//})
 


var connection = mysql.createConnection({
    host: "localhost",
    user: "tsac",
    password: "pass",
    database: "web"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
}); 

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
});


login.login(app,connection,path);

signup.signup(app,connection); 

uploadHar.uploadHar(app,connection);
