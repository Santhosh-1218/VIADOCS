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

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please select a valid Word document (.doc or .docx)");
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
        "http://localhost:5000/api/tools/word-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setIsComplete(true);
    } catch (err) {
      console.error(err);
      setError("Failed to convert Word to PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl && file) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.(docx?|doc)$/i, ".pdf");
      a.click();
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF4FC] via-[#E1EDFB] to-[#CFE3FA]">
     <Header />
     
      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
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
              <File className="w-8 h-8 text-[#3F51B5]" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#1E3A8A] sm:text-4xl">
              Word to PDF Converter
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Convert your Word documents into PDF files
            </p>
          </div>

          {/* Main Tool */}
          <div className="p-6 bg-white shadow-lg sm:p-8 rounded-2xl">
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-10 sm:p-12 text-center transition-all border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-[#3F51B5] hover:bg-[#E3F2FD]/40"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-[#3F51B5]" />
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Drop your Word file here
                </h3>
                <p className="mb-4 text-sm text-gray-500 sm:text-base">
                  or click to browse files
                </p>
                <div className="text-xs text-gray-400 sm:text-sm">
                  <p>Supported formats: DOC, DOCX</p>
                  <p>Maximum file size: 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".doc,.docx"
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
                {isComplete && (
                  <div className="flex items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700">
                      Conversion completed successfully!
                    </span>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
                  {!isProcessing && !isComplete && (
                    <button
                      onClick={processFile}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:scale-[1.02]"
                    >
                      <File className="w-5 h-5" />
                      Convert to PDF
                    </button>
                  )}
                  {isProcessing && (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white bg-[#9FA8DA] rounded-lg cursor-not-allowed"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting...
                    </button>
                  )}
                  {isComplete && (
                    <div className="flex flex-col items-center w-full gap-4 sm:flex-row sm:w-auto">
                      <button
                        onClick={downloadFile}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-medium text-white rounded-lg shadow-md transition-all bg-gradient-to-r from-[#4FC3F7] to-[#3F51B5] hover:scale-[1.02]"
                      >
                        <Download className="w-5 h-5" />
                        Download PDF
                      </button>
                      <button
                        onClick={resetTool}
                        className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md sm:w-auto bg-gradient-to-r from-gray-400 to-gray-600 hover:opacity-90"
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
