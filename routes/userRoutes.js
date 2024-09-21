const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});



module.exports = router;
