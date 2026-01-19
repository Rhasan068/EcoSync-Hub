const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // we'll create db.js later

const router = express.Router();

// Register
// Register
router.post('/register', async (req, res) => {
    const { username, email, password, firstName, lastName, birthMonth, birthDay, birthYear, gender } = req.body;

    if (!username || !email || !password || !firstName || !lastName || !birthMonth || !birthDay || !birthYear || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existingUser] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create birth date string (YYYY-MM-DD)
        const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

        // Insert user
        const [result] = await db.promise().query(
            'INSERT INTO users (username, email, password, first_name, last_name, birth_date, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, firstName, lastName, birthDate, gender]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get users (with search)
router.get('/users', async (req, res) => {
    const { search } = req.query;
    try {
        let query = 'SELECT id, username, email, role, avatar_url, bio, eco_points FROM users';
        let params = [];
        if (search) {
            query += ' WHERE username LIKE ?';
            params.push(`%${search}%`);
        }
        const [users] = await db.promise().query(query, params);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.promise().query('SELECT id, username, avatar_url, bio, eco_points, carbon_saved_kg, trees_planted, role, created_at FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get public stats
router.get('/stats', async (req, res) => {
    try {
        const [userCount] = await db.promise().query('SELECT COUNT(*) as count FROM users');
        const [productCount] = await db.promise().query('SELECT COUNT(*) as count FROM products WHERE status = "approved"');
        const [orderCount] = await db.promise().query('SELECT COUNT(*) as count FROM orders');
        const [totalCO2] = await db.promise().query('SELECT SUM(carbon_saved_kg) as total FROM users');

        res.json({
            users: userCount[0].count,
            products: productCount[0].count,
            orders: orderCount[0].count,
            totalCO2Saved: totalCO2[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;