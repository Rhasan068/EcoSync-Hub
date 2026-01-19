const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get seller by slug (username)
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [users] = await db.promise().query(
            'SELECT id, username, email, bio, avatar_url, eco_points FROM users WHERE username = ?',
            [slug]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Apply to become seller
router.post('/apply', authenticateToken, async (req, res) => {
    // Mock application - in real app, create application record or notification
    res.json({ message: 'Application submitted. Admin will review it soon.' });
});

module.exports = router;
