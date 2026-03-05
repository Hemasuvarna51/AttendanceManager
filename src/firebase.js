// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// OPTIONAL: only use analytics if you really need it (and only on https)
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCmgYq4tmXjT8dyrw6-j0WuHFyLJcA4-ZI",
  authDomain: "employee-portal-7a30b.firebaseapp.com",
  projectId: "employee-portal-7a30b",
  storageBucket: "employee-portal-7a30b.appspot.com", // ✅ use appspot.com
  messagingSenderId: "674590275859",
  appId: "1:674590275859:web:0cc0d7263004d02af842e6",
  measurementId: "G-C1TLEH9LB8",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional analytics (safe)
isSupported().then((yes) => {
  if (yes) getAnalytics(app);
});