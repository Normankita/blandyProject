// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB9qmlgZhlz8QpD5LzUgNTRErHx8IFpUCk",
  authDomain: "mkulima-app-1986d.firebaseapp.com",
  databaseURL: "https://mkulima-app-1986d-default-rtdb.firebaseio.com",
  projectId: "mkulima-app-1986d",
  storageBucket: "mkulima-app-1986d.firebasestorage.app",
  messagingSenderId: "899791108383",
  appId: "1:899791108383:web:71f927d87a831a44bc182a",
  measurementId: "G-3V1XFDV426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(storageApp);