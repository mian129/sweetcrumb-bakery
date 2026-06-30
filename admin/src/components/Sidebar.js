import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaCog, FaSignOutAlt, FaImage, FaBars, FaTimes, FaBell } from 'react-icons/fa';

const Sidebar = ({ user, onLogout, unreadCount = 0 }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setOpen(!open)}>
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Sweet Crumb</h2>
          <p>Admin Dashboard</p>
          {unreadCount > 0 && (
            <span className="sidebar-badge">{unreadCount} new</span>
          )}
        </div>
        
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/" end onClick={() => setOpen(false)}>
              <FaHome /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" onClick={() => setOpen(false)}>
              <FaBox /> Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" onClick={() => setOpen(false)}>
              <FaShoppingCart /> Orders
              {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/gallery" onClick={() => setOpen(false)}>
              <FaImage /> Gallery
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" onClick={() => setOpen(false)}>
              <FaCog /> Settings
            </NavLink>
          </li>
        </ul>

        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
