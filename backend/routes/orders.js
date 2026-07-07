const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');
const { sendOrderConfirmation, sendStatusUpdate } = require('../utils/email');
const { snakeToCamel, generateOrderNumber } = require('../utils/helpers');

// Public: Track order by order number + phone verification
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { phone } = req.query;
    const orderNumber = req.params.orderNumber.toUpperCase();

    let query = supabase
      .from('orders')
      .select('order_number, customer_name, phone, items, total_amount, status, status_history, created_at, address, city')
      .eq('order_number', orderNumber);

    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      query = query.or(`phone.eq.${cleanPhone},phone.eq.${phone}`);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (phone && data.phone !== phone.replace(/[^0-9]/g, '') && data.phone !== phone) {
      return res.status(404).json({ message: 'Order not found with this phone number' });
    }

    const statusSteps = [
      { key: 'pending', label: 'Order Placed', icon: '📋' },
      { key: 'confirmed', label: 'Confirmed', icon: '✅' },
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '🎉' }
    ];

    const currentStatusIndex = statusSteps.findIndex(s => s.key === data.status);
    const isCancelled = data.status === 'cancelled';

    res.json(snakeToCamel({
      ...data,
      statusSteps,
      currentStatusIndex,
      isCancelled
    }));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const { since } = req.query;
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    if (since) {
      query = query.gt('created_at', since);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Get stats
router.get('/stats', auth, async (req, res) => {
  try {
    const { data: allOrders, error } = await supabase.from('orders').select('id, status, total_amount');
    if (error) throw error;
    
    const pending = allOrders.filter(o => o.status === 'pending').length;
    const total = allOrders.length;
    const revenue = allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    
    res.json({ total, pending, revenue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Public: Place order
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, postalCode, paymentMethod, transactionId, items, totalAmount, specialInstructions } = req.body;

    const orderNumber = generateOrderNumber();

    const dbData = {
      order_number: orderNumber,
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
      special_instructions: specialInstructions || '',
      status: 'pending',
      status_history: [{ status: 'pending', timestamp: new Date().toISOString() }]
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

// Admin: Update order status + send email + track history
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    // Get current order
    const { data: currentOrder } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
    if (!currentOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Build status history
    let statusHistory = currentOrder.status_history || [];
    if (!Array.isArray(statusHistory)) statusHistory = [];
    statusHistory = [...statusHistory, { status, timestamp: new Date().toISOString() }];

    // Update status + history
    const { data, error } = await supabase
      .from('orders')
      .update({ status, status_history: statusHistory })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send status update email
    sendStatusUpdate(data, status).catch(err => console.log('Status email skipped:', err.message));

    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
