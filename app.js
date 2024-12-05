const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const cloudinary = require('cloudinary').v2;
const admin = require("firebase-admin");
const twilio = require("twilio");


// Middleware to parse JSON and serve static files
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

// konfiguration af cloudinary
cloudinary.config({
  cloud_name: 'dyn4wst2w',
  api_key: '366774456327515',
  api_secret: 'hwy0edyuyKLaZieBN1Y-W7ev39c' 
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
      prefix: 'JoePassport menukort', // Angiv den specifikke mappe
      max_results: 10
    });

    const products = result.resources.map(resource => {
      const fullName = resource.public_id; // Fuld sti (f.eks. "JoePassport menukort/orangeJuice")
      const productName = fullName.split('/').pop(); // Tag kun sidste del efter "/"

      
      const price = 5.99; 

      return {
        productName: productName,
        imgsrc: resource.secure_url, // URL til billedet
        price: price // Legg til prisen
      };
    });

    res.json(products); // Sender produkter med pris
  } catch (error) {
    console.error("Fejl ved hentning af billeder:", error);
    res.status(500).send({ message: "Fejl ved hentning af produkter fra cloudinary." });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
