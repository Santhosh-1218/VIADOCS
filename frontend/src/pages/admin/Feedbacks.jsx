import React, { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // holds feedback to delete

  // ===== Fetch Feedbacks =====
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/feedbacks");
      const data = await res.json();

      if (res.ok) {
        setFeedbacks(data.feedbacks || []);
      } else {
        toast.error(data.error || "Failed to fetch feedbacks");
      }
    } catch (error) {
      toast.error("Error loading feedbacks");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete Feedback =====
  const confirmDelete = (feedback) => {
    setDeleteTarget(feedback); // show alert
  };

  const cancelDelete = () => {
    setDeleteTarget(null); // hide alert
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/feedbacks/${deleteTarget._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Feedback deleted successfully");
        setFeedbacks((prev) =>
          prev.filter((f) => f._id !== deleteTarget._id)
        );
      } else {
        toast.error(data.message || "Failed to delete feedback");
      }
    } catch (error) {
      toast.error("Error deleting feedback");
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 pt-20 sm:ml-56 min-h-screen bg-[#D3EAFD] relative">
      <Toaster position="top-center" />

      {/* ✅ Custom Top Delete Alert */}
      {deleteTarget && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg border border-[#90CAF9] rounded-xl px-6 py-4 w-[90%] sm:w-[400px] animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#0D47A1] text-lg">
              Confirm Deletion
            </h3>
            <button onClick={cancelDelete}>
              <X size={20} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
          <p className="mb-4 text-sm text-gray-700">
            Are you sure you want to delete feedback from{" "}
            <strong>{deleteTarget.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-1.5 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-1.5 rounded bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-medium transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ===== Feedbacks Container ===== */}
      <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-lg shadow-md p-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#0D47A1] mb-4">
          User Feedbacks
        </h2>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : feedbacks.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No feedbacks found.
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#BBDEFB] border border-[#90CAF9] rounded-md p-3 hover:shadow-lg transition-all"
              >
                <div className="text-sm text-gray-800">
                  <p><strong>Name:</strong> {fb.name || "N/A"}</p>
                  <p><strong>Email:</strong> {fb.email || "N/A"}</p>
                  <p><strong>Rating:</strong> ⭐ {fb.rating || "N/A"}</p>
                  <p><strong>Message:</strong> {fb.message || "No message"}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Submitted: {fb.createdAt || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => confirmDelete(fb)}
                  className="mt-3 sm:mt-0 sm:ml-4 flex items-center gap-1 px-3 py-1 bg-[#E53935] text-white text-sm rounded hover:bg-[#C62828] transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 Smooth animation */}
      <style jsx="true">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-in-out;
        }
      `}</style>
    </div>
  );
}
