import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';

const POLL_INTERVAL = 5000;

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Loud notification bell sound
    const play = (freq, startTime, duration, vol) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    // Bell pattern: Ding-Ding!
    play(880, now, 0.25, 0.5);
    play(1100, now + 0.15, 0.25, 0.5);
    play(880, now + 0.4, 0.25, 0.5);
    play(1100, now + 0.55, 0.35, 0.5);

    // Second bell after short pause
    play(880, now + 1.0, 0.25, 0.5);
    play(1100, now + 1.15, 0.25, 0.5);
    play(880, now + 1.4, 0.25, 0.5);
    play(1100, now + 1.55, 0.4, 0.5);

    // Vibrate phone if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
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
        if (newestOrder.id !== lastOrderIdRef.current) {
          // Koi bhi naya order aaye toh notification
          setLatestOrder(newestOrder);
          playNotificationSound();
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎂 New Order Received!', {
              body: `${newestOrder.customerName} - Rs. ${newestOrder.totalAmount}\n${newestOrder.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || ''}`,
              icon: '/icons/icon-192.svg',
              badge: '/icons/icon-192.svg',
              tag: 'new-order-' + newestOrder.id,
              renotify: true,
              requireInteraction: true
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
          const title = payload.notification?.title || '🎂 New Order!';
          const body = payload.notification?.body || '';
          
          playNotificationSound();
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
              body,
              icon: '/icons/icon-192.svg',
              badge: '/icons/icon-192.svg',
              tag: 'new-order-firebase',
              renotify: true,
              requireInteraction: true
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
