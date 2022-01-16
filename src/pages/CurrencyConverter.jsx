import React, { useState, useEffect } from 'react'

import './CurrencyConverter.css'

import { } from 'react-papaparse'
import { parse } from 'papaparse'
import axios from 'axios'



const CurrencyConverter = () => {
    const [details, setDetails] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [rates, setRates] = useState([])
    const [fromCurrency, setfromCurrency] = useState('')
    const [toCurrency, setToCurrency] = useState('')






    useEffect(() => {
        if (details.length > 0) {
            async function fetchData() {
                axios.get("https://cdn.moneyconvert.net/api/latest.json")
                    .then((result) => {
                        const ratesData = result.data.rates
                        const keys = Object.keys(ratesData)
                        setCurrencies(keys)
                        setRates(ratesData)
                    })
            }
            fetchData();
        }
    }, [details])

    useEffect(() => {
        let inDollars
        let inRequiredCurrency
        if (toCurrency.length > 0) {
            const newData = details.map((obj) => {
                console.log(rates[obj.Currency], obj.Amount);
                inDollars = parseInt(obj.Amount) / rates[obj.Currency]
                console.log(inDollars);
                inRequiredCurrency = inDollars * rates[toCurrency]
                return { ...obj, "Converted Currency": toCurrency, "Converted Amount": inRequiredCurrency }
            })
            console.log(newData);
        }
    }, [toCurrency])


    const handletheDrop = (e) => {
        e.preventDefault()
        Array.from(e.dataTransfer.files)
            .filter((file) => file.type === "application/vnd.ms-excel")
            .forEach(async (file) => {
                const data = await file.text()
                const result = parse(data, { header: true })
                setDetails([...result.data])
            })
    }

    const handletheDrag = (e) => {
        e.preventDefault()
    }







    return (
        <div className='main-container'>
            <h3>csv currency converter</h3>
            <div className="container-wrapper">
                <div className='uploader'
                    onDrop={handletheDrop}
                    onDragOver={handletheDrag}
                >
                    <p>Drop your csv file here</p>
                </div>
                <div className='select-wrapper'>
                    <h4>Convert to:</h4>
                    <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                        {
                            currencies.map((currency) => (
                                <option key={currency} value={currency}> {currency}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </div >
    )
}

export default CurrencyConverter
