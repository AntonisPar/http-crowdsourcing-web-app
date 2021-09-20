var uploadButton = document.getElementById("uploadBut");
var error_message = document.getElementById('alert');
var success_message = document.getElementById('succ');

// Function that extracts the domain name
// from a url.
function urlDomain(url)
{
    let domain = (new URL(url));
    domain = domain.hostname.replace('www.','');
    return domain
}

// Function that adds the keys and values of the header keys inside an object
// and returns it. If a key is not found, it adds it to the object with value "null".
function inHeaders(obj) {
    let inHeaderValues = {};
    let checkName = ['cache-control', 'pragma', 'host', 'last-modified', 'content-type', 'expires','age'];
    for (var i in obj) {
        if (checkName.includes(obj[i]["name"].toLowerCase())) {
                inHeaderValues[obj[i]['name'].toLowerCase()] = obj[i]['value'];
        }
    }
    for(var i in checkName)
    {
        if(!(Object.keys(inHeaderValues).includes(checkName[i])))
            inHeaderValues[checkName[i]]=null;
    }
    return inHeaderValues;
}

// Function that finds if a key is found inside the
// REQUEST or RESPONSE key of an entry. Conactenates
// the string inside "attribute" to that key accordingly.
function addHeaderValues(obj, valueArr, attribute) {
    let inHeaderValues = inHeaders(obj);
    let itemKeys = Object.keys(inHeaderValues);
    let itemValues = Object.values(inHeaderValues);
    for (var items in itemKeys) {
        if (itemKeys[items] !== null){
            if (itemKeys[items] in valueArr) {
                valueArr[itemKeys[items] + attribute] = itemValues[items];
                console.log(itemKeys[items])
            }
            else {
                valueArr[itemKeys[items] + attribute] = itemValues[items];
            }
        }
    }
}

// "Upload File" button's on-click function that: 
//  1. Reads the .HAR file,
//     creates an object and adds all the necessary
//     data inside the file. Sends that object to back-end.
//  2. Finds the lat,lon and ISP of the user that uploads
//     the .HAR file and sends them to the back-end.
function readHar() {

    error_message.style.display='none'
    let uploadValues = {};
    var harFile = document.getElementById("harFile").files[0];
    if (harFile) {
        var reader = new FileReader();
        reader.readAsText(harFile, "UTF-8");
        reader.onload = function () {
            harContent = JSON.parse(reader.result);
            harEntry = harContent.log.entries;

            for (var key in harEntry) {
                harRequest = harEntry[key].request['headers'];
                harResponse = harEntry[key].response['headers'];

                valueArr = {
                    "startedDateTime": harEntry[key]["startedDateTime"],
                    "serverIPAddress": harEntry[key]["serverIPAddress"],
                    "wait": harEntry[key].timings["wait"],
                    "url": urlDomain(harEntry[key].request["url"]),
                    "method": harEntry[key].request["method"],
                    "status": harEntry[key].response["status"],
                    "statusText": harEntry[key].response["statusText"],
                };

                //add request's header values to valueArr
                addHeaderValues(harRequest, valueArr, "Request");
                //add response's header values to valueArr
                addHeaderValues(harResponse, valueArr, "Response");
                uploadValues[key] = valueArr;
            }
            fetch("/upload",
            {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(uploadValues)
            })
            .then(res => res.json())
            .then(data =>{
                if(Object.keys(data).includes('succ'))
                {
                    success_message.innerHTML = data['succ']
                    success_message.style.display='block';
                    setTimeout(function(){ success_message.style.display="none"; }, 6000);

                }
                   
                else if(Object.keys(data).includes('err'))
                {
                    error_message.innerHTML = data['err'];
                    error_message.style.display = 'block';
                    setTimeout(function(){ error_message.style.display="none"; }, 6000);
                }
            })
        }

        reader.onerror = function () {
            error_message.innerHTML = 'Error in loading the .har file'
            error_message.style.display = 'block';
            setTimeout(function(){ error_message.style.display="none"; }, 6000);
        }

        fetch("http://ip-api.com/json/?fields=lat,lon,isp,status",
            {
                method: 'GET',
                headers:{
                    "content-type": "application/json"
                }
            })
        .then( response => response.json())
        .then (ipInfo => {
            fetch('/myisp',
                {
                    method: 'POST',
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify(ipInfo)
                })
            .then(res => res.json())
        })
    }
}

uploadButton.onclick = readHar; 
