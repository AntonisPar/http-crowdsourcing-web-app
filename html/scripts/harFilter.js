var fileLoad = document.getElementById('harFile');
var message = document.getElementById('alert')
testObject = {};

function remove(obj, itemsToFilter) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (itemsToFilter.includes(property)) {
        delete obj[property];
          for(var j in obj[property])
              console.log(obj[property][j].name)
      }
      else if (typeof obj[property] === "object") {
        remove(obj[property], itemsToFilter);
      }
    }
  }
  return obj;
}

function removeInRequestHeaders(obj) {
    for (var entries in obj) {
        for(var headers in obj[entries].request['headers']){
            if(obj[entries].request['headers'][headers]["name"] !=='undefined' && typeof(obj[entries].request['headers'][headers]["name"]) !== null){
                if(obj[entries].request['headers'][headers]["name"].toLowerCase().includes('cookie')) {
                    delete obj[entries].request['headers'][headers]["name"]
                    delete obj[entries].request['headers'][headers]["name"];
                }
            } 
        }
    }
  return obj;
}
function removeInResponseHeaders(obj) {
    for (var entries in obj) {
        for(var headers in obj[entries].response['headers']){
            if(obj[entries].response['headers'][headers]["name"] !=='undefined' && typeof(obj[entries].response['headers'][headers]["name"]) !== null){
                if(obj[entries].response['headers'][headers]["name"].toLowerCase().includes('cookie')) {
                    delete obj[entries].response['headers'][headers]["name"]
                    delete obj[entries].response['headers'][headers]["name"];
                }
            } 
        }
    }
  return obj;
}

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

    const itemsToFilter = ["cookies", "content", "postData", "Cookie","set-cookie"];

    //console.log(harFiltered.log.entries); 
    //removeInHeaders(harFiltered.log.entries)
    //removeFromRequest(harContent.log, itemsToFilter);

    remove(harContent, itemsToFilter);
    removeInRequestHeaders(harContent.log.entries)
    removeInResponseHeaders(harContent.log.entries)
    var sensitive = JSON.stringify(harContent, null, 2);
    var blob = new Blob([sensitive], {type: "application/json"});
    var url = URL.createObjectURL(blob); 
    document.getElementById("choose_file_placeholder").innerHTML = file_name
    var filteredHar = document.createElement('a');
    filteredHar.download = file_name.split(".har")[0]+ "-FILTERED.har"
    filteredHar.href = url;
    filteredHar.textContent = "Download Filtered .HAR file"

    var linkNode = document.getElementById('link')
    if(linkNode.hasChildNodes()){
      linkNode.removeChild(linkNode.childNodes[0]);
    }
    linkNode.appendChild(filteredHar);
    
  } 
    reader.onerror = () => {

        let message = document.createElement('p');
        message.innerHTML = "Error with .har file";
        document.body.append(message)
    }
}

fileLoad.onchange = filterHar; 
