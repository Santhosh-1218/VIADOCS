import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminHome from "./AdminHome";
import Feedbacks from "./Feedbacks";
import Contacts from "./Contacts";
import Visitors from "./Visitors";
import Premiums from "./Premiums";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "admin") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // If not authenticated, don’t render dashboard content
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#D3EAFD] flex flex-col transition-all duration-300">
      {/* ====== Header ====== */}
      <AdminHeader onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* ====== Sidebar ====== */}
      <AdminSidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* ====== Mobile Overlay ====== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* ====== Admin Routes ====== */}
      <div className="flex-grow">
        <Routes>
          <Route path="/home" element={<AdminHome />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/premiums" element={<Premiums />} />
          <Route path="*" element={<Navigate to="/admin/home" />} />
        </Routes>
      </div>
    </div>
  );
}
