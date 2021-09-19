module.exports.ttls =  function ttls(app, connection) {
    app.post('/ttlData', function (request, response) {

        console.log(request.body)
        // Setting up the SQL query
        sql = `select  \`cache-controlResponse\` as cache, \`content-typeResponse\` as type, isp from Entry  left join Ip_info on Entry.username = Ip_info.username where \`cache-controlResponse\` is not NULL and (`
        for(let i=0; i< request.body.length; i++)
        {
            if(i === request.body.length-1) // if ...
                str = ' \`content-typeResponse\`=\'' + request.body[i] + '\')'
            else
                str = ' \`content-typeResponse\`=\'' + request.body[i] + '\' or'
            sql = sql + str;
        }


        connection.query(sql, function(err,result,fields){
            if (err){
                response.sendStatus(404)
                console.log(err)
            }
            else
            {
                var cacheData = {}
                let ttlDist = {}
                var max = new Object();
                var regex = new  RegExp('[a-z]+-a[a-z]+=[0-9]+') //regex for finding max-stale directive
                max['all']=0 // used for determining the max value of TTLs for ALL ISPs
                             // so that we can create the buckets in the histogram
                for(let i in result)
                {
                    let isp = result[i].isp
                    if(!Object.keys(max).includes(isp))
                    {
                        max[isp]=0 //max value of TTLs for certain ISP
                    }
                    // Initializing the max values of TTLs
                    if(regex.test(result[i].cache))
                    {
                        if(max[isp] < parseInt(result[i].cache.match('[a-z]+-a[a-z]+=[0-9]+')[0].match('[0-9]+')[0]))
                            max[isp] = parseInt(result[i].cache.match('[a-z]+-a[a-z]+=[0-9]+')[0].match('[0-9]+')[0]);

                        if(max['all'] < parseInt(result[i].cache.match('[a-z]+-a[a-z]+=[0-9]+')[0].match('[0-9]+')[0]))
                            max['all'] = parseInt(result[i].cache.match('[a-z]+-a[a-z]+=[0-9]+')[0].match('[0-9]+')[0]);

                    }
                    else 
                        continue;
                }

                for(var isps in max)
                {
                let buckets = []
                    for(let i=0; i<11;i++)
                    {
                        buckets.push((i*(max[isps]/10)))
                        if( i === 0 )
                            continue;
                        else 
                        {
                            // determining the key of the buckets, each key contains the
                            // range of TTLs (in seconds) it includes
                            key = ((i-1)*(max[isps]/10)).toString() +'-' + (i*(max[isps]/10)).toString()
                            ttlDist[isps] ={
                                ...ttlDist[isps], 
                                [key] : 0 //adding to the key to the already existing object
                                          //and adding a value to it
                                          //the value represents the number of elements in the bucket
                            }
                        }
                    }
                    ttlDist[isps] = {
                        ...ttlDist[isps],
                        'count':0 //'count' value represents the number of elements in all the buckets
                                  // for a certain ISP
                    }
                    max[isps] = buckets
                }
                buckets = max

                // Initializing the values for each ISP and each one of ISP's buckets
                for(let i in result)
                {
                    let isp = result[i].isp
                    ttlDist[isp].count++;
                    ttlDist['all'].count++;
                    if(regex.test(result[i].cache))
                        var max_age = parseInt(result[i].cache.match('[a-z]+-a[a-z]+=[0-9]+')[0].match('[0-9]+')[0])
                    else 
                        continue;
                    
                    // Find the correct bucket to insert the element into
                    for(let k=1; k<11; k++)
                    {
                        if(max_age>=buckets[isp][k-1] && max_age<=buckets[isp][k])
                        {
                            currBucket = buckets[isp][k-1].toString()+'-'+buckets[isp][k].toString() 
                            ttlDist[isp][currBucket] +=1;
                        }
                        if(max_age>=buckets['all'][k-1] && max_age<=buckets['all'][k])
                        {
                            currBucket = buckets['all'][k-1].toString()+'-'+buckets['all'][k].toString() 
                            ttlDist['all'][currBucket] +=1;
                        }
                    }
                }
                for(var i in ttlDist)
                    ttlDist[i]={
                        ...ttlDist[i],
                        label: buckets[i]
                    }

                for(var i in ttlDist){
                    for(var j in ttlDist[i]){
                        if(j !== 'label' && j !== 'count')
                        ttlDist[i][j]=ttlDist[i][j]/ttlDist[i].count

                    }
                }

                response.send(ttlDist)
            }
        });
    });
            
}
