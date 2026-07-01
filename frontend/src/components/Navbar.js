import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar" style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'
      }}>
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="navbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#e91e8c"/><stop offset="100%" stopColor="#c2185b"/></linearGradient></defs>
            <circle cx="24" cy="24" r="24" fill="url(#navbg)"/>
            <path d="M16 30 L18 24 L30 24 L32 30 Z" fill="#8b5a2b" opacity="0.9"/>
            <ellipse cx="24" cy="22" rx="9" ry="5" fill="#fff5f7"/>
            <ellipse cx="24" cy="20" rx="7" ry="4" fill="#fce4ec"/>
            <ellipse cx="24" cy="18.5" rx="5" ry="3" fill="#fff5f7"/>
            <circle cx="24" cy="15" r="2.5" fill="#e91e8c"/>
            <circle cx="23.2" cy="14.3" r="0.8" fill="white" opacity="0.6"/>
            <path d="M24 12.5 Q26 11 25 9" fill="none" stroke="#4a7c59" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          Sweet Crumb
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/track">Track Order</Link></li>
          <li>
            <Link to="/order" className="nav-order-btn">
              Order Now
            </Link>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/menu" className="mobile-link" onClick={() => setMenuOpen(false)}>Menu</Link>
        <Link to="/gallery" className="mobile-link" onClick={() => setMenuOpen(false)}>Gallery</Link>
        <Link to="/about" className="mobile-link" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link to="/track" className="mobile-link" onClick={() => setMenuOpen(false)}>Track Order</Link>
        <Link to="/order" className="mobile-link mobile-order-btn" onClick={() => setMenuOpen(false)}>Order Now</Link>
      </div>
    </>
  );
};

export default Navbar;
