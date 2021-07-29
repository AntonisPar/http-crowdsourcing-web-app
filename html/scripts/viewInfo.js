var infoBut = document.getElementById('infoView');
var finalData={};
var usersEl = document.createElement('usersEl');
var perMethodEl = document.createElement('perMethodEl');
var perStatusEl = document.createElement('perStatusEl');
var uniqueDomainsEl = document.createElement('uniqueDomainsEl');
var uniqueIspEl = document.createElement('uniqueIspEl');
var avgAgeEl = document.createElement('avgAgeEl');

function userCount(){
    fetch('/userCount',
        {
            method: 'GET'
        })
    .then(response =>  response.text())
    .then(data => {
        finalData['user'] = data;
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
        finalData['methodCount'] = data;
    })

}

function perStatus(){
    fetch('/statusCount',
        {
            method: 'GET'
        })
    .then(response => response.json())
    .then(data => {
        finalData['statusCount'] = data;
    })
}

function uniqueDomains(){
    fetch('/domainsCount',
        {
            method: 'GET'
        })
    .then(response => response.text())
    .then(data => {
        finalData['domainsCount'] = data;
    })
}

function uniqueIsp(){
    fetch('/ispCount',
        {
            method: 'GET'
        })
    .then(response => response.text())
    .then(data => {
        finalData['ispCount'] = data;
    })

}

function avgAge(){
    fetch('avgAge', {
        method: 'GET'
    })
    .then( response => response.json())
    .then( data => {
        for(var i in data)
        {
            var h = data[i]/3600

            var m = parseFloat("0."+h.toString().split('.')[1])*60
            data[i] = h.toString().split('.')[0]+":"+m.toString().split('.')[0]
        }
        finalData['avgAge'] = data;
    })

}

function createTable(){
  var body = document.getElementsByTagName('body')[0];
  var tbl = document.createElement('table');
  userCount()
  perMethod()
  perStatus()
  uniqueIsp()
  uniqueDomains()
  avgAge()
  console.log(finalData)
}

infoBut.onclick = createTable();
