import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getMessaging, getToken} from "firebase/messaging";
import { toast } from "react-toastify";


const firebaseConfig = {

  apiKey: "AIzaSyCjX1ojaPxXqEbG1cwUo5m5Ibnsv3bMWag",
  authDomain: "mzumbe-academic-portal.firebaseapp.com",
  projectId: "mzumbe-academic-portal",
  storageBucket: "mzumbe-academic-portal.firebasestorage.app",
  messagingSenderId: "946292180292",
  appId: "1:946292180292:web:a40a3859612733fecf8311",
  measurementId: "G-32J5904Z3S"
};


const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const notificationPermission = await Notification.requestPermission();

  if (notificationPermission === "granted") {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(messaging, {
        vapidKey: 'BFX267yy64KyOV0ktyxhkleykZARudNHRfkw2Z_6-7Rm-07ht5KyzNt7QZnCaFrJOIUiJZV0lA5mTW7oKpKiRFg',
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        console.warn("No registration token available. Request permission to generate one.");
        return;
      }

      console.log("FCM Token:", token);
      return token;

    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    console.warn("Notification permission not granted");
  }

  return null;
}


export const auth = getAuth(app);
export const loginGoogle = new GoogleAuthProvider();
export const db = getFirestore(app);
export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      toast.success(`👋 good bye ${JSON.parse(sessionStorage.getItem('userProfile')).name.split(' ')[0]}`);
      sessionStorage.removeItem("userProfile");
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
};