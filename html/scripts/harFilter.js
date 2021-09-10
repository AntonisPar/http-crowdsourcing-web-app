var fileLoad = document.getElementById('harFile');
var message = document.getElementById('alert') 
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

    try{
      var harContent = JSON.parse(reader.result);
      message.style.display='none'
  }catch(e){
      message.innerHTML = 'The .har file is damaged' // what is "message" ?
      message.style.display='block'
  }

    const itemsToFilter = ["cookies", "content", "postData", "Cookie"];

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
  
  reader.onerror = () => {

    let message = document.createElement('p');
    message.innerHTML = "Error with .har file";
    document.body.append(message)
}
}


// This function is not in main's version of harFilter.js 
// May need to be deleted
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
console.log(getCookie('username'))

fileLoad.onchange = filterHar; 
