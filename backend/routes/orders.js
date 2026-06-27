const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/email');

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create order (anyone can place)
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, postalCode, paymentMethod, items, totalAmount, specialInstructions } = req.body;

    const order = new Order({
      customerName,
      email,
      phone,
      address,
      city,
      postalCode,
      paymentMethod,
      items,
      totalAmount,
      specialInstructions
    });

    await order.save();

    // Send confirmation email (async, don't block response)
    sendOrderConfirmation(order).catch(err => console.log('Email skipped:', err.message));

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update order status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
