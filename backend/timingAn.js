module.exports.timingAn =  function timingAn(app, connection) {
    app.get('/timingData', function (request, response) {
        connection.query('select avg(wait), `content-typeResponse`, method, startedDateTime from Entry group by `content-typeResponse`;', function(err,result,fields){
            if (err) throw  err;
            });
    });
}