import bodyParser from 'body-parser';
import path from 'path'
import express from 'express';
import getRawBody from 'raw-body'
import * as mysql from 'mysql'
import { login } from './backend/login.js'
import { signup } from './backend/signup.js'
import { uploadHar } from './backend/uploadHar.js'
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


login(app,connection,path);

signup(app,connection); 

uploadHar(app,connection);
