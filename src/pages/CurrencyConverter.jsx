import React, { useState, useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './CurrencyConverter.css'
import Buttons from '../components/Button/ButtonUpload';

import { CSVLink } from "react-csv";
import { parse } from 'papaparse'
import axios from 'axios'
import Toast from '../components/Toast/Toast';




const CurrencyConverter = () => {
    const [details, setDetails] = useState([])
    const [fileName, setFileName] = useState('')
    const [currencies, setCurrencies] = useState([])
    const [rates, setRates] = useState([])
    const [toCurrency, setToCurrency] = useState('')
    const [newData, setNewData] = useState()

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
        const current = new Date();
        const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
        if (toCurrency.length > 0) {
            const newData = details.map((obj) => {
                if (obj.Currency && obj.Amount) {
                    inDollars = parseInt(obj.Amount) / rates[obj.Currency]
                    inRequiredCurrency = inDollars * rates[toCurrency]
                    return { ...obj, "Converted Currency": toCurrency, "Converted Amount": inRequiredCurrency, "Converted On": date }
                } else {
                    return { ...obj }
                }

            })
            setNewData(newData)
            console.log(newData);
        }
    }, [toCurrency])


    const handletheFile = (e) => {
        e.preventDefault()
        console.log(e.target.files)
        if (e.target.files[0].type === "application/vnd.ms-excel") {
            setFileName(e.target.files[0].name)
            Array.from(e.target.files)
                .filter((file) => file.type === "application/vnd.ms-excel")
                .forEach(async (file) => {
                    const data = await file.text()
                    const result = parse(data, { header: true })
                    setDetails([...result.data])
                })
        } else {
            toast.error("Invalid file format")
        }
    }
    console.log(details);
    console.log(newData);

    const headers = [
        { label: 'Name', key: "Name" },
        { label: 'Currency', key: "Currency" },
        { label: 'Amount', key: "Amount" },
        { label: 'Transaction Date', key: "Transaction Date" },
        { label: 'Converted Currency', key: "Converted Currency" },
        { label: 'Converted Amount', key: "Converted Amount" },
        { label: 'Converted On', key: "Converted On" }
    ];

    const csvReports = {
        filename: fileName,
        headers: headers,
        data: newData
    }

    return (
        <>
            <div className='main-container'>
                <h2>csv currency converter</h2>
                <div className="container-wrapper">
                    <Buttons handletheFile={handletheFile} />
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
                    {
                        newData ? <CSVLink className='csv' {...csvReports} >Download</CSVLink> : ''
                    }

                </div>
            </div >
            <Toast />
        </>
    )
}

export default CurrencyConverter
