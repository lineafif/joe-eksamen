const express = require("express");
const path = require("path");
const app = express();
const cloudinary = require('cloudinary').v2;
 // konfiguration af cloudinary
 cloudinary.config({ 
  cloud_name: 'dyn4wst2w', 
  api_key: '366774456327515', 
  api_secret: 'hwy0edyuyKLaZieBN1Y-W7ev39c' // Click 'View API Keys' above to copy your API secret
});
// Middleware to serve static files
app.use("/static", express.static(path.join(__dirname, "public")));

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
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
});


 
app.get("/products", async (req, res) => {
  try {const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'JoePassport menukort', // Angiv den specifikke mappe
    max_results: 10
  });

  const products = result.resources.map(resource => {
    const fullName = resource.public_id; // Fuld sti (f.eks. "JoePassport menukort/orangeJuice")
    const productName = fullName.split('/').pop(); // Tag kun sidste del efter "/"

    return {
      productName: productName, 
      imgsrc: resource.secure_url, // URL til billedet
    };
  });

  res.json(products);
  } catch (error) {
      console.error("Fejl ved hentning af billeder:", error);
      res.status(500).send({ message: "Fejl ved hentning af produkter fra cloudinary." });
  }
});


// Start the server ()
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


