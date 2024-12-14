
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const cloudinary = require('cloudinary').v2;
const admin = require("firebase-admin");
const twilio = require("twilio");

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

// Import the service account key (DO NOT expose this publicly)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://diseksamen-e0f52-default-rtdb.europe-west1.firebasedatabase.app" // Replace with your Firebase database URL
});

app.post('/send-order-confirmation', async (req, res) => {
  const { userId, storeName } = req.body;

  // Check if userId and storeName are provided
  if (!userId || !storeName) {
    return res.status(400).json({ error: 'Missing userId or storeName' });
  }

  try {
    // Step 1: Get phone number from Firebase Realtime Database
    const userRef = admin.database().ref(`users/${userId}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = snapshot.val();
    const phoneNumber = userData.mobile;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number not found for this user' });
    }

    // Step 2: Send SMS using Twilio
    const message = await client.messages.create({
      body: `Thank you for your order! You can pick it up at ${storeName}.`,
      from: twilioPhoneNumber, // Twilio phone number
      to: phoneNumber, // User's phone number from Firebase
    });

    console.log('Message sent successfully:', message.sid);
    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// konfiguration af cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

 

// Logging middleware 
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "joepassport.rocks@gmail.com",
    pass: "ccho qeos bljr txir",
  },
  },
);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/joePassport", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "joePassport.html"));
});

app.get("/joeStamps", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "joeStamps.html"));
});

app.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signUp.html"));
});

app.get("/locations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "locations.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
});
app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});



// Newsletter 
app.post("/email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const info = await transporter.sendMail({
      from: "JOE <joepassportexam@gmail.com>",
      to: email,
      subject: "Welcome to the JOE and The Juice Newsletter!",
      text: "Thank you for signing up for our newsletter. Stay tuned for the latest updates and offers!",
      html: "<h1>Welcome to JOE and The Juice!</h1><p>Thank you for signing up for our newsletter. Stay tuned for the latest updates and offers!</p>",
    });

    console.log("Email sent:", info.messageId);
    res.status(200).json({ message: "Newsletter sign-up successful! Confirmation email sent." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email. Please try again later." });
  }
});


//cloudinary

app.get("/products", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'JoePassport menukort', // Specific folder in Cloudinary
      max_results: 10
    });

    const products = result.resources.map((resource) => {
      const fullName = resource.public_id; // Full path (e.g., "JoePassport menukort/orangeJuice")
      const productName = fullName.split('/').pop(); // Get the last part after "/"

      // Manually assign the same price for all products
      const price = 5.99; // Fixed price for all products

      return {
        productName: productName,
        imgsrc: resource.secure_url, // URL to the image
        price: price // Fixed price
      };
    });

    res.json(products); // Send the products with image URLs and price
  } catch (error) {
    console.error("Error fetching products from Cloudinary:", error);
    res.status(500).send({ message: "Error fetching products from Cloudinary." });
  }
});



app.use(express.json());

// Middleware to verify Firebase Auth token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// Add stamp endpoint
app.post("/add-stamp", verifyToken, async (req, res) => {
  const { userId, storeName } = req.body;
  if (!userId || !storeName) {
    return res.status(400).json({ error: "Missing userId or storeName" });
  }

  // Ensure the user is adding a stamp to their own account
  if (req.user.uid !== userId) {
    return res.status(403).json({ error: "Unauthorized to add stamp for this user" });
  }

  try {
    const userRef = admin.database().ref(`users/${userId}/stamps`);
    const snapshot = await userRef.once("value");
    const currentStamps = snapshot.val() || [];

    if (!currentStamps.includes(storeName)) {
      currentStamps.push(storeName);
      await userRef.set(currentStamps);
    }

    res.status(200).json({ success: true, stamps: currentStamps });
  } catch (error) {
    console.error("Error adding stamp:", error);
    res.status(500).json({ error: "Failed to add stamp" });
  }
});


app.get('/get-stamp-count', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
  }

  try {
      // Get the user's stamps from Firebase
      const userRef = admin.database().ref(`users/${userId}/stamps`);
      const snapshot = await userRef.once('value');
      const stamps = snapshot.val() || []; // Default to an empty array if no stamps exist

      res.status(200).json({ stamps });
  } catch (error) {
      console.error('Error getting stamp count:', error);
      res.status(500).json({ error: 'Failed to get stamp count.' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
