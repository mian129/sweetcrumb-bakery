const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/gallery', require('./routes/gallery'));

app.get('/', (req, res) => res.json({ message: 'Sweet Crumb API Running' }));

app.get('/api/test-email', async (req, res) => {
  const { sendOrderConfirmation } = require('./utils/email');
  const testOrder = {
    order_number: 'SC-TEST1',
    customer_name: 'Test Customer',
    email: req.query.email || 'test@example.com',
    phone: '03001234567',
    address: 'Test Address',
    city: 'Faisalabad',
    items: [{ name: 'Test Cookie', price: 200, quantity: 2 }],
    total_amount: 400,
    created_at: new Date().toISOString()
  };
  try {
    const result = await sendOrderConfirmation(testOrder);
    res.json({ success: result, message: result ? 'Email sent!' : 'Email failed - check logs' });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = app;
