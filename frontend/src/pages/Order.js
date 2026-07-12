import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

const Order = () => {
  const { cart, totalPrice: subtotal, clearCart, totalItems } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ deliveryCharges: 50, bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '', bankInstructions: '', bankAccounts: [] });
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', postalCode: '',
    paymentMethod: 'bank', specialInstructions: '', transactionId: ''
  });

  const deliveryFee = settings.deliveryCharges || 50;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        setSettings(res.data);
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        email: formData.email || '',
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        items: cart.map(item => ({ product: item.id, name: item.name, price: item.price, quantity: item.qty })),
        totalAmount: total,
        specialInstructions: formData.specialInstructions
      };
      const res = await api.post('/api/orders', orderData);
      setOrderNumber(res.data.orderNumber || '');
      setOrderPlaced(true);
      clearCart();
      setStep(1);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (totalItems === 0 && !orderPlaced) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        <h2 style={{ color: '#999', marginTop: '1rem' }}>Cart is empty</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Pehle menu se items add karein!</p>
        <button onClick={() => navigate('/menu')} style={{ background: 'linear-gradient(135deg, #e91e8c, #880e4f)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '50px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>Browse Menu</button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }} style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✓</motion.div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem' }}>Order Placed!</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.7 }}>Shukriya! Aapka order successfully receive ho gaya hai.</p>
          {orderNumber && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '2px solid #e91e8c' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Aapka Order Number:</p>
              <p style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", color: '#e91e8c', fontWeight: '700', marginBottom: '0.5rem' }}>{orderNumber}</p>
              <p style={{ color: '#999', fontSize: '0.8rem' }}>Is number se aap apna order track kar sakte hain</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/track" style={{ padding: '1rem 2rem', background: '#e91e8c', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '600' }}>Track Order</Link>
            <Link to="/" onClick={() => setOrderPlaced(false)} style={{ padding: '1rem 2rem', background: 'white', color: '#e91e8c', border: '2px solid #e91e8c', textDecoration: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '600' }}>Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7' }}>
      <section style={{ padding: '3rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '0.5rem', textAlign: 'center' }}>
          Checkout
        </motion.h1>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '2rem' }}>{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '2', minWidth: '300px' }}>
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1.5rem' }}>Delivery Information</h2>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Aapka pura naam"
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XXXXXXXXX"
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com"
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
                  <p style={{ fontSize: '0.75rem', color: '#e91e8c', marginTop: '0.3rem' }}>Email dein taake order confirmation mile!</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Delivery Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Ghar ka pura address (Street, Area, Landmark)"
                    rows="2" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Faisalabad"
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Postal Code</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="54000"
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Transaction ID *</label>
                <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} placeholder="Bank transfer ki transaction ID"
                  style={{ width: '100%', padding: '0.8rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} required />
                <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.3rem' }}>Bank transfer karne ke baad jo transaction ID milti hai woh daalein</p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Special Instructions (Optional)</label>
                <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Koi special instructions..."
                  rows="2" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1', minWidth: '280px', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '120px' }}>
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '2px solid #eee' }}>Order Summary</h2>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ color: '#666' }}>{item.name} x{item.qty}</span>
                <span style={{ fontWeight: '600' }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#666' }}>
                <span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#666' }}>
                <span>Delivery</span><span style={{ color: '#e91e8c' }}>Rs. {deliveryFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderTop: '2px solid #eee', fontSize: '1.2rem', fontWeight: '700' }}>
                <span>Total</span><span style={{ color: '#e91e8c' }}>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {settings.bankAccounts && settings.bankAccounts.length > 0 ? (
              <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '10px', marginTop: '0.8rem', border: '1px solid #e9ecef' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#880e4f', marginBottom: '0.5rem' }}>Bank Transfer Details:</p>
                {settings.bankAccounts.map((acc, i) => (
                  <div key={i} style={{ padding: '0.6rem', background: 'white', borderRadius: '8px', marginBottom: i < settings.bankAccounts.length - 1 ? '0.5rem' : 0, border: '1px solid #eee' }}>
                    {acc.bankName && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.15rem 0' }}>Bank: <strong>{acc.bankName}</strong></p>}
                    {acc.accountTitle && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.15rem 0' }}>Title: <strong>{acc.accountTitle}</strong></p>}
                    {acc.accountNumber && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.15rem 0' }}>A/C: <strong>{acc.accountNumber}</strong></p>}
                    {acc.iban && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.15rem 0' }}>IBAN: <strong>{acc.iban}</strong></p>}
                    {acc.branchCode && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.15rem 0' }}>Branch: <strong>{acc.branchCode}</strong></p>}
                  </div>
                ))}
                {settings.bankInstructions && <p style={{ fontSize: '0.75rem', color: '#e91e8c', marginTop: '0.5rem', fontStyle: 'italic' }}>{settings.bankInstructions}</p>}
              </div>
            ) : settings.bankName && (
              <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '10px', marginTop: '0.8rem', border: '1px solid #e9ecef' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#880e4f', marginBottom: '0.5rem' }}>Bank Details:</p>
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>Bank: <strong>{settings.bankName}</strong></p>
                {settings.accountNumber && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>A/C: <strong>{settings.accountNumber}</strong></p>}
              </div>
            )}

            <button onClick={placeOrder} disabled={loading} style={{ width: '100%', padding: '0.9rem', background: loading ? '#ccc' : 'linear-gradient(135deg, #e91e8c, #880e4f)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.5rem' }}>
              {loading ? 'Placing Order...' : 'Place Order →'}
            </button>
            <button onClick={() => navigate('/cart')} style={{ width: '100%', padding: '0.7rem', background: 'white', color: '#e91e8c', border: '2px solid #e91e8c', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}>← Edit Cart</button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Order;
