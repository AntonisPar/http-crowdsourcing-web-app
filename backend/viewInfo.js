module.exports.viewInfo =  function viewInfo(app, connection) {
    app.get('/userCount', function (request, response) {
        connection.query('SELECT COUNT(*) as count FROM User WHERE isAdmin=0', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
                response.send(result[0].count.toString());
            }
        });
    });
    app.get('/methodCount', function (request, response) {
        connection.query('SELECT method,COUNT(method) as count FROM Entry GROUP BY method', function(err,result,fields){
                if (err) {
                    console.log(err)
                    response.sendStatus(404)
                }
                else
                {
                    let dataToSend = {};
                    for (let i in result){ //each key is a distinct HTTP method, each value is 
                                           //the times the method appears in the uploaded entries
                        dataToSend[result[i].method] = result[i].count
                    }
                    response.send(dataToSend);
                
                }
            });
    });
    app.get('/statusCount', function (request, response) {
        var name = request.headers;
        connection.query('SELECT status,COUNT(status) as count FROM Entry GROUP BY status', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
                let dataToSend = {};
                for (let i in result){ //each key is a distinct HTTP status, each value is 
                                       //the times the status appears in the uploaded entries
                    dataToSend[result[i].status.toString()] = result[i].count
                }
                response.send(dataToSend);
            }
            
            });
    });
    app.get('/domainsCount', function (request, response) {
        connection.query('SELECT COUNT(DISTINCT url) as count FROM Entry', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
                response.send(result[0].count.toString());
            }
        });
    });
    app.get('/ispCount', function (request, response) {
        connection.query('SELECT COUNT(DISTINCT isp) as count FROM Ip_info', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
                response.send(result[0].count.toString());
            }
            });
    });
    app.get('/avgAge', function (request, response) {
        connection.query('SELECT `content-typeResponse` as type, AVG(ageResponse) as age  FROM Entry WHERE ageResponse is not null GROUP BY `content-typeResponse`', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
                var avgAge = {} //each key is a distinct Content-Type, each value is 
                                //the avg(age) of the Content-Type in hours and minutes
                for( var i in result){

                    var hours = result[i].age/3600

                    var minutes = parseFloat("0."+ hours.toString().split('.')[1])*60
                    avgAge[result[i].type] = hours.toString().split('.')[0]+":" + minutes.toString().split('.')[0]

                }
            response.send(avgAge);
            }

        });
    });
}
