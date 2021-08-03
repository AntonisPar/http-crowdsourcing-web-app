var timingBut = document.getElementById('timing');

async function getData()
{
    fetch('/timingData',{
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: 
    })
    .then(res => res.text())

}


var x = getData()
console.log(x)
