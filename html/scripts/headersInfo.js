var headersInfoBut = document.getElementById('headers');
var headersDiv = document.getElementById('headers_div');
headersDiv.style.display = 'none';

var checkedListHistogram = {};
var checkPHistogram = document.createElement('p');
let chartHistogramPlaceholder = document.createElement('canvas');

var checkedListFreshStale = {};
var checkPFreshStale = document.createElement('p');
let chartFreshStalePlaceholder = document.createElement('canvas');

var checkedListCacheability = {};
var checkPCacheability = document.createElement('p');
let chartCacheabilityPlaceholder = document.createElement('canvas');

headersDiv.append(checkPHistogram);
headersDiv.append(chartHistogramPlaceholder);
headersDiv.append(checkPFreshStale);
headersDiv.append(chartFreshStalePlaceholder);
headersDiv.append(checkPCacheability);
headersDiv.append(chartCacheabilityPlaceholder);


let chartHistogramOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'TTL Histogram'
      }
    }
            
};
let chartHistogram = new Chart(chartHistogramPlaceholder, {
    type:'bar',
    data:{
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets: [],
        borderColor:'#ff0000'
    },
    options: chartHistogramOptions
});

let chartFreshStaleOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Max-Stale | Min-Fresh Percentage'
      }
    }       
};
let chartFreshStale = new Chart(chartFreshStalePlaceholder, {
    type:'bar',
    data:{
        labels: [],
        datasets: [],
        borderColor:'#ff0000'
    },
    options: chartFreshStaleOptions
});

let chartCacheabilityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cacheability Directives Percentage'
      }
    }
            
};
let chartCacheability = new Chart(chartCacheabilityPlaceholder, {
    type:'bar',
    data:{
        labels: [],
        datasets: [],
        borderColor:'#ff0000'
    },
    options: chartCacheabilityOptions
});

async function getHeaderData(filter)
{
    let reqData= {'filter': filter}
    let response = await fetch('/headerData',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    });
    return await response.json()

}