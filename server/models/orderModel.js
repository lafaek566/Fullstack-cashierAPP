const db = require("./db");

const Order = {
  create: async (userId, customerName, items) => {
    if (!customerName) {
      throw new Error("Customer name is required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("At least one item is required");
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Check if customer already exists
      const [customer] = await connection.query(
        "SELECT id FROM customers WHERE name = ?",
        [customerName]
      );

      let customerId;
      if (customer.length > 0) {
        customerId = customer[0].id; // Existing customer
      } else {
        const [insertCustomerResult] = await connection.query(
          "INSERT INTO customers (name) VALUES (?)",
          [customerName]
        );
        customerId = insertCustomerResult.insertId; // New customer
      }

      // Calculate total price based on items
      let totalPrice = 0;
      const orderItemsValues = await Promise.all(
        items.map(async (item) => {
          const [productInfo] = await connection.query(
            "SELECT price FROM products WHERE id = ?",
            [item.id]
          );

          if (productInfo.length === 0) {
            throw new Error(`Product with ID ${item.id} not found`);
          }

          const productPrice = productInfo[0].price;
          totalPrice += productPrice * item.quantity;
          return [item.id, item.quantity, productPrice];
        })
      );

      // Insert into orders table
      const orderQuery =
        "INSERT INTO orders (user_id, customer_id, total_price, order_date) VALUES (?, ?, ?, NOW())";
      const [orderResult] = await connection.query(orderQuery, [
        userId,
        customerId,
        totalPrice,
      ]);
      const orderId = orderResult.insertId;

      // Insert into order_items table
      const orderItemsQuery =
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
      const orderItemsData = orderItemsValues.map((item) => [orderId, ...item]);
      await connection.query(orderItemsQuery, [orderItemsData]);

      await connection.commit();
      return { orderId };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  updateOrder: async (
    orderId,
    customerId,
    customerName,
    totalPrice,
    orderDate
  ) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Update customer data
      const updateCustomerQuery = "UPDATE customers SET name = ? WHERE id = ?";
      await connection.query(updateCustomerQuery, [customerName, customerId]);

      // Update order data
      const updateOrderQuery =
        "UPDATE orders SET customer_id = ?, total_price = ?, order_date = ? WHERE id = ?";
      await connection.query(updateOrderQuery, [
        customerId,
        totalPrice,
        orderDate,
        orderId,
      ]);

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  deleteOrder: async (orderId) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Delete order items
      const deleteOrderItemsQuery =
        "DELETE FROM order_items WHERE order_id = ?";
      await connection.query(deleteOrderItemsQuery, [orderId]);

      // Delete order
      const deleteOrderQuery = "DELETE FROM orders WHERE id = ?";
      await connection.query(deleteOrderQuery, [orderId]);

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  getReport: async () => {
    const connection = await db.getConnection();

    try {
      const query = `
      SELECT 
        o.id AS order_id,
        o.order_date,
        o.user_id,
        u.username AS user_name,
        c.name AS customer_name,
        COUNT(oi.id) AS total_items,
        SUM(COALESCE(oi.price * oi.quantity, 0)) AS total_revenue
      FROM 
        orders o
      LEFT JOIN 
        users u ON o.user_id = u.id
      LEFT JOIN 
        customers c ON o.customer_id = c.id
      LEFT JOIN 
        order_items oi ON o.id = oi.order_id
      GROUP BY 
        o.id, o.order_date, o.user_id, c.name;
      `;

      const [rows] = await connection.query(query);
      return rows;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = Order;
