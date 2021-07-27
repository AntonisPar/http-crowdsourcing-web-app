module.exports.viewInfo =  function viewInfo(app, connection) {
    app.get('/userCount', function (request, response) {
        connection.query('SELECT COUNT(*) as count FROM User WHERE isAdmin=0', function(err,result,fields){
            if (err) throw  err;
            response.send(result[0].count.toString());
            }); });
    app.get('/methodCount', function (request, response) {
        connection.query('SELECT method,COUNT(method) as count FROM Entry GROUP BY method', function(err,result,fields){
            if (err) throw  err;
            let dataToSend = {};
            for (let i in result){
                dataToSend[result[i].method] = result[i].count
            }
            response.send(dataToSend);
            
            });
    });
    app.get('/statusCount', function (request, response) {
        var name = request.headers;
        connection.query('SELECT status,COUNT(status) as count FROM Entry GROUP BY status', function(err,result,fields){
            if (err) throw  err;
            let dataToSend = {};
            for (let i in result){
                dataToSend[result[i].status.toString()] = result[i].count
            }
            response.send(dataToSend);
            
            });
    });
    app.get('/domainsCount', function (request, response) {
        connection.query('SELECT COUNT(DISTINCT serverIPAddress) as count FROM Entry', function(err,result,fields){
            if (err) throw  err;
            response.send(result[0].count.toString());
            });
    });
    app.get('/ispCount', function (request, response) {
        connection.query('SELECT COUNT(DISTINCT isp) as count FROM Ip_info', function(err,result,fields){
            if (err) throw  err;
            response.send(result[0].count.toString());
            });
    });
    app.get('/avgAge', function (request, response) {
        connection.query('SELECT `content-typeResponse` as type , COUNT(`content-typeResponse`) as count FROM Entry GROUP BY `content-typeResponse`', function(err,result,fields){
            if (err) throw  err;
            let cont_type = {}
            for(let i in result){
//                 if(result[i].type !== null ){
// 
//                         if(result[i].type.includes(';')) {
//                             if(!( result[i].type.split(';')[0] in cont_type))
//                                 cont_type[ result[i].type.split(';')[0]] = result[i].count
//                             else
//                                 cont_type[ result[i].type.split(';')[0]] += result[i].count
//                             //cont_type[result[i].type] = result[i].count
//                         }
//     
//                         else{ 
//                             if(!( result[i].type in cont_type))
//                                 cont_type[ result[i].type] = result[i].count
//                             else
//                                 cont_type[ result[i].type] += result[i].count
//                         }
//                 }
            cont_type[result[i].type] = result[i].count;
          }
            console.log(cont_type)

          var sqlquery ="";
          for(let i in cont_type){
            sqlquery += ("SELECT AVG(TIME_TO_SEC(startedDateTime)) as ctime, expiresResponse as exp  FROM Entry WHERE `content-typeResponse`=\"" + i +"\"; ")
            }
            connection.query(sqlquery,function(err,result,fields){
                var startTime = {}
                var endTime = {}
                for(var i=1; i<Object.keys(cont_type).length; i++){
                    startTime[Object.keys(cont_type)[i]] = result[i][0].ctime
                    endTime[Object.keys(cont_type)[i]] = result[i][0].exp
                }
                console.log(endTime['font/woff2'].split(' ')[4])
                });
            
        });
    });
}

