var timingBut = document.getElementById('timing');
var timingDiv = document.getElementById('timingDiv');
var tablesDiv = document.getElementById('viewInfo');
var headersDiv = document.getElementById('headersDiv');
var listEl = document.createElement("select");
var checkP = document.createElement("div");
let chartPlaceHolder = document.createElement('canvas')
var message = document.getElementById('alert');
var checkedList = [];

checkP.classList.add('row')
checkP.style['margin-left'] = '0.5%'
checkP.style['margin-top'] = '2%'

// Configuring the chart
let chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Response Time during the day'
      }
        }
            
}

// Creating the dropdown select list
function createFilterList()
{
    listEl.innerHTML='';
    list.style['margin-bottom'] = '5%'
    filtMap={
        'method':'By Method',
        '\`content-typeResponse\`':'By Content-Type',
        'dayname(startedDateTime)':'By Day of the Week',
        'isp':'By ISP'
    }
    for(var i in filtMap)
    {
        var option = document.createElement("option");
        option.value = i
        option.text = filtMap[i]
        listEl.appendChild(option);
    }
}

// Creating the chart
let charts = new Chart(chartPlaceHolder, {
                type:'line',
                data:{
                    labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                    datasets: [],
                    borderColor:'#ff0000'
                },
                options: chartOptions,
            });

// Function that returns an object.
// The object contains ...
async function getData(filter)
{
    let reqData= { 'filter': filter}
    let response = await fetch('/timingData',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    });
    if(!response.ok)
        throw new Error('An error has occured')
    else
        return await response.json()

}

// "Timing Analysis" button's on-click function
function timingButClick()
{
    if(timingDiv.innerHTML===''){
        timingDiv.append(listEl)
        timingDiv.append(checkP)
        timingDiv.append(chartPlaceHolder)
        chartPlaceHolder.style.display ='none'
        timingDiv.style.display = 'none';
        message.style.display = 'none';
        createFilterList();
        selectChange();
        createChart()
    }
    if (timingDiv.style.display === 'none')
    {
        document.getElementById('map').style.display='none'
        headersDiv.style.display='none';
        timingDiv.style.display = 'block';
        tablesDiv.style.display = 'none';
    }
    else
        timingDiv.style.display = 'none';
}

// Function that ...
async function selectChange()
{

    var filterType = listEl.options[listEl.selectedIndex].value;
    checkP.innerHTML=''
    try{
        var data = await getData(filterType)
        listEl.style.display ='block'
    }
    catch(e)
    {
        message.innerHTML = e;
        message.style.display = 'block';
    }



    var checkbox_div = document.createElement('div')
    checkbox_div.classList.add('form-group')
    checkbox_div.classList.add('form-check')
    
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'all';
    checkbox.onclick = checkAll;
    checkbox.classList.add("form-check-input");
    checkbox.classList.add("timing");
    checkbox.checked = true;
    
    var label = document.createElement('label')
    label.classList.add('form-check-label')
    label.htmlFor =  'exampleCheck1';
    label.innerHTML = 'ALL';

    checkbox_div.append(checkbox);
    checkbox_div.append(label);
    checkP.append(checkbox_div);


    for(var i in data)
    {
            var checkbox_div = document.createElement('div')
            checkbox_div.classList.add('form-group')
            checkbox_div.classList.add('form-check')
            
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = i;
            checkbox.onclick =  checkBoxes;
            checkbox.classList.add("form-check-input");
            checkbox.classList.add("timing");
            
            var label = document.createElement('label')
            label.classList.add('form-check-label')
            label.htmlFor =  'exampleCheck1';
            label.innerHTML =  i;
        
            checkbox_div.append(checkbox);
            checkbox_div.append(label);
            checkP.append(checkbox_div);

    }
    createChart()
}

// Function that ...
function checkBoxes()
{
   var box = document.getElementById('all')
   box.checked = false;
   checkedList=[];
   var elements = document.getElementsByClassName("timing");
   for (var i = 0, len = elements.length; i < len; i++) 
   {
                if((elements[i].checked === true))
                checkedList.push(elements[i].id)
                
    }
    if (checkedList.length === 0)
        box.checked = true
    createChart()
}



async function createChart()
{
    let filterType = listEl.options[listEl.selectedIndex].value;
    message.style.display='none';
    try{
        var data = await getData(filterType)
        listEl.style.display ='block'
        chartPlaceHolder.style.display ='block'
    }
    catch(e)
    {
        message.innerHTML = e;
        message.style.display = 'block';
    }
    charts.data.datasets=[]
    charts.update()
    var box = document.getElementById('all')
    if(box.checked === false)
    {
        for(var i in checkedList)
        {
           newDataset = {
                label: checkedList[i],
                data: data[checkedList[i]],
                borderColor: colors[checkedList[i]],
                backgroundColor: colors[checkedList[i]],
               }
                charts.data.datasets.push(newDataset);
                charts.update()
            }
    }
    else
    {

        for(var i in data)
        {
           newDataset = {
                label: i,
                data: data[i],
                borderColor: colors[i],
                backgroundColor: colors[i],
               }
                charts.data.datasets.push(newDataset);
                charts.update()
        }
    }
}
    
function checkAll()
{
   var elements = document.getElementsByClassName("timing");
   var box = document.getElementById('all')
   if(box.checked === true)
    {
        for (var i = 0, len = elements.length; i < len; i++) 
        {
                     elements[i].checked =false;
        }
    }
    box.checked = true;
    createChart()
}


timingBut.onclick = timingButClick;
listEl.onchange = selectChange
