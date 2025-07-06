const fs = require('fs');
const path = '/logs/output.log';

const randomString = Math.random().toString(36).substring(2, 10);

function writeLog() {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} - ${randomString}\n`;
  fs.appendFileSync(path, line);
  console.log('Wrote:', line.trim());
}

setInterval(writeLog, 5000);
writeLog(); // Write once at startup

// Keep the process alive
setInterval(() => {}, 1000);
