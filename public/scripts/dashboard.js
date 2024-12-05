import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Set Firebase authentication state persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase authentication persistence set to LOCAL.");

    // Fetch and display user's first and last names
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        console.log("User ID:", userId);

        // Fetch user data from Firebase Realtime Database
        get(ref(database, `users/${userId}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const firstName = userData.firstName || "First Name Missing";
              const lastName = userData.lastName || "Last Name Missing";

              // Update the UI with the user's first and last names
              document.getElementById("user-first-name").textContent = firstName;
              document.getElementById("user-last-name").textContent = lastName;
            } else {
              console.log("No user data found in the database.");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        console.log("No user is logged in.");
        document.getElementById("user-first-name").textContent = "Guest";
        document.getElementById("user-last-name").textContent = "Guest";
      }
    });
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });
