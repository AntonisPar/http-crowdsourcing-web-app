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
            }
                
            if ((data[i]['cache-controlResponse'] === null) || (typeof(data[i]['cache-controlResponse']) === 'undefined') || (!(data[i]['cache-controlResponse'].includes('max-age'))) )
            {
                if(data[i]['cache-controlResponse'] !== null && (typeof(data[i]['cache-controlResponse']) !== 'undefined')  )
                {
                    if((typeof(data[i].expiresResponse) !== 'undefined' && data[i].expiresResponse !== null) && (typeof(data[i]['last-modifiedResponse']) !== 'undefined' && data[i]['last-modifiedResponse'] !== null ))
                    {
                        data[i]['cache-controlResponse'] += (', max-age='+(Math.abs(new Date(data[i]['last-modifiedResponse']) - new Date(data[i].expiresResponse))).toString());
                    }
                }
                
                else 
                {
                    if((typeof(data[i].expiresResponse) !== 'undefined' && data[i].expiresResponse !== null) && (typeof(data[i]['last-modifiedResponse']) !== 'undefined' && data[i]['last-modifiedResponse'] !== null ))
                    {
                        data[i]['cache-controlResponse'] = ('max-age='+(Math.abs(new Date(data[i]['last-modifiedResponse']) - new Date(data[i].expiresResponse))).toString());
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

        var cookie = JSON.parse(request.headers.cookie);

        connection.query('select username,isp,lat,lon from Ip_info where username=? ', [cookie['username']],function(err,result,fields){
            if(Object.keys(result).length === 0){
                connection.query('INSERT INTO Ip_info(username,isp,lat,lon) VALUES (?,?,?,?)', [cookie['username'],request.body['isp'],request.body['lat'],request.body['lon']]);

            }
            else{
                if(result[0].lat !== request.body['lat'] || result[0].lon !== request.body['lon'] || result[0].isp !== request.body['isp'])
        connection.query('update Ip_info set isp=?,lat=?,lon=? where username=?', [request.body['isp'],request.body['lat'],request.body['lon'],cookie['username']]);
            }
        });

    });
}
