const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../db');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error } = await supabase.storage
      .from('gallery')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    res.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
