
const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { populate } = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find()
  .populate('brand')
  .exec();
  res.json(products);
});

router.post('/add', authMiddleware, adminOnly, async (req, res) => {
  const { productName, cost, productImages, brandId, description, stockStatus } = req.body;
  const ownerId = req.user.userId;

  try {
    const newProduct = await Product.create({
      productName,
      ownerId,
      cost,
      brand: brandId,
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

router.get('/products/:brand/:page/:limit', async (req, res) => {
  console.log("Params:", req.params);
  const { brand, page, limit } = req.params;
  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'brand',
      sort: { createdAt: -1 }
    };
    const result = await Product.paginate({ brand }, options);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;
    const product = new Product({ name, description, price, brand });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/test', (req, res) => {
  const brand = 'some-id';
  const page = 1;
  const limit = 5;
  console.log('Brand:', brand, 'Page:', page, 'Limit:', limit);
  res.send('Check console');
});

module.exports = router;
