import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

const Cart = () => {
  const { cart, removeFromCart, updateQty, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryFee, setDeliveryFee] = useState(50);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        if (res.data.deliveryCharges) setDeliveryFee(res.data.deliveryCharges);
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  if (totalItems === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        <h2 style={{ color: '#999', marginTop: '1rem' }}>Cart is empty</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Browse our menu and add some delicious treats!</p>
        <button onClick={() => navigate('/menu')} style={{ background: 'linear-gradient(135deg, #e91e8c, #880e4f)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '50px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#880e4f', marginBottom: '0.5rem' }}>Your Cart</h1>
      <p style={{ color: '#777', marginBottom: '2rem' }}>{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>

      {cart.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fff', borderRadius: '12px', marginBottom: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <img src={item.image || '/placeholder-cupcake.svg'} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', color: '#333', margin: 0 }}>{item.name}</h3>
            <p style={{ color: '#e91e8c', fontWeight: '600', margin: '0.25rem 0 0' }}>Rs. {item.price}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => updateQty(item.id, -1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>−</button>
            <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
            <button onClick={() => updateQty(item.id, 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>+</button>
          </div>
          <p style={{ fontWeight: '700', color: '#333', minWidth: '80px', textAlign: 'right' }}>Rs. {(item.price * item.qty).toLocaleString()}</p>
          <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#ccc' }}>✕</button>
        </div>
      ))}

      <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: '#777' }}>Subtotal</span>
          <span style={{ fontWeight: '600' }}>Rs. {totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ color: '#777' }}>Delivery</span>
          <span style={{ color: '#e91e8c', fontWeight: '600' }}>Rs. {deliveryFee}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700', color: '#880e4f' }}>
          <span>Total</span>
          <span>Rs. {(totalPrice + deliveryFee).toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={clearCart} style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '2px solid #e91e8c', background: '#fff', color: '#e91e8c', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>Clear Cart</button>
        <button onClick={() => navigate('/order')} style={{ flex: 2, padding: '14px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #e91e8c, #880e4f)', color: '#fff', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' }}>
          Place Order →
        </button>
      </div>
    </div>
  );
};

export default Cart;
