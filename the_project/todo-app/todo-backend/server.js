const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Logging middleware: logs every incoming request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`, req.body);
  next();
});

// DB connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Initialize DB table
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        todo TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
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
    console.error('GET /todos error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /todos — Add a new todo (max 140 characters)
app.post('/todos', async (req, res) => {
  const { todo } = req.body;

  if (!todo || typeof todo !== 'string') {
    console.log('Rejected: todo missing or not a string');
    return res.status(400).json({ error: '"todo" must be a non-empty string' });
  }

  if (todo.length > 140) {
    console.log(`Rejected: todo too long (${todo.length} chars)`);
    return res.status(400).json({ error: '"todo" must be 140 characters or less' });
  }

  try {
    await pool.query('INSERT INTO todos (todo) VALUES ($1)', [todo]);
    console.log(`Added: ${todo}`);
    res.status(201).json({ todo });
  } catch (err) {
    console.error('POST /todos error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Todo-backend listening on port ${PORT}`);
});
