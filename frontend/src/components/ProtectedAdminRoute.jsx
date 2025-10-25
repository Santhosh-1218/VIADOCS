import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ If not logged in or not an admin → redirect to login
  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // ✅ If admin → allow access
  return children;
}
