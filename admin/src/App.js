import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Gallery from './pages/Gallery';
import Sessions from './pages/Sessions';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import NotificationBanner from './components/NotificationBanner';
import useNotifications from './hooks/useNotifications';
import api from './api';
import './App.css';

function generateSessionId() {
  let sid = localStorage.getItem('sc_session_id');
  if (!sid) {
    sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sc_session_id', sid);
  }
  return sid;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const { unreadCount, latestOrder, dismissNotification, clearUnread } = useNotifications();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const sid = generateSessionId();
    const registerSession = async () => {
      try {
        await api.post('/api/auth/sessions', { sessionId: sid });
      } catch (err) {
        console.log('Session register skipped:', err.message);
      }
    };
    registerSession();
    const interval = setInterval(registerSession, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    const sid = generateSessionId();
    api.post('/api/auth/sessions', { sessionId: sid }).catch(() => {});
  };

  const handleLogout = async () => {
    const sid = localStorage.getItem('sc_session_id');
    if (sid) {
      try { await api.delete(`/api/auth/sessions/${sid}`); } catch (e) {}
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sc_session_id');
    setIsAuthenticated(false);
    setUser(null);
    clearUnread();
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="admin-layout">
        <Sidebar user={user} onLogout={handleLogout} unreadCount={unreadCount} />
        <main className="admin-main">
          <NotificationBanner notification={latestOrder} onDismiss={dismissNotification} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <BottomNav unreadCount={unreadCount} />
      </div>
    </Router>
  );
}

export default App;
