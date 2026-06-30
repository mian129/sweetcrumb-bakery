let messaging = null;

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const initFirebase = async () => {
  if (typeof window === 'undefined') return null;
  if (messaging) return messaging;
  
  try {
    if (!window.firebase) {
      await loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');
    }
    
    if (window.firebase && !window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
    
    if (window.firebase && window.firebase.messaging) {
      messaging = window.firebase.messaging();
    }
  } catch (e) {
    console.log('Firebase init skipped:', e.message);
  }
  
  return messaging;
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const requestPermission = async () => {
  const msg = await initFirebase();
  if (!msg) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await msg.getToken({ vapidKey: 'YOUR_VAPID_KEY' });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (e) {
    console.log('Push permission error:', e);
  }
  return null;
};

export const onMessageListener = (callback) => {
  if (!messaging) return () => {};
  
  try {
    messaging.onMessage((payload) => {
      callback(payload);
    });
  } catch (e) {
    // Silent fail
  }
  
  return () => {};
};

export { messaging };
