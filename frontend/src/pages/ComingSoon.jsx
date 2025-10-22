import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        {/* Card Container */}
        <div className="w-full max-w-3xl p-10 bg-white border border-gray-200 shadow-lg rounded-2xl">
          {/* Icon */}
          <div className="flex flex-col items-center space-y-6">
            <div className="p-6 rounded-full shadow-md bg-gradient-to-br from-purple-600 to-indigo-600">
              <Clock size={48} className="text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              Feature Coming Soon 🚀
            </h1>

            {/* Subtitle */}
            <p className="max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
              We're putting the finishing touches on this feature.  
              Stay tuned — your Viadoc experience is about to get even better!
            </p>

            {/* Progress Animation */}
            <div className="w-48 h-1 mt-4 overflow-hidden bg-gray-200 rounded-full">
              <div className="w-1/3 h-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-[progress_2s_ease-in-out_infinite]" />
            </div>

            {/* Back Buttons */}
            <div className="flex flex-col gap-4 mt-8 sm:flex-row">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 text-sm font-semibold text-white transition-transform rounded-full shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Animation */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
