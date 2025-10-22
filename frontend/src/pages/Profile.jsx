// src/pages/Profile.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import toast from 'react-hot-toast';
import Cropper from "react-easy-crop";

import {
  ArrowLeft,
  Settings,
  Edit3,
  Check,
  X,
  Crown,
  Sparkles,
  Star,
  User,
  Mail,
  Camera,
} from "lucide-react";

/**
 * Profile.jsx
 * - Colors and UI updated to match Home.jsx palette:
 *   - Primary accent: #4066E0
 *   - Secondary: #1EC6D7
 *   - Purple accent: #6A3FD7
 * - Added gradient outline around profile image
 * - Improved mobile layout and stacking
 * - Kept existing logic for fetching/updating/cropping/uploading
 */

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const location = useLocation();

  // Profile state
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    dateOfBirth: "",
    profileImage: "",
    plan: "starter",
  });

  // UI state
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    dateOfBirth: false,
  });
  const [editValues, setEditValues] = useState({
    fullName: "",
    dateOfBirth: "",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [fileForUpload, setFileForUpload] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Settings menu items
  const settingsMenuItems = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Feedback", path: "/feedback" },
    { label: "Help Center", path: "/help" },
    { label: "Privacy Policy", path: "/privacy-policy" },
  ];

  // Fetch profile
  useEffect(() => {
    fetchProfile();
    const onFocus = () => fetchProfile(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

      // prefix local static path with backend origin if needed
      if (data.profileImage && data.profileImage.startsWith('/')) {
        data.profileImage = (window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin) + data.profileImage;
      }

      setProfile({
        username: data.username || "",
        fullName,
        email: data.email || "",
        dateOfBirth: data.dateOfBirth || "",
        profileImage: data.profileImage || "",
        plan: data.premium ? "premium" : "starter",
      });

      setEditValues({
        fullName,
        dateOfBirth: data.dateOfBirth || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // ---------- FIELD SAVE / CANCEL ----------
  const handleSave = async (field) => {
    setSaving(true);
    try {
      let updateData = {};

      if (field === "fullName") {
        const [firstName, ...rest] = editValues.fullName.split(" ");
        updateData.firstName = firstName;
        updateData.lastName = rest.join(" ") || "";
      } else {
        updateData[field] = editValues[field];
      }

      const response = await axios.put(
        "http://localhost:5000/api/profile",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      const updatedFullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

      setProfile((prev) => ({
        ...prev,
        ...data,
        fullName: updatedFullName,
      }));

      setEditValues((prev) => ({
        ...prev,
        fullName: updatedFullName,
        dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
      }));

      setIsEditing((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (field) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: profile[field] || "",
    }));
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  // ---------- CROPPER HELPERS ----------
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = url;
    });

  const getCroppedImg = async (imageSrcLocal, pixelCrop) => {
    const image = await createImage(imageSrcLocal);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        },
        "image/jpeg",
        0.92
      );
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setFileForUpload(file);
    setShowCropModal(true);
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const { blob } = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], fileForUpload?.name || "avatar.jpg", {
        type: blob.type,
      });

      const formData = new FormData();
      formData.append("profileImage", croppedFile);

      const res = await fetch("http://localhost:5000/api/profile/upload", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const newUrl = data.profileImage
          ? `${data.profileImage}?t=${Date.now()}`
          : profile.profileImage;
        setProfile((p) => ({ ...p, profileImage: newUrl }));
        setShowCropModal(false);

        URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
        setFileForUpload(null);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Crop upload error:", err);
      alert("Upload failed");
    } finally {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
      setFileForUpload(null);
      setSaving(false);
    }
  };

  const handleUploadOriginal = async () => {
    if (!fileForUpload) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", fileForUpload);
      const res = await fetch("http://localhost:5000/api/profile/upload", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((p) => ({ ...p, profileImage: data.profileImage || p.profileImage }));
        setShowCropModal(false);
        URL.revokeObjectURL(imageSrc);
        setImageSrc(null);
        setFileForUpload(null);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload original error:", err);
      alert("Upload failed");
    } finally {
      setSaving(false);
    }
  };

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="p-6 bg-white rounded-lg shadow">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper: nicely formatted DOB for display
  const displayDOB = (dob) => {
    if (!dob) return "Not set";
    try {
      return new Date(dob).toLocaleDateString("en-GB");
    } catch {
      return dob;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF]">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Top Navigation */}
          <div className="flex items-center justify-between gap-4 mb-6">
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

            {/* Settings */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-3 text-gray-700 transition-all bg-white border border-[#1EC6D7]/20 rounded-full shadow-sm hover:shadow-md hover:bg-white/90"
                aria-expanded={settingsOpen}
                aria-haspopup="true"
              >
                <Settings size={20} className="text-[#4066E0]" />
              </button>
              {settingsOpen && (
                <div
                  className="absolute right-0 z-10 w-48 mt-2 bg-white border border-[#1EC6D7]/30 rounded-lg shadow-lg"
                  role="menu"
                >
                  {settingsMenuItems.map((item, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        navigate(item.path);
                        setSettingsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="p-6 bg-white border border-[#1EC6D7]/20 shadow-lg rounded-2xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Side */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* Gradient ring wrapper */}
                    <div className="p-1 rounded-full bg-gradient-to-r from-[#4066E0] via-[#1EC6D7] to-[#6A3FD7] animate-gradient-rotate">
                      <div className="p-1 bg-white rounded-full">
                        <div className="relative overflow-hidden bg-gray-100 border border-white rounded-full shadow-xl w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt="Profile"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/default-avatar.png";
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <User size={44} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-2 text-white transition-colors bg-[#4066E0] rounded-full shadow-lg hover:bg-[#1EC6D7]"
                      aria-label="Change profile image"
                    >
                      <Camera size={16} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileSelected}
                      className="hidden"
                    />
                  </div>

                  {/* small caption and plan chip */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-800">
                        {profile.username || "username"}
                      </div>
                      <div className="text-xs text-gray-500">{profile.email}</div>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  {isEditing.fullName ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        value={editValues.fullName}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border rounded-lg focus:border-[#4066E0] focus:ring focus:ring-[#4066E0]/20"
                        placeholder="Your full name"
                      />
                      <div className="flex flex-shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSave("fullName")}
                          disabled={saving}
                          className="inline-flex items-center px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel("fullName")}
                          className="inline-flex items-center px-3 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                      <span>{profile.fullName || "Not set"}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setIsEditing((prev) => ({ ...prev, fullName: true }))
                        }
                        className="text-[#4066E0]"
                        aria-label="Edit full name"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                    <Mail size={16} className="text-gray-500" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  {isEditing.dateOfBirth ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="date"
                        value={editValues.dateOfBirth}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border rounded-lg focus:border-[#4066E0] focus:ring focus:ring-[#4066E0]/20"
                      />
                      <div className="flex flex-shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSave("dateOfBirth")}
                          disabled={saving}
                          className="inline-flex items-center px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel("dateOfBirth")}
                          className="inline-flex items-center px-3 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                      <span>{displayDOB(profile.dateOfBirth)}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setIsEditing((prev) => ({ ...prev, dateOfBirth: true }))
                        }
                        className="text-[#4066E0]"
                        aria-label="Edit date of birth"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
{/* Right Section - Plan */}
              <div className="p-6 border border-[#1EC6D7]/40 bg-gradient-to-br from-[#EAF6FF] to-[#F3F8FF] rounded-xl">
                <div className="p-4 mb-6 bg-white border border-[#1EC6D7]/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {profile.plan === "premium" ? "Premium" : "Starter"}
                    </h3>
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile.plan === "premium"
                      ? "Premium User - Full Access"
                      : "Free User - Limited Access"}
                  </p>
                </div>

                {profile.plan !== "premium" && (
                  <div className="text-center">
                    <h4 className="mb-3 text-lg font-semibold text-gray-800">
                      Upgrade to Pro
                    </h4>
                    <div className="mb-6 space-y-2 text-sm text-gray-700">
                      {["Unlimited Access", "AI Tools", "Exclusive Features", "Faster Processing"].map(
                        (f, i) => (
                          <div key={i} className="flex items-center justify-center gap-2">
                            <Check size={14} className="text-green-600" />
                            <span>{f}</span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full shadow-lg bg-gradient-to-br from-[#4066E0] via-[#1EC6D7] to-[#6A3FD7]">
                        <Crown size={32} className="text-white" />
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/coming-soon")}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-[#4066E0] to-[#1EC6D7] hover:from-[#1EC6D7] hover:to-[#4066E0]"
                    >
                      <Sparkles size={18} />
                      <span>Unlock Premium</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
      </main>

      <Footer />

      {/* ---------- Crop Modal ---------- */}
      {showCropModal && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-3xl p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Adjust & crop</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false);
                    URL.revokeObjectURL(imageSrc);
                    setImageSrc(null);
                    setFileForUpload(null);
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  disabled={saving}
                  className="px-3 py-1 text-sm text-white bg-[#4066E0] rounded hover:bg-[#1EC6D7]"
                >
                  {saving ? "Saving..." : "Save & Upload"}
                </button>
              </div>
            </div>

            <div className="relative w-full h-[400px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="horizontal-cover"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 mt-3 sm:flex-row">
              <div className="flex items-center gap-2">
                <label className="text-sm">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadOriginal}
                  disabled={saving}
                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Upload original (no crop)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
