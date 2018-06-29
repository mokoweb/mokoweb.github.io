document.addEventListener("DOMContentLoaded", fetchCurrencies);

let currencyFrom = document.getElementById('currfrom');
let currencyTo = document.getElementById('currto');

const baseUrl = 'https://free.currencyconverterapi.com/api/v5/';
document.getElementById('convertButton').addEventListener('click', computeConversion);




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
	
	
	

function computeConversion() {
   let fromCurrency = currencyFrom.options[currencyFrom.selectedIndex].value
   let toCurrency = currencyTo.options[currencyTo.selectedIndex].value
   //console.log(fromCurrency)
   //console.log(toCurrency)
   let amount = Number(document.getElementById('amount').value);
   if(!amount) { return }
   let query = `${fromCurrency}_${toCurrency}`;
   let url =  `${baseUrl}convert?q=${query}&compact=ultra`;
   //console.log(url)
    //check if value is in the DB
    dbPromise.then(function(db) {
      let tx = db.transaction('rates', 'readwrite');
      let rateStore = tx.objectStore('rates');
      console.log('i am query', query);
      return rateStore.get(query); //i have a problem with this line, my key path is pairs
    }).then(function(value) {
        if (value === undefined || value === null) {
            get(url)
                .then(function(data){
                    //console.log(data)
                    //console.log(query)
                    let val = data[query];
                    if (val) {
                        //create transaction
                        //store the value
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
                          //then compute conversion
                          let total = val * amount;
                          document.getElementById('convertedCurrency').value = total.toFixed(2)
                        });
                
                    } else {
                        let err = new Error("Offline: Value not found for " + query)
                        console.log(err)
                       // calculateAmount(err)
                    }
				});
        } else {
            console.log('The value of pairs is:', value);// for example {pairs: "LYD_FKP", convertRate: 0.553614}
			let rate = value.convertRate; //gets only the convert rate
			
            //then compute conversion
		let total = rate * amount;
			console.log(total);
            document.getElementById('convertedCurrency').value = total.toFixed(2)
            //cb(null, Math.round(total * 100) / 100);
        }
    }).catch(() => {
        console.log("Error", err);
    });
}
  


