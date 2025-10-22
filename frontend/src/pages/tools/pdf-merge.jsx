import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  File,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

export default function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(
      (f) => f.type === "application/pdf"
    );
    if (validFiles.length !== selectedFiles.length) {
      setError("Only PDF files are allowed");
      return;
    }
    setFiles((prev) => [...prev, ...validFiles]);
    setError(null);
    setIsComplete(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) handleFileSelect(e.target.files);
  };

  const processFiles = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const response = await axios.post(
        "http://localhost:5000/api/tools/pdf-merge",
        formData,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      console.error(err);
      setError("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "merged.pdf";
      a.click();
    }
  };

  const resetTool = () => {
    setFiles([]);
    setIsProcessing(false);
    setIsComplete(false);
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF4FC] via-[#E1EDFB] to-[#CFE3FA]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 🔙 Back Button */}
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

          {/* 🧾 Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#4FC3F7]/30 to-[#3F51B5]/20">
              <File className="w-10 h-10 text-[#3F51B5]" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-[#3F51B5] sm:text-4xl">
              PDF Merger
            </h1>
            <p className="text-base text-gray-700 sm:text-lg">
              Combine multiple PDFs into one document effortlessly
            </p>
          </div>

          {/* 📄 Main Tool Area */}
          <div className="p-6 bg-white shadow-xl sm:p-10 rounded-2xl">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="p-10 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-[#3F51B5] hover:bg-[#E3F2FD]/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-[#3F51B5]" />
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                Drop your PDF files here
              </h3>
              <p className="mb-4 text-gray-500">or click to browse files</p>
              <div className="text-sm text-gray-400">
                <p>Supported format: PDF</p>
                <p>Select at least 2 files</p>
                <p>Max file size: 10MB each</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between gap-3 p-4 rounded-lg sm:flex-row bg-[#F5F7FB]"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-6 h-6 text-[#3F51B5]" />
                      <div>
                        <h3 className="font-medium text-gray-900">{f.name}</h3>
                        <p className="text-sm text-gray-500">
                          {(f.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="px-3 py-1 text-sm text-gray-600 transition-colors rounded-md hover:text-[#1E88E5] hover:bg-[#E3F2FD]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <div className="flex items-center gap-2 p-4 mt-6 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {isComplete && (
              <div className="flex items-center gap-2 p-4 mt-6 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">
                  PDFs merged successfully!
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row">
              {!isProcessing && !isComplete && (
                <button
                  onClick={processFiles}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90 hover:scale-[1.02]"
                >
                  <Upload className="w-5 h-5" />
                  Merge PDFs
                </button>
              )}

              {isProcessing && (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white rounded-lg bg-[#9FA8DA] cursor-not-allowed"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Merging...
                </button>
              )}

              {isComplete && (
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <button
                    onClick={downloadFile}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90 hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    Download Merged PDF
                  </button>
                  <button
                    onClick={resetTool}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-gray-400 to-gray-600 hover:opacity-90"
                  >
                    Merge Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
