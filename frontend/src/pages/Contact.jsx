// src/pages/Contact.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, User, MessageSquare, Send } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import axios from "axios";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData);
      if (res.status === 200) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Something went wrong. Please try again later.");
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

          {/* Glass Card */}
          <div className="p-8 border border-[#1EC6D7]/30 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl">
            <h1 className="text-3xl font-extrabold text-center text-[#4066E0] sm:text-4xl">
              Contact <span className="text-[#1EC6D7]">Viadoc</span>
            </h1>
            <p className="max-w-lg mx-auto mt-3 text-center text-gray-600">
              Have a question, feedback, or collaboration idea? We’d love to hear from you!
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-6"
              autoComplete="off"
            >
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-[#4066E0]" /> Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-[#4066E0]" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4 text-[#4066E0]" /> Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message here..."
                  rows={6}
                  className="w-full px-4 py-3 mt-2 text-gray-800 bg-white border border-[#1EC6D7]/40 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
                ></textarea>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-3 font-semibold text-white transition-all rounded-full shadow-md bg-gradient-to-r from-[#4066E0] to-[#1EC6D7] hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Send Message
                  </>
                )}
              </button>

              {/* Success Message */}
              {success && (
                <p className="mt-4 text-center text-green-600">
                  ✅ Your message has been sent! We’ll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
