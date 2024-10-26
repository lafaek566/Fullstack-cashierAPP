// controllers/authControllers.js
const { findUserByUsername, createUser } = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const bcrypt = require("bcrypt");

// Register
exports.register = (req, res) => {
  const { username, password, role } = req.body;

  console.log("Incoming registration data:", req.body); // Debugging log

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  findUserByUsername(username, (err, result) => {
    if (err) {
      console.error("Error finding user: ", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    createUser(username, password, role, (err, result) => {
      if (err) {
        console.error("Error creating user: ", err);
        return res.status(500).json({ message: "Database error" });
      }
      return res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { username, password } = req.body;

  findUserByUsername(username, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!result.length)
      return res.status(401).json({ message: "User not found" });

    const user = result[0];
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "1d",
    });
    res.json({ token, role: user.role });
  });
};
