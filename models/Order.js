
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  totalCost: { type: Number, required: true, min: 0 },
  shippingStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "Items array must contain at least one item."
    },
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
