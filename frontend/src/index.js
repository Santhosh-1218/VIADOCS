import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // Tailwind styles
import App from "./App";
import { Toaster } from "react-hot-toast";  // ✅ import toaster

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* ✅ Toast notification container */}
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: "#22c55e", // Tailwind green-500
            color: "white",
            fontWeight: "600",
          },
          iconTheme: {
            primary: "white",
            secondary: "#22c55e",
          },
        },
        error: {
          style: {
            background: "#ef4444", // Tailwind red-500
            color: "white",
            fontWeight: "600",
          },
          iconTheme: {
            primary: "white",
            secondary: "#ef4444",
          },
        },
      }}
    />
  </React.StrictMode>
);
