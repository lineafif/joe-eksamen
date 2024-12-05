import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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
const database = getDatabase(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Hente verdier fra skjemaet
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const countryCode = document.getElementById("countryCode").value; // Hent landkode
  const mobile = document.getElementById("mobile").value;
  const fullMobile = `${countryCode}${mobile}`; // Kombiner landkode og mobilnummer
  const password = document.getElementById("password").value;

  if (!firstName || !lastName || !email || !mobile || !password) {
    document.getElementById("signup-msg").innerText = "Please fill out all fields.";
    return;
  }

  try {
    // Opprett bruker i Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Lagre ekstra data i Firebase Database
    await set(ref(database, `users/${userId}`), {
      firstName,
      lastName,
      email,
      mobile: fullMobile, // Lagre mobilnummer med landkode
    });

    document.getElementById("signup-msg").innerText = "User created successfully!";
  } catch (error) {
    document.getElementById("signup-msg").innerText = `Error: ${error.message}`;
  }
});


