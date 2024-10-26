// models/productModel.js
const db = require("./db");

const Product = {
  getAll: async () => {
    const query = "SELECT * FROM products";
    try {
      const [results] = await db.query(query);
      return results;
    } catch (err) {
      throw err;
    }
  },

  create: async (name, price, stock, imageUrl) => {
    const query =
      "INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)";
    try {
      const [result] = await db.query(query, [name, price, stock, imageUrl]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  update: async (id, name, price, stock, imageUrl) => {
    // If imageUrl is null, don't update it
    let query = "UPDATE products SET name = ?, price = ?, stock = ?";
    const params = [name, price, stock];

    if (imageUrl) {
      query += ", image = ?";
      params.push(imageUrl);
    }

    query += " WHERE id = ?";
    params.push(id);

    try {
      const [result] = await db.query(query, params);
      return result;
    } catch (err) {
      throw err;
    }
  },

  deleteProduct: async (id) => {
    const query = "DELETE FROM products WHERE id = ?";
    try {
      const [result] = await db.query(query, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Product;
