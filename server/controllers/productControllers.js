// controllers/productControllers.js
const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).single("image"); // 'image' should match the field name in the form

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
};

const addProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error("Multer error:", err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading
      console.error("Unknown error:", err);
      return res.status(500).json({ error: err.message });
    }

    const { name, price, stock } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic validation
    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock are required." });
    }

    try {
      const result = await Product.create(name, price, stock, imagePath);
      res.status(201).json({
        message: "Product created successfully",
        productId: result.insertId,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

const updateProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error("Multer error:", err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading
      console.error("Unknown error:", err);
      return res.status(500).json({ error: err.message });
    }

    const { id } = req.params;
    const { name, price, stock } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic validation
    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock are required." });
    }

    try {
      const result = await Product.update(id, name, price, stock, imagePath);
      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Product.deleteProduct(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
