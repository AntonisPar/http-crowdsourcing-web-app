var headBut = document.getElementById('headers')
var headersDiv = document.getElementById('headersDiv')
var message = document.getElementById('alert')
var list = document.createElement("select");
list.style.display = 'none';
var checkBoxPlace = document.createElement("div");
checkBoxPlace.classList.add('row')
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

async function cacheChartCreate(options)
{
    
    try{
        var data = await getHeadersData()
        var ttldata = await getTtlData()
    }
    catch(e){
        message.innerHTML='An Error has occured while loading the data.'
        message.style.display = 'block';
        setTimeout(function(){ message.style.display = 'none' })
    }
    if(typeof(document.getElementById('canvas'+options[0])) !== 'undefined' && document.getElementById('canvas'+options[0]) !== null)
       document.getElementById('canvas'+options[0]).remove()
    let cacheChartPlaceHolder = document.createElement('canvas')

    if(typeof(document.getElementById('table'+options[0])) !== 'undefined' && document.getElementById('table'+options[0]) !== null)
       document.getElementById('table'+options[0]).remove()
    let table = document.createElement('table')
    table.classList.add('table')
    table.style['margin-top'] = '4%'

    // headersDiv.append(cacheChartPlaceHolder);
    cacheChartPlaceHolder.id='canvas'+options[0]
    table.id = 'table'+options[0]

    let plotData={
        labels: options,
        datasets:[]}
    let cacheChart = new Chart(cacheChartPlaceHolder, {
                    type: 'bar',
                        data:{},
            options: barChartOptions,
                    title: {
                      display: true,
                      text: 'Chart.js Line Chart'
              
                    }
                });
    let chartDescription = document.createElement('h2')
    
    if(options[0] === 'max-age')
    {
        
        if(document.getElementById('description1') !== null)
            document.getElementById('description1').remove()
        chartDescription.id = 'description1'
        chartDescription.innerHTML = 'TTL Histogram'
        chartDescription.style['margin-top'] = "3%"
        chartDescription.style['textAlign'] = "center"
        headersDiv.append(chartDescription)

        headersDiv.append(cacheChartPlaceHolder);

        plotData.labels=Object.keys(ttldata[list.value]).slice(0,10)
        plotData.datasets.push({
            label: "TTL Histogram",
            data: Object.values(ttldata[list.value]).slice(0,10),
            borderColor: Object.values(colors),
            backgroundColor: Object.values(colors),
        })
//        for(var i in ttldata[list.value])
//        {
//            var header = table.createTHead();
//            var row1 = header.insertRow(0);    
//            var header = table.createTHead();
//            var row = header.insertRow(0);
//            headersDiv.append(table)
//            for(var label in plotData.labels)
//                row.insertCell(0).innerHTML = label
//            for(var val in plotData.datasets.data)
//                console.log(val)
//                //row.insertCell(1).innerHTML = val
//                
//        }
        cacheChart.data = plotData;
        cacheChart.update()
    }
    else
    {
        if(options[0] === 'max-stale'){

            if(document.getElementById('description2') !== null)
            document.getElementById('description2').remove()
            chartDescription.id= 'description2'
            chartDescription.innerHTML = 'MAX-STALE and MIN-FRESH Directives Percentage'
            chartDescription.style['margin-top'] = "25%"
            chartDescription.style['textAlign'] = "center"
            headersDiv.append(chartDescription)

            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            
            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            table_header_row.insertCell(0).outerHTML = "<th>MIN-FRESH %</th>"
            table_header_row.insertCell(0).outerHTML = "<th>MAX-STALE %</th>"
            table_header_row.insertCell(0).outerHTML = "<th>Content Type</th>"
        }
        else if(options[0] === 'public'){
            
            if(document.getElementById('description3') !== null)
            document.getElementById('description3').remove()
            chartDescription.id= 'description3'
            chartDescription.innerHTML = 'Cacheability Directives Percentage'
            chartDescription.style['margin-top'] = "25%"
            chartDescription.style['textAlign'] = "center"
            headersDiv.append(chartDescription)

            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            
            var table_header = table.createTHead();
            var table_header_row = table_header.insertRow(0);
            table_header_row.insertCell(0).outerHTML = "<th>NO-STORE %</th>"
            table_header_row.insertCell(0).outerHTML = "<th>NO-CACHE %</th>"
            table_header_row.insertCell(0).outerHTML = "<th>PRIVATE %</th>"
            table_header_row.insertCell(0).outerHTML = "<th>PUBLIC %</th>"
            table_header_row.insertCell(0).outerHTML = "<th>Content Type</th>"
            
        }
        
        headersDiv.append(cacheChartPlaceHolder);

        var table_body = table.createTBody();
        var current_row = 0
        for(var i in data[list.value])
        {
            let d = [];

            if(cacheCheckedList.includes(i))
            {
                var content_row = table_body.insertRow(current_row)
                content_row.insertCell(0).innerHTML = i
                current_row++
            for(var j in options)
            {
                values =(data[list.value][i][options[j]]/data[list.value][i]['count']) *100
                d.push(values)
                content_row.insertCell(1).innerHTML = values
            }
                    plotData.datasets.push( {
                            label: i,
                            data: d,
                            borderColor: colors[CryptoJS.SHA256(i).toString()],
                            backgroundColor: colors[CryptoJS.SHA256(i).toString()],
                        })
                }
            }
            cacheChart.data = plotData;
            cacheChart.update()
            headersDiv.append(table)
    }
}


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
    if(headersDiv.style.display === 'none')
    {
        document.getElementById('viewInfo').style.display='none'
        document.getElementById('timingDiv').style.display='none'
        document.getElementById('map').style.display='none'
        headersDiv.style.display = 'block';
        createSelectList(cacheData)
        createCheckBoxes(cacheData)

        cacheCheckAll()
    }
    else
    {
        headersDiv.style.display = 'none';
        headersDiv.innerHTML = '';
        list.remove()
        checkBoxPlace.remove()

    }
}

