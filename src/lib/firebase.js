// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyn5iCXPvnP7v_kHy_NdM3GBG3efYcDiI",
  authDomain: "gmc-kannur-onam.firebaseapp.com",
  projectId: "gmc-kannur-onam",
  storageBucket: "gmc-kannur-onam.firebasestorage.app",
  messagingSenderId: "211935119239",
  appId: "1:211935119239:web:0f76ae32a6d7a03562f522",
  measurementId: "G-8C4KQ698LW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
