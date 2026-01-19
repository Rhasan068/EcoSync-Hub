const express = require('express');
const db = require('../db');
const { authenticateToken, isSeller } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.promise().query('SELECT * FROM products WHERE status = "approved"');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await db.promise().query('SELECT * FROM products WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create product (seller/admin only)
router.post('/', authenticateToken, isSeller, async (req, res) => {
    const { name, description, price, category_id, stock, image_url, eco_rating, co2_reduction_kg } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const [result] = await db.promise().query(
            'INSERT INTO products (name, description, price, category_id, stock, image_url, eco_rating, co2_reduction_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description || '', price, category_id || null, stock || 0, image_url || '', eco_rating || 5, co2_reduction_kg || 0.00]
        );
        res.status(201).json({ message: 'Product created', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product (seller/admin only)
router.put('/:id', authenticateToken, isSeller, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, stock, image_url, eco_rating, co2_reduction_kg } = req.body;

    try {
        const [result] = await db.promise().query(
            'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ?, image_url = ?, eco_rating = ?, co2_reduction_kg = ? WHERE id = ?',
            [name, description || '', price, category_id || null, stock || 0, image_url || '', eco_rating || 5, co2_reduction_kg || 0.00, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete product (seller/admin only)
router.delete('/:id', authenticateToken, isSeller, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.promise().query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
