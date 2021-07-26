var infoBut = document.getElementById('infoView');
var finalData = new Object();

function userCount(){
    fetch('/userCount',
        {
            method: 'GET'
        })
    .then(response =>  response.text())
    .then(data => {
    })
}

function perMethod(){
    fetch('/methodCount',
        {
            method: 'GET'
        })
    .then(response => response.json())
    .then(data => {
        //console.log(data,data['GET'])
    })

}

function perStatus(){
    fetch('/statusCount',
        {
            method: 'GET'
        })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

function uniqueDomains(){
    fetch('/domainsCount',
        {
            method: 'GET'
        })
    .then(response => response.text())
    .then(data => {
        console.log(data)
    })
}

function uniqueIsp(){
    fetch('/ispCount',
        {
            method: 'GET'
        })
    .then(response => response.text())
    .then(data => {
        console.log(data)
    })

}

function avgAge(){
    fetch('avgAge', {
        method: 'GET'
    })
    .then( respone => response.json())
    .then( data => {
        console.log(data)
    })

}

function createTable(value){
  var body = document.getElementsByTagName('body')[0];
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < 3; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < 2; j++) {
      if (i == 2 && j == 1) {
        break
      } else {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(value))
        i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
        tr.appendChild(td)
      }
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
}

infoBut.onclick = avgAge();
