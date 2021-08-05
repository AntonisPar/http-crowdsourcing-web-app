module.exports.timingAn =  function timingAn(app, connection) {
    app.post('/timingData', function (request, response) {
        var filter = request.body;
        let filterMap = {
            'method':'method',
            '\`content-typeResponse\`': 'type',
            'dayname(startedDateTime)' : 'day'
        }

         connection.query(`select avg(wait) as wait, date_format(startedDateTime,'%H') as hour, \`content-typeResponse\` as type, method, dayname(startedDateTime) as day from Entry group by date_format(startedDateTime,'%H'), ${filter['filter']}`, function(err,result,fields){
             if (err) throw  err;
             var data = {}
             var label = [];
             for( var i in result)
             {
                 let key = result[i]['hour']
                 let obj = {
                     'wait': result[i].wait,
                     'check' : result[i][filterMap[filter['filter']]]
                 }
                 label.push(result[i][filterMap[filter['filter']]])
                 if( Object.keys(data).includes(key))
                    data[key].push(obj)
                 else
                 { 
                    data[key] = new Array()
                    data[key].push(obj)
                 }
             }
             
             var toSend = {
                 'labels': label,
                 'data' : data
             }
             response.send(toSend)

            });
    });
}

