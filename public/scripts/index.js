import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFEjAZM5PTdr63DGtpscAy7QR4fLIgPcA",
  authDomain: "diseksamen-e0f52.firebaseapp.com",
  databaseURL: "https://diseksamen-e0f52-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "diseksamen-e0f52",
  storageBucket: "diseksamen-e0f52.appspot.com",
  messagingSenderId: "191371826193",
  appId: "1:191371826193:web:a97704e1af7a77d1a14db0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle user login
window.login = async function login() {
  const email = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    document.getElementById("login").innerText = "Please enter both email and password.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("login").innerText = `Welcome back, ${userCredential.user.email}`;
  } catch (error) {
    document.getElementById("login").innerText = `Error: ${error.message}`;
    console.error("Login error:", error);
  }
};

// Handle user creation
window.createUser = async function createUser() {
  const email = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    document.getElementById("create-user-msg").innerText = "Please enter both email and password.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    document.getElementById("create-user-msg").innerText = `User created: ${userCredential.user.email}`;
  } catch (error) {
    document.getElementById("create-user-msg").innerText = `Error: ${error.message}`;
    console.error("User creation error:", error);
  }
};

