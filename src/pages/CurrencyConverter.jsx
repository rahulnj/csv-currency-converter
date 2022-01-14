import React from 'react'

import './CurrencyConverter.css'

import { CSVReader } from 'react-papaparse'



const CurrencyConverter = () => {

    const handleOnDrop = (data) => {
        console.log(data);
        Array.from(data)
            .filter((file) => file.type === "text/csv")
            .forEach((file) => {
                console.log(file);
            })
    }

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
        console.log(file);
        console.log(inputElem);
        console.log(reason);
    }

    const handleOnRemoveFile = (data) => {
        console.log(data);
    }





    return (
        <div className='main-container'>
            <h3>csv currency converter</h3>
            <div className="container-wrapper">
                <CSVReader
                    onDrop={handleOnDrop}
                    onError={handleOnError}
                    addRemoveButton
                    removeButtonColor='#659cef'
                    onRemoveFile={handleOnRemoveFile}
                >
                    <p>Click or Drop your csv file here</p>
                </CSVReader>
                <div className='select-wrapper'>
                    <h4>Convert to:</h4>
                    <select name="" id="">
                        <option value="">Choose One</option>
                        <option value="">helloo</option>
                        <option value="">helloo</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default CurrencyConverter
