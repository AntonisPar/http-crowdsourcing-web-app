var headBut = document.getElementById('headers')
var headersDiv = document.getElementById('headersDiv')
var list = document.createElement("select");
var checkBoxPlace = document.createElement("p"); 
var cacheCheckedList=[];
headersDiv.style.display='none';
    
let barChartOptions = {
    responsive: true,
    scales:{
        y: {
            beginAtZero: true
        }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ''
      }
        }
            
};

async function cacheChartCreate(options)
{
    let data = await getHeadersData()
    if(typeof(document.getElementById('canvas'+options[0])) !== 'undefined' && document.getElementById('canvas'+options[0]) !== null)
       document.getElementById('canvas'+options[0]).remove()
    let cacheChartPlaceHolder = document.createElement('canvas')

    if(typeof(document.getElementById('table'+options[0])) !== 'undefined' && document.getElementById('table'+options[0]) !== null)
       document.getElementById('table'+options[0]).remove()
    let table = document.createElement('table')
    //table.createCaption().textContent = captions[key]

    headersDiv.append(cacheChartPlaceHolder);
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

    if(options[0] === 'max-age')
    {
        for(var i in data[list.value])
        {
            var header = table.createTHead();
            var row1 = header.insertRow(0);    
            var header = table.createTHead();
            var row = header.insertRow(0);
            let d = [];
            if(cacheCheckedList.includes(i))
            {
                var age =data[list.value][i]['max-age']/data[list.value][i]['count'] 
                d.push(age)
                    plotData.datasets.push( {
                            label: i,
                            data: d
                        })
                    row.insertCell(0).innerHTML = i
                    row.insertCell(1).innerHTML = age
                }
            }
            cacheChart.data = plotData;
            cacheChart.update()
            headersDiv.append(table)
    }
    else
    {
        for(var i in data[list.value])
        {
            let d = [];
            var header = table.createTHead();
            var row1 = header.insertRow(0);    
            var header = table.createTHead();
            var row = header.insertRow(0);
            if(cacheCheckedList.includes(i))
            {
            row.insertCell(0).innerHTML = i
            for(var j in options)
            {
                values =(data[list.value][i][options[j]]/data[list.value][i]['count']) *100
                d.push(values)
                row.insertCell(1).innerHTML = values
            }
                    plotData.datasets.push( {
                            label: i,
                            data: d
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
    let cacheData = await getHeadersData();
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
    return await response.json()

}

function createSelectList(obj)
{
    list.innerHTML='';
    list.id = "mySelect";
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
    var checkbox = document.createElement('input');
    checkBoxPlace.innerHTML = ''
    checkbox.type = 'checkbox';
    checkbox.id = 'allCache';
    checkbox.classList.add("cacheCheckbox");
    checkbox.onclick = cacheCheckAll;
    checkbox.checked = true;
    var label = document.createElement('label')
    label.htmlFor =  'ALL';
    label.appendChild(document.createTextNode('ALL'));
    checkBoxPlace.append(checkbox);
    checkBoxPlace.append(label);

    for(var i in obj[list.value])
    {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = i;
            checkbox.onclick =  cacheCheckBoxes;
            checkbox.classList.add("cacheCheckbox");
            var label = document.createElement('label')
            label.htmlFor =  i;
            label.appendChild(document.createTextNode(i));
            checkBoxPlace.append(checkbox);
            checkBoxPlace.append(label);

    }
    headersDiv.append(checkBoxPlace);

}



function cacheCheckBoxes()
{
   var cacheAllBox = document.getElementById('allCache')
   cacheAllBox.checked = false;
   cacheCheckedList=[];
   var elements = document.getElementsByClassName("cacheCheckbox");
   for (var i = 0, len = elements.length; i < len; i++) 
   {
                if((elements[i].checked === true))
                cacheCheckedList.push(elements[i].id)
                
    }
    if (cacheCheckedList.length === 0)
        cacheAllBox.checked = true
    cacheChartCreate(['max-age'])
    cacheChartCreate(['max-stale','min-fresh'])
    cacheChartCreate(['public','private','no-cache','no-store'])
}

function cacheCheckAll()
{
   var elements = document.getElementsByClassName("cacheCheckbox");
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
    console.log(cacheCheckedList)
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
