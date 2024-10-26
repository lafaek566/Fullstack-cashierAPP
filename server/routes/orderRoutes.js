const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderReport,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordercontrollers");

// Create a new order
router.post("/", createOrder);

// Get order report
router.get("/report", getOrderReport);

// Update an existing order
router.put("/:orderId", updateOrder);

// Delete an existing order
router.delete("/:orderId", deleteOrder);

module.exports = router;
