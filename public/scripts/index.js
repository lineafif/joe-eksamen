import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

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

// Håndterer link til pas
onAuthStateChanged(auth, (user) => {
  const passportLink = document.getElementById("joe-passport-link");
  if (passportLink) {
    if (user) {
      // If user is logged in, show the link
      passportLink.classList.remove("hidden");
    } else {
      // If no user is logged in, hide the link
      passportLink.classList.add("hidden");
    }
  }
});
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
    console.log("User logged in:", userCredential.user);

    // Set a cookie to indicate that the user is logged in
    document.cookie = "isLoggedIn=true; path=/; max-age=3600"; // The cookie will expire in 1 hour

    // Redirect to Joe Passport page
    window.location.href = "/joePassport";
  } catch (error) {
    document.getElementById("login").innerText = `Error: ${error.message}`;
    console.error("Login error:", error);
  }
};


// Async function to handle sending the email
const emailInputDom = document.getElementById("newsletterEmail");
const emailDom = document.getElementById("newsletterMessage");

async function sendEmail() {
  try {
    const email = emailInputDom.value; // Get email from input field
    if (!email) {
      emailDom.innerHTML = "Please enter a valid email.";
      return;
    }

    const response = await fetch("/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send email as JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP status code ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    emailDom.innerHTML = data.message; // Display success message
    emailInputDom.value = ""; // Clear input field
  } catch (error) {
    console.error("Error:", error);
    emailDom.innerHTML = `Error: ${error.message}`;
  }
}

// Attach the function to the Subscribe button (in case onclick is missing)
document.querySelector("button[onclick='sendEmail()']").addEventListener("click", sendEmail);

