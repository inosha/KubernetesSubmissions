const http = require('http');

const PORT = process.env.PORT || 3000;

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Todo App is Running!</h1>
    <p>Server is listening on port ${PORT}</p>
    <ul>
      <li>Endpoint: <code>/</code></li>
      <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
    </ul>
  </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(HTML_CONTENT);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
