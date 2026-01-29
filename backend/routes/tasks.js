const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Create a new task
router.post('/tasks', (req, res) => {
  const { title, dueDate, priority = 'medium', description = '' } = req.body;
  const username = req.body.username || req.headers['x-username'];

  if (!username) return res.status(400).json({ error: 'Username required' });
  if (!title) return res.status(400).json({ error: 'Title required' });

  // Basic validation for priority
  const allowedPriorities = ['low','medium','high'];
  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority (low|medium|high)' });
  }

  // Normalize dueDate (allow empty string -> null)
  const normalizedDueDate = dueDate ? dueDate : null;

  // Correct parameter order: (username, title, description, priority, due_date)
  pool.query(
    'INSERT INTO tasks (username, title, description, priority, due_date) VALUES (?,?,?,?,?)',
    [username, title, description, priority, normalizedDueDate],
    (err, result) => {
      if (err) {
        console.error('MySQL Task Insert Error:', err.code, err.message);
        // Specific MySQL error handling
        if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
          return res.status(400).json({ error: 'Invalid field value (priority or date format)' });
        }
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

// Get a single task
router.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'username query param required' });

  pool.query('SELECT * FROM tasks WHERE id=? AND username=?', [id, username], (err, rows) => {
    if (err) {
      console.error('MySQL Task Fetch Error:', err);
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  });
});

// Update a task
router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, dueDate, priority, description, status } = req.body;
  const username = req.body.username || req.headers['x-username'];

  if (!username) return res.status(400).json({ error: 'Username required' });

  const normalizedDueDate = dueDate ? dueDate : null;

  pool.query(
    'UPDATE tasks SET title=?, due_date=?, priority=?, description=?, status=? WHERE id=? AND username=?',
    [title, normalizedDueDate, priority, description, status, id, username],
    (err, result) => {
      if (err) {
        console.error('MySQL Task Update Error:', err);
        return res.status(500).json({ error: 'Failed to update task' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// Delete a task
router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const username = req.query.username || req.headers['x-username'];

  if (!username) return res.status(400).json({ error: 'Username required' });

  pool.query(
    'DELETE FROM tasks WHERE id=? AND username=?',
    [id, username],
    (err, result) => {
      if (err) {
        console.error('MySQL Task Delete Error:', err);
        return res.status(500).json({ error: 'Failed to delete task' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
      }
      res.json({ message: 'Task deleted successfully' });
    }
  );
});

module.exports = router;