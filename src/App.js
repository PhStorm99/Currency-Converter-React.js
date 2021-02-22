import React , {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'

//API for latest currency conversion rates
const BASE_URL = "https://api.exchangeratesapi.io/latest"

function App(){

    //useState for currency options
    const [currencyOptions, setCurrencyOptions] = useState([])
    
    //to set the default currency in option
    const [fromCurrency, setFromCurrency] = useState()
    
    //set the exchange default currency
    const [toCurrency, setToCurrency] = useState()

    //to get the exchange rate
    const [exchangeRate, setExchangeRate] = useState()
    //setting the default amount
    const [amount, setAmount] = useState(1)

    //Is it the amount that changed from first box or second box
    const [amountInFromCurrency, setamountInFromCurrency] = useState(true)
   
    //automatically gets the exchange rae amount
    let toAmount, fromAmount
    if (amountInFromCurrency) {
        fromAmount = amount
        toAmount = amount * exchangeRate
        
    }
    else{
        toAmount = amount
        fromAmount = amount / exchangeRate
    }


    // We want to fetch the api everytime we load the application, so we use useEffect()
    //In useeffect, first parameter will empty function and 2nd will be an empty array, will only called once 
    useEffect(()=> {
        fetch(BASE_URL) //fetch the url 
            .then(res => res.json())   //convert response to json
            .then(data => {

                const firstCurrency = Object.keys(data.rates)[0]
                setCurrencyOptions([data.base, ...Object.keys(data.rates)])
                setFromCurrency(data.base)   //set currency from the base in the json
                setToCurrency(firstCurrency)
                setExchangeRate(data.rates[firstCurrency])
            })
    }, [])

    //If we want to update the exchange rate by selecting or changing the currency value
    //then we have to make another useEffect.
    useEffect(() =>{
        if (fromCurrency != null && toCurrency !=null) {
            fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
            .then(res => res.json()) 
            .then(data => setExchangeRate(data.rates[toCurrency]))
        }
    }, [fromCurrency, toCurrency])




    function handleFromAmountChange(e){
        setAmount(e.target.value)
        setamountInFromCurrency(true)
    }

    function handleToAmountChange(e){
        setAmount(e.target.value)
        setamountInFromCurrency(false)
    }
    return(
        // wrap in fragments, empty elements will return the javascrip 
        <>
            <h1>Convert your currency through <br/>latest conversion rates
            </h1>
            <CurrencyRow
                currencyOptions = {currencyOptions}
                selectedCurrency = {fromCurrency}

                //setting the target onchange currently
                onChangeCurrency = {e => setFromCurrency(e.target.value)}
                amount = {fromAmount}
                onChangeAmount = {handleFromAmountChange}
            />
            <div className="equals">=</div>
            <CurrencyRow
                currencyOptions = {currencyOptions}
                selectedCurrency = {toCurrency}
                onChangeCurrency = {e => setToCurrency(e.target.value)}
                onChangeAmount = {handleToAmountChange}
                amount = {toAmount}
            />
            <p><i>Made by Harsh Patel</i></p>
        </>
    );
}

export default App;