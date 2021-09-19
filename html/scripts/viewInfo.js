var infoBut = document.getElementById('infoView');
var message = document.getElementById('alert')
document.getElementById('viewInfo').style.display = 'none';

// Function that returns the total number of Users in the system
async function userCount(){
    let response = await fetch('/userCount',
        {
            method: 'GET'
        })
    if (!response.ok) {
        throw new Error('An error has occured');

     }
    else
        return await response.text()

}

// Function that returns an object.
// The object contains distinct HTTP methods as keys and the number
// of times each method appears inside the uploaded entries as values.
async function perMethod(){
    let response = await fetch('/methodCount',
        {
            method: 'GET'
        })
    if (!response.ok) {
        throw new Error('An error has occured');

     }
    else
        return await response.json()
}

// Function that returns an object.
// The object contains distinct HTTP statuses as keys and the number
// of times each status appears inside the uploaded entries as values.
async function perStatus(){
    let response = await fetch('/statusCount',
        {
            method: 'GET'
        })
    if (!response.ok) {
        throw new Error('An error has occured');

     }
    else
        return await response.json()
}

// Function that returns the number of unique domains
// inside the uploaded entries.
async function uniqueDomains(){
    let response = await fetch('/domainsCount',
        {
            method: 'GET'
        })
    if (!response.ok) {
        throw new Error('An error has occured');

     }
    else
        return await response.text()
}

// Function that returns the number of unique ISPs
// inside the uploaded entries.
async function uniqueIsp(){
    let response = await fetch('/ispCount',
        {
            method: 'GET'
        })
    if (!response.ok) {
        throw new Error('An error has occured');
     }
    else
        return await response.text();
}

// Function that returns an object.
// The object contains distinct Content-Types as keys and the
// average value of the AGE directive of each Content-Type as values.
async function avgAge(){
    let response = await fetch('/avgAge', {
        method: 'GET'
    })
    if (!response.ok) {
        throw new Error('An error has occured');

     }
    else
        return await response.json()
}

