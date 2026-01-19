const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initiate payment
router.post('/initiate', authenticateToken, (req, res) => {
    const { amount, order_id } = req.body;

    if (!amount || !order_id) {
        return res.status(400).json({ message: 'Amount and order ID are required' });
    }

    // Mock payment initiation
    const paymentIntent = {
        id: 'pi_mock_' + Date.now(),
        amount: amount,
        order_id: order_id,
        status: 'pending'
    };

    res.json({ message: 'Payment initiated', paymentIntent });
});

// Confirm payment (mock)
router.post('/confirm', authenticateToken, async (req, res) => {
    const { payment_intent_id, order_id } = req.body;

    if (!payment_intent_id || !order_id) {
        return res.status(400).json({ message: 'Payment intent ID and order ID are required' });
    }

    try {
        // Update order status to paid
        const db = require('../db');
        await db.promise().query(
            'UPDATE orders SET status = ?, payment_intent_id = ? WHERE id = ? AND user_id = ?',
            ['paid', payment_intent_id, order_id, req.user.id]
        );

        res.json({ message: 'Payment confirmed', status: 'paid' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;