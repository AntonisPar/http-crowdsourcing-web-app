var headBut = document.getElementById('headers')
var headersDiv = document.getElementById('headersDiv')
var message = document.getElementById('alert')
var list = document.createElement("select");
var checkBoxPlace = document.createElement("div");
checkBoxPlace.classList.add('row')
checkBoxPlace.id='checkBoxDiv'
var cacheCheckedList=[];
headersDiv.style.display='none';
    
let barChartOptions = {
    responsive: true,
    scales:{
        y: {
            beginAtZero: true
        },
        xAxis: {
            alignToPixels: true
        }
    },
    plugins: {
      legend: { },
      title: {
        display: true,
        text: ''
      }
        }
            
};

// Function that is called when the "Headers Analysis"
// chart needs to be created.
async function cacheChartCreate(options)
{
    
    try{
        // Getting needed data from back-end
        var ttldata = await getTtlData() // data for first chart
        var data = await getHeadersData() //data for the rest
    }
    catch(e){
        message.innerHTML='An Error has occured while loading the data.'
        message.style.display = 'block';
        setTimeout(function(){ message.style.display = 'none' },6000)
    }
    // Create the canvases for the chart (one for each option)
    // Options is an array used to differentiate between the needed data.
    if(typeof(document.getElementById('canvas'+options[0])) !== 'undefined' && document.getElementById('canvas'+options[0]) !== null)
       document.getElementById('canvas'+options[0]).remove()
    let cacheChartPlaceHolder = document.createElement('canvas')

    // Create the table for each option
    if(typeof(document.getElementById('table'+options[0])) !== 'undefined' && document.getElementById('table'+options[0]) !== null)
       document.getElementById('table'+options[0]).remove()
    let table = document.createElement('table')
    table.classList.add('table')
    table.style['margin-top'] = '4%'

    cacheChartPlaceHolder.id='canvas'+options[0]
    table.id = 'table'+options[0]

    // Object that gets pushed in "data" key of cacheChart
    // when the data are ready to be presented in the Chart
    let plotData={
        labels: options,
        datasets:[]
    }
    
    // Object structure for chart (Chart.js)
    let cacheChart = new Chart(cacheChartPlaceHolder, {
                    type: 'bar',
                        data:{},
            options: barChartOptions,
                    title: {
                      display: true,
                      text: 'Chart.js Chart'
              
                    }
                });
    let chartDescription = document.createElement('h2')
    
    if(options[0] === 'max-age')
    {
        // Creating description of chart
        if(document.getElementById('description1') !== null)
            document.getElementById('description1').remove()
        chartDescription.id = 'description1'
        chartDescription.innerHTML = 'TTL Histogram'
        chartDescription.style['margin-top'] = "3%"
        chartDescription.style['textAlign'] = "center"
        headersDiv.append(chartDescription)

        headersDiv.append(cacheChartPlaceHolder);

        // Labels will be the text of each bucket on x axis
        plotData.labels=Object.keys(ttldata[list.value]).slice(0,10)
        // Datasets will be the value of each bucket on y axis
        plotData.datasets.push({
            label: "TTL Histogram",
            data: Object.values(ttldata[list.value]).slice(0,10),
            borderColor: Object.values(colors),
            backgroundColor: Object.values(colors),
        })
        cacheChart.data = plotData;
        cacheChart.update()
    }
    else
    {
        if(options[0] === 'max-stale'){

            // Creating description of chart
            if(document.getElementById('description2') !== null)
            document.getElementById('description2').remove()
            chartDescription.id= 'description2'
            chartDescription.innerHTML = 'MAX-STALE and MIN-FRESH Directives Percentage'
            chartDescription.style['margin-top'] = "25%"
            chartDescription.style['textAlign'] = "center"
            headersDiv.append(chartDescription)

            // Creating the table header
            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            table_header_row.insertCell(0).outerHTML = "<th>Content Type</th>"
            table_header_row.insertCell(1).outerHTML = "<th>MAX-STALE %</th>"
            table_header_row.insertCell(2).outerHTML = "<th>MIN-FRESH %</th>"
        }
        else if(options[0] === 'public'){
            
            // Creating description of chart
            if(document.getElementById('description3') !== null)
            document.getElementById('description3').remove()
            chartDescription.id= 'description3'
            chartDescription.innerHTML = 'Cacheability Directives Percentage'
            chartDescription.style['margin-top'] = "25%"
            chartDescription.style['textAlign'] = "center"
            headersDiv.append(chartDescription)

            // Creating the table header
            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            table_header_row.insertCell(0).outerHTML = "<th>Content Type</th>"
            table_header_row.insertCell(1).outerHTML = "<th>PUBLIC %</th>"
            table_header_row.insertCell(2).outerHTML = "<th>PRIVATE %</th>"
            table_header_row.insertCell(3).outerHTML = "<th>NO-CACHE %</th>"
            table_header_row.insertCell(4).outerHTML = "<th>NO-STORE %</th>"
            
        }
        
        headersDiv.append(cacheChartPlaceHolder);

        // Creating the table body
        var table_body = table.createTBody();
        var current_row = 0

        // Loops through ISP(s) selected in the dropdown list
        for(var i in data[list.value])
        {
            let d = [];

            // cacheCheckedList has the content-type(s) selected
            // with the checkboxes
            if(cacheCheckedList.includes(i))
            {
                var content_row = table_body.insertRow(current_row)
                content_row.insertCell(0).innerHTML = i
                current_row++
                
                let cell_index = 1; // used so that values are placed
                                    // in the correct column
                for(var j in options)
                {
                    values =(data[list.value][i][options[j]]/data[list.value][i]['count']) *100
                    d.push(values)
                    content_row.insertCell(cell_index).innerHTML = values
                    cell_index++
                }
                
                plotData.datasets.push( {
                        label: i,
                        data: d,
                        borderColor: colors[i],
                        backgroundColor: colors[i],
                })
            }
        }
            cacheChart.data = plotData;
            cacheChart.update()
            headersDiv.append(table)
        
    }
}

