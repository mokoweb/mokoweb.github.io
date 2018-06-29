document.addEventListener("DOMContentLoaded", fetchCurrencies);

let currencyFrom = document.getElementById('currfrom');
let currencyTo = document.getElementById('currto');

const baseUrl = 'https://free.currencyconverterapi.com/api/v5/'
document.getElementById('convertButton').addEventListener('click', computeConversion)




// Function to perform HTTP request
let get = function(url) {
  return new Promise(function(resolve, reject) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let result = xhr.responseText
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


function fetchCurrencies() {
   get(`${baseUrl}currencies`)
  .then(function(data) {
        let currencies = data.results;
       populateSelectBoxes(currencies);
	
    }).catch(err => console.log(err));
}

function populateSelectBoxes(currencies) {
    for ( currency in currencies) {
        let optionFrom = document.createElement('option');
        let optionTo = document.createElement('option');

        optionFrom.text = `${currencies[currency].currencyName} (${currency})`;
        optionFrom.value = currency;
        currencyFrom.appendChild(optionFrom);

        optionTo.text = `${currencies[currency].currencyName} (${currency})`;
        optionTo.value = currency;
        currencyTo.appendChild(optionTo);  
    }
}
    

//this function converts the pairs and outputs results to users
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
        //console.log(data)
		//console.log(query)
        let val = data[query]
        if (val) {
			storeDB(query,val);
            let total = val * amount
            document.getElementById('convertedCurrency').value = total.toFixed(2)
           //cb(null, Math.round(total * 100) / 100);
        }
        else {
            let err = new Error("Value not found for " + query)
            console.log(err)
           // calculateAmount(err)
        }
    }).catch(err => {
        console.log("Error", err);
    })
}

//service worker
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




//for indexDB
let dbPromise = idb.open('convert-db', 4, function(upgradeDb) {
	let rateStore = upgradeDb.createObjectStore('rates', {
      keyPath: 'pairs'
    });
	 
  });
  

// add currency to db
function storeDB(query, val){
dbPromise.then(function(db) {
  let tx = db.transaction('rates', 'readwrite');
  let rateStore = tx.objectStore('rates');

  rateStore.put({
    pairs: query,
	convertRate: val
  });
  
  return tx.complete;
}).then(function() {
  console.log('data added');
});
}
//when in offline
// Query the data
// read "hello" in "keyval"
function queryDB(pairs){
dbPromise.then(function(db) {
  let tx = db.transaction('rates');
  let rateStore = tx.objectStore('rates');
  return rateStore.get(pairs);
}).then(function(val) {
  console.log('The value of pairs is:', val);
}).catch(() => {
    console.log('file not found wai');
	
})
	
}
