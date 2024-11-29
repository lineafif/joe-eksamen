const express = require("express");
const path = require("path");
const app = express();

// Middleware to serve static files

app.use("/static", express.static(path.join(__dirname, "public")));


// Logging middleware (optional for debugging)
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  // Serve the Home Page (index.html)
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/joePassport", (req, res) => {
  // Serve the Joe Passport page
  res.sendFile(path.join(__dirname, "public", "joePassport.html"));
});

app.get("/joeStamps", (req, res) => {
  // Serve the Joe Stamps page
  res.sendFile(path.join(__dirname, "public", "joeStamps.html"));
});

