const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../middleware/auth');

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

router.post('/sessions', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { sessionId, device } = req.body;
    const ua = req.headers['user-agent'] || '';
    const { browser, os } = parseUA(ua);
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown';

    await supabase.from('sessions').upsert({
      session_id: sessionId,
      user_id: userId,
      browser,
      os,
      device: device || `${browser} on ${os}`,
      ip: ip.split(',')[0].trim(),
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString()
    }, { onConflict: 'session_id' });

    res.json({ success: true });
  } catch (err) {
    console.error('Session save error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/sessions', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { data, error } = await supabase.from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_active', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Sessions fetch error:', err.message);
    res.json([]);
  }
});

router.put('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    await supabase.from('sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('session_id', sessionId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { sessionId } = req.params;
    await supabase.from('sessions')
      .delete()
      .eq('session_id', sessionId)
      .eq('user_id', userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/sessions', auth, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const currentSessionId = req.query.currentSessionId;
    if (currentSessionId) {
      await supabase.from('sessions')
        .delete()
        .eq('user_id', userId)
        .neq('session_id', currentSessionId);
    } else {
      await supabase.from('sessions')
        .delete()
        .eq('user_id', userId);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
