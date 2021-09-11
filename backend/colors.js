module.exports.colors =  function colors(app, connection) {
    app.get('/cont-type', function (request, response) {
        connection.query(' SELECT DISTINCT \`content-typeResponse\` as type1 FROM Entry where  \`content-typeResponse\` is not null ; SELECT DISTINCT method from Entry where method is not null', function(err,result,fields){
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
                console.log(data)
                response.send(data)
            }
        });
    });
}
