import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import DashboardU from "./components//Dashboard/DashboardU";
import AdminDashboard from "./components/Dashboard/AdminDashboard"; // Komponen Dashboard Admin
import KasirDashboard from "./components/Dashboard/KasirDashboard"; // Komponen Dashboard Kasir
import OrderReport from "./components/Order/OrderReport"; // Komponen Laporan Order
import UserList from "./components/List/UserList"; // Komponen Daftar Pengguna
import Footer from "./components/Footer/Footer";

import "./index.css";

// import Dashboard from "./components/Dashboard"; // Komponen Dashboard Umum

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
        <Route path="/" element={<DashboardU />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />{" "} */}
        {/* Use Dashboard as the main route */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/list" element={<UserList />} />
        <Route path="/kasir" element={<KasirDashboard />} />
        <Route path="/report" element={<OrderReport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
