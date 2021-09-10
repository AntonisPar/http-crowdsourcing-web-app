module.exports.headers =  function headers(app, connection) {
    app.get('/headersData', function (request, response) {
        connection.query(`select \`cache-controlResponse\` as cache, \`content-typeResponse\` as type, isp from Entry  left join Ip_info on Entry.username = Ip_info.username where \`cache-controlResponse\` != 'null'`, function(err,result,fields){
            if (err){
                console.log(err)
                response.sendStatus(404);
            }
            else{
                var cacheData = {}
                let listOfIncluded = []
                let listOfIsp = []
                for(var i in result)
                {
                    let contentType = result[i].type
                    let isp = result[i].isp
                    if(!(listOfIsp.includes(isp)))
                    {
                        cacheData[isp] = new Object();
                        listOfIsp.push(isp);
                    }
                    if(Object.keys(cacheData[isp]).includes(contentType))
                    {
                        let splitted = result[i].cache.split(',')
                        for(var j in splitted)
                        {
                            if(splitted[j].includes('max-stale'))
                            {
                                cacheData[isp][contentType]['max-stale'] += 1
                            }
                            if(Object.keys(cacheData[isp][contentType]).includes(splitted[j]))
                            {
                                cacheData[isp][contentType][splitted[j]] += 1;
                            }
                        }
                        cacheData[isp][contentType]['count']+=1
                    }
                
                    else
                    {
                    cacheData[isp][contentType] = {
                        'public':0,
                        'private':0,
                        'max-stale':0,
                        'min-fresh':0,
                        'no-cache' : 0,
                        'no-store':0,
                        'count': 0
                        };
                        let splitted = result[i].cache.split(',')
                        for(var j in splitted)
                        {
                            if(splitted[j].includes('max-stale'))
                            {
                                cacheData[isp][contentType]['max-stale'] += 1
                            }
                            if(Object.keys(cacheData[isp][contentType]).includes(splitted[j]))
                            {
                                cacheData[isp][contentType][splitted[j]] += 1;
                            }
                        }
                        cacheData[isp][contentType]['count']+=1
                        listOfIncluded.push(contentType)
                    }
                        
                        
                        
                }

                response.send(cacheData)
            }
        });
    });
}
