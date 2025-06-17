// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
   apiKey: "AIzaSyCjX1ojaPxXqEbG1cwUo5m5Ibnsv3bMWag",
  authDomain: "mzumbe-academic-portal.firebaseapp.com",
  projectId: "mzumbe-academic-portal",
  storageBucket: "mzumbe-academic-portal.firebasestorage.app",
  messagingSenderId: "946292180292",
  appId: "1:946292180292:web:a40a3859612733fecf8311",
  measurementId: "G-32J5904Z3S"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => { 
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}
);
