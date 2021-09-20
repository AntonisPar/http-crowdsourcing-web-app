var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var login = require('./backend/login.js');
var signup = require('./backend/signup.js');
var ipGeolocation = require('./backend/ipGeolocation.js');
var uploadHar  = require('./backend/uploadHar.js');
var viewInfo  = require('./backend/viewInfo.js');
var timingAn  = require('./backend/timingAn.js');
var headers  = require('./backend/headers.js');
var colors  = require('./backend/colors.js');
var polyline  = require('./backend/polyline.js');
var ttls  = require('./backend/ttls.js');
var giveAdmin  = require('./backend/giveAdmin.js');
var changeSettings  = require('./backend/changeSettings.js');
var checkAccess = require('./backend/checkAccess.js')
var app = express();


app.use(bodyParser.json({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.static('html'));


var connection = mysql.createConnection({
    host: "localhost",
    user: "jason",
    password: "j@s0n_123",
    database: "web",
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

checkAccess.checkAccess(app, connection); 

uploadHar.uploadHar(app,connection);

changeSettings.changeSettings(app,connection);

ipGeolocation.ipGeolocation(app,connection);

viewInfo.viewInfo(app,connection);

timingAn.timingAn(app,connection);

headers.headers(app,connection);

polyline.polyline(app,connection);

giveAdmin.giveAdmin(app,connection);

ttls.ttls(app,connection);

colors.colors(app,connection);
