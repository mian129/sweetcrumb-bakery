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
      }, 12000);
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
        <strong>🎂 New Order Received!</strong>
        <p>
          <strong>{notification.customerName}</strong> - Rs. {notification.totalAmount}
          {notification.phone && <span> | {notification.phone}</span>}
        </p>
        {notification.items && (
          <p style={{ fontSize: '0.75rem', opacity: 0.85, margin: '2px 0 0' }}>
            {notification.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </p>
        )}
      </div>
      <button className="notification-close" onClick={() => { setVisible(false); setTimeout(() => onDismiss(), 300); }}>
        <FaTimes />
      </button>
    </div>
  );
};

export default NotificationBanner;
