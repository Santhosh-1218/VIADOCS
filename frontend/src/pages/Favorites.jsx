import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {
  Star,
  Eye,
  Edit,
  Share2,
  Trash2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { jsPDF } from "jspdf";

export default function Favorites() {
  const [docs, setDocs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");

  // Fetch favorite docs
  const fetchDocs = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await axios.get("http://localhost:5000/api/docs/my-docs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocs(res.data.filter((doc) => doc.favorite));
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Delete doc
  const deleteDoc = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/docs/my-docs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocs();
    } catch (err) {
      console.error("Error deleting doc:", err);
    }
  };

  // Share doc as PDF
  const shareDocAsPDF = async (doc) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/docs/my-docs/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullDoc = res.data;

      const pdf = new jsPDF("p", "pt", "a4");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(fullDoc.name, 40, 50);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      await pdf.html(fullDoc.content || "<p></p>", {
        x: 40,
        y: 80,
        width: 500,
        windowWidth: 800,
      });

      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], `${fullDoc.name}.pdf`, { type: "application/pdf" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({ title: fullDoc.name, text: "Sharing doc", files: [pdfFile] });
      } else {
        pdf.save(`${fullDoc.name}.pdf`);
        alert("Sharing not supported — PDF downloaded instead");
      }
    } catch (err) {
      console.error("Error sharing doc:", err);
      alert("Failed to share document");
    }
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">
         {/* Back Button */}
                                      <div className="flex justify-start mb-8">
                                        <button
                                          onClick={() => navigate("/home")}
                                          className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#4066E0] to-[#1EC6D7] hover:opacity-90 hover:scale-[1.03] active:scale-[0.97]"
                                        >
                                          <ArrowLeft size={18} />
                                          <span className="text-sm font-medium sm:text-base">Back</span>
                                        </button>
                                      </div>

          {/* Title */}
          <h2 className="mb-8 text-2xl font-extrabold text-center text-gray-900">
            Your <span className="text-[#4066E0]">Favorite Docs</span>
          </h2>

          {/* Docs Grid */}
          {isLoggedIn ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-6">
              {docs.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full">
                  No favorites yet.
                </div>
              ) : (
                docs.map((doc) => (
                  <div
                    key={doc._id}
                    className="relative p-5 bg-white border border-[#1EC6D7]/30 shadow-sm cursor-pointer rounded-2xl hover:shadow-xl hover:border-[#4066E0]/40 hover:bg-[#EAF6FF] transition-all group"
                    onClick={() =>
                      navigate(`/doc/${doc._id}`, { state: { openTools: true } })
                    }
                    onContextMenu={(e) => handleContextMenu(e, doc._id)}
                  >
                    {/* Star at top-right */}
                    {doc.favorite && (
                      <Star
                        size={18}
                        className="absolute text-yellow-400 top-2 right-2 fill-yellow-400"
                      />
                    )}

                    {/* Doc Icon */}
                    <div className="flex flex-col items-center">
                      <FileText className="w-10 h-10 mb-2 text-[#4066E0] group-hover:text-[#1EC6D7]" />
                      <p className="text-xs font-semibold text-center text-gray-800 truncate">
                        {doc.name}
                      </p>
                    </div>

                    {/* Dropdown menu */}
                    {dropdownOpen === doc._id && (
                      <div className="absolute z-20 p-2 -translate-x-1/2 bg-white border border-[#1EC6D7]/30 rounded-lg shadow-lg w-40 top-14 left-1/2 animate-fadeIn">
                        <button
                          className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/doc/${doc._id}`, { state: { openTools: true } });
                            setDropdownOpen(null);
                          }}
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/doc/${doc._id}/edit`);
                            setDropdownOpen(null);
                          }}
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareDocAsPDF(doc);
                            setDropdownOpen(null);
                          }}
                        >
                          <Share2 size={14} /> Share
                        </button>
                        <button
                          className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(doc);
                            setDeleteInput("");
                            setShowDeleteModal(true);
                            setDropdownOpen(null);
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>

                        <div className="pt-1 mt-2 text-xs text-center text-gray-500 border-t">
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Please log in to view your favorites.
            </p>
          )}
        </div>
      </main>
      <Footer />

      {/* Delete confirmation modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Confirm deletion</h2>
            <p className="mb-3 text-sm text-gray-600">
              Type <span className="font-bold">{deleteTarget.name}</span> to confirm deletion.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded border-[#1EC6D7]/40"
              placeholder={deleteTarget.name}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                  setDeleteInput("");
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded ${
                  deleteInput === deleteTarget.name
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
                disabled={deleteInput !== deleteTarget.name}
                onClick={async () => {
                  await deleteDoc(deleteTarget._id);
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                  setDeleteInput("");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
