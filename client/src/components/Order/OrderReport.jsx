import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import jsPDF autotable plugin
import ReceiptComponent from "../Dashboard/ReceiptComponent"; // Import the ReceiptComponent
import "./OrderReport.css"; // Import the CSS file

const OrderReport = () => {
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [receiptData, setReceiptData] = useState(null); // State to manage receipt data

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5002/orders/report");
      if (Array.isArray(response.data)) {
        setReportData(response.data);
      } else {
        throw new Error("Data is not an array");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    }
  };

  const handleUpdate = async (orderId) => {
    try {
      await axios.put(`http://localhost:5002/orders/${orderId}`, {
        customer_name: editOrder.customerName,
        total_price: editOrder.totalPrice,
        order_date: editOrder.orderDate,
        total_items: editOrder.totalItems,
        customer_id: editOrder.customerId,
      });
      alert("Order updated successfully");
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5002/orders/${orderId}`);
        alert("Order deleted successfully");
        fetchOrders();
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      alert("No orders selected for deletion.");
      return;
    }

    if (window.confirm("Are you sure you want to delete selected orders?")) {
      try {
        await Promise.all(
          selectedOrders.map((orderId) =>
            axios.delete(`http://localhost:5002/orders/${orderId}`)
          )
        );
        alert("Selected orders deleted successfully");
        setSelectedOrders([]);
        fetchOrders();
      } catch (err) {
        console.error("Error deleting selected orders:", err);
      }
    }
  };

  const data = {
    labels: reportData.map((order) => order.customer_name),
    datasets: [
      {
        label: "Total Revenue",
        data: reportData.map((order) => order.total_revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "OrderReport.xlsx");
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Report", 14, 22);

    const tableData = reportData.map((order) => ({
      OrderID: order.order_id,
      OrderDate: new Date(order.order_date).toLocaleString(),
      CustomerName: order.customer_name,
      TotalItems: order.total_items,
      TotalRevenue: order.total_revenue,
    }));

    doc.autoTable({
      head: [
        [
          "Order ID",
          "Order Date",
          "Customer Name",
          "Total Items",
          "Total Revenue",
        ],
      ],
      body: tableData.map((order) => [
        order.OrderID,
        order.OrderDate,
        order.CustomerName,
        order.TotalItems,
        order.TotalRevenue,
      ]),
    });

    doc.save("OrderReport.pdf");
  };

  return (
    <div>
      <h1>Order Report</h1>
      {error && <p>Error: {error}</p>}
      <div style={{ width: "100%", height: "300px" }}>
        <Bar data={data} options={options} />
      </div>
      <h2>Order List</h2>
      <button onClick={handleDeleteSelected}>Delete Selected Orders</button>
      <button onClick={handleExportToExcel}>Export to Excel</button>
      <button onClick={handlePrintPDF}>Print PDF</button>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Customer Name</th>
            <th>Total Items</th>
            <th>Total Revenue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((order) => (
            <tr key={order.order_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.order_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders([...selectedOrders, order.order_id]);
                    } else {
                      setSelectedOrders(
                        selectedOrders.filter((id) => id !== order.order_id)
                      );
                    }
                  }}
                />
              </td>
              <td>{order.order_id}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.customer_name}</td>
              <td>{order.total_items}</td>
              <td>{order.total_revenue}</td>
              <td>
                <button
                  onClick={() => {
                    setEditOrder({
                      order_id: order.order_id,
                      customerName: order.customer_name,
                      totalPrice: order.total_revenue,
                      orderDate: order.order_date,
                      totalItems: order.total_items,
                      customerId: order.customer_id,
                    });
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(order.order_id)}>
                  Delete
                </button>
                <button
                  onClick={() => {
                    setReceiptData({
                      customerName: order.customer_name,
                      customerBalance: order.customer_balance || 0, // Update this to get the correct balance
                      cart: order.cart || [], // Assume cart details are included in the order
                    });
                  }}
                >
                  View Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editOrder && (
        <div>
          <h2>Edit Order</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editOrder.order_id);
            }}
          >
            <input
              type="text"
              placeholder="Customer Name"
              value={editOrder.customerName}
              onChange={(e) =>
                setEditOrder({ ...editOrder, customerName: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Total Price"
              value={editOrder.totalPrice}
              onChange={(e) =>
                setEditOrder({ ...editOrder, totalPrice: e.target.value })
              }
              required
            />

            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditOrder(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {receiptData && (
        <ReceiptComponent
          customerName={receiptData.customerName}
          customerBalance={receiptData.customerBalance}
          cart={receiptData.cart}
        />
      )}
    </div>
  );
};

export default OrderReport;
