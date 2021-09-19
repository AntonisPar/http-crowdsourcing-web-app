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
             if (err)
             {
                 console.log(err);
                 response.sendStatus(404);
             }
             else
             {
                var data = {} // Object to be sent to front-end that contains one key for each
                              // distinct value of the filter (e.g. if filter is "By Method", keys are POST, GET, etc.).
                              // The value of each key is an array of length 25 that each element is the average response
                              // time for the certain key in the certain hour of the day.
                              // (e.g. if key is POST and the element 15 of the array has the value 30, then the average response time
                              // of POST methods at 15pm is 30 milliseconds)
                for(var i in result)
                {
                    var padded = [];
                    let key = result[i][filterMap[filter['filter']]]
                    if(key === null)
                       continue;
                    for( var j =0; j<=24; j++)
                           padded[j]=0;

                    padded[result[i]['hour']] = result[i].wait 

                    if( Object.keys(data).includes(key))
                    {
                        data[key][result[i]['hour']] = result[i]['wait'] //initialize the values of the object
                    }
                    else
                    { 
                      data[key] = padded;
                    }
                }
                response.send(data)
             }
        });
    });
}
