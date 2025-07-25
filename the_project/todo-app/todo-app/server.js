// server.js
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TODO_BACKEND_URL = process.env.TODO_BACKEND_URL || 'http://localhost:4000';


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


app.get('/', async (req, res) => {
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
        <meta charset="UTF-8" />
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
          .todo-section {
            margin-top: 40px;
            padding: 24px;
            background: #f8f8f8;
            border-radius: 8px;
            max-width: 600px;
          }
          .todo-input {
            width: 70%;
            padding: 8px;
            font-size: 1em;
            margin-right: 8px;
          }
          .todo-send {
            padding: 8px 16px;
            font-size: 1em;
          }
          .todo-list {
            margin-top: 24px;
            padding-left: 20px;
          }
          .todo-list li {
            margin-bottom: 8px;
          }
          .error {
            color: #b00;
            font-size: 0.95em;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>The project App</h1>
          <img src="/current-image" alt="Random Image" class="project-image" />
          <div class="caption">DevOps with Kubernetes 2025</div>
          <div class="todo-section">
            <h2>Todo List</h2>
            <form id="todo-form" autocomplete="off">
              <input 
                type="text" 
                id="todo-input" 
                class="todo-input" 
                maxlength="140" 
                placeholder="Add a new todo (max 140 chars)" 
                required
              />
              <button class="todo-send" id="todo-send" type="submit">Send</button>
              <div id="error-msg" class="error" style="display:none;"></div>
            </form>
            <ul class="todo-list" id="todo-list">
              <!-- Todos will be inserted here -->
            </ul>
          </div>
        </div>
        <script>
          const backendUrl = '${TODO_BACKEND_URL}'; // Adjust the URL if needed
          const input = document.getElementById('todo-input');
          const form = document.getElementById('todo-form');
          const errorMsg = document.getElementById('error-msg');
          const todoList = document.getElementById('todo-list');

          // Function to fetch todos and render them
          async function fetchTodos() {
            try {
              const res = await fetch(backendUrl + '/todos');
              if (!res.ok) throw new Error('Failed to fetch todos');
              const todos = await res.json();
              todoList.innerHTML = todos.map(todo => \`<li>\${todo}</li>\`).join('');
            } catch (error) {
              console.error('Error fetching todos:', error);
              todoList.innerHTML = '<li style="color:#b00;">Failed to load todos</li>';
            }
          }

          // Initial fetch of todos on page load
          fetchTodos();

          function showError(message) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
          }

          function clearError() {
            errorMsg.style.display = 'none';
          }

          form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const newTodo = input.value.trim();
            if (newTodo.length === 0) {
              showError('Todo cannot be empty.');
              return;
            }
            if (newTodo.length > 140) {
              showError('Todo cannot be more than 140 characters.');
              return;
            }
            clearError();

            try {
              const res = await fetch(backendUrl + '/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: newTodo })
              });
              if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                showError(body.error || 'Failed to add todo');
                return;
              }
              input.value = '';
              await fetchTodos();  // Refresh todo list
            } catch (error) {
              showError('Failed to add todo');
              console.error('Error posting todo:', error);
            }
          });

          input.addEventListener('input', function() {
            if (input.value.length > 140) {
              showError('Todo cannot be more than 140 characters.');
            } else {
              clearError();
            }
          });
        </script>
      </body>
    </html>
  `);
});


// app.get('/', async (req, res) => {
//   const now = Date.now();
//   if (!fs.existsSync(IMAGE_PATH) || (now - cachedAt > CACHE_DURATION && servedAfterExpiry)) {
//     await fetchAndSaveImage();
//   } else if (now - cachedAt > CACHE_DURATION && !servedAfterExpiry) {
//     servedAfterExpiry = true;
//   }

//   // Hardcoded todos
//   const hardcodedTodos = [
//     "Learn Kubernetes basics",
//     "Write deployment.yaml for project",
//     "Test Docker volume persistence"
//   ];

//   // Serve an HTML page with heading, image, and caption
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <title>The project App</title>
//         <style>
//           body {
//             font-family: sans-serif;
//             margin: 40px;
//           }
//           .container {
//             text-align: left;
//             max-width: 900px;
//           }
//           h1 {
//             font-size: 2.5em;
//             margin-bottom: 24px;
//             text-align: left;
//           }
//           .project-image {
//             display: block;
//             height: 75vh;
//             width: auto;
//             max-width: 100%;
//             margin-bottom: 16px;
//             object-fit: contain;
//           }
//           .caption {
//             font-size: 1.2em;
//             color: #555;
//             text-align: left;
//           }
//           .todo-section {
//             margin-top: 40px;
//             padding: 24px;
//             background: #f8f8f8;
//             border-radius: 8px;
//             max-width: 600px;
//           }
//           .todo-input {
//             width: 70%;
//             padding: 8px;
//             font-size: 1em;
//             margin-right: 8px;
//           }
//           .todo-send {
//             padding: 8px 16px;
//             font-size: 1em;
//           }
//           .todo-list {
//             margin-top: 24px;
//             padding-left: 20px;
//           }
//           .todo-list li {
//             margin-bottom: 8px;
//           }
//           .error {
//             color: #b00;
//             font-size: 0.95em;
//             margin-top: 8px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <h1>The project App</h1>
//           <img src="/current-image" alt="Random Image" class="project-image" />
//           <div class="caption">DevOps with Kubernetes 2025</div>
//           <div class="todo-section">
//             <h2>Todo List</h2>
//             <form id="todo-form" autocomplete="off" onsubmit="return false;">
//               <input 
//                 type="text" 
//                 id="todo-input" 
//                 class="todo-input" 
//                 maxlength="140" 
//                 placeholder="Add a new todo (max 140 chars)" 
//                 required
//               />
//               <button class="todo-send" id="todo-send" type="submit">Send</button>
//               <div id="error-msg" class="error" style="display:none;"></div>
//             </form>
//             <ul class="todo-list" id="todo-list">
//               ${hardcodedTodos.map(todo => `<li>${todo}</li>`).join('')}
//             </ul>
//           </div>
//         </div>
//         <script>
//           const input = document.getElementById('todo-input');
//           const form = document.getElementById('todo-form');
//           const errorMsg = document.getElementById('error-msg');

//           form.addEventListener('submit', function(e) {
//             e.preventDefault();
//             if (input.value.length > 140) {
//               errorMsg.textContent = "Todo cannot be more than 140 characters.";
//               errorMsg.style.display = "block";
//             } else {
//               errorMsg.style.display = "none";
//               // Not sending the todo yet
//               input.value = '';
//             }
//           });

//           input.addEventListener('input', function() {
//             if (input.value.length > 140) {
//               errorMsg.textContent = "Todo cannot be more than 140 characters.";
//               errorMsg.style.display = "block";
//             } else {
//               errorMsg.style.display = "none";
//             }
//           });
//         </script>
//       </body>
//     </html>
//   `);

// });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
