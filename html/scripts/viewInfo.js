var infoBut = document.getElementById('infoView');
var usersEl = document.createElement('usersEl');
var perMethodEl = document.createElement('perMethodEl');
var perStatusEl = document.createElement('perStatusEl');
var uniqueDomainsEl = document.createElement('uniqueDomainsEl');
var uniqueIspEl = document.createElement('uniqueIspEl');
var avgAgeEl = document.createElement('avgAgeEl');

async function userCount(){
    let response = await fetch('/userCount',
        {
            method: 'GET'
        })
    return await response.text()

}

async function perMethod(){
    let response = await fetch('/methodCount',
        {
            method: 'GET'
        })
    return await response.json()
}

async function perStatus(){
    let response = await fetch('/statusCount',
        {
            method: 'GET'
        })
    return await response.json()
}

async function uniqueDomains(){
    let response = await fetch('/domainsCount',
        {
            method: 'GET'
        })
    return await response.text()
}

async function uniqueIsp(){
    let response = await fetch('/ispCount',
        {
            method: 'GET'
        })

    return await response.text();
}

async function avgAge(){
    let response = await fetch('avgAge', {
        method: 'GET'
    })
    return await response.json()
}

async function createTable(){
    let finalData = {
        "users": await userCount(),
        "isps": await uniqueIsp(),
        "domains": await uniqueDomains(),
        "age": await avgAge(),
        "perMethod": await perMethod(),
        "perStatus": await perStatus()
    }

    let div = document.getElementById('tables');
    let table = document.createElement('table')
    var header = table.createTHead();
    //for(let i=0; i < finalData.length; i++)
    for(let i in finalData)
    {
    var k = 0 ;
    var row = header.insertRow(k);    
     var cell = row.insertCell(0);
     cell.innerHTML = i + " " ;
     k++;
//        for(let j in finalData[i])
//        {
//            let subrow = 
//        }
            
    }
    div.append(table)

}
infoBut.onclick = createTable();
