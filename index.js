const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http');

const spreadsheetId = process.env.SPREADSHEET_ID;
const apiKey = process.env.API_KEY;

app.get('/:sheet_name', (req, res) => {
  const sheetName = req.params.sheet_name;
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

  import('node-fetch')
    .then(fetch => fetch.default(apiUrl))
    .then(response => response.json())
    .then(data => {
      const rows = data.values.slice(1); // Exclude the header row
      const headers = data.values[0];
      const jsonData = rows.map(row => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index];
        });
        return item;
      });
      res.json(jsonData);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Keep alive 
const https = require('https');

// Retrieve the Heroku app name from the environment variables
const appName = process.env.HEROKU_APP_NAME;
const appUrl = `https://${appName}.herokuapp.com`;

setInterval(function() {
  https.get(appUrl);
  console.log("I'm Alive hehe");
}, 300000);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
