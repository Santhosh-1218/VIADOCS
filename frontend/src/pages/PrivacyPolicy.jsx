// src/pages/PrivacyPolicy.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
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

          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-[#4066E0]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#4066E0] sm:text-4xl">
              Privacy <span className="text-[#1EC6D7]">Policy</span>
            </h1>
            <p className="mt-3 text-gray-600">
              Last updated on{" "}
              <span className="font-semibold text-[#4066E0]">
                October 2025
              </span>
            </p>
          </div>

          {/* Content Card */}
          <div className="p-8 border border-[#1EC6D7]/30 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl">
            <section className="space-y-10 leading-relaxed text-gray-700">
              {/* Introduction */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  1. Introduction
                </h2>
                <p>
                  Welcome to{" "}
                  <span className="font-semibold text-[#1EC6D7]">Viadoc</span>.
                  Your privacy is important to us. This Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  2. Information We Collect
                </h2>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>
                    <span className="font-semibold text-[#1EC6D7]">
                      Personal Information:
                    </span>{" "}
                    Such as name, email, and account details.
                  </li>
                  <li>
                    <span className="font-semibold text-[#1EC6D7]">
                      Usage Data:
                    </span>{" "}
                    Includes IP address, browser type, and interactions within
                    our site.
                  </li>
                  <li>
                    <span className="font-semibold text-[#1EC6D7]">
                      Documents:
                    </span>{" "}
                    Files you upload or manage using Viadoc tools.
                  </li>
                </ul>
              </div>

              {/* Use of Data */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  3. How We Use Your Data
                </h2>
                <p>
                  We use your data to operate and enhance Viadoc’s features,
                  provide personalized experiences, and ensure system security.
                  We never sell or share your personal data without your
                  consent.
                </p>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  4. Data Security
                </h2>
                <p>
                  We employ advanced encryption and access control technologies
                  to protect your data. While we strive for the highest security
                  standards, no online system is completely risk-free.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  5. Cookies
                </h2>
                <p>
                  Viadoc uses cookies to enhance functionality and remember user
                  preferences. You can disable cookies in your browser settings,
                  though some features may not work as intended.
                </p>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  6. Third-Party Services
                </h2>
                <p>
                  We may use trusted third-party providers such as analytics or
                  storage platforms. Each provider operates under its own
                  privacy policy, which we recommend reviewing.
                </p>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  7. Your Rights
                </h2>
                <p>
                  You have the right to access, correct, or request deletion of
                  your personal data. To do so, contact us at{" "}
                  <span className="font-semibold text-[#1EC6D7]">
                    contact.viadocs@gmail.com
                  </span>
                  .
                </p>
              </div>

              {/* Policy Updates */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  8. Updates to This Policy
                </h2>
                <p>
                  We may periodically update this Privacy Policy. All changes
                  will be reflected on this page along with an updated revision
                  date.
                </p>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-[#4066E0]">
                  9. Contact Us
                </h2>
                <p>
                  If you have any questions or concerns regarding this policy or
                  your data, reach out at{" "}
                  <span className="font-semibold text-[#1EC6D7]">
                    contact.viadocs@gmail.com
                  </span>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
