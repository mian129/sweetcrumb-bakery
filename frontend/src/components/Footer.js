import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer style={{
      background: '#2c1810',
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
              color: '#d4a574',
              marginBottom: '1rem'
            }}
          >
            Sweet Crumb
          </motion.h3>
          <p style={{ color: '#aaa', lineHeight: 1.8 }}>
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
                  background: 'rgba(212, 165, 116, 0.1)',
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
          <h4 style={{ color: '#d4a574', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Quick Links</h4>
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
                  color: '#aaa',
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
          <h4 style={{ color: '#d4a574', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Hours</h4>
          <div style={{ color: '#aaa', lineHeight: 2 }}>
            <p>Tuesday - Friday: 7am - 6pm</p>
            <p>Saturday: 8am - 5pm</p>
            <p>Sunday: 8am - 3pm</p>
            <p>Monday: Closed</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#d4a574', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact</h4>
          <div style={{ color: '#aaa', lineHeight: 2 }}>
            <p>📍 South Denver, Colorado</p>
            <p>📞 (555) 123-4567</p>
            <p>✉️ hello@sweetcrumb.com</p>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '3rem',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>© 2026 Sweet Crumb Bakery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
