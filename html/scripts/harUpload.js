var uploadButton = document.getElementById("uploadBut");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function inHeaders(obj) {
    let inHeaderValues = {};
    for (var i in obj) {
        let checkName = ['cache-control', 'pragma', 'host', 'last-modified', 'content-type', 'expires'];
        if (checkName.includes(obj[i]["name"].toLowerCase())) {
            if (obj[i]['name'] != null && obj[i]['value'] != null) {
                inHeaderValues[obj[i]['name'].toLowerCase()] = obj[i]['value'];

            }
        }
    }
    return inHeaderValues;
}

function addHeaderValues(obj, valueArr, attribute) {
    let inHeaderValues = inHeaders(obj);
    let itemKeys = Object.keys(inHeaderValues);
    let itemValues = Object.values(inHeaderValues);
    for (var items in itemKeys) {
        if (itemKeys[items] != null) {
            if (itemKeys[items] in valueArr) {
                valueArr[itemKeys[items] + attribute] = itemValues[items];
            }
            else {
                valueArr[itemKeys[items] + attribute] = itemValues[items];
            }
        }
    }
}

function readHar() {

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
                    "url": harEntry[key].request["url"],
                    "method": harEntry[key].request["method"],
                    "status": harEntry[key].response["status"],
                    "statusText": harEntry[key].response["statusText"],
                };

                addHeaderValues(harRequest, valueArr, "Request");
                addHeaderValues(harResponse, valueArr, "Response");
                uploadValues[key] = valueArr;
            }
            var name = getCookie('username');
            console.log(name);
            fetch("/upload",
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", "name":name },
                body: JSON.stringify(uploadValues)
            })
            .then(function(res){ return res.json(); })
//            fetch("/usercookie",
//            {
//                method: 'POST',
//                body: name
//            })
//            .then(function(res){ return res.json(); })
//            $.post("/upload", uploadValues);
        }

        reader.onerror = function () {
            console.log("error loading file");
        }

    }
}

uploadButton.onclick = readHar; 
