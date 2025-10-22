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

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setFile(selectedFile);
    setError(null);
    setIsComplete(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/tools/pdf-to-word",
        formData,
        { responseType: "blob" }
      );

      // Successful response should be a blob (docx)
      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      console.error(err);
      // Try to parse server JSON details if available (server may return JSON error as a blob)
      try {
        const blob = err.response && err.response.data;
        if (blob) {
          const text = await blob.text();
          try {
            const json = JSON.parse(text);
            setError(json.details || json.error || "Conversion failed. See server details.");
          } catch (e) {
            // Not JSON — display raw text
            setError(text || "Conversion failed. See server logs.");
          }
        } else {
          setError("Failed to convert PDF. Please try again.");
        }
      } catch (parseErr) {
        console.error("Error parsing error response:", parseErr);
        setError("Failed to convert PDF. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl && file) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetTool = () => {
    setFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setError(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF4FC] via-[#E1EDFB] to-[#CFE3FA]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
         {/* Back Button */}
                   <div className="flex justify-start mb-8">
                     <button
                       onClick={() => navigate("/tools")}
                       className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90 hover:scale-[1.03]"
                     >
                       <ArrowLeft size={18} />
                       <span className="text-sm font-medium sm:text-base">
                         Back to Tools
                       </span>
                     </button>
                   </div>
          {/* 🧾 Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#64B5F6]/40 to-[#1E88E5]/30">
              <File className="w-8 h-8 text-[#1E88E5]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#0D47A1]">
              PDF to Word Converter
            </h1>
            <p className="text-lg text-gray-700">
              Convert your PDF documents into editable Word files
            </p>
          </div>

          {/* 🧩 Main Tool Area */}
          <div className="p-6 bg-white shadow-lg rounded-2xl sm:p-8">
            {!file ? (
              // Step 1: Upload Area
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-12 text-center transition-all border-2 border-blue-200 border-dashed cursor-pointer rounded-xl hover:border-[#1E88E5] hover:bg-[#E3F2FD]/60"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-[#1E88E5]" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Drop your PDF file here
                </h3>
                <p className="mb-4 text-gray-500">or click to browse files</p>
                <div className="text-sm text-gray-400">
                  <p>Supported format: PDF</p>
                  <p>Maximum file size: 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              // Step 2: File Display + Actions
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex flex-col items-start gap-3 p-4 rounded-lg sm:flex-row sm:items-center bg-blue-50">
                  <File className="w-8 h-8 text-[#1E88E5]" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 break-words">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetTool}
                    className="px-3 py-1 text-sm text-gray-700 transition-colors rounded-md hover:text-white hover:bg-red-500"
                  >
                    Remove
                  </button>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {isComplete && (
                  <div className="flex items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700">
                      Conversion completed successfully!
                    </span>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {!isProcessing && !isComplete && (
                    <button
                      onClick={processFile}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#42A5F5] to-[#1E88E5] hover:opacity-90 hover:scale-[1.02]"
                    >
                      <File className="w-5 h-5" />
                      Convert to Word
                    </button>
                  )}

                  {isProcessing && (
                    <button
                      disabled
                      className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-blue-300 rounded-lg cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting...
                    </button>
                  )}

                  {isComplete && (
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <button
                        onClick={downloadFile}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#43A047] to-[#2E7D32] hover:opacity-90 hover:scale-[1.02]"
                      >
                        <Download className="w-5 h-5" />
                        Download Word
                      </button>
                      <button
                        onClick={resetTool}
                        className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-gray-400 to-gray-600 hover:opacity-90"
                      >
                        Convert Another
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
