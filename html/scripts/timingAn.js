var timingBut = document.getElementById('timing');
var timingDiv = document.getElementById('timingDiv');
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
                    labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
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
    let b = { 'filter': filter}
    let response = await fetch('/timingData',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(b)
    });
    return await response.json()

}

async function clickTimingBut()
{
    if (timingDiv.style.display === 'none')
    {
        timingDiv.style.display = 'block';
        selectChange();
    }
    else
        timingDiv.style.display = 'none';
    var filterType = listEl.options[listEl.selectedIndex].value;
    let data = await getData(filterType)
    createChart(data)
}

async function selectChange()
{

    var filterType = listEl.options[listEl.selectedIndex].value;
    let data = await getData(filterType)
    checkP.innerHTML = ' '
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = 'ALL';
    checkbox.id = 'all';
    checkbox.name =  'ALL';
    checkbox.onclick = checkAll;
    checkbox.classList.add("checkbox");
    var label = document.createElement('label')
    label.htmlFor =  'ALL';
    label.appendChild(document.createTextNode('ALL'));
    checkP.append(checkbox);
    checkP.append(label);
    document.getElementById('all').checked = true;

    for(var i in data)
    {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i;
            checkbox.id = i;
            checkbox.name =  i;
            checkbox.onclick =  checkBoxes;
            checkbox.classList.add("checkbox");
            var label = document.createElement('label')
            label.htmlFor =  i;
            label.appendChild(document.createTextNode(i));
            checkP.append(checkbox);
            checkP.append(label);

    }
    createChart(data)
}



async function checkBoxes()
{
   var filterType = listEl.options[listEl.selectedIndex].value;
   let data = await getData(filterType)
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
    createChart(data)
}



function createChart(dataObj)
{
    charts.data.datasets=[]
    charts.update()
    var box = document.getElementById('all')
    if(box.checked === false)
    {
        for(var i in checkedList)
        {
           newDataset = {
                label: checkedList[i],
                data: dataObj[checkedList[i]]
               }
                charts.data.datasets.push(newDataset);
                charts.update()
            }
    }
    else
    {

        for(var i in dataObj)
        {
           newDataset = {
                label: i,
                data: dataObj[i]
               }
                charts.data.datasets.push(newDataset);
                charts.update()
        }
    }
}
    
async function checkAll()
{
   var filterType = listEl.options[listEl.selectedIndex].value;
   let data = await getData(filterType)
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
    createChart(data)
}


timingBut.onclick = clickTimingBut
//listEl.onchange = selectChange
listEl.onchange = selectChange
