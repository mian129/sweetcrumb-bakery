import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FloatingCart = () => {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  if (totalItems === 0) return null;

  return (
    <button onClick={() => navigate('/cart')} style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 9998,
      background: 'linear-gradient(135deg, #e91e8c, #880e4f)', color: '#fff',
      border: 'none', borderRadius: '60px', padding: '14px 24px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 4px 24px rgba(233,30,140,0.4)', fontSize: '1rem', fontWeight: '600',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 30px rgba(233,30,140,0.6)'; }}
    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 24px rgba(233,30,140,0.4)'; }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
      <span style={{ background: '#fff', color: '#e91e8c', borderRadius: '50%', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
        {totalItems}
      </span>
      <span>Rs. {totalPrice.toLocaleString()}</span>
      <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.8rem' }}>View Cart</span>
    </button>
  );
};

export default FloatingCart;
