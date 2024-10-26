import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { motion } from "framer-motion"; // Import motion dari framer-motion

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
    imageUrl: "", // Tambahkan field baru untuk image URL
  });
  const [updatedProduct, setUpdatedProduct] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    image: null,
    imageUrl: "", // Tambahkan field baru untuk image URL
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State loading

  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/products");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setProducts([]);
      }
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

    if (newProduct.image) {
      formData.append("image", newProduct.image);
    } else if (newProduct.imageUrl) {
      formData.append("imageUrl", newProduct.imageUrl);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        image: null,
        imageUrl: "",
      }); // Reset semua field
      fetchProducts();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error adding product";
      setMessage(errorMessage);
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

    if (updatedProduct.image) {
      formData.append("image", updatedProduct.image);
    } else if (updatedProduct.imageUrl) {
      formData.append("imageUrl", updatedProduct.imageUrl);
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/products/${updatedProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setUpdatedProduct({
        id: null,
        name: "",
        price: "",
        stock: "",
        image: null,
        imageUrl: "", // Reset image URL
      });
      fetchProducts();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error updating product";
      setMessage(errorMessage);
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) {
      return; // If user clicks "No", exit the function.
    }

    try {
      const response = await axios.delete(
        `http://localhost:5001/products/${id}`
      );
      setMessage(response.data.message);
      fetchProducts();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error deleting product";
      setMessage(errorMessage);
      console.error("Error deleting product:", error);
    }
  };

  // Function to navigate to different pages
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <h2 className="mt-5 text-xl">Akses semua halaman</h2>

      {message && <p className="text-red-500">{message}</p>}
      {loading && <p>Loading products...</p>}

      <div className="mt-5 mb-5 space-x-4">
        <button
          onClick={() => handleNavigate("/report")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Order Report
        </button>
        <button
          onClick={() => handleNavigate("/kasir")}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Kasir
        </button>
        <button
          onClick={() => handleNavigate("/list")}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          User
        </button>
      </div>

      <h2 className="mt-10 text-xl">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product.id}
              className="border p-4 rounded shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Price: ${Number(product.price).toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              {product.image && (
                <img
                  src={`http://localhost:5001${product.image}`}
                  alt={product.name}
                  className="w-10 h-10 object-cover mt-2 rounded"
                />
              )}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-12 object-cover mt-2 rounded"
                />
              )}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setUpdatedProduct({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      stock: product.stock,
                      image: null,
                      imageUrl: "", // Reset image URL untuk editing
                    });
                  }}
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
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

      <h2 className="mt-10 text-xl">Update Product</h2>
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
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;