async function getHeadersData()
{
    let response = await fetch('/headersData',{
        method: 'GET',
    });
    if(!response.ok)
        throw new Error('An error occured')
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
        throw new Error('An error occured')
    else
        return await response.json()

}

function createSelectList(obj)
{
    list.innerHTML='';
    list.id = "mySelect";
    list.style['margin-bottom'] = '5%'
    headersDiv.append(list)
    for(var i in Object.keys(obj))
    {
        var option = document.createElement("option");
        option.value = Object.keys(obj)[i];
        option.text = Object.keys(obj)[i];
        list.appendChild(option);

    }

}

function createCheckBoxes(obj)
{
    var checkbox_div = document.createElement('div')
    checkbox_div.classList.add('form-group')
    checkbox_div.classList.add('form-check')
    
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'allCache';
    checkbox.classList.add("form-check-input");
    checkbox.onclick = cacheCheckAll;
    checkbox.checked = true;
    
    var label = document.createElement('label')
    label.classList.add('form-check-label')
    label.htmlFor =  'exampleCheck1';
    label.innerHTML = 'ALL';
    
    checkbox_div.append(checkbox);
    checkbox_div.append(label);
    checkBoxPlace.append(checkbox_div);

    for(var i in obj[list.value])
    {
            var checkbox_div = document.createElement('div')
            checkbox_div.classList.add('form-group')
            checkbox_div.classList.add('form-check')
            
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = i;
            checkbox.onclick =  cacheCheckBoxes;
            checkbox.classList.add("form-check-input");
            
            var label = document.createElement('label')
            label.htmlFor =  "exampleCheck1";
            label.innerHTML = i;
            
            checkbox_div.append(checkbox);
            checkbox_div.append(label);
            checkBoxPlace.append(checkbox_div);

    }
    headersDiv.append(checkBoxPlace);

}



function cacheCheckBoxes()
{
   var cacheAllBox = document.getElementById('allCache')
   cacheAllBox.checked = false;
   cacheCheckedList=[];
   var elements = document.getElementsByClassName("form-check-input");
   for (var i = 0, len = elements.length; i < len; i++) 
   {
                if((elements[i].checked === true))
                cacheCheckedList.push(elements[i].id)
                
    }
    if (cacheCheckedList.length === 0)
    {
        cacheAllBox.checked = true
        cacheCheckAll()
    }
    cacheChartCreate(['max-age'])
    cacheChartCreate(['max-stale','min-fresh'])
    cacheChartCreate(['public','private','no-cache','no-store'])
}

function cacheCheckAll()
{
   var elements = document.getElementsByClassName("form-check-input");
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
    cacheChartCreate(['max-stale','min-fresh'])
    cacheChartCreate(['public','private','no-cache','no-store'])
}

function onListChange()
{

    cacheChartCreate(['max-age'])
    cacheChartCreate(['max-stale','min-fresh'])
    cacheChartCreate(['public','private','no-cache','no-store'])
}

headBut.onclick = headButClick; 
list.onchange = onListChange;
