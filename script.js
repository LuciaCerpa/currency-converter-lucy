const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "MXN" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    const exchangeRateTxt1 = document.querySelector("form .exchange-rate1");
    const exchangeRateTxt2 = document.querySelector("form .exchange-rate2");
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";
    
    let url = `https://v6.exchangerate-api.com/v6/18b0fd1fa7990245ae112484/latest/${fromCurrency.value}`;
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;       
    }).catch(() =>{
        exchangeRateTxt.innerText = "Something went wrong";
    });

    fetch(`https://v6.exchangerate-api.com/v6/18b0fd1fa7990245ae112484/latest/USD`).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates["MXN"];
        let totalExRate = (1 * exchangeRate).toFixed(2);
        exchangeRateTxt1.innerText = `1 USD = ${totalExRate} MXN`;
        
    }).catch(() =>{
        exchangeRateTxt.innerText = "Something went wrong";
    });

    fetch("https://v6.exchangerate-api.com/v6/18b0fd1fa7990245ae112484/latest/EUR").then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates["MXN"];
        let totalExRate = (1 * exchangeRate).toFixed(2);        
        exchangeRateTxt2.innerText = `1 EUR = ${totalExRate} MXN`;
    }).catch(() =>{
        exchangeRateTxt.innerText = "Something went wrong";
    });
}