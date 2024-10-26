import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
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
  const receiptRef = useRef();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/products");
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
        const response = await axios.get("http://localhost:5001/orders/report");
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
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, price: Number(product.price) },
      ]);
    }
    alert(`${product.name} added to chart!`);
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
        "http://localhost:5001/orders",
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

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const generateReceiptOutput = () => {
    return `
    --------------------
    Receipt
    Date & Time: ${formatDate()}
    Customer: ${customerName}
    Cart Items:
    ${cart
      .map(
        (item) =>
          `${item.name} (x${item.quantity}) - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n")}
    --------------------
    Total Price: $${calculateTotalPrice()}
    Customer Balance: $${customerBalance}
    Remaining Balance: $${(customerBalance - calculateTotalPrice()).toFixed(2)}
    --------------------
  `;
  };

  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text(generateReceiptOutput(), 10, 10);
    doc.save("receipt.pdf");
  };

  return (
    <div>
      <h1>Kasir Dashboard</h1>

      <div>
        <h2 className="text-xl">Customer Name:</h2>
        <input
          className="space-y-7 border p-2 w-full"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div>
        <h2>Customer Balance:</h2>
        <input
          className="space-y-7"
          type="number"
          value={customerBalance}
          onChange={(e) => setCustomerBalance(Number(e.target.value))}
          placeholder="Enter balance"
        />
      </div>

      <h2>Products</h2>
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
                src={`http://localhost:5001${product.image}`}
                alt={product.name}
                style={styles.productImage}
                whileHover={{ scale: 1.1 }}
              />
            )}
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            {/* <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleQuantityChange(
                  product.id,
                  isNaN(value) || value < 1 ? 1 : value
                );
              }}
              placeholder="Quantity"
            /> */}
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </motion.div>
        ))}
      </motion.div>

      <h2>Cart</h2>
      {cart.length > 0 ? (
        <div style={styles.cartContainer}>
          {cart.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
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

      <div style={styles.receipt} ref={receiptRef}>
        <h2>Receipt</h2>
        <pre>{generateReceiptOutput()}</pre>
      </div>

      <button onClick={handlePrintReceipt}>Print Receipt</button>
      <button onClick={handleGeneratePDF}>Generate PDF</button>
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
  receipt: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default KasirDashboard;
