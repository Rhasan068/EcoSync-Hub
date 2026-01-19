import React, { useState, useRef } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Seller = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        eco_rating: 5,
        co2_reduction_kg: 0
    });
    const { api } = useAuth();
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm(prev => ({ ...prev, image_url: res.data.url }));
        } catch (err) {
            console.error('Image upload failed', err);
            alert('Failed to upload image');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.image_url) {
            alert('Please upload a product image.');
            return;
        }
        try {
            await api.post('/products', form);
            alert('Product added!');
            setForm({
                name: '',
                description: '',
                price: '',
                stock: '',
                image_url: '',
                eco_rating: 5,
                co2_reduction_kg: 0
            });
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product');
        }
    };

    return (
        <Box className="page-container fade-in" sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>🌿 Seller Dashboard</Typography>
                <Button component={Link} to="/" variant="outlined" sx={{ borderRadius: '12px', fontWeight: 700 }}>Back to Hub</Button>
            </Box>
            <Card>
                <CardContent>
                    <Typography variant="h6">Add New Product</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Stock"
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Box sx={{ my: 2 }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => fileInputRef.current.click()}
                                    color={!form.image_url ? 'primary' : 'success'}
                                >
                                    {form.image_url ? 'Image Uploaded' : 'Upload Product Image *'}
                                </Button>
                                {form.image_url && (
                                    <Box
                                        component="img"
                                        src={getImageUrl(form.image_url)}
                                        sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                )}
                            </Box>
                        </Box>
                        <TextField
                            fullWidth
                            label="Eco Rating (1-5)"
                            name="eco_rating"
                            type="number"
                            value={form.eco_rating}
                            onChange={handleChange}
                            margin="normal"
                            inputProps={{ min: 1, max: 5 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="CO2 Reduction (kg)"
                            name="co2_reduction_kg"
                            type="number"
                            value={form.co2_reduction_kg}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Product</Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Seller;
