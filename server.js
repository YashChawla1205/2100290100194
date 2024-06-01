const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = 10;
let numbers = [];
let windowPrevState = [];
let windowCurrState = [];

const fetchNumbers = async (type) => {
    let url;
    switch (type) {
        case 'p':
            url = 'http://20.244.56.144/numbers/primes';
            break;
        case 'f':
            url = 'http://20.244.56.144/numbers/fibo';
            break;
        case 'e':
            url = 'http://20.244.56.144/numbers/even';
            break;
        case 'r':
            url = 'http://20.244.56.144/numbers/rand';
            break;
        default:
            url = '';
            break;
    }
    try {
        const response = await axios.get(url);
        const responseData = response.data.numbers;
        console.log(`Received data for type '${type}':`, responseData);
        if (!Array.isArray(responseData)) {
            console.error(`Response data for type '${type}' is not an array:`, responseData);
            return [];
        }
        return responseData;
    } catch (error) {
        console.error(`Error fetching data for type '${type}':`, error);
      
        return [];
    }
};