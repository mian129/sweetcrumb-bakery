import React, { useState, useEffect } from 'react';
import api from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    return allStatuses.filter(s => s !== currentStatus);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fff3cd',
      confirmed: '#d4edda',
      preparing: '#cce5ff',
      out_for_delivery: '#d1ecf1',
      delivered: '#d4edda',
      cancelled: '#f8d7da'
    };
    return colors[status] || '#f5f5f5';
  };

  const getPaymentLabel = (method) => {
    const labels = { bank: 'Bank Transfer' };
    return labels[method] || method;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <p style={{ color: '#666' }}>{orders.length} total orders</p>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td>
                  <strong>{order.customerName}</strong>
                  <br />
                  <small style={{ color: '#666' }}>{order.phone}</small>
                </td>
                <td>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem' }}>
                      {item.quantity}x {item.name || item.product?.name || 'Product'}
                    </div>
                  ))}
                </td>
                <td><strong>Rs. {order.totalAmount}</strong></td>
                <td>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                    {getPaymentLabel(order.paymentMethod)}
                  </span>
                  {order.transactionId && (
                    <div style={{ fontSize: '0.7rem', color: '#999', fontFamily: 'monospace', marginTop: '2px' }}>
                      TX: {order.transactionId}
                    </div>
                  )}
                </td>
                <td>
                  <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', background: getStatusColor(order.status), textTransform: 'capitalize' }}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.8rem' }}
                  >
                    <option value="">Update Status</option>
                    {getStatusOptions(order.status).map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            Abhi tak koi order nahi aaya
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Customer</h4>
                <p style={{ fontWeight: '600', color: '#2c1810' }}>{selectedOrder.customerName}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{selectedOrder.phone}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{selectedOrder.email}</p>
              </div>
              <div>
                <h4 style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Delivery Address</h4>
                <p style={{ color: '#2c1810' }}>{selectedOrder.address}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{selectedOrder.city} {selectedOrder.postalCode}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment</h4>
              <p style={{ padding: '0.5rem 1rem', background: '#fff5f7', borderRadius: '8px', display: 'inline-block', fontWeight: '600', color: '#880e4f' }}>
                {getPaymentLabel(selectedOrder.paymentMethod)}
              </p>
              {selectedOrder.transactionId && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Transaction ID: </span>
                  <strong style={{ color: '#880e4f', fontFamily: 'monospace' }}>{selectedOrder.transactionId}</strong>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Items</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ color: '#666' }}>{item.quantity}x {item.name || item.product?.name || 'Product'}</span>
                  <span style={{ fontWeight: '600' }}>Rs. {(item.price || 0) * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', fontWeight: '700', fontSize: '1.1rem' }}>
                <span>Total</span><span style={{ color: '#e91e8c' }}>Rs. {selectedOrder.totalAmount}</span>
              </div>
            </div>

            {selectedOrder.specialInstructions && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Special Instructions</h4>
                <p style={{ padding: '0.8rem', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>{selectedOrder.specialInstructions}</p>
              </div>
            )}

            <div>
              <h4 style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Update Status</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {getStatusOptions(selectedOrder.status).map(status => (
                  <button key={status} onClick={() => { updateStatus(selectedOrder._id, status); setSelectedOrder({ ...selectedOrder, status }); }}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
