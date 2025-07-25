const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  user: 'pingpong',
  host: 'postgres.default.svc.cluster.local',
  database: 'pingpong',
  password: 'pingpong',
  port: 5432,
});

// Ensure table exists (for local dev, in prod use migrations)
pool.query(`
  CREATE TABLE IF NOT EXISTS counts (
    id SERIAL PRIMARY KEY,
    counter INTEGER NOT NULL
  );
  INSERT INTO counts (counter) SELECT 0 WHERE NOT EXISTS (SELECT * FROM counts);
`).catch(console.error);

app.get('/pingpong', async (req, res) => {
  try {
    await pool.query('UPDATE counts SET counter = counter + 1 WHERE id = 1');
    const result = await pool.query('SELECT counter FROM counts WHERE id = 1');
    res.send(`pings: ${result.rows[0].counter}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/pings', async (req, res) => {
  try {
    const result = await pool.query('SELECT counter FROM counts WHERE id = 1');
    res.send(`pings: ${result.rows[0].counter}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pingpong app listening on port ${PORT}`);
});
