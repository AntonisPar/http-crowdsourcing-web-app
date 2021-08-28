var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var login = require('./backend/login.js');
var signup = require('./backend/signup.js');
var upload = require('./backend/upload.js');
var changeSettings = require('./backend/changeSettings.js');
var ipGeolocation = require('./backend/ipGeolocation.js');
var viewInfo  = require('./backend/viewInfo.js');
var timingAn  = require('./backend/timingAn.js');
var headersInfo = require('./backend/headersInfo.js');
var polyline = require('./backend/polyline.js');
var app = express();


app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.static('html'));

var connection = mysql.createConnection({
    host: "localhost",
    user: "jason",
    password: "j@s0n_123", //used to be J@s0n123
    database: "web", //used to be web_project
    multipleStatements: true
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
upload.uploadHar(app,connection);
changeSettings.changeSettings(app,connection);
ipGeolocation.ipGeolocation(app,connection);
viewInfo.viewInfo(app,connection);
timingAn.timingAn(app, connection);
polyline.polyline(app, connection);
headersInfo.headersInfo(app, connection);