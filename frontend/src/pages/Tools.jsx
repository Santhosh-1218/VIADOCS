// src/pages/Tools.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  File,
  Image,
  Lock,
  Unlock,
  Scissors,
  Merge,
  Download,
  Upload,
  PenTool,
  Languages,
  Shrink,
  Edit3,
  Presentation,
  Signature,
} from "lucide-react";

export default function Tools() {
  const navigate = useNavigate();

  const tools = [
    { slug: "pdf-to-word", name: "PDF to Word", desc: "Convert PDF into editable Word docs", icon: FileText },
    { slug: "word-to-pdf", name: "Word to PDF", desc: "Export Word files into PDF", icon: File },
    { slug: "pdf-merge", name: "PDF Merge", desc: "Combine multiple PDFs into one", icon: Merge },
    { slug: "pdf-split", name: "PDF Split", desc: "Extract specific pages from PDF", icon: Scissors },
    { slug: "pdf-compress", name: "PDF Compress", desc: "Reduce file size of PDFs", icon: Shrink },
    { slug: "pdf-editor", name: "PDF Editor", desc: "Edit and modify your PDF files", icon: Edit3 },
    { slug: "image-to-pdf", name: "Image to PDF", desc: "Convert images into a PDF file", icon: Image },
    { slug: "pdf-to-image", name: "PDF to Image", desc: "Save PDF pages as images", icon: Download },
    { slug: "password-protect", name: "Password Protect", desc: "Add password to a PDF", icon: Lock },
    { slug: "unlock-pdf", name: "Unlock PDF", desc: "Remove PDF restrictions", icon: Unlock },
    { slug: "excel-to-pdf", name: "Excel to PDF", desc: "Convert spreadsheets into PDF", icon: FileSpreadsheet },
    { slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", desc: "Save slides into PDF format", icon: Presentation },
    { slug: "esign-pdf", name: "eSign PDF", desc: "Add digital signatures", icon: Signature },
    { slug: "doc-translator", name: "Doc Translator", desc: "Translate documents easily", icon: Languages },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
         {/* Back Button */}
                             <div className="flex justify-start mb-8">
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

          {/* Title */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              All Your PDF Tools —{" "}
              <span className="text-[#4066E0]">Smart, Fast & Free!</span>
            </h2>
            <p className="max-w-3xl mx-auto mt-3 text-lg text-gray-600">
              Merge, split, compress, edit, convert, and secure your PDFs effortlessly.
              Everything you need to manage documents — beautifully designed and easy to use.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {tools.map((tool, i) => (
              <button
                key={i}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-white border border-[#1EC6D7]/30 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#4066E0]/40 hover:bg-[#EAF6FF] hover:scale-[1.03] transition-all group"
              >
                <tool.icon className="w-10 h-10 mb-3 text-[#4066E0] group-hover:text-[#1EC6D7] transition-colors" />
                <h3 className="mb-1 text-sm font-semibold text-gray-800 sm:text-base">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
