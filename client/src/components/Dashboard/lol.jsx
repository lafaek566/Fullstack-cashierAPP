import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import ReceiptComponent from "./ReceiptComponent";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function KasirDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerBalance, setCustomerBalance] = useState("");
  const [reportData, setReportData] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5002/products");
        const formattedProducts = response.data.map((product) => ({
          ...product,
          price: parseFloat(product.price) || 0,
          quantity: 1,
          size: "medium", // Set default size
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch report data periodically
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get("http://localhost:5002/orders/report");
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchReportData();
    const intervalId = setInterval(fetchReportData, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleAddToCart = (product) => {
    const sizePriceAdjustment = (size) => {
      switch (size) {
        case "small":
          return product.price - 3; // Reduce $3 for small
        case "medium":
          return product.price; // Normal price
        case "large":
          return product.price + 3; // Add $3 for large
        default:
          return product.price; // Default to normal price
      }
    };

    const existingItem = cart.find((item) => item.id === product.id);
    const adjustedPrice = sizePriceAdjustment(product.size); // Use the size from the product

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, price: adjustedPrice }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, price: adjustedPrice }]);
    }
    alert(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (id, quantity) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
  };

  const handleReduceQuantity = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      handleRemoveFromCart(product.id);
    }
  };

  const handleIncreaseQuantity = (item) => {
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (itemIndex !== -1) {
      const newCart = [...cart];
      newCart[itemIndex].quantity += 1;
      setCart(newCart);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateTotalPrice = () => {
    return cart
      .reduce(
        (total, item) => total + parseFloat(item.price) * Number(item.quantity),
        0
      )
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const totalPrice = calculateTotalPrice();
    console.log("Calculated Total Price:", totalPrice);

    const orderData = {
      user_id: 1, // Make sure this is the correct user ID
      customer_name: customerName,
      items: cart.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      })),
    };

    console.log("Order Data:", orderData);

    try {
      const response = await axios.post(
        "http://localhost:5002/orders",
        orderData
      );
      console.log("Response Data:", response.data); // Log the response data
      console.log("Response Status:", response.status); // Log the status
      if (response.status === 200) {
        alert("Order placed successfully");
        setCart([]);
        setCustomerName("");
        setCustomerBalance(0);
        setProducts(products.map((product) => ({ ...product, quantity: 1 })));
      } else {
        alert("Checkout success...");
      }
    } catch (error) {
      console.error(
        "Checkout failed:",
        error.response ? error.response.data : error
      );
      alert("Checkout failed. Please try again.");
    }
  };

  const chartData = {
    labels: reportData.map((data) => data.customer_name),
    datasets: [
      {
        label: "Total Items",
        data: reportData.map((data) => data.total_orders),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Total Revenue",
        data: reportData.map((data) => data.total_revenue),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Order Report (Customer, Total Items, Total Revenue)",
      },
    },
  };

  return (
    <div>
      <h1>Kasir Dashboard</h1>
      <h2>Products</h2>

      <div style={styles.titleContainer}>
        <h3 className="text-xl">Customer Name:</h3>
        <input
          style={styles.titleInput}
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter name"
        />
        <h3>Customer Balance:</h3>
        <input
          style={styles.titleInput}
          type="number"
          value={customerBalance}
          onChange={(e) => setCustomerBalance(Number(e.target.value))}
          placeholder="Enter balance"
        />
      </div>

      <motion.div
        style={styles.productGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            style={styles.productContainer}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: product.id * 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.85 }}
          >
            {product.image && (
              <motion.img
                src={`http://localhost:5002${product.image}`}
                alt={product.name}
                style={styles.productImage}
                whileHover={{ scale: 1.1 }}
              />
            )}
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <select
              value={product.size} // Ensure your product object has a size property
              onChange={(e) => {
                // Update product size logic here
                const selectedSize = e.target.value;
                setProducts(
                  products.map((p) =>
                    p.id === product.id ? { ...p, size: selectedSize } : p
                  )
                );
              }}
            >
              <option value="small">Small -3$</option>
              <option value="medium">Medium</option>
              <option value="large">Large +3$</option>
            </select>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - Size: {item.size} - {item.quantity} x $
                {item.price.toFixed(2)}{" "}
                <button onClick={() => handleReduceQuantity(item)}> - </button>
                <button onClick={() => handleIncreaseQuantity(item)}>
                  {" "}
                  +{" "}
                </button>
                <button onClick={() => handleRemoveFromCart(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total Price: ${calculateTotalPrice()}</h3>
        <button onClick={handleCheckout}>Checkout</button>
      </div>

      <div>
        <h2>Cart</h2>
        <p>
          Please note: Items in your cart are available in sizes: Small, Medium,
          and Large.
        </p>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} (Size: {item.size}) - {item.quantity} x $
                {item.price.toFixed(2)}{" "}
                <button onClick={() => handleReduceQuantity(item)}> - </button>
                <button onClick={() => handleIncreaseQuantity(item)}>
                  {" "}
                  +{" "}
                </button>
                <button onClick={() => handleRemoveFromCart(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total Price: ${calculateTotalPrice()}</h3>
        <button onClick={handleCheckout}>Checkout</button>
      </div>

      <h2>Sales Report</h2>
      <Bar options={chartOptions} data={chartData} />
      <ReceiptComponent cart={cart} />
    </div>
  );
}

const styles = {
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  titleInput: {
    marginBottom: "0.5rem",
    padding: "0.5rem",
    fontSize: "1rem",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "1rem",
  },
  productContainer: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    maxWidth: "100%",
    borderRadius: "4px",
  },
};

export default KasirDashboard;
