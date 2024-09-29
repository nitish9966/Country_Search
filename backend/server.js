const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const admin = require("firebase-admin");
const serviceAccount = require(path.join(__dirname, "./fullstack.json")); // Firebase credentials JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware (Important for React frontend to access backend)
const cors = require('cors');
app.use(cors());

// Route for signup (registration)
app.post("/signup", async (req, res) => {
  try {
    const { FullName, Email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const userDoc = await db.collection("RegisteredDB").doc(Email).get();

    if (userDoc.exists) {
      return res.status(400).json({ error: "User with this email already exists" });
    } else {
      const newUser = {
        FullName,
        Email,
        Password: hashedPassword,
      };

      await db.collection("RegisteredDB").doc(Email).set(newUser);
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Route for login
app.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const userDoc = await db.collection("RegisteredDB").doc(Email).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const passwordMatch = await bcrypt.compare(Password, userData.Password);

      if (passwordMatch) {
        return res.status(200).json({ message: "Login successful", user: userData });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      return res.status(404).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
