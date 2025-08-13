
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, unique: true},
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
});

module.exports = mongoose.model('User', userSchema);
