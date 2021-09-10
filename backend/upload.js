module.exports.uploadHar =  function uploadHar(app, connection) {
    app.post("/upload", function (request, response) {

        var data = request.body;
        let nestedArr = new Array()
        var curdate = new Date().toJSON().slice(0,10).replace(/-/g,'/')
        var cookie = JSON.parse(request.headers.cookie);
        var checklist = ["startedDateTime","serverIPAddress","wait","url","method","hostRequest","pragmaRequest","cache-controlRequest","status","statusText","cache-controlResponse","pragmaResponse","ageResponse","last-modifiedResponse",'content-typeResponse',"expiresResponse"]

        for(var i in data){
            if( (data[i]['content-typeResponse'] !== null) && (typeof(data[i]['content-typeResponse']) !== 'undefined')) {

                if((data[i]['content-typeResponse'].includes(';')) ){

                data[i]['content-typeResponse'] = data[i]['content-typeResponse'].split(';')[0]

                }
//                //else content = data[i]['content-typeResponse']
            }
                
            if ((data[i]['cache-controlResponse'] === null) || (typeof(data[i]['cache-controlResponse']) === 'undefined') || (!(data[i]['cache-controlResponse'].includes('max-age'))) )
            {
                if(data[i]['cache-controlResponse'] !== null && (typeof(data[i]['cache-controlResponse']) !== 'undefined')  )
                {
                    if((typeof(data[i].expiresResponse) !== 'undefined' && data[i].expiresResponse !== null) && (typeof(data[i]['last-modifiedResponse']) !== 'undefined' && data[i]['last-modifiedResponse'] !== null ))
                    {
                        data[i]['cache-controlResponse'] += (', max-age='+(Math.abs(new Date(data[i]['last-modifiedResponse']) - new Date(data[i].expiresResponse))).toString());
                            //data[i].ageResponse = new Date(Math.abs(new Date(data[i].startedDateTime) - new Date(data[i].expiresResponse)) * 1000).toISOString().substr(11,8);
                    }
                    else
                        data[i]['cache-controlResponse'] += ', NULL'
                    
            }
                else 
                {
                    if((typeof(data[i].expiresResponse) !== 'undefined' && data[i].expiresResponse !== null) && (typeof(data[i]['last-modifiedResponse']) !== 'undefined' && data[i]['last-modifiedResponse'] !== null ))
                    {
                        data[i]['cache-controlResponse'] = ('max-age='+(Math.abs(new Date(data[i]['last-modifiedResponse']) - new Date(data[i].expiresResponse))).toString());
                            //data[i].ageResponse = new Date(Math.abs(new Date(data[i].startedDateTime) - new Date(data[i].expiresResponse)) * 1000).toISOString().substr(11,8);
                    }

                }

            }
            for (var j in checklist)
            {

                if(!(Object.keys(data[i]).includes(checklist[j])))
                    data[i][checklist[j]] = null
            }
            let unsorted = data[i]
            let sorted = Object.keys(unsorted)
                    .sort()
                    .reduce(function (acc, key) { 
                        acc[key] = unsorted[key];
                        return acc;
                    }, {});
            nestedArr.push(Object.values(sorted))
            
            nestedArr[i].unshift(cookie['username'],curdate)

        }
            connection.query('INSERT INTO Entry(username,uploadDate,ageRequest,ageResponse,`cache-controlRequest`,`cache-controlResponse`,`content-typeRequest`,`content-typeResponse`,expiresRequest,expiresResponse,hostRequest,hostResponse,`last-modifiedRequest`,`last-modifiedResponse`,method, pragmaRequest,pragmaResponse,serverIPAddress,startedDateTime,status,statusText,url,wait) VALUES ?', [nestedArr], function(err,result,fields){
                if(err){
                    console.log(err)
                    response.send({'err':'The .har file is damaged'})
                }
                else 
                    response.send({'succ':'Upload Successful'})
            });
            
        
    });

    app.post("/myisp", function (request, response) {

        var data = request.body;
        var cookie = JSON.parse(request.headers.cookie);

        connection.query('INSERT IGNORE INTO Ip_info(username,isp,lat,lon) VALUES (?,?,?,?)', [cookie['username'],request.body['isp'],request.body['lat'],request.body['lon']]);
    });
}
//            if ((data[i]['ageResponse'] == null) && (typeof(data[i]['ageResponse']) == 'undefined'))
//            {
//                if(typeof(data[i].expiresResponse) !== 'undefined' && data[i].expiresResponse !== null)
//                {
//                        data[i].ageResponse = (Math.abs(new Date(data[i].startedDateTime) - new Date(data[i].expiresResponse))).toString();
//                        //data[i].ageResponse = new Date(Math.abs(new Date(data[i].startedDateTime) - new Date(data[i].expiresResponse)) * 1000).toISOString().substr(11,8);
//                    }
//            
//                else
//                    data[i].ageResponse = 'NULL';
//            }        