import React, { useState, useEffect } from 'react';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaTrash, FaSignOutAlt, FaShieldAlt, FaExclamationTriangle, FaCopy } from 'react-icons/fa';
import api from '../api';

function getDeviceIcon(os, browser) {
  const ua = ((os || '') + ' ' + (browser || '')).toLowerCase();
  if (ua.includes('android') || ua.includes('iphone') || ua.includes('ios')) return <FaMobileAlt size={24} />;
  if (ua.includes('ipad') || ua.includes('tablet')) return <FaTabletAlt size={24} />;
  return <FaDesktop size={24} />;
}

function timeAgo(date) {
  if (!date) return 'N/A';
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 10) return 'Abhi abhi';
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ghante ago`;
  return `${Math.floor(diff / 86400)} din pehle`;
}

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const currentSessionId = localStorage.getItem('sc_session_id');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/auth/sessions');
        if (Array.isArray(res.data)) {
          setSessions(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.log('Sessions error:', err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const logoutSession = async (sessionId) => {
    try {
      await api.delete(`/api/auth/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s.session_id !== sessionId));
    } catch (err) {
      console.log('Logout session error:', err.message);
    }
  };

  const logoutAll = async () => {
    try {
      await api.delete(`/api/auth/sessions?currentSessionId=${currentSessionId}`);
      setSessions(prev => prev.filter(s => s.session_id === currentSessionId));
    } catch (err) {
      console.log('Logout all error:', err.message);
    }
  };

  const copySQL = () => {
    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  browser TEXT,
  os TEXT,
  device TEXT,
  ip TEXT,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_session_id ON sessions(session_id);`);
    alert('SQL copied!');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #e91e8c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p>Sessions load ho rahe hain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <FaShieldAlt /> Active Sessions
        </h1>
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaExclamationTriangle color="#856404" />
            <h3 style={{ color: '#856404', margin: 0 }}>Sessions Table Nahi Mili</h3>
          </div>
          <p style={{ color: '#856404', marginBottom: '1rem', lineHeight: 1.6 }}>
            Supabase mein <b>sessions</b> table create karna hai. Ye ek baar ka kaam hai.
          </p>
          <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', position: 'relative' }}>
            <pre style={{ color: '#4ade80', fontSize: '0.8rem', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  browser TEXT, os TEXT, device TEXT, ip TEXT,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON sessions FOR ALL USING (true);`}
            </pre>
            <button onClick={copySQL} style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 10px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaCopy /> Copy
            </button>
          </div>
          <ol style={{ color: '#856404', paddingLeft: '1.2rem', lineHeight: 2 }}>
            <li>Supabase Dashboard kholo → <b>pcztdmemhxngtmbumdgi</b></li>
            <li><b>SQL Editor</b> pe jao</li>
            <li>Upar ka SQL paste karo → <b>Run</b> dabao</li>
            <li>Fresh login karo → Sessions page refresh karo</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaShieldAlt /> Active Sessions
          </h1>
          <p style={{ color: '#666', marginTop: '0.3rem' }}>{sessions.length} active login{sessions.length !== 1 ? 's' : ''}</p>
        </div>
        {sessions.length > 1 && (
          <button onClick={logoutAll} style={{ padding: '0.6rem 1.2rem', background: '#ff4757', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaSignOutAlt /> Logout All Others
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <FaShieldAlt size={48} color="#ddd" />
          <p style={{ color: '#999', marginTop: '1rem' }}>Koi active session nahi</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {sessions.map((session) => {
            const isCurrent = session.session_id === currentSessionId;
            return (
              <div key={session.session_id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem',
                background: isCurrent ? '#f0f9ff' : 'white', borderRadius: '12px',
                border: isCurrent ? '2px solid #3b82f6' : '1px solid #eee',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: isCurrent ? '#dbeafe' : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isCurrent ? '#3b82f6' : '#999', flexShrink: 0
                }}>
                  {getDeviceIcon(session.os, session.browser)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '600', color: '#1a1a2e' }}>
                      {session.browser || 'Unknown'} on {session.os || 'Unknown'}
                    </span>
                    {isCurrent && (
                      <span style={{ background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                        YE DEVICE
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#999', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                    {session.ip && `IP: ${session.ip}`} {session.ip && '·'} {timeAgo(session.last_active || session.created_at)}
                  </p>
                </div>
                {!isCurrent && (
                  <button onClick={() => logoutSession(session.session_id)} style={{
                    padding: '0.5rem 1rem', background: 'none', color: '#ff4757', border: '1px solid #ff4757',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                    display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0
                  }}>
                    <FaTrash size={12} /> Logout
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sessions;
