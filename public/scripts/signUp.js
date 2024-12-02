import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

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

// Handle user creation
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("signup-msg").innerText = "Please fill out all fields.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    document.getElementById("signup-msg").innerText = `User created: ${userCredential.user.email}`;
  } catch (error) {
    document.getElementById("signup-msg").innerText = `Error: ${error.message}`;
    console.error("User creation error:", error);
  }
});
