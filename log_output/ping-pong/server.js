const express = require('express');
const fs = require('fs');
const app = express();
// const LOG_FILE = '/logs/output.log'; //log output file
let counter = 0;
const PORT = process.env.PORT || 3000;


app.get('/pingpong', (req, res) => {
  counter++;
  const output = `ping / pongs ${counter}`;
  res.send(output);

  // // Append the output to file (@PV) 
  // fs.appendFile(LOG_FILE, output + '\n', (err) => {
  //   if (err) {
  //     console.error('Failed to write to log file:', err);
  //   }
  // });
});

// New endpoint to get current pong count without incrementing:
app.get('/pings', (req, res) => {
  const pong_output = `ping / pongs ${counter}`;
  res.send(pong_output);
});

app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});