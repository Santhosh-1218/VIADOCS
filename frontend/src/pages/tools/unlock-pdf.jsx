import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  File,
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
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const resetAll = () => {
    setFile(null);
    setLockedInfo(null);
    setPassword("");
    setError(null);
    setDownloadUrl(null);
    setIsComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf")
      return setError("Please select a valid PDF file.");
    if (selectedFile.size > 20 * 1024 * 1024)
      return setError("Please upload a PDF smaller than 20MB.");

    setFile(selectedFile);
    setLockedInfo(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  };

  // --- Check if PDF is locked ---
  const checkLockStatus = async () => {
    if (!file) return setError("Please upload a PDF first!");
    setIsProcessing(true);
    setError(null);
    setLockedInfo(null);

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
      console.error("Check error:", err);
      setError("Failed to check PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Unlock PDF ---
  const unlockPdf = async () => {
    if (!file) return setError("Please upload a PDF file first!");
    if (!password) return setError("Please enter your password!");

    setIsProcessing(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("pdfFile", file);
      form.append("password", password);

      const res = await axios.post(
        "http://localhost:5000/api/tools/unlock-pdf/unlock",
        form,
        { responseType: "blob" }
      );

      const blobUrl = URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(blobUrl);
      setIsComplete(true);
    } catch (err) {
      console.error("Unlock error:", err);

      if (err.response && err.response.status === 401) {
        // Specific wrong password error
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to unlock PDF. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(/\.pdf$/i, "_unlocked.pdf");
    a.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF4FC] via-[#E1EDFB] to-[#CFE3FA]">
      <Header />

      <main className="flex-1 px-3 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="flex justify-start mb-6 sm:mb-8">
            <button
              onClick={() => navigate("/tools")}
              className="flex items-center gap-2 px-3 py-2 text-white text-sm sm:text-base transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:opacity-90"
            >
              <ArrowLeft size={18} />
              <span>Back to Tools</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#4FC3F7]/30 to-[#3F51B5]/20 sm:w-20 sm:h-20">
              <Lock className="w-8 h-8 text-[#3F51B5] sm:w-10 sm:h-10" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-[#3F51B5] sm:text-3xl">
              Unlock PDF
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Remove password or restrictions from your PDF securely.
            </p>
          </div>

          {/* Tool UI */}
          <div className="p-4 bg-white shadow-lg sm:p-6 md:p-8 rounded-2xl">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="p-6 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-[#3F51B5] hover:bg-[#E3F2FD]/40 sm:p-10"
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-[#3F51B5] sm:w-12 sm:h-12" />
                <h3 className="mb-2 text-lg font-semibold text-gray-700 sm:text-xl">
                  Drop your PDF file here
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  or click to browse files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {/* File info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg bg-[#F5F7FB]">
                  <div className="flex items-center gap-3">
                    <File className="w-6 h-6 sm:w-8 sm:h-8 text-[#3F51B5]" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 break-words sm:text-base">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetAll}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 sm:px-4"
                  >
                    Remove
                  </button>
                </div>

                {/* Check Lock Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <button
                    onClick={checkLockStatus}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm sm:text-base rounded-lg bg-[#4066E0] text-white hover:opacity-90 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <Loader2 className="inline-block animate-spin" />
                    ) : (
                      "Check PDF"
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                {/* Lock Info */}
                {lockedInfo && (
                  <div
                    className={`p-4 rounded-lg text-sm sm:text-base ${
                      lockedInfo.locked
                        ? "bg-yellow-50 border border-yellow-300"
                        : "bg-green-50 border border-green-300"
                    }`}
                  >
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${
                        lockedInfo.locked
                          ? "text-yellow-700"
                          : "text-green-700"
                      }`}
                    >
                      {lockedInfo.locked
                        ? "This PDF is locked. Please enter the password to unlock."
                        : "This PDF is already unlocked."}
                    </span>
                  </div>
                )}

                {/* Unlock Section */}
                {lockedInfo && lockedInfo.locked && (
                  <div className="p-4 space-y-3 bg-white border rounded-lg">
                    <h4 className="text-base font-semibold sm:text-lg">
                      Enter Password
                    </h4>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/40"
                      />
                      <button
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute text-gray-600 right-2 top-2"
                        type="button"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>

                    <button
                      onClick={unlockPdf}
                      disabled={isProcessing || !password}
                      className={`w-full px-4 py-2 mt-2 text-sm sm:text-base rounded-lg text-white transition-all ${
                        isProcessing
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-[#1E88E5] hover:bg-[#1565C0]"
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="inline-block animate-spin" />
                      ) : (
                        "Unlock PDF"
                      )}
                    </button>
                  </div>
                )}

                {/* Download Section */}
                {isComplete && downloadUrl && (
                  <div className="flex flex-col gap-3 p-3 border border-green-200 rounded-lg sm:flex-row sm:items-center bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1 text-sm text-green-700 sm:text-base">
                      PDF unlocked successfully. You can download it now.
                      <div className="flex flex-col gap-2 mt-2 sm:flex-row">
                        <button
                          onClick={downloadFile}
                          className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg sm:text-base"
                        >
                          Download
                        </button>
                        <button
                          onClick={resetAll}
                          className="px-3 py-1 text-sm bg-white border rounded-md sm:text-base"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
