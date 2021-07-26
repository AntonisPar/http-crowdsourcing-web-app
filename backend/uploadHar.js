module.exports.uploadHar =  function uploadHar(app, connection) {
//    app.post("/usercookie",function(request,response) {
//        console.log(request.body);
//
//    });
    app.post("/upload", function (request, response) {

        var data = request.body;
        console.log(request.headers.cookie);
        var cookie = JSON.parse(request.headers.cookie);

        for(var i in data){
            connection.query('INSERT INTO Entry(username,uploadDate,startedDateTime, serverIPAddress, wait, url, method, hostRequest, pragmaRequest, `cache-controlRequest`, status, statusText, `cache-controlResponse`, pragmaResponse, age, `last-modifiedResponse`, `content-typeResponse`, expiresResponse) VALUES ( ?,CURDATE(), ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [cookie['username'], data[ i ]["startedDateTime"],data[i]["serverIPAddress"],data[i]["wait"],data[i]["url"],data[i]["method"],data[i]["hostRequest"],data[i]["pragmaRequest"],data[i]["cache-controlRequest"],data[i]["status"],data[i]["statusText"],data[i]["cache-controlResponse"],data[i]["pragmaResponse"],data[i]["age"],data[i]["last-modifiedResponse"],data[i]["content-typeResponse"],data[i]["expiresResponse"]]);
        }
    });
    app.post("/myisp", function (request, response) {

        var data = request.body;
        var cookie = JSON.parse(request.headers.cookie);

        connection.query('INSERT IGNORE INTO Ip_info(username,isp,lat,lon) VALUES (?,?,?,?)', [cookie['username'],request.body['isp'],request.body['lat'],request.body['lon']]);
    });
}
