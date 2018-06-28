document.addEventListener("DOMContentLoaded", fetchCurrencies);

let currencyFrom = document.getElementById('currfrom');
let currencyTo = document.getElementById('currto');

const baseUrl = 'https://free.currencyconverterapi.com/api/v5/'
document.getElementById('convertButton').addEventListener('click', computeConversion)

function fetchCurrencies() {
   get(`${baseUrl}currencies`)
  .then(function(data) {
        let currencies = data.results
        populateSelectBoxes(currencies)
    }).catch(err => console.log(err));
}

function populateSelectBoxes(currencies) {
    for ( currency in currencies) {
        let optionFrom = document.createElement('option');
        let optionTo = document.createElement('option')

        optionFrom.text = currency
        optionFrom.value = currency
        currencyFrom.appendChild(optionFrom)

        optionTo.text = currency
        optionTo.value = currency
        currencyTo.appendChild(optionTo)   
    }
}
 

function computeConversion() {
    let fromCurrency = currencyFrom.options[currencyFrom.selectedIndex].value
    let toCurrency = currencyTo.options[currencyTo.selectedIndex].value
    console.log(fromCurrency)
    console.log(toCurrency)
    let amount = Number(document.getElementById('amount').value)
    if(!amount) { return }
    let query = `${fromCurrency}_${toCurrency}`
    let url =  `${baseUrl}convert?q=${query}&compact=ultra`
    console.log(url)
   get(url)
  .then(function(data){
        console.log(data)
        let val = data[query]
        if (val) {
            let total = val * amount
            document.getElementById('convertedCurrency').value = total.toFixed(2)
            calculateAmount(null, Math.round(total * 100) / 100)
        }
        else {
            let err = new Error("Value not found for " + query)
            console.log(err)
            calculateAmount(err)
        }
    }).catch(err => {
        console.log("Error", err);
    })
}

if ('serviceWorker' in navigator) {
 window.addEventListener('load', function() {
   navigator.serviceWorker.register('./sw.js').then(function(registration) {
     // Registration was successful
     console.log('ServiceWorker registration successful with scope: ', registration.scope);
   }, function(err) {
     // registration failed :disappointed:
     console.log('ServiceWorker registration failed: ', err);
   });
 });
}


// Function to perform HTTP request
var get = function(url) {
  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var result = xhr.responseText
                result = JSON.parse(result);
                resolve(result);
            } else {
                reject(xhr);
            }
        }
    };
    
    xhr.open("GET", url, true);
    xhr.send();

  }); 
};








