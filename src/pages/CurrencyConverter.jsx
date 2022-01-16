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
    const [details, setDetails] = useState()
    const [fileName, setFileName] = useState('')
    const [currencies, setCurrencies] = useState([])
    const [rates, setRates] = useState([])
    const [toCurrency, setToCurrency] = useState('')
    const [newData, setNewData] = useState()

    useEffect(() => {
        if (details) {
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
                    {details &&
                        <div className='input-data'>
                            <svg
                                className="svg-inline--fa fa-upload fa-w-16"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                ></path>
                            </svg>
                            <span className='fileName'>{fileName}</span>

                        </div>
                    }
                    <div className='select-wrapper'>
                        <h2>convert to:</h2>
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
