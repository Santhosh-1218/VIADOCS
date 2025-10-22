import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.jpg";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "other",
    referred_by: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [referralValid, setReferralValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const navigate = useNavigate();

  // ✅ Check username availability
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (formData.username.trim()) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/auth/check-username?username=${formData.username}`
          );
          const data = await res.json();
          setUsernameError(!data.available ? "Username already taken" : "");
        } catch (err) {
          console.error("Error checking username:", err);
        }
      } else {
        setUsernameError("");
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [formData.username]);

  // ✅ Check email availability
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (formData.email.trim()) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/auth/check-email?email=${formData.email}`
          );
          const data = await res.json();
          setEmailError(!data.available ? "Email already registered" : "");
        } catch (err) {
          console.error("Error checking email:", err);
        }
      } else {
        setEmailError("");
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [formData.email]);

  // ✅ Check referral code availability/validity
  useEffect(() => {
    const delay = setTimeout(async () => {
      const code = formData.referred_by.trim();
      if (showReferral && code.length > 0) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/auth/check-referral?code=${encodeURIComponent(
              code
            )}`
          );
          const data = await res.json();
          if (res.ok && data && typeof data.valid !== "undefined") {
            setReferralValid(!!data.valid);
            setReferralError(data.valid ? "" : "The referral code is invalid");
          } else {
            setReferralValid(false);
            setReferralError("Unable to validate referral code");
          }
        } catch (err) {
          console.error("Error checking referral:", err);
          setReferralValid(false);
          setReferralError("Unable to validate referral code");
        }
      } else {
        // if referral not shown or empty, it's fine
        setReferralValid(true);
        setReferralError("");
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [formData.referred_by, showReferral]);

  // ✅ Smart form validation (Referral optional)
  const isFormValid =
    formData.username &&
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.dateOfBirth &&
    !usernameError &&
    !emailError &&
    formData.password === formData.confirmPassword &&
    // only require referral if user chose to enter one
  // require a non-empty referral only if user opted in, and require it to be validated
  (!showReferral || (formData.referred_by.trim().length > 0 && referralValid));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill all fields correctly!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dateOfBirth,
          gender: formData.gender,
          referred_by: showReferral ? formData.referred_by.trim() : "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Normalize referral-related errors to a friendlier single message
        const errMsg = (data && data.error) ? data.error : "Signup failed";
        if (typeof errMsg === "string" && errMsg.toLowerCase().includes("referral")) {
          toast.error("The referral code is invalid");
        } else {
          toast.error(errMsg || "Signup failed");
        }
        return;
      }

      toast.success("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[#EAF4FC] to-[#CFE3FA]">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        transition={Slide}
      />

      <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white shadow-2xl md:flex-row rounded-2xl">
        {/* Left Section - Image + Back Button */}
        <div className="relative flex items-center justify-center w-full bg-white md:flex-1 md:py-10">
          

          <img
            src={logo}
            alt="Logo"
            className="object-contain w-3/4 max-w-[300px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[500px]"
            draggable="false"
          />
        </div>

        {/* Right Section - Form */}
        <div className="flex flex-col justify-center flex-1 p-6 md:p-10">
          <h2 className="mb-2 text-3xl font-bold text-[#304FFE] sm:text-4xl">
            Create Account
          </h2>
          <p className="mb-6 text-gray-600">
            Join <strong>ViaDocs</strong> and start building smarter!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-b-2 outline-none transition-all ${
                  usernameError
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#3F51B5]"
                }`}
                required
              />
              {usernameError && (
                <p className="mt-1 text-sm text-red-500">{usernameError}</p>
              )}
            </div>

            {/* First & Last Name */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 outline-none focus:border-[#3F51B5]"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 outline-none focus:border-[#3F51B5]"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border-b-2 outline-none transition-all ${
                emailError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-[#3F51B5]"
              }`}
              required
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}

            {/* Password */}
            <div className="relative flex items-center border-b-2 border-gray-300 focus-within:border-[#3F51B5]">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 bg-transparent outline-none"
                required
                minLength={6}
              />
              <span
                className="text-[#3F51B5] cursor-pointer hover:text-[#1E88E5]"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative flex items-center border-b-2 border-gray-300 focus-within:border-[#3F51B5]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 bg-transparent outline-none"
                required
              />
              <span
                className="text-[#3F51B5] cursor-pointer hover:text-[#1E88E5]"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* DOB & Gender */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 outline-none focus:border-[#3F51B5]"
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 outline-none focus:border-[#3F51B5]"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Referral Code */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showReferral}
                  onChange={() => setShowReferral((prev) => !prev)}
                />
                <span className="text-sm text-gray-700">
                  I have a referral code
                </span>
              </label>

              {showReferral && (
                <input
                  type="text"
                  name="referred_by"
                  placeholder="Enter referral code"
                  value={formData.referred_by}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-2 border-b-2 border-gray-300 outline-none focus:border-[#3F51B5]"
                />
              )}
              {showReferral && referralError && (
                <p className="mt-1 text-sm text-red-500">{referralError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 font-semibold text-white transition-all rounded-full shadow-md ${
                isFormValid
                  ? "bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-semibold cursor-pointer text-[#1E88E5] hover:underline"
            >
              Log in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
