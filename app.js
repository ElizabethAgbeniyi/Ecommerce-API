require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./users');
const brandRoutes = require('./routes/brand');
const orderRoutes = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

console.log('Mongo URI:', MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
  });

app.use('/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/users', userRoutes);
app.use('/api', brandRoutes);
app.use('/api', order);
