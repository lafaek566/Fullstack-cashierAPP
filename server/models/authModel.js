// models/usermodel.js
const db = require("./db");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Function to find user by username
exports.findUserByUsername = (username, callback) => {
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], callback);
};

// Function to create a new user
exports.createUser = (username, password, role, callback) => {
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

  console.log("Creating user with data:", { username, hashedPassword, role });

  db.query(query, [username, hashedPassword, role], (err, results) => {
    if (err) {
      console.error("Error inserting user into the database:", err);
      return callback(err);
    }
    console.log("User created successfully:", results);
    return callback(null, results);
  });
};
