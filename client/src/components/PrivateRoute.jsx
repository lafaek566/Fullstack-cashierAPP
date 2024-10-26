// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles, userRole }) => {
  const isAuthorized = allowedRoles.includes(userRole);

  return isAuthorized ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
