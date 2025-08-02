
const express = require('express');
const router = express.Router();
const User = require('./models/User');
const { authMiddleware, adminOnly } = require('./middleware/auth');

router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '_id username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
});

module.exports = mongoose.model('users', userSchema);
