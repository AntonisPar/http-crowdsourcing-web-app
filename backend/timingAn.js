module.exports.timingAn =  function timingAn(app, connection) {
    app.post('/timingData', function (request, response) {
        var group = request.body
        console.log(request)

         connection.query('select avg(wait) as wait, `content-typeResponse` as type, method, startedDateTime as time from Entry group by (?)',[[group]], function(err,result,fields){
             if (err) throw  err;
             var data = {};
             for( var i in result)
             {
             }
            });
    });
}
