// src/components/Footer/Footer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="py-8 text-white bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          {/* Left Side */}
          <div>
            <p className="flex items-center gap-2 text-sm text-gray-400">
              By Work Wizards Innovations
            </p>
            <p className="mt-1 text-xs text-gray-500">
              © 2025 Pro Doc. All rights reserved.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 sm:justify-end">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="transition hover:text-white"
            >
              Privacy Policy
            </button>
            <span className="hidden text-gray-600 sm:block">|</span>
            <button
              onClick={() => navigate("/contact")}
              className="transition hover:text-white"
            >
              Contact Us
            </button>
            <span className="hidden text-gray-600 sm:block">|</span>
            <button
              onClick={() => navigate("/help")}
              className="transition hover:text-white"
            >
              Help Center
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
