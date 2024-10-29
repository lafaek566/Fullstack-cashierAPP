import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";

const ReceiptComponent = ({ customerName, customerBalance, cart }) => {
  const receiptRef = useRef();

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
          `${item.name} (Size: ${item.size}) (x${item.quantity}) - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n")}
    --------------------
    Total Price: $${calculateTotalPrice().toFixed(2)}
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Receipt</h2>
      <div ref={receiptRef} style={styles.receiptContent}>
        <p style={styles.dateTime}>Date & Time: {formatDate()}</p>
        <p style={styles.customer}>Customer: {customerName}</p>
        <p style={styles.sectionTitle}>Cart Items:</p>
        <ul style={styles.itemList}>
          {cart.map((item, index) => (
            <li key={index} style={styles.item}>
              {item.name} (Size: {item.size}) (x{item.quantity}) - $
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p style={styles.totals}>
          Total Price: ${calculateTotalPrice().toFixed(2)}
        </p>
        <p style={styles.totals}>Customer Balance: ${customerBalance}</p>
        <p style={styles.totals}>
          Remaining Balance: $
          {(customerBalance - calculateTotalPrice()).toFixed(2)}
        </p>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handlePrintReceipt}>
          Print Receipt
        </button>
        <button style={styles.button} onClick={handleGeneratePDF}>
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default ReceiptComponent;

// Inline styling
const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  receiptContent: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  dateTime: {
    fontSize: "14px",
    marginBottom: "8px",
    color: "#555",
  },
  customer: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "15px",
    marginBottom: "10px",
  },
  itemList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    fontSize: "14px",
    marginBottom: "5px",
    paddingLeft: "10px",
    borderLeft: "3px solid #ddd",
  },
  totals: {
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "500",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
