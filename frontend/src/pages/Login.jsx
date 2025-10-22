import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- Handle Input Change ----------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  // ---------------- Handle Form Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = { message: "Unexpected server response" };
      }

      // ✅ Handle invalid credentials (401, etc.)
      if (!res.ok) {
        toast.error(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // ✅ Successful login
      localStorage.setItem("token", data.token);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      // ❌ Only show friendly message, no console error
      toast.error("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[#EAF4FC] to-[#CFE3FA]">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white shadow-xl md:flex-row rounded-2xl">
        {/* Left Section - Logo */}
        <div className="flex items-center justify-center flex-1 p-6 bg-white">
          <img
            src={logo}
            alt="Logo"
            className="object-contain w-full h-48 md:h-full"
            draggable="false"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="flex flex-col justify-center flex-1 p-6 md:p-10">
          <h2 className="mb-6 text-2xl font-bold text-[#304FFE] sm:text-3xl">
            Welcome Back
          </h2>
          <p className="mb-6 text-gray-600">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#3F51B5]">
              <User className="mr-3 text-[#3F51B5]" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-3 text-gray-700 bg-transparent outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#3F51B5]">
              <Lock className="mr-3 text-[#3F51B5]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full py-3 text-gray-700 bg-transparent outline-none"
              />
              <button
                type="button"
                className="text-[#3F51B5] hover:text-[#1E88E5]"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-right text-[#3F51B5] cursor-pointer hover:text-[#1E88E5]"
            >
              Forgot Password?
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-medium text-white transition rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup link */}
          <div className="mt-6 text-center text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#1E88E5] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
