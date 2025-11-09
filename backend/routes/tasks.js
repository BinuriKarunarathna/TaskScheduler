const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Create a new task
router.post('/tasks', (req, res) => {
  const { title, dueDate, priority = 'medium', description = '' } = req.body;
  const username = req.body.username || req.headers['x-username'];

  if (!username) return res.status(400).json({ error: 'Username required' });
  if (!title) return res.status(400).json({ error: 'Title required' });

  pool.query(
    'INSERT INTO tasks (username, title, priority, due_date, description) VALUES (?,?,?,?,?)',
    [username, title, priority, dueDate || null, description],
    (err, result) => {
      if (err) {
        console.error('MySQL Task Insert Error:', err);
        return res.status(500).json({ error: 'Failed to create task' });
      }
      res.status(201).json({ id: result.insertId, message: 'Task created' });
    }
  );
});

// List tasks (basic)
router.get('/tasks', (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'username query param required' });
  pool.query('SELECT id, title, priority, due_date, status, created_at FROM tasks WHERE username=? ORDER BY due_date IS NULL, due_date', [username], (err, rows) => {
    if (err) {
      console.error('MySQL Task Fetch Error:', err);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    res.json(rows);
  });
});

module.exports = router;