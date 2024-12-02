const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

// Logging middleware (optional for debugging)
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

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/locations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "locations.html"));
});

app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
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


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
