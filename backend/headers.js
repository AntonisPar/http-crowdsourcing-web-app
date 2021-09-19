module.exports.headers =  function headers(app, connection) {
    app.get('/headersData', function (request, response) {
        connection.query(`select \`cache-controlResponse\` as cache, \`content-typeResponse\` as type, isp from Entry  left join Ip_info on Entry.username = Ip_info.username where \`cache-controlResponse\` != 'null'`, function(err,result,fields){
            if (err){
                console.log(err)
                response.sendStatus(404);
            }
            else{
                var cacheData = {} // object to be sent to front-end
                let listOfIsp = []
                cacheData['all'] = new Object(); //creating new key representing all ISPs
                for(var i in result)
                {
                    let contentType = result[i].type
                    let isp = result[i].isp
                    if(contentType === null) //if content-type is NULL don't put element in cacheData
                        continue;
                    if(!(listOfIsp.includes(isp))) //create a new key for each ISP
                    {
                        cacheData[isp] = new Object();
                        listOfIsp.push(isp);
                    }
                    if(Object.keys(cacheData[isp]).includes(contentType)) //if object already exists
                    {
                        let splitted = result[i].cache.split(',') //array with all the conent-types splitted
                        for(var j in splitted)
                        {
                            if(splitted[j].includes('max-stale'))
                            {
                                cacheData[isp][contentType]['max-stale'] += 1
                                cacheData['all'][contentType]['max-stale'] += 1
                            }
                            if(Object.keys(cacheData[isp][contentType]).includes(splitted[j]))
                            {
                                cacheData[isp][contentType][splitted[j]] += 1;
                                cacheData['all'][contentType][splitted[j]] += 1;
                            }
                        }
                        cacheData[isp][contentType]['count']+=1
                        cacheData['all'][contentType]['count']+=1
                    }
                    else //else create the object
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
                        if(!Object.keys(cacheData['all']).includes(contentType))
                            cacheData['all'][contentType] = {
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
                                cacheData['all'][contentType]['max-stale'] += 1
                            }
                            if(Object.keys(cacheData[isp][contentType]).includes(splitted[j]))
                            {
                                cacheData[isp][contentType][splitted[j]] += 1;
                                cacheData['all'][contentType][splitted[j]] += 1;
                            }
                        }
                        cacheData[isp][contentType]['count']+=1
                        cacheData['all'][contentType]['count']+=1
                    }
                        
                        
                        
                }
                response.send(cacheData)
            }
        });
    });
}
