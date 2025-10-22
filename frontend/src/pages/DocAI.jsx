import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu, ArrowLeft, Mail } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import axios from "axios";

export default function DocAI() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return alert("Please enter a valid email");
    setLoading(true);
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:5000/api/docai/early-access", { email });
      if (res.status === 200) {
        setSuccess(true);
        setEmail("");
      } else {
        console.warn('Early-access endpoint responded:', res.status, res.data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#E8F4FD] via-[#EDE7FB] to-[#F3E9FE]">
      <Header />

      <main className="flex-1 px-6 py-10 animate-fadeIn">
  <div className="flex flex-col max-w-6xl mx-auto md:flex-row md:items-start md:justify-start">
    <div className="w-full md:w-[80%] lg:w-[70%]">

      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90 hover:scale-[1.03]"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium sm:text-base">
            Back 
          </span>
        </button>
      </div>

      {/* Main Card */}
      <div className="p-10 border border-purple-100 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4 bg-gradient-to-r from-[#1EC6D7] to-[#6A3FD7] rounded-full w-14 h-14 shadow-md">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1EC6D7] to-[#6A3FD7]">
            DocAI — Coming Soon
          </h1>
          <p className="max-w-md mt-2 text-center text-gray-600">
            Smart document creation powered by AI — we’re perfecting your next-gen writing assistant.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Left Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">What to expect</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>AI-powered document drafting and rewriting</li>
              <li>Auto-formatting, summarization, and highlights</li>
              <li>Image-aware editing and contextual suggestions</li>
              <li>Smart references and export-ready outputs</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Want early access?</h3>
            <p className="text-sm text-gray-600">
              Leave your email and we’ll notify you when DocAI launches.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 mt-2"
              autoComplete="off"
            >
              <div className="relative">
                <Mail className="absolute text-purple-500 left-3 top-3" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 font-semibold text-white rounded-full shadow-md transition-all bg-gradient-to-r from-[#1EC6D7] to-[#6A3FD7] hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Request Access"}
              </button>

              {success && (
                <p className="text-sm text-center text-green-600">
                  ✅ Request submitted! We’ll notify you once DocAI is live.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-10 text-sm text-center text-gray-500">
          Estimated launch:{" "}
          <span className="font-semibold text-purple-600">Q4 2025</span>
        </div>
      </div>
    </div>
  </div>
</main>


      <Footer />
    </div>
  );
}
