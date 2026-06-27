import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaDollarSign, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [productsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products', config),
        axios.get('http://localhost:5000/api/orders', config)
      ]);

      const orders = ordersRes.data;
      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pending = orders.filter(o => o.status === 'pending').length;

      setStats({
        products: productsRes.data.length,
        orders: orders.length,
        revenue: revenue,
        pendingOrders: pending
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
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

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p style={{ color: '#666' }}>Welcome to Sweet Crumb Admin</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon"><FaBox /></div>
          <h3>Total Products</h3>
          <div className="value">{stats.products}</div>
        </div>

        <div className="stat-card">
          <div className="icon"><FaShoppingCart /></div>
          <h3>Total Orders</h3>
          <div className="value">{stats.orders}</div>
        </div>

        <div className="stat-card">
          <div className="icon"><FaDollarSign /></div>
          <h3>Total Revenue</h3>
          <div className="value">Rs. {stats.revenue}</div>
        </div>

        <div className="stat-card">
          <div className="icon"><FaClock /></div>
          <h3>Pending Orders</h3>
          <div className="value">{stats.pendingOrders}</div>
        </div>
      </div>

      <div className="data-table">
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <h3>Recent Orders</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order._id}>
                <td>
                  <strong>{order.customerName}</strong>
                  <br />
                  <small style={{ color: '#666' }}>{order.city}</small>
                </td>
                <td>{order.phone}</td>
                <td><strong>Rs. {order.totalAmount}</strong></td>
                <td style={{ fontSize: '0.85rem' }}>
                  {order.paymentMethod === 'bank' ? 'Bank Transfer' : order.paymentMethod}
                </td>
                <td>
                  <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', background: getStatusColor(order.status), textTransform: 'capitalize' }}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentOrders.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Abhi tak koi order nahi</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
