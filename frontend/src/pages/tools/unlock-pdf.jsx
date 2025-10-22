import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  File,
  Unlock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [lockedInfo, setLockedInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    setLockedInfo(null);
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

  const checkFile = async () => {
    if (!file) return setError("Please select a file first");
    setIsProcessing(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("pdfFile", file);

      const res = await axios.post(
        "http://localhost:5000/api/tools/unlock-pdf/check",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLockedInfo(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to check PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const unlockFile = async () => {
    if (!file) return setError("Please select a file");
    setIsProcessing(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("pdfFile", file);
      if (password) form.append("password", password);

      const res = await axios.post(
        "http://localhost:5000/api/tools/unlock-pdf/unlock",
        form,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to unlock PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl && file) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.pdf$/i, "_unlocked.pdf");
      a.click();
    }
  };

  const resetTool = () => {
    setFile(null);
    setLockedInfo(null);
    setPassword("");
    setError(null);
    setIsComplete(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
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

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#4FC3F7]/30 to-[#3F51B5]/20">
              <Unlock className="w-8 h-8 text-[#3F51B5]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#1E3A8A] sm:text-4xl">
              Unlock PDF
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Remove password or restrictions from your PDF securely
            </p>
          </div>

          {/* Main Tool Area */}
          <div className="p-6 bg-white shadow-lg sm:p-8 rounded-2xl">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="p-10 sm:p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-[#3F51B5] hover:bg-[#E3F2FD]/40"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-[#3F51B5]" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Drop your PDF file here
                </h3>
                <p className="mb-4 text-sm text-gray-500 sm:text-base">
                  or click to browse files
                </p>
                <div className="text-xs text-gray-400 sm:text-sm">
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
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg bg-[#F5F7FB]">
                  <File className="w-8 h-8 text-[#3F51B5]" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 break-all">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetTool}
                    className="px-3 py-1 text-sm text-gray-600 transition-all rounded-md hover:bg-red-50 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                {/* Status */}
                {error && (
                  <div className="flex items-center gap-2 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700 sm:text-base">{error}</span>
                  </div>
                )}

                {lockedInfo && (
                  <div
                    className={`p-4 rounded-lg ${
                      lockedInfo.locked
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <strong>Status:</strong>{" "}
                    {lockedInfo.locked ? "Locked" : "Unlocked"} <br />
                    <span className="text-sm text-gray-600">
                      {lockedInfo.message}
                    </span>
                  </div>
                )}

                {isComplete && (
                  <div className="flex items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700">
                      PDF unlocked successfully!
                    </span>
                  </div>
                )}

                {/* Password Input */}
                {lockedInfo?.locked && lockedInfo.type === "user" && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3F51B5]/50 focus:outline-none"
                    />
                    <button
                      onClick={() => setShowPassword((s) => !s)}
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
                  {!isComplete && !isProcessing && !lockedInfo && (
                    <button
                      onClick={checkFile}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:scale-[1.02]"
                    >
                      <File className="w-5 h-5" />
                      Check PDF
                    </button>
                  )}

                  {!isComplete &&
                    !isProcessing &&
                    lockedInfo &&
                    lockedInfo.locked && (
                      <button
                        onClick={unlockFile}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:scale-[1.02]"
                      >
                        <Unlock className="w-5 h-5" />
                        Unlock PDF
                      </button>
                    )}

                  {isProcessing && (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white bg-[#9FA8DA] rounded-lg cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </button>
                  )}

                  {isComplete && (
                    <div className="flex flex-col items-center w-full gap-4 sm:flex-row sm:w-auto">
                      <button
                        onClick={downloadFile}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:scale-[1.02]"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </button>
                      <button
                        onClick={resetTool}
                        className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md sm:w-auto bg-gradient-to-r from-gray-400 to-gray-600 hover:opacity-90"
                      >
                        Unlock Another
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
