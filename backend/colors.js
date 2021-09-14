module.exports.colors =  function colors(app, connection) {
    app.get('/cont-type', function (request, response) {
        connection.query(' SELECT DISTINCT \`content-typeResponse\` as type1 FROM Entry where  \`content-typeResponse\` is not null ; SELECT DISTINCT method from Entry where method is not null ; SELECT DISTINCT isp from Ip_info where isp is not null; SELECT DISTINCT dayname(startedDateTime) as day from Entry where startedDateTime is not null', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
               var data = [] 
               for(var i in result[0]) 
                {
                    data.push(result[0][i]['type1'])
                }
               for(var j in result[1]) 
                {
                    data.push(result[1][j]['method'])
                }
               for(var k in result[2]) 
                {
                    data.push(result[2][k]['isp'])
                }
               for(var m in result[3]) 
                {
                    data.push(result[3][m]['day'])
                }
                response.send(data)
            }
        });
    });
}
