function loadCurrency(){
 const select_1 = document.getElementById('from');
 const select_2 = document.getElementById('to');

 const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

 fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(data => {
        let currencies = data.results;
        for (currency in currencies){ //Loop through the result
           console.log(currency);
           let option = document.createElement('option');
           option.value = `${currencies[currency].id}`;
           option.innerText = `${currencies[currency].currencyName}(${currencies[currency].currencySymbol})`;
           // select_1.innerHTML += `<option>${currency}</option>`;
           // select_2.innerHTML += `<option>${currency}</option>`;
           select_1.appendChild(option);
           select_2.appendChild(option.cloneNode(true));
        }
    }).catch(err =>{
     console.log(JSON.stringify(err));
 });
}