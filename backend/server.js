const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors"); // CORS for cross-origin access

// Firebase Admin SDK
const admin = require("firebase-admin");
require('dotenv').config(); // Load environment variables

// Firebase credentials JSON file from environment variable
const serviceAccount = require(path.join(__dirname, process.env.FIREBASE_CREDENTIALS_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow cross-origin requests

// Helper function to validate email and password
const validateUserInput = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters long" };
  }

  return { valid: true };
};

// Route for signup (registration)
app.post("/signup", async (req, res) => {
  try {
    const { FullName, Email, Password } = req.body;

    // Validate user input
    const validation = validateUserInput(Email, Password);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    const userDoc = await db.collection("RegisteredDB").doc(Email).get();

    if (userDoc.exists) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const newUser = { FullName, Email, Password: hashedPassword };
    await db.collection("RegisteredDB").doc(Email).set(newUser);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// Route for login
app.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Validate user input
    const validation = validateUserInput(Email, Password);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const userDoc = await db.collection("RegisteredDB").doc(Email).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const userData = userDoc.data();
    const passwordMatch = await bcrypt.compare(Password, userData.Password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
