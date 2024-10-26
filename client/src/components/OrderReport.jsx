import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./OrderReport.css"; // Import the CSS file

const OrderReport = () => {
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/orders/report");
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
      await axios.put(`http://localhost:5001/orders/${orderId}`, {
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
        await axios.delete(`http://localhost:5001/orders/${orderId}`);
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
            axios.delete(`http://localhost:5001/orders/${orderId}`)
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
    labels: reportData.map((order) => order.order_id),
    datasets: [
      {
        label: "Total Revenue",
        data: reportData.map((order) => order.total_revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h1>Order Report</h1>
      {error && <p>Error: {error}</p>}
      <Bar data={data} />
      <h2>Order List</h2>
      <button onClick={handleDeleteSelected}>Delete Selected Orders</button>
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
                <button onClick={() => setEditOrder(order)}>Edit</button>
                <button onClick={() => handleDelete(order.order_id)}>
                  Delete
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
            <input
              type="datetime-local" // Changed to datetime-local
              value={editOrder.orderDate}
              onChange={(e) =>
                setEditOrder({ ...editOrder, orderDate: e.target.value })
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
    </div>
  );
};

export default OrderReport;