// The "Headers Analysis" button's on-click function
async function headButClick()
{
    message.style.display = 'none';
    try{
        var cacheData = await getHeadersData();
        list.style.display = 'block';
    }
    catch(e){

        message.innerHTML=e;
        message.style.display = 'block';
    }
    if(headersDiv.innerHTML === '')
    {
        createSelectList(cacheData)
        createCheckBoxes()
        .then(() => cacheCheckAll())
    }
    if(headersDiv.style.display === 'none')
    {
        document.getElementById('viewInfo').style.display='none'
        document.getElementById('timingDiv').style.display='none'
        document.getElementById('map').style.display='none'
        headersDiv.style.display = 'block';
    }
    else
    {
        headersDiv.style.display = 'none';
    }
}

async function getHeadersData()
{
    let response = await fetch('/headersData',{
        method: 'GET',
    });
    if(!response.ok)
        throw new Error('An error while fetching the Headers\' data occured')
    else
        return await response.json()

}

async function getTtlData()
{
    let response = await fetch('/ttlData',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'list':list.value
        },
        body: JSON.stringify(cacheCheckedList)
    });
    if(!response.ok)
        throw new Error('An error while fetching the TTL data occured')
    else
        return await response.json()

}

// Function that creates the ISPs dropdown select list
function createSelectList(obj)
{
    list.innerHTML='';
    list.id = "mySelect";
    list.style['margin-bottom'] = '5%'
    headersDiv.append(list)
    
    // Creates one option for each ISP inside the object
    // sent from the back-end
    for(var i in Object.keys(obj))
    {
        var option = document.createElement("option");
        option.value = Object.keys(obj)[i];
        option.text = Object.keys(obj)[i].charAt(0).toUpperCase() + Object.keys(obj)[i].slice(1,);
        list.appendChild(option);

    }
}

