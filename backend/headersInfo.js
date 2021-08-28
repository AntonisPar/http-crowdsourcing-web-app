module.exports.headersInfo =  function headersInfo(app, connection) {

    app.post('/headerData', function (request, response) {
        var filter = request.body;
        let filterMap = {
            'method':'method',
            '\`content-typeResponse\`': 'type',
            '\`cache-controlRequest\`' : 'cacheRequest',
            '\`cache-controlResponse\`' : 'cacheResponse',
            '\`last-modifiedResponse\`' : 'lastModified',
            'expiresResponse' : 'expires',
            'isp' : 'isp'
        }
        connection.query(`SELECT \`content-typeResponse\` as type, \`cache-controlRequest\` as cacheRequest, \`cache-controlResponse\` as cacheResponse, \`last-modifiedResponse\` as lastModified, expiresResponse as expires, isp from Entry LEFT JOIN Ip_info ON Entry.username = Ip_info.username GROUP BY isp, \`content-typeResponse\``, function(err,result,fields){
           if(err) throw err;

        });
        
        console.log("ok")
    });
    

    // select distinct `cache-controlRequest` from Entry where `cache-controlRequest` is not null;
    // select distinct `cache-controlResponse` from Entry where `cache-controlResponse` is not null;
    // select distinct `content-typeResponse` from Entry where `content-typeResponse` is not null


}