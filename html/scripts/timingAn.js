var timingBut = document.getElementById('timing');
var timingDiv = document.getElementById('timingDiv');
var tablesDiv = document.getElementById('viewInfo');
var checkedList = [];
timingDiv.style.display = 'none';
var listEl = document.getElementById('filter')
var checkP = document.createElement('p')
let chartPlaceHolder = document.createElement('canvas')
timingDiv.append(chartPlaceHolder)
timingDiv.append(checkP)

let chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
        }
            
}

let charts = new Chart(chartPlaceHolder, {
                type:'line',
                data:{
                    labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
                    datasets: [],
                    borderColor:'#ff0000'
                },
                options: chartOptions,
                title: {
                  display: true,
                  text: 'Chart.js Line Chart'
          
                }
            });


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
    return await response.json()

}

function clickTimingBut()
{
    if (timingDiv.style.display === 'none')
    {
        document.getElementById('map').style.display='none'
        timingDiv.style.display = 'block';
        tablesDiv.style.display = 'none';
        selectChange();
    }
    else
        timingDiv.style.display = 'none';
    createChart()
}

async function selectChange()
{

    var filterType = listEl.options[listEl.selectedIndex].value;
    let data = await getData(filterType)
    checkP.innerHTML = ' '
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'all';
    checkbox.onclick = checkAll;
    checkbox.classList.add("checkbox");
    checkbox.checked = true;
    var label = document.createElement('label')
    label.htmlFor =  'ALL';
    label.appendChild(document.createTextNode('ALL'));
    checkP.append(checkbox);
    checkP.append(label);

    for(var i in data)
    {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = i;
            checkbox.onclick =  checkBoxes;
            checkbox.classList.add("checkbox");
            var label = document.createElement('label')
            label.htmlFor =  i;
            label.appendChild(document.createTextNode(i));
            checkP.append(checkbox);
            checkP.append(label);

    }
    createChart()
}



function checkBoxes()
{
   var box = document.getElementById('all')
   box.checked = false;
   checkedList=[];
   var elements = document.getElementsByClassName("checkbox");
   for (var i = 0, len = elements.length; i < len; i++) 
   {
                if((elements[i].checked === true))
                checkedList.push(elements[i].id)
                
    }
    if (checkedList.length === 0)
        box.checked = true
    console.log(checkedList)
    createChart()
}



async function createChart()
{
    let filterType = listEl.options[listEl.selectedIndex].value;
    let data = await getData(filterType)
    charts.data.datasets=[]
    charts.update()
    var box = document.getElementById('all')
    if(box.checked === false)
    {
        for(var i in checkedList)
        {
           var color = '#' + Math.floor(Math.random()*16777215).toString(16);
           newDataset = {
                label: checkedList[i],
                data: data[checkedList[i]],
                borderColor: color,
                backgroundColor: color,
               }
                charts.data.datasets.push(newDataset);
                charts.update()
            }
    }
    else
    {

        for(var i in data)
        {
           var color = '#' + Math.floor(Math.random()*16777215).toString(16);
           newDataset = {
                label: i,
                data: data[i],
                borderColor: color,
                backgroundColor: color,
               }
                charts.data.datasets.push(newDataset);
                charts.update()
        }
    }
}
    
function checkAll()
{
   var elements = document.getElementsByClassName("checkbox");
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


timingBut.onclick = clickTimingBut
listEl.onchange = selectChange