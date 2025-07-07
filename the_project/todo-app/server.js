// server.js
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const IMAGE_DIR = path.join(__dirname, 'images');
const IMAGE_PATH = path.join(IMAGE_DIR, 'current.jpg');

let cachedAt = 0;
let servedAfterExpiry = false;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in ms

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function fetchAndSaveImage() {
  const response = await axios({
    url: 'https://picsum.photos/1200',
    responseType: 'stream'
  });
  const writer = fs.createWriteStream(IMAGE_PATH);
  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  cachedAt = Date.now();
  servedAfterExpiry = false;
}

app.get('/current-image', (req, res) => {
  res.sendFile(IMAGE_PATH);
});

app.get('/image', async (req, res) => {
  const now = Date.now();
  if (!fs.existsSync(IMAGE_PATH) || (now - cachedAt > CACHE_DURATION && servedAfterExpiry)) {
    await fetchAndSaveImage();
  } else if (now - cachedAt > CACHE_DURATION && !servedAfterExpiry) {
    servedAfterExpiry = true;
  }
  // Serve an HTML page with heading, image, and caption
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>The project App</title>
        <style>
          body {
            font-family: sans-serif;
            margin: 40px;
          }
          .container {
            text-align: left;
            max-width: 900px;
          }
          h1 {
            font-size: 2.5em;
            margin-bottom: 24px;
            text-align: left;
          }
          .project-image {
            display: block;
            height: 75vh;
            width: auto;
            max-width: 100%;
            margin-bottom: 16px;
            object-fit: contain;
          }
          .caption {
            font-size: 1.2em;
            color: #555;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>The project App</h1>
          <img src="/current-image" alt="Random Image" class="project-image" />
          <div class="caption">DevOps with Kubernetes 2025</div>
        </div>
      </body>
    </html>
  `);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
