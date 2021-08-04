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
    console.log(data)
    labels = data[1]
    console.log(labels)
    data = data[0]
    let filterMap = {
        'method':'method',
        '\`content-typeResponse\`': 'type',
        'dayname(startedDateTime)' : 'time'
    }
    for(var i in data)
    {
        for(var j in data[i])
        {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = data[i][j].check;
            checkbox.id = data[i][j].check;
            checkbox.name = data[i][j].check;
            var label = document.createElement('label')
            label.htmlFor =  data[i][j].check;
            label.appendChild(document.createTextNode( data[i][j].check));
 
            timingDiv.append(checkbox)
            timingDiv.append(label)
            console.log(data[i][j].check)
        }
    }

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

timingBut.onclick = clickTimingBut
listEl.onchange = selectChange
