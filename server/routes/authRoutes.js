const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../models/db"); // Ensure this connects to your database

// User Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get user from database
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0]; // Get the first user object from the rows

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).json({ message: "Login successful!", user });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Registration (optional)
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    res
      .status(201)
      .json({
        message: "User registered successfully!",
        userId: result.insertId,
      });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
