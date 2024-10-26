// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  const checkUserRole = async () => {
    // Fetch the user role from your backend or local storage
    const token = localStorage.getItem("token"); // Assuming you're storing the token in localStorage
    if (token) {
      try {
        const response = await axios.get("http://localhost:5001/auth/role", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role); // Adjust based on your backend response
      } catch (error) {
        console.error("Failed to fetch user role", error);
        setUserRole(null);
      }
    }
  };

  useEffect(() => {
    checkUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole }}>{children}</AuthContext.Provider>
  );
};
