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

  reader.onload = function () {

    try{
        var harContent = JSON.parse(reader.result);
        message.style.display='none'
    }catch(e){
        message.innerHTML = 'The .har file is damaged'
        message.style.display='block'
    }

    const itemsToFilter = ["cookies", "content", "postData"];

    var harFiltered = remove(harContent, itemsToFilter);
    console.log(harFiltered); 

    testObject = remove(harContent, itemsToFilter);
    var sensitive = JSON.stringify(testObject, null, 2);
    var blob = new Blob([sensitive], {type: "application/json"});
    var url = URL.createObjectURL(blob); 
    var filteredHar = document.createElement('a');
    filteredHar.download = "sensitive.json"
    filteredHar.href = url;
    filteredHar.textContent = "Download Filtered Har"

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
