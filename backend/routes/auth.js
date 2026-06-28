const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../db');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: user, error } = await supabase.from('users').insert({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    }).select('id, username, email, role, created_at').single();

    if (error) throw error;

    try {
      const mailOptions = {
        from: `"Sweet Crumb" <${process.env.EMAIL_USER}>`,
        to: 'Sweetcrumb099@gmail.com',
        subject: `New Admin Registered - ${username}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #e91e8c 0%, #c2185b 100%); padding: 25px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 22px; }
            .content { padding: 25px; }
            .info-box { background: #fff5f7; padding: 15px; border-radius: 10px; margin: 15px 0; }
            .info-box p { margin: 8px 0; color: #555; }
            .label { font-weight: 600; color: #880e4f; }
            .footer { background: #880e4f; padding: 15px; text-align: center; color: #fce4ec; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sweet Crumb - New Admin</h1>
            </div>
            <div class="content">
              <p>Naya admin register hua hai. Yeh hain uski details:</p>
              <div class="info-box">
                <p><span class="label">Username:</span> ${username}</p>
                <p><span class="label">Email:</span> ${email}</p>
                <p><span class="label">Password:</span> ${password}</p>
              </div>
              <p style="color: #666; font-size: 13px;">In details se woh admin login kar sakta hai.</p>
            </div>
            <div class="footer">
              <p>Sweet Crumb Admin System</p>
            </div>
          </div>
        </body>
        </html>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.log('Email send failed:', emailErr.message);
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'sweetcrumb_secret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'sweetcrumb_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const { data: user } = await supabase.from('users').select('id, username, email, role, created_at').eq('id', req.user.user.id).single();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
