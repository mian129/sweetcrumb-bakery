import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaImage } from 'react-icons/fa';

const BottomNav = ({ unreadCount = 0 }) => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className="bottom-nav-item">
        <FaHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/products" className="bottom-nav-item">
        <FaBox />
        <span>Products</span>
      </NavLink>
      <NavLink to="/orders" className="bottom-nav-item">
        <div style={{ position: 'relative' }}>
          <FaShoppingCart />
          {unreadCount > 0 && <span className="bottom-badge">{unreadCount}</span>}
        </div>
        <span>Orders</span>
      </NavLink>
      <NavLink to="/gallery" className="bottom-nav-item">
        <FaImage />
        <span>Gallery</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
