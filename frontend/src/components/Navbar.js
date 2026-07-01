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
          <img src="/logo.svg" alt="Sweet Crumb" style={{ width: '40px', height: '40px' }} />
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
