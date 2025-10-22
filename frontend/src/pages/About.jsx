import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Globe, Users, Target, Briefcase } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import wwiLogo from "../assets/wwi-logo.jpg"; // ✅ Ensure this path matches your image location

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />

      <main className="flex-1 px-6 py-10">
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

          {/* Main Section */}
          <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="flex flex-col items-center justify-center mb-8">
              <img
                src={wwiLogo}
                alt="Work Wizards Innovations Logo"
                className="w-32 h-32 mb-4 rounded-lg shadow-md"
              />
              <h1 className="text-4xl font-extrabold text-center text-purple-700">
                About Work Wizards Innovations
              </h1>
              <p className="max-w-2xl mt-3 text-lg text-center text-gray-600">
                We are <strong>Work Wizards Innovations (WWI)</strong> — a newly
                started startup company driven by creativity, technology, and a
                vision to simplify modern work with smart, efficient tools.
              </p>
              <a
                href="https://wwi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-[#4066E0] hover:underline text-base font-medium"
              >
                🌐 Visit our official website — www.wwi.org.in
              </a>
            </div>

            {/* Product Info */}
            <div className="p-6 mt-4 text-center transition-all border border-gray-200 rounded-xl bg-gradient-to-br from-[#EAF6FF]/40 to-[#EAE4FF]/40 hover:shadow-md">
              <Briefcase className="w-10 h-10 mx-auto mb-3 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Viadocs — Our Debut Product
              </h2>
              <p className="max-w-2xl mx-auto mt-2 text-gray-600">
                <strong>Viadocs</strong> is the debut product of Work Wizards
                Innovations — a next-gen AI-powered document platform designed
                to help professionals, creators, and students create, manage,
                and share documents effortlessly.
              </p>
              <p className="mt-2 text-gray-600">
                With Viadocs, we aim to empower users with faster workflows,
                intelligent tools, and beautiful document design — powered by
                innovation and simplicity.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 mt-10 md:grid-cols-2">
              {/* Our Mission */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Target className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Our Mission
                </h2>
                <p className="mt-2 text-gray-600">
                  To revolutionize document creation and business tools through
                  intelligent design, AI assistance, and user-first innovation.
                </p>
              </div>

              {/* Who We Are */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Users className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Who We Are
                </h2>
                <p className="mt-2 text-gray-600">
                  We’re a young and energetic team of developers, designers, and
                  innovators who believe in building meaningful digital
                  experiences that make people’s work easier and smarter.
                </p>
              </div>

              {/* Global Vision */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Globe className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Global Vision
                </h2>
                <p className="mt-2 text-gray-600">
                  Our long-term goal is to establish Work Wizards Innovations as
                  a leading force in technology and innovation — helping people
                  around the world achieve more with less effort.
                </p>
              </div>

              {/* Why Choose Viadoc */}
              <div className="flex flex-col items-center p-6 text-center transition-all border border-gray-200 rounded-xl hover:shadow-md hover:bg-purple-50">
                <Info className="w-10 h-10 mb-4 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Why Choose Viadoc?
                </h2>
                <p className="mt-2 text-gray-600">
                  Viadoc combines simplicity, intelligence, and performance —
                  offering smart PDF tools, collaborative editing, and seamless
                  cloud integration for effortless document creation.
                </p>
              </div>
            </div>
          </div>

          {/* Tagline Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-purple-700">
              “Your Documents, Simplified — Powered by Work Wizards
              Innovations.”
            </h2>
            <p className="mt-2 text-gray-600">
              Join us on our journey to build smarter tools and empower the
              digital workspace.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
