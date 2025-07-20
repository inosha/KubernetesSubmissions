// todo-backend
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());  

let todos = [];

// GET /todos — Return the current todo list as an array of strings
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos — Add a new todo (expects { "todo": "text" } in body)
app.post('/todos', (req, res) => {
  const { todo } = req.body;
  if (!todo || typeof todo !== 'string') {
    return res.status(400).json({ error: '"todo" must be a non-empty string' });
  }
  todos.push(todo);
  res.status(201).json({ todo });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Todo-backend listening on port ${PORT}`);
});