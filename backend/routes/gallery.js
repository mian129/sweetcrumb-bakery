const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

// GET all gallery images (public)
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST add gallery image (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { src, title, category } = req.body;
    if (!src) return res.status(400).json({ message: 'Image URL required' });

    const { data: maxRow } = await supabase
      .from('gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxRow?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('gallery')
      .insert([{ src, title: title || '', category: category || 'other', sort_order: nextOrder }])
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE gallery image (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT reorder gallery images (admin only)
router.put('/reorder', auth, async (req, res) => {
  try {
    const { orders } = req.body; // [{ id, sort_order }]
    if (!orders || !Array.isArray(orders)) return res.status(400).json({ message: 'Invalid data' });

    for (const item of orders) {
      await supabase
        .from('gallery')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    }
    res.json({ message: 'Reordered' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
