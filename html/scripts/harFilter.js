var fileLoad = document.getElementById('harFile');
var message = document.getElementById('alert')

// Function that recursively traverses inside the keys
// of the .HAR file. If it finds a key specified inside the 
// itemsToFilter array it deletes the key.
function remove(obj, itemsToFilter) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (itemsToFilter.includes(property)) {
        delete obj[property];
      }
      else if (typeof obj[property] === "object") {
        remove(obj[property], itemsToFilter);
      }
    }
  }
  return obj;
}

// Function that deletes all cookies inside 
// the REQUEST key of an entry
function removeInRequestHeaders(obj) {
    for (var entries in obj) {
        for(var headers in obj[entries].request['headers']){
            if(typeof(obj[entries].request['headers'][headers]["name"]) !=='undefined' && typeof(obj[entries].request['headers'][headers]["name"]) !== null){
                if(obj[entries].request['headers'][headers]["name"].toLowerCase().includes('cookie')) {
                    delete obj[entries].request['headers'][headers]["name"]
                    delete obj[entries].request['headers'][headers]["value"];
                }
            } 
        }
    }
  return obj;
}

// Function that deletes all cookies inside 
// the RESPONSE key of an entry
function removeInResponseHeaders(obj) {
    for (var entries in obj) {
        for(var headers in obj[entries].response['headers']){
            if(typeof(obj[entries].response['headers'][headers]["name"]) !=='undefined' && typeof(obj[entries].response['headers'][headers]["name"]) !== null){
                if(obj[entries].response['headers'][headers]["name"].toLowerCase().includes('cookie')) {
                    delete obj[entries].response['headers'][headers]["name"]
                    delete obj[entries].response['headers'][headers]["value"];
                }
            } 
        }
    }
  return obj;
}

// Function that reads and filters the .HAR file and
// creates a new downloadable file that is free of
// every sensitive information.
function filterHar() {


  var harFile = document.getElementById("harFile").files[0];
  var reader = new FileReader();
  var file_name = harFile.name;
  reader.readAsText(harFile, "UTF-8");

  reader.onload = function () {

    try{
        var harContent = JSON.parse(reader.result);
        message.style.display='none'
    }catch(e){
        message.innerHTML = 'The .har file is damaged'
        message.style.display='block'
    }

    const itemsToFilter = ["cookies", "content", "postData", "Cookie", "set-cookie"];

    // Filter .HAR file
    remove(harContent, itemsToFilter);
    removeInRequestHeaders(harContent.log.entries)
    removeInResponseHeaders(harContent.log.entries)
    
    // Make the filtered file downloadable
    var sensitive_free = JSON.stringify(harContent, null, 2);
    var blob = new Blob([sensitive_free], {type: "application/json"});
    var url = URL.createObjectURL(blob); 
    document.getElementById("choose_file_placeholder").innerHTML = file_name
    var filteredHar = document.createElement('a');
    filteredHar.download = file_name.split(".har")[0]+ "-FILTERED.har"
    filteredHar.href = url;
    filteredHar.textContent = "Download Filtered .HAR file"

    // Delete a previous filtered file from the DOM
    // and place the new one there.
    var linkNode = document.getElementById('link')
    if(linkNode.hasChildNodes()){
      linkNode.removeChild(linkNode.childNodes[0]);
    }
    linkNode.appendChild(filteredHar);
    
  } 
    reader.onerror = () => {

        message.innerHTML = "Error with .har file";
        message.style.display='block'
    }
}

fileLoad.onchange = filterHar; 
