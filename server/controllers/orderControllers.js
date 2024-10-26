const Order = require("../models/ordermodel");

// Create a new order
const createOrder = async (req, res) => {
  const { user_id, customer_name, items } = req.body;

  if (
    !user_id ||
    !customer_name ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ message: "Invalid order data." });
  }

  try {
    const { orderId } = await Order.create(user_id, customer_name, items);
    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error placing order." });
  }
};

// Get order report
const getOrderReport = async (req, res) => {
  try {
    const report = await Order.getReport();
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching order report:", error);
    res.status(500).json({ error: "Error fetching order report." });
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { customerId, customerName, totalPrice, orderDate } = req.body;

  try {
    await Order.updateOrder(
      orderId,
      customerId,
      customerName,
      totalPrice,
      orderDate
    );
    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete an existing order
const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId; // Extract orderId from request parameters

  // Check if orderId is valid
  if (!orderId) {
    return res.status(400).json({ message: "Invalid order ID." });
  }

  try {
    await Order.deleteOrder(orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrderReport,
  updateOrder,
  deleteOrder,
};
