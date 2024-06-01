const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 9876;

const windowSize = 10;
const window = [];

const thirdPartyAPIs = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',
  r: 'http://20.244.56.144/test/rand',
};

const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjIzMTk0LCJpYXQiOjE3MTcyMjI4OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFkMGE4NjgzLWU1YWEtNGFmZC1iODJjLTVjYTg1ODJiMzEzYSIsInN1YiI6Inlhc2guMjEyNWNzZTExMjJAa2lldC5lZHUifSwiY29tcGFueU5hbWUiOiJBZmZvcmRNZWQiLCJjbGllbnRJRCI6ImFkMGE4NjgzLWU1YWEtNGFmZC1iODJjLTVjYTg1ODJiMzEzYSIsImNsaWVudFNlY3JldCI6ImhlbGVacVRZQ1JoTkpKcU4iLCJvd25lck5hbWUiOiJZYXNoIENoYXdsYSIsIm93bmVyRW1haWwiOiJ5YXNoLjIxMjVjc2UxMTIyQGtpZXQuZWR1Iiwicm9sbE5vIjoiMjEwMDI5MDEwMDE5NCJ9.Iur_GtPgc9kIckq1fRWlx5lYemApGwuhaT5a6wfxI5c";

app.get('/numbers/:numberid', async (req, res) => {
  const numberID = req.params.numberid;
  const apiUrl = thirdPartyAPIs[numberID];

  if (!apiUrl) {
    return res.status(400).send({ error: 'Invalid number ID' });
  }

  const prevWindowState = [...window];

  try {
    const config = {};
    if (numberID === 'p') {
      config.headers = { Authorization: `Bearer ${bearerToken}` };
    }
    
    const response = await axios.get(apiUrl, { ...config, timeout: 500 });
    const numbers = response.data.numbers;

    // Ensure uniqueness and manage window size
    const uniqueNumbers = _.uniq([...window, ...numbers]);
    while (uniqueNumbers.length > windowSize) {
      uniqueNumbers.shift();
    }

    window.length = 0; // Clear the window array
    window.push(...uniqueNumbers); // Add unique numbers back to window

    const avg = _.mean(window);

    const responsePayload = {
      windowPrevState: prevWindowState,
      windowCurrState: window,
      numbers,
      avg: parseFloat(avg.toFixed(2)),
    };

    res.json(responsePayload);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send({ error: 'Error fetching data from third-party API' });
  }
});

app.listen(port, () => {
  console.log(`Average Calculator microservice running on port ${port}`);
});
