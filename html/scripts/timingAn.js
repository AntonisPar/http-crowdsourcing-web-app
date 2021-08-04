var timingBut = document.getElementById('timing');

async function getData()
{
    let response = await fetch('/timingData',{
        method: 'GET'
    })

    return await response.json()
}