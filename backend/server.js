const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Export io for use in routes
module.exports.io = io;

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/reviews');
const profileRoutes = require('./routes/profile');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const sellerRoutes = require('./routes/sellers');
const communityRoutes = require('./routes/community');
const challengeRoutes = require('./routes/challenges');
const carbonRoutes = require('./routes/carbon');
const notificationRoutes = require('./routes/notifications');
const friendRoutes = require('./routes/friends');
const wishlistRoutes = require('./routes/wishlist');
const addressRoutes = require('./routes/addresses');
const districtRoutes = require('./routes/districts');
const databaseRoutes = require('./routes/database');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/admin/database', databaseRoutes);
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Serve uploaded files statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'EcoSync Hub API' });
});

// Public stats
// Public stats
app.get('/api/stats', async (req, res) => {
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

// Public Top Users
app.get('/api/leaderboard/top', async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT id, username, avatar_url, carbon_saved_kg, role FROM users ORDER BY carbon_saved_kg DESC LIMIT 3');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.userId = decoded.id;
        next();
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join user's room for private messages
    socket.join(socket.userId);

    // Handle private messages
    socket.on('private_message', async (data) => {
        const { receiver_id, content } = data;
        try {
            // Save message to database
            const [result] = await db.promise().query(
                'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
                [socket.userId, receiver_id, content]
            );

            const message = {
                id: result.insertId,
                sender_id: socket.userId,
                receiver_id,
                content,
                is_read: false,
                created_at: new Date()
            };

            // Send to receiver's room
            socket.to(receiver_id).emit('new_message', message);

            // Send confirmation to sender
            socket.emit('message_sent', message);
        } catch (error) {
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    });

    // Handle message read
    socket.on('mark_read', async (data) => {
        const { message_id } = data;
        try {
            await db.promise().query(
                'UPDATE messages SET is_read = TRUE WHERE id = ? AND receiver_id = ?',
                [message_id, socket.userId]
            );
            socket.emit('message_read', { message_id });
        } catch (error) {
            socket.emit('message_error', { error: 'Failed to mark as read' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});