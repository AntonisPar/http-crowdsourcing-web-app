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
        connection.query('SELECT `content-typeResponse` as type, AVG(age) as age  FROM Entry WHERE age!="NULL" GROUP BY `content-typeResponse`', function(err,result,fields){
            var avgAge = {}
            for( var i in result){
                avgAge[result[i].type] = result[i].age;
            }
            if (err) throw  err;
            response.send(avgAge);

        });
    });
}



/*
    app.get('/avgAge', function (request, response) {
        connection.query('SELECT `content-typeResponse` as type , COUNT(`content-typeResponse`) as count FROM Entry GROUP BY `content-typeResponse`', function(err,result,fields){
            if (err) throw  err;
            let cont_type = {}
            for(let i in result){
                 if(result[i].type !== null ){
 
                         if(result[i].type.includes(';')) {
                             if(!( result[i].type.split(';')[0] in cont_type))
                                 cont_type[ result[i].type.split(';')[0]] = result[i].count
                             else
                                 cont_type[ result[i].type.split(';')[0]] += result[i].count
                             //cont_type[result[i].type] = result[i].count
                         }
     
                         else{ 
                             if(!( result[i].type in cont_type))
                                 cont_type[ result[i].type] = result[i].count
                             else
                                 cont_type[ result[i].type] += result[i].count
                         }
                 }
            cont_type[result[i].type] = result[i].count;
          }
          console.log(cont_type)

          for(let i in cont_type){
            sqlquery = ("SELECT avg(age) FROM Entry WHERE age!=\"NULL\" and `content-typeResponse`=\"" + i +"\"; ")
            
            connection.query(sqlquery,function(err,result,fields){
                console.log(result) 
          
                });
            }
        });
    });
}




// may be useful

                var age = 0;
                var months = "JanFebMarAprMayJunJulAugSepOctNovDec"
                var endTime;
                var counter = 0; 
                for(var j in result){
                    if(typeof(result[j].exp) !== 'undefined' && result[j].exp !== null){
                        //startTime[Object.keys(cont_type)[i]] = result[i][0].ctime

                        var str = result[j].exp.split(' ')
                        endTime = str[3]+"/"+(months.indexOf(str[2])/3+1)+"/"+str[1]+"/"+" "+ str[4]
                        age += Math.abs(new Date(result[j].ctime) - new Date(endTime))
                        counter++;
                    }
                    //console.log(i + ":" + age)
                    
                }
                    age = age/counter;
                    console.log(i + ":" + age)
                console.log(endTime['font/woff2'].split(' ')[4])
                });
                */
