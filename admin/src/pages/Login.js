import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isRegister
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';
      const payload = isRegister
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };
      const res = await axios.post(url, payload);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Sweet Crumb</h1>
        <p className="subtitle">Admin Dashboard</p>
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@sweetcrumb.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isRegister ? 'Creating Account...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
          </button>
          
          {error && <p className="error-msg">{error}</p>}
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="toggle-btn" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
