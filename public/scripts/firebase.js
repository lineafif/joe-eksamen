// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFEjAZM5PTdr63DGtpscAy7QR4fLIgPcA",
  authDomain: "diseksamen-e0f52.firebaseapp.com",
  databaseURL: "https://diseksamen-e0f52-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "diseksamen-e0f52",
  storageBucket: "diseksamen-e0f52.firebasestorage.app",
  messagingSenderId: "191371826193",
  appId: "1:191371826193:web:a97704e1af7a77d1a14db0",
};

// Initialize Firebase and export the `auth` instance
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
