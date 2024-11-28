const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const responseTime = require("response-time");
const app = express();

app.use(cors());
app.use("/static", express.static("public"));
app.use((req, res, next) => {
  console.log("----- HTTP Request -----");
  console.log(`Method: ${req.method}`); // HTTP Method
  console.log(`URL: ${req.originalUrl}`); // Requested URL
  console.log("Headers:", req.headers); // Request Headers
  console.log(`IP: ${req.ip}`); // IP Address
  console.log("------------------------");
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(responseTime());

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "copenhagenbusinessjoe@gmail.com",
    pass: "mzksmywihnpdjqjx",
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/products", (req, res) => {
  const serverUri = `${req.protocol}://${req.get("host")}`;
  const products = [
    {
      productName: "Orange Juice",
      imgsrc: `${serverUri}/static/img/orange_juice.jpg`,
    },
    {
      productName: "Apple Juice",
      imgsrc: `${serverUri}/static/img/apple_juice.jpg`,
    },
    {
      productName: "Grape Juice",
      imgsrc: `${serverUri}/static/img/grapes.jpg`,
    },
    {
      productName: "Pineapple Juice",
      imgsrc: `${serverUri}/static/img/pineapple_juice.jpg`,
    },
    {
      productName: "Espresso",
      imgsrc: `${serverUri}/static/img/espresso.jpg`,
    },
    {
      productName: "Cappuccino",
      imgsrc: `${serverUri}/static/img/cappuccino.jpg`,
    },
  ];
  res.json(products);
});

app.get("/locations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "locations.html"));
});

app.get("/joePassport", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "joePassport.html"));
});

app.get("/joeStamps", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "joeStamps.html"));
});

app.get("/res", (req, res) => {
  res.send("Response message from server");
});

app.get("/cookie", (req, res) => {
  res.cookie("taste", "chocolate");
  res.send("Cookie set");
});

// POST /email endpoint to send an email
app.post("/email", async (req, res) => {
  const { email } = req.body;
  const sender = "JOE <copenhagenbusinessjoe@gmail.com>";
  const subjectMsg = "Welcome to JOE";
  const textMsg = "Welcome to JOE";
  const htmlMsg = "<h1>Welcome to JOE</h1>";

  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: subjectMsg,
      text: textMsg,
      html: htmlMsg,
    });
    console.log("Message sent: %s", info.messageId);
    res.json({ message: `Email sent to ${email}` });
  } catch (error) {
    console.error(error);
    res.json({ message: "Email could not be sent" });
  }
});

const customers = [
  {
    username: "hans",
    email: "hanshansen@gmail.com",
    password: "hansemanse",
  },
  {
    username: "jens",
    email: "jensjensen@gmail.com",
    password: "jenspassword",
  },
];

app.get("/customers", (req, res) => {
  res.json(customers);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  const customer = customers.find(
    (user) => user.username === username && user.password === password
  );

  if (customer) {
    res
      .cookie("userAuth", username, {
        maxAge: 3600000,
      })
      .send({ message: "You are logged in" })
      .status(200);
  } else {
    res.status(401).send({ message: "Invalid username or password" });
  }
});

app.get("/protected", (req, res) => {
  const authCookie = req.cookies.userAuth;

  if (!authCookie) {
    return res.status(401).send("No authentication cookie.");
  }

  const customer = customers.find((user) => user.username === authCookie);

  if (!customer) {
    return res.status(401).send("Invalid cookie.");
  }

  res.send(`Welcome ${customer.username}`);
});

app.get("/culture", (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.sendFile(path.join(__dirname, "public", "culture.html"));
});

app.get("/culture/image", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.sendFile(path.join(__dirname, "public/img", "cbs.jpeg"));
});

