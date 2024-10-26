import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth"; // Komponen untuk Login/Register
import AdminDashboard from "./components/AdminDashboard"; // Komponen Dashboard Admin
import KasirDashboard from "./components/KasirDashboard"; // Komponen Dashboard Kasir
import OrderReport from "./components/OrderReport"; // Komponen Laporan Order
import Dashboard from "./components/Dashboard"; // Komponen Dashboard Umum
import UserList from "./components/UserList";

const NotFound = () => (
  <div>
    <h2>404 Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        {/* Tambahkan route untuk dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/List" element={<UserList />} />
        <Route path="/kasir" element={<KasirDashboard />} />
        <Route path="/report" element={<OrderReport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
