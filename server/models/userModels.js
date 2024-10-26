const db = require("../models/db");

// Get all users
exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

// Get user by ID
exports.getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

// Create a new user
exports.createUser = async (user) => {
  const [result] = await db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [user.username, user.password, user.role]
  );
  return result;
};

// Update user
exports.updateUser = async (id, user) => {
  const [result] = await db.query(
    "UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?",
    [user.username, user.password, user.role, id]
  );
  return result;
};

// Delete user
exports.deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result;
};
