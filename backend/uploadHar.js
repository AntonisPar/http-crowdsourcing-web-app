export function uploadHar(app, connection) {
//    app.post("/usercookie",function(request,response) {
//        console.log(request.body);
//
//    });
    app.post("/upload", function (request, response) {

        var data = request.body;
        var head = request.headers;

        for(var i in data){
            connection.query('INSERT INTO Entry(username,startedDateTime, serverIPAddress, wait, url, method, hostRequest, pragmaRequest, `cache-controlRequest`, status, statusText, `cache-controlResponse`, pragmaResponse, age, `last-modifiedResponse`, `content-typeResponse`, expiresResponse) VALUES ( ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [head['name'], data[ i ]["startedDateTime"],data[i]["serverIPAddress"],data[i]["wait"],data[i]["url"],data[i]["method"],data[i]["hostRequest"],data[i]["pragmaRequest"],data[i]["cache-controlRequest"],data[i]["status"],data[i]["statusText"],data[i]["cache-controlResponse"],data[i]["pragmaResponse"],data[i]["age"],data[i]["last-modifiedResponse"],data[i]["content-typeResponse"],data[i]["expiresResponse"]]);
        }
    });
}
