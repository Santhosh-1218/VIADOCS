import React from "react";
import logo from "../../assets/logo2.png";
import { User, Menu, X } from "lucide-react";

export default function AdminHeader({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 sm:px-6 bg-gradient-to-r from-[#1EC6D7] via-[#4066E0] to-[#6A3FD7] text-white shadow-md z-50">
      {/* Left: Hamburger + Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onToggleSidebar}
          className="block p-2 transition rounded-md sm:hidden bg-white/10 hover:bg-white/20"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-white rounded-full">
            <img
              src={logo}
              alt="VIADOCS"
              className="object-contain w-8 h-8"
            />
          </div>
          <h1 className="text-xl font-bold tracking-wide sm:text-2xl">
            VIADOCS
          </h1>
        </div>
      </div>

      {/* Right: Admin Profile */}
      <div className="flex items-center gap-2">
        <User size={20} className="text-white" />
        <span className="hidden text-sm font-semibold sm:inline sm:text-base">
          Admin
        </span>
      </div>
    </header>
  );
}
