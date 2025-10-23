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

export default function PasswordProtect() {
  const [file, setFile] = useState(null);
  const [lockedInfo, setLockedInfo] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPassword(false);
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

  // --- Check Lock Status ---
  const checkLockStatus = async () => {
    if (!file) return setError("Please upload a PDF first!");
    setIsProcessing(true);
    setError(null);
    setLockedInfo(null);

    try {
      const form = new FormData();
      form.append("pdfFile", file);

      const res = await axios.post(
        "http://localhost:5000/api/tools/password-protect/check",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLockedInfo(res.data);
    } catch (err) {
      console.error("Check error:", err);
      setError("Failed to check PDF lock status.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Set Password ---
  const setPassword = async () => {
    if (!file) return setError("Please upload a PDF file first!");
    if (!newPassword || !confirmNewPassword)
      return setError("Please enter and confirm your password!");
    if (newPassword !== confirmNewPassword)
      return setError("Passwords do not match!");

    setIsProcessing(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("pdf", file);
      form.append("password", newPassword);

      const res = await axios.post(
        "http://localhost:5000/api/tools/password-protect",
        form,
        { responseType: "blob" }
      );

      const blobUrl = URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(blobUrl);
      setIsComplete(true);
    } catch (err) {
      console.error("Set password failed:", err);
      setError("Failed to set password.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(/\.pdf$/i, "_protected.pdf");
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
              Password Protect PDF
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              Upload a PDF, check if it’s protected, and set a password if it’s unlocked.
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
                      "Check Lock Status"
                    )}
                  </button>
                </div>

                {/* Error */}
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
                        ? "bg-red-50 border border-red-300"
                        : "bg-green-50 border border-green-300"
                    }`}
                  >
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${
                        lockedInfo.locked
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {lockedInfo.locked
                        ? "This PDF is already password-protected."
                        : "This PDF is not protected."}
                    </span>
                  </div>
                )}

                {/* Password Inputs */}
                {lockedInfo && !lockedInfo.locked && (
                  <div className="p-4 space-y-3 bg-white border rounded-lg">
                    <h4 className="text-base font-semibold sm:text-lg">Set Password</h4>

                    {/* New Password */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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

                    {/* Confirm Password */}
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm password"
                      className={`w-full px-4 py-2 text-sm sm:text-base border rounded-lg ${
                        confirmNewPassword && confirmNewPassword !== newPassword
                          ? "border-red-400 focus:ring-red-300"
                          : "focus:ring-[#1E88E5]/40"
                      }`}
                    />

                    {/* Mismatch Warning */}
                    {confirmNewPassword &&
                      confirmNewPassword !== newPassword && (
                        <div className="flex items-center gap-2 text-xs text-red-600 sm:text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Passwords do not match</span>
                        </div>
                      )}

                    {/* Button */}
                    <button
                      onClick={setPassword}
                      disabled={
                        isProcessing ||
                        !newPassword ||
                        !confirmNewPassword ||
                        newPassword !== confirmNewPassword
                      }
                      className={`w-full px-4 py-2 mt-2 text-sm sm:text-base rounded-lg text-white transition-all ${
                        isProcessing || newPassword !== confirmNewPassword
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-[#1E88E5] hover:bg-[#1565C0]"
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="inline-block animate-spin" />
                      ) : (
                        "Set Password & Download"
                      )}
                    </button>
                  </div>
                )}

                {/* Download Section */}
                {isComplete && downloadUrl && (
                  <div className="flex flex-col gap-3 p-3 border border-green-200 rounded-lg sm:flex-row sm:items-center bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1 text-sm text-green-700 sm:text-base">
                      Operation completed — download your protected PDF.
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
