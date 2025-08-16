
const express = require('express');
const router = express.Router();
const Order = require('../models/Order.js');
const { verifyToken, authorizeRoles } = require('../middleware/verifyToken.js');

/** Customer: Create order */
router.post("/order", verifyToken, authorizeRoles("customer"), async (req, res) => {
  try {
    let { items, productName, productId, quantity, price, shippingStatus } = req.body;
    if (!items) {
      if (!productId || !productName || !quantity) {
                return res.status(400).json({ 
                    message: "Either 'items' array or 'productId', 'productName', and 'quantity' are required" 
                });
            }
            
            items = [{
                productId,
                productName,
                quantity,
                price: price || 0,
                shippingStatus: shippingStatus || "pending"
            }];
        }
        
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items array is required" });
        }

        const order = await Order.create({
            customerId: req.user.id,
            items: sanitized,
            totalCost: req.body.totalCost || sanitized.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderStatus: req.body.orderStatus || "pending"
        });

        res.status(201).json({ message: "Order created", order });

    } catch (error) {
        console.error('Order creation error:', error);
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

    // Validate status
    if (!["pending", "shipped", "delivered"].includes(status)) {
        return res.status(400).json({ 
            message: "Invalid status. Use pending|shipped|delivered." 
        });
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { 
            orderStatus: status, 
            "items.$[].shippingStatus": status 
        },
        { new: true }
    );

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json({ 
        message: "Order status updated", 
        order 
    });

} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = router;