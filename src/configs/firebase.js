import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {

  apiKey: "AIzaSyA7aqPYh1YbO-fj1_rY2Fz-rB6MoRPlxhY",
  authDomain: "mzumbe-academic-portal-be18b.firebaseapp.com",
  projectId: "mzumbe-academic-portal-be18b",
  storageBucket: "mzumbe-academic-portal-be18b.firebasestorage.app",
  messagingSenderId: "412710888829",
  appId: "1:412710888829:web:9a68b7397998fea0e29814"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const loginGoogle = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      sessionStorage.removeItem("userProfile");
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
};