// Function that creates all the tables and charts in "General Information"
async function createTable(){
    try{
        var finalData = {
            "users": await userCount(),
            "isps": await uniqueIsp(),
            "domains": await uniqueDomains(),
            "age": await avgAge(),
            "perMethod": await perMethod(),
            "perStatus": await perStatus()
        }
    }
    catch(e){
        message.innerHTML = e;
        message.style.display = 'block'
    }
    let chartOptions = {
            scales: {
                y:{
                    beginAtZero: true
                }
            }
        }

    var chartPlaceHolder = document.createElement('canvas')
    chartPlaceHolder.style["margin-top"] = "3%"

    var myChart = new Chart(chartPlaceHolder, {
        type:'bar',
        data:{
            labels: [],
            datasets: [{
                label: 'General Application Data',
                data:  [],
                backgroundColor:Object.values(colors),
                borderColor:Object.values(colors),
                borderWidth: 1
            }]
        },
        options: chartOptions,
    });

    // Creating the first table and chart (General Application Data)
    // and appending it in DOM
    let div = document.getElementById('viewInfo');

    // Creating description of the table "General Application Info"
    let chartDescription = document.createElement('h2')
    chartDescription.innerHTML = 'General Application Info'
    chartDescription.style['margin-top'] = "3%"
    chartDescription.style['textAlign'] = "center"
    
    // Creating the table
    let table = document.createElement('table')
    table.classList.add('table')
    table.style["margin-top"] = "4%";
    
    // Creating the table's header
    var table_header = table.createTHead();
    var table_header_row = table_header.insertRow(0);    
    table_header_row.insertCell(0).outerHTML = "<th>Number of Users</th>";
    table_header_row.insertCell(1).outerHTML  = "<th>Unique Domains</th>";
    table_header_row.insertCell(2).outerHTML = "<th>Unique ISPs</th>";
    
    // Creating the table's body
    var table_body = table.createTBody()
    var content_row = table_body.insertRow(0)
    content_row.insertCell(0).innerHTML = finalData.users ;
    content_row.insertCell(1).innerHTML  = finalData.domains ;
    content_row.insertCell(2).innerHTML = finalData.isps ;
    
    div.append(chartDescription)
    div.append(table)

    var captions = {
        'age': 'Average Age per CONTENT-TYPE',
        'perMethod': 'Number of Entries per METHOD',
        'perStatus': 'Number of Entries per STATUS',
    }

    // Creating a table and a chart for the keys 'age', 'perMethod', 'perStatus' in
    // finalData and appending them in DOM after the initializaton process
    for(let key in finalData)
    {
        if( key === 'age' || key === 'perMethod' || key === 'perStatus')
        {
            // Creating the chart and table description
            let chartDescription = document.createElement('h2')
            chartDescription.innerHTML = captions[key]
            chartDescription.style['margin-top'] = "10%"
            chartDescription.style['textAlign'] = "center"

            // Creating the canvas for the chart and configuring the chart
            let chartPlaceHolder = document.createElement('canvas')
            chartPlaceHolder.style["margin-top"] = "3%"
            let charts = new Chart(chartPlaceHolder, {
                type:'bar',
                data:{
                    labels: [],
                    datasets: [{
                        label: captions[key],
                        data:  [],
                        backgroundColor:Object.values(colors),
                        borderColor:Object.values(colors),
                        borderWidth: 1
                    }]
                },
                options: chartOptions,
            });

            // Creating the table
            let table = document.createElement('table')
            table.classList.add('table')
            table.style["margin-top"] = "4%";

            // Creating the table's header
            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            if(key === 'age'){
                table_header_row.insertCell(0).outerHTML = "<th>Average Age</th>";
                table_header_row.insertCell(0).outerHTML = "<th>Content-Type</th>";
            }
            else if(key === 'perMethod'){
                table_header_row.insertCell(0).outerHTML = "<th>Number of Entries</th>";
                table_header_row.insertCell(0).outerHTML = "<th>HTTP Method</th>";
            }
            else if(key === 'perStatus'){
                table_header_row.insertCell(0).outerHTML = "<th>Number of Entries</th>";
                table_header_row.insertCell(0).outerHTML = "<th>HTTP Status</th>";
            }

            var table_body = table.createTBody();
            // Initializing the values of the the chart and the table's body
            for(let i=0; i<Object.keys(finalData[key]).length; i++)
            {  
                var row = table_body.insertRow(i);

                if(key ==='age')
                {
                    var hours =  finalData[key][Object.keys(finalData[key])[i]].split(':')
                    var minutes = hours[1]
                    hours = hours[0]

                    charts.data.labels.push(Object.keys(finalData[key])[i]);
                    charts.data.datasets[0].data.push(hours);

                    row.insertCell(0).innerHTML = Object.keys(finalData[key])[i];
                    row.insertCell(1).innerHTML = hours + " hours and " + minutes + " minutes";
                }
                else
                {
                    charts.data.labels.push(Object.keys(finalData[key])[i]);
                    charts.data.datasets[0].data.push(finalData[key][Object.keys(finalData[key])[i]]);

                    row.insertCell(0).innerHTML = Object.keys(finalData[key])[i];
                    row.insertCell(1).innerHTML = finalData[key][Object.keys(finalData[key])[i]];
                }
                
                div.append(chartDescription)
                div.append(chartPlaceHolder)
                div.append(table)
                
            }
        }
    }
}

// "General Information" button's on-click function
function infoButClick()
{
    let div = document.getElementById('viewInfo')
    message.style.display = 'none';
    if(div.innerHTML ==='')
        createTable()
    if(div.style.display === 'none')
    {
        document.getElementById('map').style.display='none'
        document.getElementById('timingDiv').style.display='none'
        document.getElementById('headersDiv').style.display='none'

        div.style.display='block'
    }
    else
    {
        div.style.display='none'
    }
}

infoBut.onclick = infoButClick;
