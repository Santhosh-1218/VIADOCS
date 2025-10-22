import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PenTool, Clock } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function ESignPdfComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF4FC] via-[#E1EDFB] to-[#CFE3FA]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="flex justify-start mb-8">
            <button
              onClick={() => navigate("/tools")}
              className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium sm:text-base">
                Back to Tools
              </span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#4FC3F7]/30 to-[#3F51B5]/20">
              <PenTool className="w-10 h-10 text-[#3F51B5]" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-[#3F51B5] sm:text-4xl">
              E-Sign PDF
            </h1>
            <p className="text-base text-gray-700 sm:text-lg">
              Sign your documents electronically with ease — Coming Soon!
            </p>
          </div>

          {/* Main Container */}
          <div className="p-6 text-center bg-white shadow-xl sm:p-10 rounded-2xl">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Clock className="w-12 h-12 text-[#1E88E5] animate-pulse" />
              <h2 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
                Coming Soon
              </h2>
              <p className="max-w-md text-sm text-gray-600 sm:text-base">
                Our E-Sign tool will let you securely sign PDFs online, add
                initials, and verify document authenticity — all from your
                browser with just a few clicks.
              </p>

              {/* Progress Bar */}
              <div className="w-3/4 h-2 max-w-xs mt-2 overflow-hidden bg-gray-200 rounded-full">
                <div className="w-2/3 h-2 rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] animate-pulse"></div>
              </div>

              {/* Note */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 sm:text-base">
                  Stay tuned — the E-Signature feature is almost ready to launch 🚀
                </p>
              </div>

             
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
