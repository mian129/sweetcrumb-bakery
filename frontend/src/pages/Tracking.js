import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const Tracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);
    
    try {
      const params = {};
      if (phone.trim()) params.phone = phone.trim();
      const res = await api.get(`/api/orders/track/${orderNumber.trim().toUpperCase()}`, { params });
      setOrder(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Order not found. Please check your order number and phone number.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#28a745',
      preparing: '#007bff',
      out_for_delivery: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#fff5f7' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: 'clamp(2rem, 5vw, 4rem) 5%', 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #fff5f7 0%, #fce4ec 100%)' 
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 3rem)', 
            fontFamily: "'Playfair Display', serif", 
            color: '#880e4f', 
            marginBottom: '1rem' 
          }}
        >
          Track Your Order
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          style={{ color: '#6d3a5a', fontSize: '1.1rem', marginBottom: '2rem' }}
        >
          Enter your order number to see live status
        </motion.p>

        {/* Search Box */}
        <motion.form 
          onSubmit={handleTrack}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          style={{ 
            maxWidth: '500px', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number (e.g. SC-A3F2B)"
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid #e91e8c',
              borderRadius: '50px',
              fontSize: '1.1rem',
              textAlign: 'center',
              fontWeight: '600',
              letterSpacing: '2px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Apna phone number daalein (verify ke liye)"
            style={{
              width: '100%',
              padding: '0.8rem 1.5rem',
              border: '2px solid #ddd',
              borderRadius: '50px',
              fontSize: '1rem',
              textAlign: 'center',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              background: loading ? '#ccc' : '#e91e8c',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </motion.button>
        </motion.form>
      </section>

      {/* Results Section */}
      <section style={{ padding: '2rem 5%', maxWidth: '800px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {/* Loading */}
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '3rem' }}
            >
              <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>⏳</div>
              <p style={{ color: '#666', marginTop: '1rem' }}>Finding your order...</p>
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                background: 'white', 
                borderRadius: '16px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)' 
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: '#880e4f', marginBottom: '0.5rem' }}>Order Not Found</h3>
              <p style={{ color: '#666' }}>{error}</p>
              <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1rem' }}>
                Order number format: <strong>SC-XXXXX</strong> (e.g. SC-A3F2B)
              </p>
            </motion.div>
          )}

          {/* Order Found */}
          {order && !loading && (
            <motion.div 
              key="order"
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
            >
              {/* Order Header */}
              <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '2rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Order Number</p>
                <h2 style={{ 
                  color: '#880e4f', 
                  fontSize: '2rem', 
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '3px',
                  margin: '0.5rem 0'
                }}>
                  {order.orderNumber}
                </h2>
                <p style={{ color: '#666' }}>Placed on {formatDate(order.createdAt)}</p>
              </div>

              {/* Status Timeline */}
              {order.isCancelled ? (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  padding: '2rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                  <h3 style={{ color: '#dc3545', fontSize: '1.5rem' }}>Order Cancelled</h3>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>Your order has been cancelled</p>
                </div>
              ) : (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  padding: '2rem', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)' 
                }}>
                  <h3 style={{ color: '#880e4f', marginBottom: '1.5rem', textAlign: 'center' }}>Order Status</h3>
                  
                  {/* Progress Bar */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    position: 'relative',
                    marginBottom: '2rem',
                    padding: '0 10px'
                  }}>
                    {/* Background Line */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '30px',
                      right: '30px',
                      height: '4px',
                      background: '#eee',
                      borderRadius: '2px',
                      zIndex: 0
                    }} />
                    {/* Progress Line */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '30px',
                      width: `${order.currentStatusIndex >= 0 ? (order.currentStatusIndex / (order.statusSteps.length - 1)) * (100 - 12) : 0}%`,
                      height: '4px',
                      background: 'linear-gradient(90deg, #e91e8c, #c2185b)',
                      borderRadius: '2px',
                      zIndex: 1,
                      transition: 'width 0.5s ease'
                    }} />

                    {order.statusSteps.map((step, index) => {
                      const isCompleted = index <= order.currentStatusIndex;
                      const isCurrent = index === order.currentStatusIndex;
                      
                      return (
                        <div key={step.key} style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 2,
                          flex: 1
                        }}>
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: isCompleted ? '#e91e8c' : '#eee',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              marginBottom: '0.5rem',
                              border: isCurrent ? '3px solid #c2185b' : 'none',
                              boxShadow: isCurrent ? '0 0 0 4px rgba(233,30,140,0.2)' : 'none'
                            }}
                          >
                            {step.icon}
                          </motion.div>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            color: isCompleted ? '#880e4f' : '#999',
                            fontWeight: isCompleted ? '600' : '400',
                            textAlign: 'center'
                          }}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Current Status Message */}
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: '#fff5f7',
                    borderRadius: '12px',
                    marginTop: '1rem'
                  }}>
                    <p style={{ color: '#880e4f', fontWeight: '600', fontSize: '1.1rem' }}>
                      {order.statusSteps[order.currentStatusIndex]?.icon} {' '}
                      {order.statusSteps[order.currentStatusIndex]?.label}
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                      {order.status === 'pending' && 'Waiting for confirmation...'}
                      {order.status === 'confirmed' && 'Your order has been confirmed!'}
                      {order.status === 'preparing' && 'We are preparing your delicious order...'}
                      {order.status === 'out_for_delivery' && 'Your order is on its way!'}
                      {order.status === 'delivered' && 'Enjoy your treats!'}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '2rem', 
                marginBottom: '1.5rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)' 
              }}>
                <h3 style={{ color: '#880e4f', marginBottom: '1rem' }}>Order Details</h3>
                
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '0.8rem 0',
                    borderBottom: idx < order.items.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    <span style={{ color: '#555' }}>{item.quantity}x {item.name}</span>
                    <span style={{ fontWeight: '600' }}>Rs. {(item.price || 0) * item.quantity}</span>
                  </div>
                ))}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '1rem 0 0',
                  marginTop: '0.5rem',
                  borderTop: '2px solid #eee',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  <span>Total</span>
                  <span style={{ color: '#e91e8c' }}>Rs. {order.totalAmount}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '2rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)' 
              }}>
                <h3 style={{ color: '#880e4f', marginBottom: '1rem' }}>Delivery Address</h3>
                <p style={{ color: '#555' }}>{order.address}</p>
                <p style={{ color: '#666' }}>{order.city}</p>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!searched && !loading && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                color: '#999'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <p style={{ fontSize: '1.1rem' }}>Enter your order number above to track</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                You received your order number in the confirmation email
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Tracking;
