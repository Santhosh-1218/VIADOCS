// src/pages/Feedback.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, Star, User } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";


export default function Feedback() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [feedback, setFeedback] = useState({
    message: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Fetch logged-in user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fullName = `${res.data.firstName || ""} ${res.data.lastName || ""}`.trim();
        setUser({
          name: fullName || res.data.username || "User",
          email: res.data.email || "",
        });
      })
      .catch(() => {
        console.log("No user logged in or token expired");
      });
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  // ✅ Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/feedback",
        {
          message: feedback.message,
          rating: feedback.rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setSuccess(true);
        setFeedback({ message: "", rating: "" });
        toast.success("✅ Feedback submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("❌ Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="flex justify-start mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4066E0] to-[#1EC6D7] hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium sm:text-base">Back</span>
            </button>
          </div>

          {/* Feedback Card */}
          <div className="p-8 border border-[#1EC6D7]/30 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl">
            <h1 className="text-3xl font-extrabold text-center text-[#4066E0] sm:text-4xl">
              Share Your <span className="text-[#1EC6D7]">Feedback</span>
            </h1>
            <p className="max-w-lg mx-auto mt-3 text-center text-gray-600">
              We value your opinion! Tell us how{" "}
              <span className="text-[#4066E0] font-semibold">Viadoc</span> can serve you better.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6" autoComplete="off">
              {/* User Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-[#4066E0]" /> Your Name
                  </label>
                  <input
                    type="text"
                    value={user.name || "Guest User"}
                    disabled
                    className="w-full px-4 py-3 mt-2 text-gray-800 bg-gray-100 border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-[#4066E0]" /> Email
                  </label>
                  <input
                    type="email"
                    value={user.email || "Not logged in"}
                    disabled
                    className="w-full px-4 py-3 mt-2 text-gray-800 bg-gray-100 border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4 text-yellow-500" /> Rate Viadoc
                </label>
                <select
                  name="rating"
                  value={feedback.rating}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                >
                  <option value="">Select a rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Bad</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4 text-[#4066E0]" /> Feedback Message
                </label>
                <textarea
                  name="message"
                  value={feedback.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what you think..."
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-[#1EC6D7]/40 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all rounded-full shadow-md bg-gradient-to-r from-[#4066E0] to-[#1EC6D7] hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Submit Feedback
                  </>
                )}
              </button>

            
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
