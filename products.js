
const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { productName, cost, productImages, description, stockStatus } = req.body;
  const ownerId = req.user.userId;

  try {
    const newProduct = await Product.create({
      productName,
      ownerId,
      cost,
      productImages,
      description,
      stockStatus
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: "Error adding product" });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting product" });
  }
});

module.exports = router;
