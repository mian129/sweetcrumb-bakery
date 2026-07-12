const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const supabase = require('./db');
const auth = require('./middleware/auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

// Inline sessions routes
function parseUA(ua) {
  if (!ua) return { browser: 'Unknown', os: 'Unknown' };
  let browser = 'Unknown';
  if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  return { browser, os };
}

app.post('/api/auth/sessions', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { sessionId } = req.body;
    const ua = req.headers['user-agent'] || '';
    const { browser, os } = parseUA(ua);
    const ip = req.headers['x-forwarded-for'] || 'Unknown';
    await supabase.from('sessions').upsert({
      session_id: sessionId, user_id: userId, browser, os,
      device: `${browser} on ${os}`, ip: String(ip).split(',')[0].trim(),
      last_active: new Date().toISOString(), created_at: new Date().toISOString()
    }, { onConflict: 'session_id' });
    res.json({ success: true });
  } catch (err) {
    console.error('Session save error:', err.message);
    res.json({ success: true });
  }
});

app.get('/api/auth/sessions', auth, async (req, res) => {
  try {
    const { data } = await supabase.from('sessions')
      .select('*').eq('user_id', req.user.user.id).order('last_active', { ascending: false });
    res.json(data || []);
  } catch (err) {
    res.json([]);
  }
});

app.put('/api/auth/sessions/:sessionId', auth, async (req, res) => {
  try {
    await supabase.from('sessions').update({ last_active: new Date().toISOString() }).eq('session_id', req.params.sessionId);
    res.json({ success: true });
  } catch (err) { res.json({ success: true }); }
});

app.delete('/api/auth/sessions/:sessionId', auth, async (req, res) => {
  try {
    await supabase.from('sessions').delete().eq('session_id', req.params.sessionId).eq('user_id', req.user.user.id);
    res.json({ success: true });
  } catch (err) { res.json({ success: true }); }
});

app.delete('/api/auth/sessions', auth, async (req, res) => {
  try {
    const currentSessionId = req.query.currentSessionId;
    let q = supabase.from('sessions').delete().eq('user_id', req.user.user.id);
    if (currentSessionId) q = q.neq('session_id', currentSessionId);
    await q;
    res.json({ success: true });
  } catch (err) { res.json({ success: true }); }
});

app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/gallery', require('./routes/gallery'));

app.get('/', (req, res) => res.json({ message: 'Sweet Crumb API Running' }));

module.exports = app;
