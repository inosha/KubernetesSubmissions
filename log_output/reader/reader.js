const express = require('express');
const fs = require('fs');
const app = express();
const path = '/logs/output.log';

app.get('/', (req, res) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Log file not found or unreadable.');
    res.type('text/plain').send(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reader app listening on port ${PORT}`);
});
