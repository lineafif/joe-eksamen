const express = require("express");
const path = require("path");
const app = express();

// Middleware to serve static files
app.use("/static", express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/joePassport", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "joePassport.html"));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


