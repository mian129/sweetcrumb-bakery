const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/email');
const { snakeToCamel, camelToSnake } = require('../utils/helpers');

router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, postalCode, paymentMethod, transactionId, items, totalAmount, specialInstructions } = req.body;

    const dbData = {
      customer_name: customerName,
      email,
      phone,
      address,
      city,
      postal_code: postalCode || '',
      payment_method: paymentMethod || 'bank',
      transaction_id: transactionId || '',
      items: items || [],
      total_amount: totalAmount,
      special_instructions: specialInstructions || ''
    };

    const { data, error } = await supabase.from('orders').insert(dbData).select().single();
    if (error) throw error;

    sendOrderConfirmation(data).catch(err => console.log('Email skipped:', err.message));

    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.id).select().single();

    if (error || !data) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
