const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('pg');

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'student_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

const query = (text, params) => client.query(text, params);

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, student_id, password } = req.body;
    
    if (!name || !student_id || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if student_id already exists
    const check = await query(
      'SELECT * FROM users WHERE student_id = $1',
      [student_id]
    );
    
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    await query(
      'INSERT INTO users (name, student_id, password_hash, role) VALUES ($1, $2, $3, $4)',
      [name, student_id, hashedPassword, 'student']
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { student_id, password } = req.body;
    
    if (!student_id || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await query('SELECT * FROM users WHERE student_id = $1', [student_id]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({
      id: user.rows[0].id,
      student_id: user.rows[0].student_id,
      name: user.rows[0].name,
      role: user.rows[0].role
    }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.rows[0].id,
        student_id: user.rows[0].student_id,
        name: user.rows[0].name,
        role: user.rows[0].role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user (protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: user.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
