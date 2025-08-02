const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split('')[1];
    if (!token) return res.status(401).json({ message: 'Acess denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin allowed' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

router.post('/brands', isAdmin, async (req, res) => {
    try {
        const { brandName } = req.body;
        const brand = new Brand({ brandName });
        await brand.save();
        res.status(201).json(brand);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/brand/:id', isAdmin, async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(404).json({ error: 'Brand not found' });
        res.json(brand);
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
});

router.get('/brands', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/brands/:id', isAdmin, async (req, res) => {
    try {
        const result = await Brand.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Brand not found' });
        res.json({ message: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;