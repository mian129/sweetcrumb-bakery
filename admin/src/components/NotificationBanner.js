import React, { useEffect, useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

const NotificationBanner = ({ notification, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDismiss(), 300);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className={`notification-banner ${visible ? 'notification-show' : 'notification-hide'}`}>
      <div className="notification-icon">
        <FaBell />
      </div>
      <div className="notification-content">
        <strong>New Order Received!</strong>
        <p>{notification.customerName} - Rs. {notification.totalAmount}</p>
      </div>
      <button className="notification-close" onClick={() => { setVisible(false); setTimeout(() => onDismiss(), 300); }}>
        <FaTimes />
      </button>
    </div>
  );
};

export default NotificationBanner;
