
const express = require('express');
const Order = require('../models/Order.js');
const { verifyToken } = require('../middleware/verifyToken.js');
const { authorizeRoles } = require('../middleware/auth.js');

const router = express.Router();

/** Customer: Create order */
router.post("/order", verifyToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }
    // Optional: server-side sanitation of each item
    const sanitized = items.map(i => ({
      productName: i.productName,
      productId: i.productId,
      quantity: i.quantity,
      totalCost: i.totalCost,
      shippingStatus: i.shippingStatus ?? "pending"
    }));

    const order = await Order.create({
      customerId: req.user.id,
      items: sanitized
    });

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** Admin: View all orders */
router.get("/orders", verifyToken, authorizeRoles("admin"), async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** Admin: View single order */
router.get("/orders/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/** Admin: Update order status */
router.patch("/orders/:id/status", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use pending|shipped|delivered." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status, "items.$[].shippingStatus": status }, 
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;