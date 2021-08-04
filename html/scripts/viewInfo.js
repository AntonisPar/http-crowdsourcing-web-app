var infoBut = document.getElementById('infoView');
document.getElementById('viewInfo').style.display = 'none';

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
    let chartBg = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
                ]
    let chartBorderColor = [ 
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
                ]

    let chartOptions = {
            scales: {
                y:{
                    beginAtZero: true
                }
            }
        }

    var chartPlaceHolder = document.createElement('canvas')

    var myChart = new Chart(chartPlaceHolder, {
        type:'bar',
        data:{
            labels: ['users','domains','isps'],
            datasets: [{
                label: 'data',
                data:  [finalData.users,finalData.domains,finalData.isps],
                backgroundColor:chartBg,
                borderColor:chartBorderColor,
                borderWidth: 1
            }]
        },
        options: chartOptions,
    });

    let div = document.getElementById('viewInfo');
    let table = document.createElement('table')
    var header = table.createTHead();
    var row1 = header.insertRow(0);    
    row1.insertCell(0).innerHTML = "Unique ISPs" ;
    row1.insertCell(0).innerHTML  = "Unique Domains" ;
    row1.insertCell(0).innerHTML = "Number of Users" ;
    var row2 = header.insertRow(1)
    row2.insertCell(0).innerHTML = finalData.isps ;
    row2.insertCell(0).innerHTML  = finalData.domains ;
    row2.insertCell(0).innerHTML = finalData.users ;
    
    div.append(table)
    div.append(chartPlaceHolder)

    var captions = {
        'age': 'Average age per content-type',
        'perMethod': 'Number of entries per method',
        'perStatus': 'Number of entries per status',
    }
    for(let key in finalData)
    {
        if( key === 'age' || key === 'perMethod' || key === 'perStatus')
        {
            let chartPlaceHolder = document.createElement('canvas')
            let table = document.createElement('table')
            table.createCaption().textContent = captions[key]
            let charts = new Chart(chartPlaceHolder, {
                type:'bar',
                data:{
                    labels: [],
                    datasets: [{
                        label: captions[key],
                        data:  [],
                        backgroundColor:chartBg,
                        borderColor:chartBorderColor,
                        borderWidth: 1
                    }]
                },
                options: chartOptions,
            });

            for(let i=0; i<Object.keys(finalData[key]).length; i++)
            {  
                
                var header = table.createTHead();
                var row1 = header.insertRow(0);    
                var header = table.createTHead();
                var row = header.insertRow(0);

                if(key ==='age')
                {
                   var h =  finalData[key][Object.keys(finalData[key])[i]].split(':')
                   var m = h[1]
                   h = h[0]
                

                    charts.data.labels.push(Object.keys(finalData[key])[i]);
                    charts.data.datasets[0].data.push(h);

                    row.insertCell(0).innerHTML = Object.keys(finalData[key])[i];
                    row.insertCell(1).innerHTML = h + "hours and " + m + " minutes";
                }

                else
                {
                    charts.data.labels.push(Object.keys(finalData[key])[i]);
                    charts.data.datasets[0].data.push(finalData[key][Object.keys(finalData[key])[i]]);

                    row.insertCell(0).innerHTML = Object.keys(finalData[key])[i];
                    row.insertCell(1).innerHTML = finalData[key][Object.keys(finalData[key])[i]];
                }
                div.append(table)
                div.append(chartPlaceHolder)
                
            }
        }
    }
}

function clickAct()
{
    let div = document.getElementById('viewInfo')
    console.log(div.style.visibility)
    if(div.style.display === 'none')
    {
        createTable()
        div.style.display='block'
    }
    else
    {
        div.style.display='none'
    }


}

infoBut.onclick = clickAct;