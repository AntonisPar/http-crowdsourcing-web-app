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
    console.log(finalData)
    var row1 = header.insertRow(0);    
    row1.insertCell(0).innerHTML = "Unique ISPs" ;
    row1.insertCell(0).innerHTML  = "Unique Domains" ;
    row1.insertCell(0).innerHTML = "Number of Users" ;
    var row2 = header.insertRow(1)
    row2.insertCell(0).innerHTML = finalData.isps ;
    row2.insertCell(0).innerHTML  = finalData.domains ;
    row2.insertCell(0).innerHTML = finalData.users ;
    
    div.append(table)

    for(let key=0; key<Object.keys(finalData).length; key++)
    {
        if( (Object.keys(finalData)[key] === 'age') || (Object.keys(finalData)[key] === 'perMethod') || (Object.keys(finalData)[key] === 'perStatus'))
        {
            let table = document.createElement('table');
            let k =Object.keys(finalData); 
            for(let i=0; i<Object.keys(k[key]).length; i++)
            {  
               console.log( finalData[key].length)
                let info = finalData[k[key]]
            //    let table = document.createElement('table')
            //    var header = table.createTHead();
            //    console.log(finalData)
            //    var row1 = header.insertRow(0);    
            //    row1.insertCell(0).innerHTML = "Unique ISPs" ;
            //    row1.insertCell(0).innerHTML  = "Unique Domains" ;
            //    row1.insertCell(0).innerHTML = "Number of Users" ;
                var header = table.createTHead();
                var row = header.insertRow(0);
                //row.insertCell(0).innerHTML = Object.keys(info);
                //row.insertCell(1).innerHTML = info[i];
                console.log(info)
                div.append(table)
                
            }
        }
    }
}

infoBut.onclick = createTable();
