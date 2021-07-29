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
            let content;
            if( (data[i]['content-typeResponse'] !== null) && (typeof(data[i]['content-typeResponse']) !== 'undefined')) {

                if((data[i]['content-typeResponse'].includes(';')) ){

                content = data[i]['content-typeResponse'].split(';')[0]

                }
//                //else content = data[i]['content-typeResponse']
            }
            if ((data[i]['age'] == null) && (typeof(data[i]['age']) == 'undefined'))
            {
                if(typeof(data[i].expiresResponse) !== 'undefined' && data[i].expiresResponse !== null)
                {
                        data[i].ageResponse = Math.abs(new Date(data[i].startedDateTime) - new Date(data[i].expiresResponse));
                        //data[i].ageResponse = new Date(Math.abs(new Date(data[i].startedDateTime) - new Date(data[i].expiresResponse)) * 1000).toISOString().substr(11,8);
                    }
                else
                    data[i].ageResponse = 'NULL';
                    
                }
            
            connection.query('INSERT INTO Entry(username,uploadDate,startedDateTime, serverIPAddress, wait, url, method, hostRequest, pragmaRequest, `cache-controlRequest`, status, statusText, `cache-controlResponse`, pragmaResponse, age, `last-modifiedResponse`, `content-typeResponse`, expiresResponse) VALUES ( ?,CURDATE(), ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [cookie['username'], data[ i ]["startedDateTime"],data[i]["serverIPAddress"],data[i]["wait"],data[i]["url"],data[i]["method"],data[i]["hostRequest"],data[i]["pragmaRequest"],data[i]["cache-controlRequest"],data[i]["status"],data[i]["statusText"],data[i]["cache-controlResponse"],data[i]["pragmaResponse"],data[i]["ageResponse"],data[i]["last-modifiedResponse"],content,data[i]["expiresResponse"]]);
            
        }
    });

    app.post("/myisp", function (request, response) {

        var data = request.body;
        var cookie = JSON.parse(request.headers.cookie);

        connection.query('INSERT IGNORE INTO Ip_info(username,isp,lat,lon) VALUES (?,?,?,?)', [cookie['username'],request.body['isp'],request.body['lat'],request.body['lon']]);
    });
}