// Function that creates one checkbox for each
// content-type inside the object sent from the back-end
async function createCheckBoxes()
{
    
    try{
        var obj = await getHeadersData()
    }
    catch(e){
        message.innerHTML=e;
        message.style.display = 'block';
    }
    // Clearing the div that will be hosting all checkboxes
    checkBoxPlace.innerHTML =''

    // Creating the div that will be hosting checkbox "ALL"
    var checkbox_div = document.createElement('div')
    checkbox_div.classList.add('form-group')
    checkbox_div.classList.add('form-check')
    
    // Creating the checkbox "ALL"
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'allCache';
    checkbox.classList.add("form-check-input");
    checkbox.classList.add("cache");
    checkbox.onclick = cacheCheckAll;
    checkbox.checked = true;
    
    // Creating "ALL" checkbox's label
    var label = document.createElement('label')
    label.classList.add('form-check-label')
    label.htmlFor =  'exampleCheck1';
    label.innerHTML = 'ALL';
    
    checkbox_div.append(checkbox);
    checkbox_div.append(label);
    checkBoxPlace.append(checkbox_div);
    for(var i in obj[list.value])
    {        
        // Creating the div that will be hosting a checkbox
        var checkbox_div = document.createElement('div')
        checkbox_div.id='checkDiv'
        checkbox_div.classList.add('form-group')
        checkbox_div.classList.add('form-check')
          
        // Creating the checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = i;
        checkbox.onclick =  cacheCheckBoxes;
        checkbox.classList.add("form-check-input");
        checkbox.classList.add("cache");
            
        // Creating the checkbox's label
        var label = document.createElement('label')
        label.htmlFor =  "exampleCheck1";
        label.innerHTML = i;
            
        checkbox_div.append(checkbox);
        checkbox_div.append(label);
        checkBoxPlace.append(checkbox_div);

    }

    headersDiv.append(checkBoxPlace);

}


// Function that gets called when a checkbox other
// than "ALL" checkbox gets checked
function cacheCheckBoxes()
{
   var cacheAllBox = document.getElementById('allCache')
   cacheAllBox.checked = false;
   cacheCheckedList=[];
   var elements = document.getElementsByClassName("cache");
   for (var i = 0, len = elements.length; i < len; i++) 
   {
                if((elements[i].checked === true))
                cacheCheckedList.push(elements[i].id)
                
    }
    if (cacheCheckedList.length === 0) // if none of the other checkboxes is checked
    {
        cacheAllBox.checked = true
        cacheCheckAll()
    }
    cacheChartCreate(['max-age'])
    .then(() => cacheChartCreate(['max-stale','min-fresh'])) //test
    .then(() => cacheChartCreate(['public','private','no-cache','no-store'])) //test
}

// Function that gets called when the "ALL" checkbox
// is checked
function cacheCheckAll()
{
   var elements = document.getElementsByClassName("cache");
   var allCacheBox = document.getElementById('allCache')
   cacheCheckedList=[];
   if(allCacheBox.checked === true)
    {
        for (var i = 1, len = elements.length; i < len; i++) 
        {
            elements[i].checked =false;
            cacheCheckedList.push(elements[i].id)

        }
    }
    allCacheBox.checked = true;
    cacheChartCreate(['max-age'])
    .then(() => cacheChartCreate(['max-stale','min-fresh'])) //test
    .then(() => cacheChartCreate(['public','private','no-cache','no-store'])) //test
}

// Function that gets called when the
// select dropdown list gets another value
function onListChange()
{

    headersDiv.style.display ='none'
    createCheckBoxes()
    .then( () => cacheChartCreate(['max-age']))
    .then( () => cacheChartCreate(['max-stale','min-fresh']))
    .then( () => cacheChartCreate(['public','private','no-cache','no-store']))
    .finally( () => headersDiv.style.display = 'block')
}

headBut.onclick = headButClick; 
list.onchange = onListChange;
