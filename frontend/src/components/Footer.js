import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer style={{
      background: '#880e4f',
      color: 'white',
      padding: '4rem 5% 2rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '3rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Brand */}
        <div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="ftbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#e91e8c"/><stop offset="100%" stopColor="#c2185b"/></linearGradient></defs>
              <circle cx="24" cy="24" r="24" fill="url(#ftbg)"/>
              <path d="M16 30 L18 24 L30 24 L32 30 Z" fill="#8b5a2b" opacity="0.9"/>
              <ellipse cx="24" cy="22" rx="9" ry="5" fill="#fff5f7"/>
              <ellipse cx="24" cy="20" rx="7" ry="4" fill="#fce4ec"/>
              <ellipse cx="24" cy="18.5" rx="5" ry="3" fill="#fff5f7"/>
              <circle cx="24" cy="15" r="2.5" fill="#e91e8c"/>
              <circle cx="23.2" cy="14.3" r="0.8" fill="white" opacity="0.6"/>
              <path d="M24 12.5 Q26 11 25 9" fill="none" stroke="#4a7c59" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <h3 style={{
              fontSize: '1.8rem',
              fontFamily: "'Playfair Display', serif",
              color: '#fce4ec',
              margin: 0
            }}>
              Sweet Crumb
            </h3>
          </motion.div>
          <p style={{ color: '#f8bbd0', lineHeight: 1.8 }}>
            Thoughtfully crafted and beautifully delicious one-of-a-kind treats for every occasion.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {['📷', '📘', '🐦'].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, y: -3 }}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(252, 228, 236, 0.1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  textDecoration: 'none'
                }}
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fce4ec', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Quick Links</h4>
          {[
            { to: '/', label: 'Home' },
            { to: '/menu', label: 'Menu' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/track', label: 'Track Order' },
            { to: '/about', label: 'About' },
            { to: '/contact', label: 'Contact' }
          ].map((link) => (
            <motion.div key={link.to} whileHover={{ x: 5 }}>
              <Link
                to={link.to}
                style={{
                  display: 'block',
                  color: '#f8bbd0',
                  textDecoration: 'none',
                  padding: '0.4rem 0',
                  transition: 'color 0.3s'
                }}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Hours */}
        <div>
          <h4 style={{ color: '#fce4ec', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Hours</h4>
          <div style={{ color: '#f8bbd0', lineHeight: 2 }}>
            <p>9am - 10pm</p>
            <p>Monday - Sunday</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#fce4ec', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact</h4>
          <div style={{ color: '#f8bbd0', lineHeight: 2 }}>
            <p>📞 0326 763 3796</p>
            <p>📍 Faisalabad, Pakistan</p>
            <p>✉️ Sweetcrumb099@gmail.com</p>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '3rem',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#f8bbd0'
      }}>
        <p>© 2026 Sweet Crumb. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
