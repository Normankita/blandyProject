import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Friend's Firebase config (for external storage)
const externalFirebaseConfig = {
  apiKey: "AIzaSyBntjRLElBQ8GVG5rt7l-c-DzkFilcCVsE",
  authDomain: "nembora-app.firebaseapp.com",
  databaseURL: "https://nembora-app-default-rtdb.firebaseio.com",
  projectId: "nembora-app",
  storageBucket: "nembora-app.appspot.com",
  messagingSenderId: "106630216660",
  appId: "1:106630216660:web:8a9b17b17b8a27b3523441",
  measurementId: "G-7947VP21TX"
};

// ✅ Initialize as a uniquely named app
const externalApp = initializeApp(externalFirebaseConfig, "externalApp");

// ✅ Now get storage from the external app
export const storage = getStorage(externalApp);
