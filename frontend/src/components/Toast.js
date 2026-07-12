import React from 'react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { notification } = useCart();
  if (!notification) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
      background: '#222', color: '#fff', padding: '12px 24px', borderRadius: '50px',
      display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease',
      fontSize: '0.95rem', fontWeight: '500'
    }}>
      <span style={{ background: '#e91e8c', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</span>
      <span><b>{notification.name}</b> added to cart</span>
      <span style={{ color: '#e91e8c', fontWeight: '700' }}>Rs. {notification.price}</span>
    </div>
  );
};

export default Toast;
