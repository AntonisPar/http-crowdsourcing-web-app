module.exports.timingAn =  function timingAn(app, connection) {
    app.post('/timingData', function (request, response) {
        var filter = request.body;
        let filterMap = {
            'method':'method',
            '\`content-typeResponse\`': 'type',
            'dayname(startedDateTime)' : 'day',
            'isp' : 'isp'
        }

         connection.query(`select avg(wait) as wait, date_format(startedDateTime,'%H') as hour, \`content-typeResponse\` as type, method,isp,  dayname(startedDateTime) as day from Entry  left join Ip_info on Entry.username = Ip_info.username group by date_format(startedDateTime,'%H'), ${filter['filter']}`, function(err,result,fields){
             if (err) throw  err;
             var data = {}
             for(var i in result)
             {
                var padded = [];
                let key = result[i][filterMap[filter['filter']]]
                for( var j =0; j<=24; j++)
                {
                        padded[j]=0;
                }
                padded[result[i]['hour']] = result[i].wait

                if( Object.keys(data).includes(key))
                    {
                    data[key][result[i]['hour']] = result[i]['wait']
                    }
                else
                { 
                   data[key] = padded;
                }
             }
             response.send(data)

            });
    });
}
