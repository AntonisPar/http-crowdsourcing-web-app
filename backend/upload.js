module.exports.upload = function (app, connection) {
    
    app.post("/upload", function (request, response) {

        //connection.query('INSERT INTO User (username, e_mail, passwd) VALUES (?, ?, ?)', [username, e_mail, password]);

        var data = request.body;
        var head = request.headers;
        var entryList = [ "startedDateTime","serverIPAddress","wait" ];
        var requsetList = ["url","method","hostRequest","pragmaRequest","cache-controlRequest"];
        var responseList = ["status","statusText","cache-controlResponse","pragmaResponse","age","last-modifiedResponse","content-typeResponse","expiresResponse"];
        for(var i in data){
            connection.query('INSERT INTO Entry(username,startedDateTime, serverIPAddress, wait, url, method, hostRequest, pragmaRequest, `cache-controlRequest`, status, statusText, `cache-controlResponse`, pragmaResponse, age, `last-modifiedResponse`, `content-typeResponse`, expiresResponse) VALUES ( ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [head['name'], data[ i ]["startedDateTime"],data[i]["serverIPAddress"],data[i]["wait"],data[i]["url"],data[i]["method"],data[i]["hostRequest"],data[i]["pragmaRequest"],data[i]["cache-controlRequest"],data[i]["status"],data[i]["statusText"],data[i]["cache-controlResponse"],data[i]["pragmaResponse"],data[i]["age"],data[i]["last-modifiedResponse"],data[i]["content-typeResponse"],data[i]["expiresResponse"]]);
        }
    });
}
