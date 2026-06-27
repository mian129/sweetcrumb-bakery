import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar" style={{
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'
    }}>
      <Link to="/" className="nav-logo">Sweet Crumb</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          <Link to="/order" style={{
            padding: '0.75rem 1.5rem',
            background: '#d4a574',
            color: 'white',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Order Now
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
