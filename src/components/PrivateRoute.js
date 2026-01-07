import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ If not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in → allow access
  return children;
};

export default PrivateRoute;
