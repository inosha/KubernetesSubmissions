const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// DB connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Initialize DB table if not exists
(async () => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, todo TEXT NOT NULL)');
  } catch (err) {
    console.error('Failed to initialize DB:', err);
  }
})();

// GET /todos — Get all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT todo FROM todos');
    const todos = result.rows.map(row => row.todo);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /todos — Add a new todo
app.post('/todos', async (req, res) => {
  const { todo } = req.body;
  if (!todo || typeof todo !== 'string') {
    return res.status(400).json({ error: '"todo" must be a non-empty string' });
  }
  try {
    await pool.query('INSERT INTO todos (todo) VALUES ($1)', [todo]);
    res.status(201).json({ todo });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Todo-backend listening on port ${PORT}`);
});
