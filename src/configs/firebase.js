import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getMessaging } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";


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
export const auth = getAuth(app);
export const loginGoogle = new GoogleAuthProvider()
export const db = getFirestore(app);
export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
}
// export const storage = getStorage(app);
// export const messaging = getMessaging(app);

// const analytics = getAnalytics(app);