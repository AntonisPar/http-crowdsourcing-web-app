export function uploadHar(app, connection) {
    let username;
    app.post('/usertest',function(request, response){
        var user = request.body;
        console.log(user);
    });
    app.post("/upload", function (request, response) {

        //connection.query('INSERT INTO User (username, e_mail, passwd) VALUES (?, ?, ?)', [username, e_mail, password]);

        var data = request.body;
        for(var i in data){

            //console.log(data[i]['startedDateTime'])
        }
        //var entryList = [ "startedDateTime","serverIPAddress","wait" ];
        //var requestList = ["url","method","hostRequest","pragmaRequest","cache-controlRequest"];
        //var responseList = ["status","statusText","cache-controlResponse","pragmaResponse","age","last-modifiedResponse","content-typeResponse","expiresResponse"];
        var requestList = ["startedDateTime", "serverIPAddress", "wait", "url", "method", "hostRequest", "pragmaRequest", "cache-controlRequest", "status", "statusText", "cache-controlResponse", "pragmaResponse", "age", "last-modifiedResponse", "content-typeResponse", "expiresResponse"];
        var nestedList = []
        for (var idx in data) {
            var tmp = [];

            for (var element in requestList) {

                let currentValue = data[idx][requestList[element]];
                console.log(currentValue);

                if (currentValue != null) {
                    tmp[element] = data[idx][requestList[element]];
                }
                else tmp[element] = null;
            }
            nestedList[idx] = tmp
        }
        console.log(nestedList[590])
        console.log(data[590])

    });
}
