import React, { useState, useEffect } from 'react';
import api from '../api';
import { FaSave, FaTruck, FaUniversity } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    deliveryCharges: 50,
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branchCode: '',
    bankInstructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.put('/api/settings', settings, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p style={{ color: '#666' }}>Manage delivery charges and bank details</p>
      </div>

      {/* Delivery Charges */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <FaTruck style={{ fontSize: '1.5rem', color: '#e91e8c' }} />
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Delivery Charges</h2>
        </div>
        
        <div style={{ maxWidth: '400px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Delivery Fee (Rs.)</label>
          <input
            type="number"
            name="deliveryCharges"
            value={settings.deliveryCharges}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '2px solid #eee',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Bank Details */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <FaUniversity style={{ fontSize: '1.5rem', color: '#e91e8c' }} />
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Bank Details</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '700px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={settings.bankName}
              onChange={handleChange}
              placeholder="e.g. HBL, Meezan, JazzCash"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Account Title</label>
            <input
              type="text"
              name="accountTitle"
              value={settings.accountTitle}
              onChange={handleChange}
              placeholder="Account holder name"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={settings.accountNumber}
              onChange={handleChange}
              placeholder="Account number"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>IBAN</label>
            <input
              type="text"
              name="iban"
              value={settings.iban}
              onChange={handleChange}
              placeholder="IBAN number"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Branch Code</label>
            <input
              type="text"
              name="branchCode"
              value={settings.branchCode}
              onChange={handleChange}
              placeholder="Branch code"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Bank Instructions</label>
            <textarea
              name="bankInstructions"
              value={settings.bankInstructions}
              onChange={handleChange}
              placeholder="e.g. Order ID likh dein transfer ke time"
              rows="3"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #eee',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '0.9rem 2.5rem',
            background: saved ? '#28a745' : '#e91e8c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaSave /> {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
