const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');
const { snakeToCamel } = require('../utils/helpers');

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    const { category, featured } = req.query;
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (featured) query = query.eq('featured', featured === 'true');

    const { data, error } = await query;
    if (error) throw error;
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, category, image, featured, available } = req.body;

    const { data, error } = await supabase.from('products').insert({
      name, description, price, category, image: image || '', featured: featured || false, available: available !== false
    }).select().single();

    if (error) throw error;
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, category, image, featured, available } = req.body;

    const { data, error } = await supabase.from('products').update({
      name, description, price, category, image, featured, available
    }).eq('id', req.params.id).select().single();

    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(snakeToCamel(data));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
