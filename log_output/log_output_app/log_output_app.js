const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const PING_URL = process.env.PING_URL || 'http://localhost:3000/pings'; // URL to fetch ping message

const MESSAGE = process.env.MESSAGE || 'check MESSAGE: not set'; 
const FILE_PATH = '/vol/information.txt';  

// read the file
async function readConfigFile() {
  try {
    return await fs.readFile(FILE_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading config file:', error.message);
    return 'Error: Could not read information.txt';
  }
}


// Generate random UUID on startup
const randomId = uuidv4();

let latestMessage = '';

// log the timestamp and UUID
function logMessage() {
  const timestamp = new Date().toISOString();
  const message = `${timestamp}: ${randomId}.`;
  latestMessage = message;
  console.log(message);
  // return message;
}



setInterval(logMessage, 5000);

// root endpoint
app.get('/', async (req, res) => {
  try {
    const pingResponse = await fetch(PING_URL);
    const pingText = await pingResponse.text();
    const fileContent = await readConfigFile();
    const output = `
      File content: ${fileContent}<br>
      Environment variable: MESSAGE=${MESSAGE}<br>
      ${latestMessage}<br>
      ${pingText}
    `;
    res.send(output);
    // res.send(`${latestMessage} <br>${pingText}`); 

  } catch (error) {
    console.error('Failed to fetch from /pings:', error.message);
    res.send(`${latestMessage}\nPing Response: Failed (server not available)`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`logoutput app running on port:${PORT}`);
});
