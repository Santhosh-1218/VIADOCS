// src/pages/HelpCenter.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How can I create a new document in Viadoc?",
      a: "Go to 'Create Doc' from the homepage or tools section. Choose a document type and start editing right away using Viadoc’s smart editor.",
    },
    {
      q: "Can I edit my PDF files?",
      a: "Yes! Open the 'Tools' page and select 'PDF Editor'. You can annotate, edit, and modify your PDF files easily.",
    },
    {
      q: "How do I reset my password?",
      a: "From the login page, click 'Forgot Password' and follow the steps to reset your account credentials securely.",
    },
    {
      q: "Is Viadoc free to use?",
      a: "Yes, Viadoc offers free access to all major tools with no watermarks or limits. Premium AI features may require a subscription.",
    },
    {
      q: "How do I contact Viadoc support?",
      a: "You can reach us anytime from the 'Contact' page, or email us directly at support@viadoc.com.",
    },
  ];

  const filteredFaqs = faqs.filter((f) =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-5xl mx-auto">
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

          {/* Title Section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-[#4066E0] sm:text-4xl">
              Help <span className="text-[#1EC6D7]">Center</span>
            </h1>
            <p className="mt-3 text-gray-600">
              Find quick answers to your questions or reach out for support.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-lg">
              <Search
                className="absolute text-[#4066E0] left-3 top-3"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full py-3 pl-10 pr-4 bg-white border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="transition-all border border-[#1EC6D7]/30 shadow-md bg-white/80 backdrop-blur-md rounded-xl hover:shadow-lg"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="flex justify-between w-full px-5 py-4 text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.q}
                    </h3>
                    {openIndex === i ? (
                      <ChevronUp className="text-[#4066E0]" />
                    ) : (
                      <ChevronDown className="text-[#4066E0]" />
                    )}
                  </button>

                  {openIndex === i && (
                    <div className="px-5 pb-4 text-gray-700 border-t border-[#1EC6D7]/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No results found.</p>
            )}
          </div>

          {/* Contact Support Card */}
          <div className="p-8 mt-12 text-center border border-[#1EC6D7]/30 shadow-lg bg-white/80 rounded-2xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-[#4066E0]">
              Still Need Help?
            </h2>
            <p className="mt-2 text-gray-600">
              Can’t find what you’re looking for? Reach out to our support team.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 px-6 py-3 mt-5 font-medium text-white transition-transform rounded-full bg-gradient-to-r from-[#4066E0] to-[#1EC6D7] hover:scale-[1.05] hover:shadow-lg"
            >
              <MessageCircle size={18} />
              Contact Support
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
