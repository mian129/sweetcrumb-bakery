import React, { useState, useEffect } from 'react';
import api from '../api';
import { FaSave, FaTruck, FaUniversity, FaPlus, FaTrash } from 'react-icons/fa';

const emptyAccount = { bankName: '', accountTitle: '', accountNumber: '', iban: '', branchCode: '' };

const Settings = () => {
  const [settings, setSettings] = useState({
    deliveryCharges: 50,
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branchCode: '',
    bankInstructions: '',
    bankAccounts: []
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      const data = res.data;
      if (data.bankAccounts && Array.isArray(data.bankAccounts) && data.bankAccounts.length > 0) {
        setSettings(data);
      } else if (data.bankName) {
        setSettings({ ...data, bankAccounts: [{ bankName: data.bankName, accountTitle: data.accountTitle, accountNumber: data.accountNumber, iban: data.iban, branchCode: data.branchCode }] });
      } else {
        setSettings({ ...data, bankAccounts: [{ ...emptyAccount }] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleAccountChange = (index, field, value) => {
    const updated = [...settings.bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, bankAccounts: updated });
  };

  const addAccount = () => {
    setSettings({ ...settings, bankAccounts: [...settings.bankAccounts, { ...emptyAccount }] });
  };

  const removeAccount = (index) => {
    const updated = settings.bankAccounts.filter((_, i) => i !== index);
    setSettings({ ...settings, bankAccounts: updated });
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
          <input type="number" name="deliveryCharges" value={settings.deliveryCharges} onChange={handleChange}
            style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* Bank Instructions */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <FaUniversity style={{ fontSize: '1.5rem', color: '#e91e8c' }} />
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Bank Instructions</h2>
        </div>
        <div style={{ maxWidth: '700px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Payment Instructions</label>
          <textarea name="bankInstructions" value={settings.bankInstructions} onChange={handleChange}
            placeholder="e.g. Transfer karne ke baad Order ID zaroor likhein" rows="3"
            style={{ width: '100%', padding: '0.8rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* Multiple Bank Accounts */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <FaUniversity style={{ fontSize: '1.5rem', color: '#e91e8c' }} />
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Bank Accounts ({settings.bankAccounts.length})</h2>
          </div>
          <button onClick={addAccount} style={{ padding: '0.6rem 1.2rem', background: '#e91e8c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <FaPlus /> Add Account
          </button>
        </div>

        {settings.bankAccounts.map((account, index) => (
          <div key={index} style={{ border: '2px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#880e4f', margin: 0 }}>Account #{index + 1}</h3>
              {settings.bankAccounts.length > 1 && (
                <button onClick={() => removeAccount(index)} style={{ padding: '0.4rem 0.8rem', background: '#ff5252', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                  <FaTrash /> Remove
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Bank Name</label>
                <input type="text" value={account.bankName} onChange={(e) => handleAccountChange(index, 'bankName', e.target.value)}
                  placeholder="e.g. HBL, Meezan, JazzCash"
                  style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Account Title</label>
                <input type="text" value={account.accountTitle} onChange={(e) => handleAccountChange(index, 'accountTitle', e.target.value)}
                  placeholder="Account holder name"
                  style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Account Number</label>
                <input type="text" value={account.accountNumber} onChange={(e) => handleAccountChange(index, 'accountNumber', e.target.value)}
                  placeholder="Account number"
                  style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>IBAN</label>
                <input type="text" value={account.iban} onChange={(e) => handleAccountChange(index, 'iban', e.target.value)}
                  placeholder="IBAN number"
                  style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '0.85rem' }}>Branch Code</label>
                <input type="text" value={account.branchCode} onChange={(e) => handleAccountChange(index, 'branchCode', e.target.value)}
                  placeholder="Branch code (optional)"
                  style={{ width: '100%', padding: '0.7rem', border: '2px solid #eee', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
        <button onClick={handleSave} disabled={loading}
          style={{ padding: '0.9rem 2.5rem', background: saved ? '#28a745' : '#e91e8c', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaSave /> {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
