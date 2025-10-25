import React, { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch Contacts =====
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/contacts");
      const data = await res.json();

      if (res.ok) {
        setContacts(data.contacts || []);
      } else {
        toast.error(data.error || "Failed to fetch contacts");
      }
    } catch (error) {
      toast.error("Error loading contacts");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete Contact =====
  const confirmDelete = (contact) => setDeleteTarget(contact);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/contacts/${deleteTarget._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Contact deleted successfully");
        setContacts((prev) =>
          prev.filter((c) => c._id !== deleteTarget._id)
        );
      } else {
        toast.error(data.message || "Failed to delete contact");
      }
    } catch (error) {
      toast.error("Error deleting contact");
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-6 pt-20 sm:ml-56 min-h-screen bg-[#D3EAFD] relative">
      <Toaster position="top-center" />

      {/* ✅ Top Delete Confirmation Alert */}
      {deleteTarget && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg border border-[#90CAF9] rounded-xl px-6 py-4 w-[90%] sm:w-[400px] animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-[#0D47A1] text-lg">Confirm Delete</h3>
            <button onClick={cancelDelete}>
              <X size={20} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to delete the contact from{" "}
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

      {/* ===== Contacts Container ===== */}
      <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-lg shadow-md p-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#0D47A1] mb-4">
          Contact Messages
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div
                key={c._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#BBDEFB] border border-[#90CAF9] rounded-md p-3 hover:shadow-lg transition-all"
              >
                <div className="text-sm text-gray-800">
                  <p><strong>Name:</strong> {c.name || "N/A"}</p>
                  <p><strong>Email:</strong> {c.email || "N/A"}</p>
                  <p><strong>Subject:</strong> {c.subject || "N/A"}</p>
                  <p><strong>Message:</strong> {c.message || "No message"}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Submitted: {c.createdAt || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => confirmDelete(c)}
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
