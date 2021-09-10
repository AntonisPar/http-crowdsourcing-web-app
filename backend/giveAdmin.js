module.exports.giveAdmin=  function giveAdmin(app, connection) {
    app.post('/giveAdmin', function (request, response) {
        var username = request.body.username
        connection.query(`update User set isAdmin=1 where username=? `, [username],function(err,result,fields){
            if (err){
                response.send('User does not exist')
            }
            else
                response.send('User is now admin')
        });
    });
}