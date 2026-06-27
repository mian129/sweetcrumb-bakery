import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Sweet Crumb</h2>
        <p>Admin Dashboard</p>
      </div>
      
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" end>
            <FaHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/products">
            <FaBox /> Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders">
            <FaShoppingCart /> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings">
            <FaCog /> Settings
          </NavLink>
        </li>
      </ul>

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
