var timingBut = document.getElementById('timing');
var timingDiv = document.getElementById('timingDiv');
timingDiv.style.display = 'none';
var listEl = document.getElementById('filter')

function clickTimingBut()
{
    if (timingDiv.style.display === 'none')
    {
        timingDiv.style.display = 'block';
        selectChange();
    }
    else
        timingDiv.style.display = 'none';
}

async function selectChange()
{

    var filterType = listEl.options[listEl.selectedIndex].value;
    let data = await getData(filterType)
    var labels = [...new Set(data['labels'])]
    data = data['data']

    for(var i in labels)
    {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = labels[i];
            checkbox.id =    'check';
            checkbox.name =  labels[i];
            var label = document.createElement('label')
            label.htmlFor =  labels[i];
            label.appendChild(document.createTextNode(labels[i]));
            timingDiv.append(checkbox);
            timingDiv.append(label);

    }
    let filterMap = {
        'method':'method',
        '\`content-typeResponse\`': 'type',
        'dayname(startedDateTime)' : 'time'
    }
    createChart(data)

}

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

function createChart(dataObj)
{
    console.log(dataObj)
}

timingBut.onclick = clickTimingBut
listEl.onchange = selectChange
