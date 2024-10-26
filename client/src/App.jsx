import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard"; // Komponen Dashboard Umum
import AdminDashboard from "./components/AdminDashboard"; // Komponen Dashboard Admin
import KasirDashboard from "./components/KasirDashboard"; // Komponen Dashboard Kasir
import OrderReport from "./components/OrderReport"; // Komponen Laporan Order
import UserList from "./components/UserList"; // Komponen Daftar Pengguna
import "./index.css";

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
        <Route path="/" element={<Dashboard />} />{" "}
        {/* Use Dashboard as the main route */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/list" element={<UserList />} />
        <Route path="/kasir" element={<KasirDashboard />} />
        <Route path="/report" element={<OrderReport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
