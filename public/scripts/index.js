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


// DOM elements
const responseDom = document.getElementById("response");
const cookieDom = document.getElementById("cookie");
const locationDom = document.getElementById("location");
const latlongDom = document.getElementById("latlong");
const weatherDom = document.getElementById("weather");
const emailDom = document.getElementById("email");
const emailInputDom = document.getElementById('emailInput');
const usernameInputDom = document.getElementById('usernameInput');
const passwordInputDom = document.getElementById('passwordInput');
const loginDom = document.getElementById('login');

// Fetch and display response from the /res endpoint
async function getResponse() {
  try {
    const response = await fetch('/res');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.text();
    console.log(data);
    responseDom.innerHTML = data;
  } catch (error) {
    console.log(error);
    responseDom.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Fetch and set cookie
async function setCookie() {
  try {
    const response = await fetch('/cookie');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const value = await response.text();
    console.log(value);
    cookieDom.innerHTML = value;
  } catch (error) {
    console.log(error);
    cookieDom.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Set location and fetch latitude/longitude
async function getLocation() {
  const dropdown = document.getElementById('locationDropdown');
  const selectedLocation = dropdown.options[dropdown.selectedIndex].text;
  locationDom.innerHTML = `Your location is ${selectedLocation}`;
  document.cookie = `location=${selectedLocation}; path=/;`;
  await getLatLong(selectedLocation);
}

async function getLatLong(locationName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&addressdetails=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    if (data.length > 0) {
      console.log(data);
      latlongDom.innerHTML = `Latitude: ${data[0].lat}, Longitude: ${data[0].lon}`;
      await getWeather(data[0].lat, data[0].lon);
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.log(error);
    latlongDom.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function getWeather(lat, long) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    weatherDom.innerHTML = `Temperature: ${data.current_weather.temperature}°`;
  } catch (error) {
    console.log(error);
    weatherDom.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Send email via POST request
async function sendEmail() {
  try {
    const response = await fetch('/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInputDom.value }),
    });
    if (!response.ok) throw new Error(`HTTP status code ${response.status}`);
    const data = await response.json();
    console.log(data);
    emailDom.innerHTML = data.message;
  } catch (error) {
    console.log(error);
    emailDom.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Fetch and display products
async function fetchProducts() {
  try {
    const response = await fetch('/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function displayProducts() {
  const productList = await fetchProducts();
  const productContainer = document.getElementById("product-list");
  productContainer.innerHTML = "";

  productList.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");

    const img = document.createElement("img");
    img.src = product.imgsrc;
    img.alt = product.productName;

    const productName = document.createElement("h3");
    productName.innerText = product.productName;

    productItem.appendChild(img);
    productItem.appendChild(productName);
    productContainer.appendChild(productItem);
  });
}

