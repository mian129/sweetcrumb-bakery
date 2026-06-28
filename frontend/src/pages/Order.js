import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [settings, setSettings] = useState({ deliveryCharges: 50, bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '', bankInstructions: '' });
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', postalCode: '',
    paymentMethod: 'bank', specialInstructions: '', transactionId: ''
  });
  const placeholderImg = 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products');
        setMenuItems(res.data.map(p => ({ _id: p.id, name: p.name, price: p.price, image: p.image })));
      } catch (err) {
        console.log('Could not fetch products');
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        setSettings(res.data);
      } catch (err) {
        console.log('Could not fetch settings');
      }
    };
    fetchProducts();
    fetchSettings();
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id));

  const updateQty = (id, delta) => {
    setCart(cart.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = settings.deliveryCharges || 50;
  const total = subtotal + deliveryFee;

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
        email: formData.email || 'N/A',
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
      await api.post('/api/orders', orderData);
      setOrderPlaced(true);
      setCart([]);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }} style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✓</motion.div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem' }}>Order Placed!</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>Shukriya! Aapka order successfully receive ho gaya hai. Hum jaldi se jaldi banayenge.</p>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            <p style={{ color: '#2c1810', fontWeight: '600', marginBottom: '0.5rem' }}>📧 Confirmation Email</p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Agar aapne email diya hai toh aapko order confirmation email mil jayega.</p>
          </div>
          <Link to="/" onClick={() => setOrderPlaced(false)} style={{ padding: '1rem 2.5rem', background: '#e91e8c', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '600' }}>Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fff5f7' }}>
      <section style={{ padding: '4rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, #fff5f7 0%, #fce4ec 100%)' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '0.5rem' }}>
          {step === 1 ? 'Select Your Items' : 'Checkout'}
        </motion.h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? '#e91e8c' : '#ccc' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 1 ? '#e91e8c' : '#ccc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>1</span>
            <span style={{ fontWeight: '600' }}>Cart</span>
          </div>
          <div style={{ width: '60px', height: '2px', background: step >= 2 ? '#e91e8c' : '#ccc', alignSelf: 'center' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? '#e91e8c' : '#ccc' }}>
            <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 2 ? '#e91e8c' : '#ccc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>2</span>
            <span style={{ fontWeight: '600' }}>Details</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
        {step === 1 ? (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '2', minWidth: '320px' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1.5rem' }}>Select Items</h2>
              {menuItems.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.2rem' }}>
                  {menuItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -5 }} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
                      <div style={{ height: '150px', overflow: 'hidden', background: '#fff5f7' }}>
                        <img src={imgErrors[item.id] || !item.image ? placeholderImg : item.image} alt={item.name}
                          onError={() => setImgErrors(prev => ({ ...prev, [item.id]: true }))}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '0.3rem' }}>{item.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#e91e8c' }}>Rs. {item.price}</span>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)}
                            style={{ padding: '0.4rem 1rem', background: '#e91e8c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>+ Add</motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No products available</div>
              )}
            </div>

            <div style={{ flex: '1', minWidth: '300px', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '120px' }}>
              <h2 style={{ fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '2px solid #eee' }}>Your Cart ({cart.length})</h2>
              <AnimatePresence>
                {cart.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center', padding: '1.5rem 0' }}>Your cart is empty</p>
                ) : cart.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ display: 'flex', gap: '0.8rem', padding: '0.8rem 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                    <img src={imgErrors[item.id] || !item.image ? placeholderImg : item.image} alt={item.name}
                      onError={() => setImgErrors(prev => ({ ...prev, [item.id]: true }))}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#880e4f' }}>{item.name}</h4>
                      <p style={{ color: '#e91e8c', fontWeight: '600', fontSize: '0.9rem' }}>Rs. {item.price * item.qty}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ width: '24px', height: '24px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>-</button>
                      <span style={{ width: '20px', textAlign: 'center', fontWeight: '600', fontSize: '0.85rem' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ width: '24px', height: '24px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {cart.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                    <span>Subtotal</span><span>Rs. {subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#666' }}>
                    <span>Delivery Fee</span><span>Rs. {deliveryFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderTop: '2px solid #eee', fontSize: '1.1rem', fontWeight: '700' }}>
                    <span>Total</span><span style={{ color: '#e91e8c' }}>Rs. {total}</span>
                  </div>
                  <button onClick={() => setStep(2)} style={{ width: '100%', padding: '0.9rem', background: '#e91e8c', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}>
                    Proceed to Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '2', minWidth: '320px' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1.5rem' }}>Delivery Information</h2>
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Aapka pura naam"
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XXXXXXXXX"
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Email (Optional)</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com"
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Delivery Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Ghar ka pura address (Street, Area, Landmark)"
                      rows="2" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Shehar"
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="54000"
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Payment Method *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { value: 'bank', label: 'Bank Transfer', desc: 'Bank se transfer karein' }
                    ].map((method) => (
                      <label key={method.value} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', border: `2px solid ${formData.paymentMethod === method.value ? '#e91e8c' : '#eee'}`, borderRadius: '12px', cursor: 'pointer', background: formData.paymentMethod === method.value ? '#fff5f7' : 'white', transition: 'all 0.3s' }}>
                        <input type="radio" name="paymentMethod" value={method.value} checked={formData.paymentMethod === method.value} onChange={handleChange} style={{ accentColor: '#e91e8c' }} />
                        <div>
                          <p style={{ fontWeight: '600', color: '#880e4f', margin: 0 }}>{method.label}</p>
                          <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Transaction ID *</label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} placeholder="Bank transfer ki transaction ID daalein"
                    style={{ width: '100%', padding: '0.8rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} required />
                  <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.3rem' }}>Bank transfer karne ke baad jo transaction ID milti hai woh daalein</p>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#555', fontSize: '0.9rem' }}>Special Instructions (Optional)</label>
                  <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Koi special instructions... e.g. 2 baje se pehle chahiye"
                    rows="2" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1', minWidth: '300px', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '120px' }}>
              <h2 style={{ fontSize: '1.3rem', fontFamily: "'Playfair Display', serif", color: '#880e4f', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '2px solid #eee' }}>Order Summary</h2>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ color: '#666' }}>{item.name} x {item.qty}</span>
                  <span style={{ fontWeight: '600' }}>Rs. {item.price * item.qty}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#666' }}>
                  <span>Subtotal</span><span>Rs. {subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#666' }}>
                  <span>Delivery</span><span>Rs. {deliveryFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderTop: '2px solid #eee', fontSize: '1.2rem', fontWeight: '700' }}>
                  <span>Total</span><span style={{ color: '#e91e8c' }}>Rs. {total}</span>
                </div>
              </div>

              <div style={{ padding: '0.8rem', background: '#fff5f7', borderRadius: '10px', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💳 Payment: <strong style={{ color: '#880e4f' }}>Bank Transfer</strong>
                </p>
              </div>

              {settings.bankName && (
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '10px', marginTop: '0.8rem', border: '1px solid #e9ecef' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#880e4f', marginBottom: '0.5rem' }}>🏦 Bank Details:</p>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>Bank: <strong>{settings.bankName}</strong></p>
                  {settings.accountTitle && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>Title: <strong>{settings.accountTitle}</strong></p>}
                  {settings.accountNumber && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>A/C: <strong>{settings.accountNumber}</strong></p>}
                  {settings.iban && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>IBAN: <strong>{settings.iban}</strong></p>}
                  {settings.branchCode && <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0' }}>Branch: <strong>{settings.branchCode}</strong></p>}
                  {settings.bankInstructions && <p style={{ fontSize: '0.75rem', color: '#e91e8c', marginTop: '0.5rem', fontStyle: 'italic' }}>{settings.bankInstructions}</p>}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button onClick={() => setStep(1)} style={{ flex: '1', padding: '0.9rem', background: 'white', color: '#e91e8c', border: '2px solid #e91e8c', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>← Back</button>
                <button onClick={placeOrder} disabled={loading} style={{ flex: '2', padding: '0.9rem', background: loading ? '#ccc' : '#e91e8c', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Placing Order...' : 'Place Order →'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Order;
