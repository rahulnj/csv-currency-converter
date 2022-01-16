import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CSVLink } from "react-csv";
import { parse } from 'papaparse'
import { toast } from 'react-toastify'
import { FaFileUpload } from 'react-icons/fa'

import Buttons from '../components/Button/ButtonUpload';
import Toast from '../components/Toast/Toast';
import 'react-toastify/dist/ReactToastify.css'
import './CurrencyConverter.css'


const CurrencyConverter = () => {

    const [fileContents, setFileContents] = useState()
    const [fileName, setFileName] = useState('')
    const [currencies, setCurrencies] = useState([])
    const [exchangeRates, setExchangerates] = useState([])
    const [toCurrency, setToCurrency] = useState('')
    const [newData, setNewData] = useState()

    useEffect(async () => {
        if (fileContents) {
            async function fetchExchangeRates() {
                const { data } = await axios.get("https://cdn.moneyconvert.net/api/latest.json")
                const rates = data.rates
                const keys = Object.keys(rates)
                setCurrencies(keys)
                setExchangerates(rates)
            }
            fetchExchangeRates();
        }
    }, [fileContents])

    useEffect(() => {
        let amountInDollars
        let amountInRequiredCurrency
        const today = new Date();
        const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        if (toCurrency.length > 0) {
            const newData = fileContents.map((row) => {
                if (row.Currency && row.Amount) {
                    amountInDollars = parseInt(row.Amount) / exchangeRates[row.Currency]
                    amountInRequiredCurrency = amountInDollars * exchangeRates[toCurrency]
                    return { ...row, "Converted Currency": toCurrency, "Converted Amount": amountInRequiredCurrency, "Converted On": date }
                } else {
                    return { ...row }
                }

            })
            setNewData(newData)
        }
    }, [toCurrency])

    const newTitles = [
        { label: 'Name', key: "Name" },
        { label: 'Currency', key: "Currency" },
        { label: 'Amount', key: "Amount" },
        { label: 'Transaction Date', key: "Transaction Date" },
        { label: 'Converted Currency', key: "Converted Currency" },
        { label: 'Converted Amount', key: "Converted Amount" },
        { label: 'Converted On', key: "Converted On" }
    ];

    const newFileProperties = {
        filename: fileName,
        headers: newTitles,
        data: newData
    }

    const handleFileInput = (files) => {
        if (files[0].type === "application/vnd.ms-excel") {
            setFileName(files[0].name)
            Array.from(files)
                .filter((file) => file.type === "application/vnd.ms-excel")
                .forEach(async (file) => {
                    const data = await file.text()
                    const result = parse(data, { header: true })
                    setFileContents([...result.data])
                })
        } else {
            toast.error("Invalid file format")
        }
    }

    return (
        <>
            <div className='main-container'>
                <h2>csv currency converter</h2>
                <div className="container-wrapper">
                    <Buttons handleFileInput={handleFileInput} />
                    {fileContents &&
                        <div className='input-data'>
                            <FaFileUpload size={26} />
                            <span className='fileName'>{fileName}</span>

                        </div>
                    }
                    {
                        fileContents &&
                        <div className='select-wrapper'>
                            <div className='convert-wrapper'>
                                <p>convert to:</p>
                            </div>
                            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                                <option value="">-select-</option>
                                {
                                    currencies.map((currency) => (
                                        <option key={currency} value={currency}> {currency}</option>
                                    ))
                                }
                            </select>
                        </div>
                    }
                    {
                        newData && <CSVLink className='csv' {...newFileProperties} >Download</CSVLink>
                    }
                </div>
            </div >
            <Toast />
        </>
    )
}

export default CurrencyConverter
