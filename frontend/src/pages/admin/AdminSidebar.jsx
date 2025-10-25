import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Optional icon (install lucide-react if not yet)
 
export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const links = [
    { label: "Home", path: "/admin/home" },
    { label: "Site Visitors", path: "/admin/visitors" },
    { label: "FeedBacks", path: "/admin/feedbacks" },
    { label: "Contacts", path: "/admin/contacts" },
    { label: "Premiums", path: "/admin/premiums" },
  ];

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT token
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside
      className={`fixed left-0 top-16 w-56 h-[calc(100vh-64px)] bg-[#D3EAFD] border-r border-[#90CAF9] shadow-inner transform transition-transform duration-300 z-40
      ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
    >
      <h2 className="text-lg font-extrabold text-center py-3 text-[#0D47A1]">
        DASHBOARD
      </h2>

      <nav className="flex flex-col gap-3 px-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-4 py-2 font-semibold rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#4066E0] to-[#6A3FD7] text-white"
                  : "bg-[#BBDEFB] text-[#0D47A1] hover:bg-[#90CAF9]"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* ✅ Logout Button at Bottom */}
      <div className="absolute left-0 w-full px-3 bottom-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 font-semibold text-white transition-all bg-gradient-to-r from-[#E53935] to-[#C62828] rounded-lg shadow-md hover:opacity-90 hover:scale-[1.03]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
