import React, { useState, useEffect } from 'react';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaTrash, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import api from '../api';

function getDeviceIcon(os, browser) {
  const ua = ((os || '') + ' ' + (browser || '')).toLowerCase();
  if (ua.includes('android') || ua.includes('iphone') || ua.includes('ios')) return <FaMobileAlt size={24} />;
  if (ua.includes('ipad') || ua.includes('tablet')) return <FaTabletAlt size={24} />;
  return <FaDesktop size={24} />;
}

function timeAgo(date) {
  if (!date) return 'N/A';
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 10) return 'Abhi abhi';
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ghante ago`;
  return `${Math.floor(diff / 86400)} din pehle`;
}

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentSessionId = localStorage.getItem('sc_session_id');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/auth/sessions');
        setSessions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log('Sessions error:', err.message);
        setSessions([]);
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
    } catch (err) {}
  };

  const logoutAll = async () => {
    try {
      await api.delete(`/api/auth/sessions?currentSessionId=${currentSessionId}`);
      setSessions(prev => prev.filter(s => s.session_id === currentSessionId));
    } catch (err) {}
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #e91e8c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p>Loading sessions...</p>
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
          <p style={{ color: '#999', marginTop: '1rem' }}>Abhi koi session record nahi hua</p>
          <p style={{ color: '#bbb', fontSize: '0.85rem' }}>Session table exists karta hai. Login karne pe sessions yahan dikhenge.</p>
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
                      <span style={{ background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '600' }}>
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
