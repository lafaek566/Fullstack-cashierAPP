// models/db.js
const mysql = require("mysql2");

// Create a connection pool for better performance and scalability
const pool = mysql.createPool({
  host: "localhost", // Replace with your host
  user: "root", // Replace with your database user
  password: "root1234", // Replace with your database password
  database: "cashier_app", // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promisify for Node.js async/await.
const db = pool.promise();

db.getConnection()
  .then(() => {
    console.log("Connected to MySQL database.");
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err);
  });

module.exports = db;
