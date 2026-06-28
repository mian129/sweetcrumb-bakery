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
          <motion.h3
            whileHover={{ scale: 1.05 }}
            style={{
              fontSize: '1.8rem',
              fontFamily: "'Playfair Display', serif",
              color: '#fce4ec',
              marginBottom: '1rem'
            }}
          >
            Sweet Crumb
          </motion.h3>
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
