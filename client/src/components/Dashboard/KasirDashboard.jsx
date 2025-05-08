import React, { useState, useEffect, useRef } from "react";
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
  const [orderId, setORderId] = useState("");
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
        }));
        console.log("formatted products:", formattedProducts);
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

    // Fetch report data on component mount and then every 5 seconds
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

    const existingItem = cart.find(
      (item) => item.name === product.name && item.size === product.size
    );
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
    alert(`${product.name} (${product.size}) added to cart!`);
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
        alert("checkout success...");
      }
    } catch (error) {
      console.error(
        "Checkout failed:",
        error.response ? error.response.data : error
      );
      alert("Checkout succees. Please try again.");
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

      {/* // customer_name && balance */}
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

      {/* motion untuk produts */}
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
              value={product.size || "medium"} // Set default if size is undefined
              onChange={(e) => {
                const updatedProduct = {
                  ...product,
                  size: e.target.value,
                };
                setProducts(
                  products.map((p) =>
                    p.id === product.id ? updatedProduct : p
                  )
                ); // Update state
              }}
            >
              {" "}
              <option>chooses size</option>
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

      {/* cart add dan tampilan */}
      <div style={styles.productGrid}></div>
      <h2 className="text-xl">Cart</h2>
      <p>
        Please note: Items in your cart are available in sizes: Small, Medium,
        and Large.
      </p>
      {cart.length > 0 ? (
        <div style={styles.cartContainer}>
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} style={styles.cartItem}>
              <h3>
                {item.name} (Size: {item.size})
              </h3>
              <p>
                Price: ${item.price.toFixed(2)} - Quantity: {item.quantity}
              </p>
              <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
              <button onClick={() => handleReduceQuantity(item)}> - </button>
              <button onClick={() => handleIncreaseQuantity(item)}> + </button>
              <button onClick={() => handleRemoveFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <h3>Total Price: ${calculateTotalPrice()}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}

      <ReceiptComponent
        cart={cart}
        customerName={customerName}
        customerBalance={customerBalance}
      />
      <h2>Order Report</h2>
      <Bar data={chartData} options={chartOptions} />
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
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  cartContainer: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "10px",
  },
  cartItem: {
    borderBottom: "1px solid #ddd",
    padding: "5px 0",
  },
  titleContainer: {
    display: "flex", // Align elements horizontally
    flexDirection: "row", // Default to horizontal
    alignItems: "center", // Center vertically
    gap: "20px", // Gap between items for desktop
    padding: "10px", // Padding for the container
    flexWrap: "wrap", // Allow elements to wrap to the next line if necessary
  },
  titleInput: {
    padding: "5px", // Padding inside input
    width: "100%", // Full width for mobile
    maxWidth: "200px", // Maximum width for desktop
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  titleH3: {
    margin: 0, // Remove default margin on <h3>
    flex: "1", // Allow <h3> to take up space
  },
};

// Media Queries for Mobile Responsiveness
const mediaQueryStyles = `
  @media (max-width: 600px) {
    .productGrid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); // Smaller min-width for mobile
    }
    .productImage {
      width: 100%; // Full width for mobile
      height: auto; // Maintain aspect ratio
    }
    .titleContainer {
      flex-direction: column; // Stack elements vertically on mobile
      gap: 5px; // Reduced gap for mobile
      align-items: flex-start; // Align items to the start for better layout
   
    }
    .titleInput {
      width: 100%; // Full width for mobile input
      padding: 0.5rem; /* Add padding for better touch targets */
       
    }
  }
`;

// Insert media query styles into a <style> element in your component
const styleElement = document.createElement("style");
styleElement.textContent = mediaQueryStyles;
document.head.appendChild(styleElement);

export default KasirDashboard;
