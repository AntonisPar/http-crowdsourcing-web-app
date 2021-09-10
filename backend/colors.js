module.exports.colors =  function colors(app, connection) {
    app.get('/cont-type', function (request, response) {
        connection.query(' SELECT DISTINCT \`content-typeResponse\` as type1 FROM Entry where  \`content-typeResponse\` is not null', function(err,result,fields){
            if (err) {
                console.log(err)
                response.sendStatus(404)
            }
            else
            {
               var data = [] 
               for(var i of result) 
                {
                    data.push(i['type1'])
                }
                response.send(data)
                console.log(data)
            }
        });
    });
}
