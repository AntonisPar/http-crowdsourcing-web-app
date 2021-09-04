var fileLoad = document.getElementById('harFile');
testObject = {};

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

function filterHar() {


  var harFile = document.getElementById("harFile").files[0];
  var reader = new FileReader();
  reader.readAsText(harFile, "UTF-8");
  var file_name = harFile.name;

  reader.onload = function () {

    var harContent = JSON.parse(reader.result);

    const itemsToFilter = ["cookies", "content", "postData"];

    var harFiltered = remove(harContent, itemsToFilter);
    console.log(harFiltered); 

    testObject = remove(harContent, itemsToFilter);
    var sensitive = JSON.stringify(testObject, null, 2);
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
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
console.log(getCookie('username'))

fileLoad.onchange = filterHar; 
