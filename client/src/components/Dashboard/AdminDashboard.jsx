import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
    imageUrl: "",
  });
  const [updatedProduct, setUpdatedProduct] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    image: null,
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const updateFormRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/products");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProduct.price <= 0 || newProduct.stock < 0) {
      setMessage(
        "Price must be greater than 0 and stock must not be negative."
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    if (newProduct.image) formData.append("image", newProduct.image);
    if (newProduct.imageUrl) formData.append("imageUrl", newProduct.imageUrl);

    try {
      const response = await axios.post(
        "http://localhost:5001/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        image: null,
        imageUrl: "",
      });
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error adding product");
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (updatedProduct.price <= 0 || updatedProduct.stock < 0) {
      setMessage(
        "Price must be greater than 0 and stock must not be negative."
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("price", updatedProduct.price);
    formData.append("stock", updatedProduct.stock);
    if (updatedProduct.image) formData.append("image", updatedProduct.image);
    if (updatedProduct.imageUrl)
      formData.append("imageUrl", updatedProduct.imageUrl);

    try {
      const response = await axios.put(
        `http://localhost:5001/products/${updatedProduct.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(response.data.message);
      setUpdatedProduct({
        id: null,
        name: "",
        price: "",
        stock: "",
        image: null,
        imageUrl: "",
      });
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating product");
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:5001/products/${id}`
      );
      setMessage(response.data.message);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (product) => {
    setUpdatedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: null,
      imageUrl: "",
    });
    updateFormRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <h2 className="mt-5 text-xl">Akses semua halaman</h2>
      {message && <p className="text-red-500">{message}</p>}
      {loading && <p>Loading products...</p>}

      <div className="mt-5 mb-5 space-x-4">
        <button
          onClick={() => navigate("/report")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Order Report
        </button>
        <button
          onClick={() => navigate("/kasir")}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Kasir
        </button>
        <button
          onClick={() => navigate("/list")}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          User
        </button>
      </div>

      <h2 className="mt-10 text-xl">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="file"
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.files[0] })
          }
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Product
        </button>
      </form>

      <h2 className="mt-10 text-xl" ref={updateFormRef}>
        Update Product
      </h2>
      <form onSubmit={handleUpdateProduct} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={updatedProduct.name}
          onChange={(e) =>
            setUpdatedProduct({ ...updatedProduct, name: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={updatedProduct.price}
          onChange={(e) =>
            setUpdatedProduct({ ...updatedProduct, price: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          placeholder="Stock"
          value={updatedProduct.stock}
          onChange={(e) =>
            setUpdatedProduct({ ...updatedProduct, stock: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="file"
          onChange={(e) =>
            setUpdatedProduct({ ...updatedProduct, image: e.target.files[0] })
          }
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Update Product
        </button>
      </form>

      <h2 className="mt-5 text-xl">Product List</h2>
      <div style={styles.productGrid}>
        {products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product.id}
              style={styles.productContainer}
              className="border p-5 rounded shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} // Hover effect
              transition={{ duration: 0.4 }}
              whileTap={{ scale: 0.85 }}
            >
              {product.image && (
                <img
                  src={`http://localhost:5001${product.image}`}
                  alt={product.name}
                  style={styles.productImage}
                />
              )}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-12 object-cover mt-1 rounded"
                />
              )}
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Price: ${Number(product.price).toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <div className="space-x-3 mt-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "10px",
  },
  productContainer: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  productImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },
};

export default AdminDashboard;
