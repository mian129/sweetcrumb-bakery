import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';

const POLL_INTERVAL = 10000;

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.12 + 0.3);
      osc.start(audioCtx.currentTime + i * 0.12);
      osc.stop(audioCtx.currentTime + i * 0.12 + 0.3);
    });
  } catch (e) {
    // Audio not available
  }
};

const useNotifications = () => {
  const [orders, setOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState(null);
  const lastOrderIdRef = useRef(null);
  const isFirstLoad = useRef(true);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await api.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newOrders = res.data;
      setOrders(newOrders);

      if (isFirstLoad.current) {
        if (newOrders.length > 0) {
          lastOrderIdRef.current = newOrders[0].id;
        }
        isFirstLoad.current = false;
        return;
      }

      const pendingOrders = newOrders.filter(o => o.status === 'pending');
      setUnreadCount(pendingOrders.length);

      if (newOrders.length > 0 && lastOrderIdRef.current) {
        const newestOrder = newOrders[0];
        if (newestOrder.id !== lastOrderIdRef.current && newestOrder.status === 'pending') {
          setLatestOrder(newestOrder);
          playNotificationSound();
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Order! 🎂', {
              body: `${newestOrder.customerName} - Rs. ${newestOrder.totalAmount}`,
              icon: '/icons/icon-192.svg',
              tag: 'new-order'
            });
          }
        }
      }
      
      if (newOrders.length > 0) {
        lastOrderIdRef.current = newOrders[0].id;
      }
    } catch (err) {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const { requestPermission, onMessageListener } = await import('../firebase-config');
        await requestPermission();
        
        onMessageListener((payload) => {
          const data = payload.data || {};
          const title = payload.notification?.title || 'New Order!';
          const body = payload.notification?.body || '';
          
          playNotificationSound();
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
              body,
              icon: '/icons/icon-192.svg',
              tag: 'new-order'
            });
          }
        });
      } catch (e) {
        // Firebase not configured
      }
    };
    
    initFirebase();
  }, []);

  const dismissNotification = useCallback(() => {
    setLatestOrder(null);
  }, []);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    orders,
    unreadCount,
    latestOrder,
    dismissNotification,
    clearUnread,
    refreshOrders: fetchOrders
  };
};

export default useNotifications;
