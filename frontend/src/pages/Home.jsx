// src/pages/Home.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {
  MoreVertical,
  Star,
  Eye,
  Edit,
  Share2,
  Trash2,
  Plus,
  Bookmark,
  Settings,
  Sparkles,
  Bot,
} from "lucide-react";
import { jsPDF } from "jspdf";

// Animated typing text (same as before)
const texts = [
  "Use Pro Doc\nto create your\nproject docs faster and smarter",
  "Use Pro Doc\nto create your\nprofessional documents easily",
  "Use Pro Doc\nto create your\ncollaborative workspaces quickly",
  "Use Pro Doc\nto create your\nstructured content efficiently",
];

const AnimatedText = () => {
  const [currentText, setCurrentText] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(80);
  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b));

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[currentText];
      if (isDeleting) {
        setDisplayedText((prev) => prev.slice(0, -1));
        setSpeed(40);
      } else {
        setDisplayedText((prev) => fullText.slice(0, prev.length + 1));
        setSpeed(80);
      }

      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentText((prev) => (prev + 1) % texts.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentText, speed]);

  return (
    <div className="relative min-h-[120px]">
      <h2 className="invisible text-2xl font-extrabold whitespace-pre-line lg:text-3xl">
        {longestText}
      </h2>
      <h2 className="absolute top-0 left-0 text-2xl font-extrabold leading-snug text-gray-900 whitespace-pre-line lg:text-3xl">
        <span className="text-[#4066E0]">{displayedText}</span>
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  );
};

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [loadingRoleSave, setLoadingRoleSave] = useState(false);
  const timeoutRef = useRef(null);
  const docsContainerRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Fetch docs
  const fetchDocs = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await axios.get("http://localhost:5000/api/docs/my-docs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Support both res.data and res.data.docs
      setDocs(res.data?.docs ?? res.data ?? []);
    } catch (err) {
      console.error("Error fetching docs:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error("Failed to load documents");
    }
  }, [token, isLoggedIn, navigate]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);
  // Close dropdown on outside tap or scroll (mobile fix)
    useEffect(() => {
      const handleOutsideTouch = (e) => {
        const target = e.target;
        // if the click/touch was inside the docs container, don't close the dropdown
        if (docsContainerRef.current && docsContainerRef.current.contains(target)) {
          return;
        }
        setDropdownOpen(null);
      };
  
      const handleScroll = () => setDropdownOpen(null);
  
      document.addEventListener("touchstart", handleOutsideTouch);
      document.addEventListener("mousedown", handleOutsideTouch);
      document.addEventListener("scroll", handleScroll, true);
  
      return () => {
        document.removeEventListener("touchstart", handleOutsideTouch);
        document.removeEventListener("mousedown", handleOutsideTouch);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }, []);

  // ---------- Role modal (first-time user) ----------
  // We check profile; if there's no role saved, prompt the user to choose
  useEffect(() => {
    const checkRole = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.role) {
          // open role modal
          setRoleModalOpen(true);
        } else {
          // Role exists — ensure we store a quick client-side flag if wanted
          localStorage.setItem("userRole", res.data.role);
        }
      } catch (err) {
        console.error("Error checking profile role:", err);
        // if unauthorized -> redirect to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    checkRole();
  }, [isLoggedIn, token, navigate]);

  const saveRole = async (role) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setLoadingRoleSave(true);
    try {
      // POST to set role; adjust endpoint to match your backend if needed
      const res = await axios.post(
        "http://localhost:5000/api/profile/role",
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Thanks — saved your role!");
        setRoleModalOpen(false);
        localStorage.setItem("userRole", role);
      } else {
        toast.error("Failed to set role. Try again.");
      }
    } catch (err) {
      console.error("Error saving role:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error("Server error while saving role");
    } finally {
      setLoadingRoleSave(false);
    }
  };

  // ---------- Favorite toggle ----------
  const setFavorite = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/docs/my-docs/${id}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocs((prev) =>
        prev.map((doc) => (doc._id === id ? { ...doc, favorite: res.data.favorite } : doc))
      );
      toast.success("Updated favorite");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error("Failed to update favorite");
    }
  };

  // ---------- Share as PDF ----------
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
      const pdfFile = new File([pdfBlob], `${fullDoc.name}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: fullDoc.name,
          text: "Sharing my Pro Doc document",
          files: [pdfFile],
        });
      } else {
        pdf.save(`${fullDoc.name}.pdf`);
        alert("Sharing not supported — PDF downloaded instead");
      }
    } catch (err) {
      console.error("Error sharing doc:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error("Failed to share document");
    }
  };

  // ---------- Dropdown handlers ----------
  const toggleDropdown = (id, e) => {
    // stopPropagation might already be handled at click site; keep safe here
    if (e) e.stopPropagation();
    clearTimeout(timeoutRef.current);
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(null), 300);
  };

  // ---------- Navigation helper (ensures login) ----------
  const handleNav = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate("/login");
  };

  // ---------- Delete flow ----------
  const confirmDelete = async () => {
    if (!deleteTarget || deleteInput !== deleteTarget.name) return;
    try {
      await axios.delete(`http://localhost:5000/api/docs/my-docs/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTarget(null);
      setDeleteInput("");
      fetchDocs();
      toast.success("Document deleted");
    } catch (err) {
      console.error("Error deleting doc:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error("Failed to delete document");
    }
  };

  // ---------- Helper: formatted date ----------
  const formatDate = (dateVal) => {
    if (!dateVal) return "-";
    try {
      return new Date(dateVal).toLocaleDateString();
    } catch {
      return String(dateVal).split("T")[0];
    }
  };

  return (
    // Outer wrapper is full width so background and footer span the entire viewport
    <div ref={docsContainerRef} className="flex flex-col min-h-screen bg-gradient-to-br from-[#EAF6FF] via-[#F3F8FF] to-[#E4E1FF] w-full">
      {/* make this a flex column and allow it to grow so `main.flex-1` can push footer to bottom */}
      <div className="flex flex-col flex-1 w-full">
        <Header />
  <main className="flex-1 px-6 py-10"> 
          <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="p-8 mb-10 text-center bg-white border border-[#1EC6D7]/30 shadow-lg rounded-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to <span className="text-[#4066E0]">Pro Doc</span>
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Create professional documents, collaborate with your team, and
              manage projects efficiently.
            </p>

            {!isLoggedIn && (
              <div className="flex flex-col items-center justify-center gap-3 mt-8 sm:flex-row sm:gap-6">
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 text-sm font-medium text-white transition-all rounded-full shadow-md bg-[#4066E0] hover:bg-[#1EC6D7] hover:shadow-lg sm:px-6 sm:py-2 sm:text-base"
                >
                  Get Started - Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 text-sm font-medium text-[#4066E0] transition-all border border-[#1EC6D7] rounded-full shadow-sm hover:bg-[#1EC6D7]/10 hover:text-[#1EC6D7] hover:shadow-md sm:px-6 sm:py-2 sm:text-base"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Top Section */}
          <div className="grid grid-cols-1 gap-6 mb-12 lg:grid-cols-2">
            <div className="flex gap-4 p-6 bg-white border border-[#1EC6D7]/30 shadow-md rounded-2xl">
              <div
                onClick={() => handleNav("/create-doc")}
                className="flex flex-col items-center justify-center flex-1 p-8 transition-all duration-300 border-2 border-dashed cursor-pointer rounded-xl border-[#1EC6D7]/40 hover:border-[#4066E0] hover:bg-[#EAF6FF] hover:shadow-xl group"
              >
                <div className="flex items-center justify-center w-20 h-20 mb-4 transition-colors rounded-full bg-[#EAF6FF] group-hover:bg-[#1EC6D7]/20">
                  <Plus strokeWidth={3} className="w-10 h-10 text-[#4066E0]" />
                </div>
                <p className="text-lg font-semibold text-gray-900 group-hover:text-[#4066E0]">
                  Create a Doc
                </p>
              </div>

              <div className="flex flex-col w-1/2 gap-4">
                <div
                  onClick={() => handleNav("/favorites")}
                  className="flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer rounded-xl border-[#1EC6D7]/30 hover:border-[#4066E0] hover:bg-[#EAF6FF] hover:shadow-lg group"
                >
                  <Bookmark strokeWidth={3} className="mb-2 w-7 h-7 text-[#4066E0]" />
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#4066E0]">
                    Favorites
                  </p>
                </div>

                <div
                  onClick={() => handleNav("/tools")}
                  className="flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer rounded-xl border-[#1EC6D7]/30 hover:border-[#4066E0] hover:bg-[#EAF6FF] hover:shadow-lg group"
                >
                  <Settings strokeWidth={3} className="mb-2 w-7 h-7 text-[#4066E0]" />
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#4066E0]">
                    Tools
                  </p>
                </div>
              </div>
            </div>

            {/* AI Section */}
            <div
              className="relative p-8 overflow-hidden border shadow-lg bg-gradient-to-br from-[#4066E0]/10 via-[#1EC6D7]/5 to-[#EAF6FF] border-[#1EC6D7]/30 rounded-2xl min-h-[240px] flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all"
              onClick={() => handleNav("/DocAI")}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-32 h-32 rounded-full bg-[#4066E0]/10 blur-2xl animate-float top-10 left-10"></div>
                <div className="absolute w-40 h-40 rounded-full bg-[#1EC6D7]/10 blur-3xl animate-float-delayed bottom-10 right-10"></div>
                <div className="absolute w-24 h-24 rounded-full bg-[#6A3FD7]/10 blur-xl animate-float-slow top-20 right-20"></div>
              </div>

              <div className="absolute z-20 flex flex-col items-center top-4 right-4">
                <Bot className="w-12 h-12 text-[#4066E0] drop-shadow-lg animate-bounce-slow group-hover:text-[#1EC6D7] transition-colors" />
                <span className="mt-1 text-sm font-bold text-gray-800">Docxy</span>
              </div>

              <div className="relative z-10 max-w-md">
                <AnimatedText />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNav("/DocAI");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 mt-6 font-medium text-gray-800 transition-all bg-white/80 backdrop-blur-sm border border-[#1EC6D7]/30 rounded-full shadow-md hover:bg-[#1EC6D7]/10 hover:border-[#4066E0] hover:text-[#4066E0] hover:shadow-xl group"
                >
                  <Sparkles className="w-5 h-5 text-[#4066E0] group-hover:text-[#1EC6D7] animate-pulse" />
                  <span>Make me a Project Documentation ...</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document List */}
          {isLoggedIn && (
            <div className="mt-6 border-t-2 border-[#1EC6D7]/30">
              {/* Search bar for documents */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white rounded-lg shadow-sm">
                  <div className="relative flex-1">
                    <svg
                      className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search documents..."
                      className="w-full sm:max-w-md pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4066E0] focus:border-transparent shadow-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">No. of docs:</span>
                    <span className="font-medium text-[#4066E0]">{docs.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                {/* Desktop Header */}
                <div className="hidden sm:grid grid-cols-[60px,1fr,140px,80px] md:grid-cols-[80px,1fr,180px,100px] font-semibold bg-[#EAF6FF] text-gray-700 py-3 px-2 sm:px-4 rounded-t-lg">
                  <span className="text-xs text-center md:text-sm">S. No</span>
                  <span className="text-xs md:text-sm">Name</span>
                  <span className="pr-2 text-xs text-right md:text-sm">Date Created</span>
                  <span className="text-xs text-right md:text-sm">Actions</span>
                </div>

                {/* Mobile Header */}
                <div className="grid grid-cols-[1fr,80px] sm:hidden font-semibold bg-[#EAF6FF] text-gray-700 py-3 px-3 rounded-t-lg">
                  <span className="text-sm">Document</span>
                  <span className="text-sm text-right">Actions</span>
                </div>

                {/* Document List Content */}

                {docs.filter(d => d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className="px-3 py-4 text-sm text-gray-500 border-b">No documents found.</div>
                ) : (
                  docs
                    .filter((d) => d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((doc, i) => (
                    <div key={doc._id}>
                      {/* Desktop Row */}
                      <div
                        className="hidden sm:grid grid-cols-[60px,1fr,140px,80px] md:grid-cols-[80px,1fr,180px,100px] items-center py-3 px-2 sm:px-4 border-b text-sm hover:bg-[#EAF6FF] transition-all"
                      >
                        <span className="text-xs text-center md:text-sm">{i + 1}</span>

                        <span
                          className="flex items-center gap-1 pr-2 text-xs font-medium text-gray-800 truncate md:text-sm"
                          title={doc.name}
                        >
                          <span
                            className="truncate cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/doc/${doc._id}`);
                            }}
                          >
                            {doc.name}
                          </span>
                          {doc.favorite && <Star size={14} className="flex-shrink-0 text-yellow-400 fill-yellow-400" />}
                        </span>

                        <span className="pr-2 text-xs text-right text-gray-600 md:text-sm">
                          {formatDate(doc.createdAt || doc.created_at)}
                        </span>

                      <span className="relative flex justify-end">
                        <button
                          className="p-1 rounded hover:bg-[#EAF6FF]"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(doc._id, e);
                          }}
                          aria-haspopup="true"
                          aria-expanded={dropdownOpen === doc._id}
                          title="More actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {dropdownOpen === doc._id && (
                          <div
                            className="doc-dropdown absolute right-0 z-50 mt-2 bg-white border border-[#1EC6D7]/30 rounded-lg shadow-lg w-44 animate-fadeIn"
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Home: View clicked', doc._id);
                                navigate(`/doc/${doc._id}`);
                                setDropdownOpen(null);
                              }}
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Home: Edit clicked', doc._id);
                                navigate(`/doc/${doc._id}/edit`);
                                setDropdownOpen(null);
                              }}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Home: Favorite clicked', doc._id);
                                setFavorite(doc._id);
                                setDropdownOpen(null);
                              }}
                            >
                              <Star
                                size={14}
                                className={doc.favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                              />{" "}
                              Favorite
                            </button>
                            <button
                              type="button"
                              className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Home: Share clicked', doc._id);
                                shareDocAsPDF(doc);
                                setDropdownOpen(null);
                              }}
                            >
                              <Share2 size={14} /> Share
                            </button>
                            <button
                              type="button"
                              className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Home: Delete clicked', doc._id);
                                setDeleteTarget(doc);
                                setDeleteInput("");
                                setDropdownOpen(null);
                              }}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </span>
                      </div>

                      {/* Mobile Row */}
                      <div className="grid grid-cols-[1fr,80px] sm:hidden items-start py-3 px-3 border-b hover:bg-[#EAF6FF] transition-all gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <span
                              className="font-medium text-gray-800 hover:text-[#4066E0] text-sm truncate max-w-[200px] cursor-pointer"
                              title={doc.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/doc/${doc._id}`);
                              }}
                            >
                              {doc.name}
                            </span>
                            {doc.favorite && <Star size={12} className="flex-shrink-0 text-yellow-400 fill-yellow-400" />}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(doc.createdAt || doc.created_at)}</span>
                        </div>

                        <span className="relative flex items-start justify-end">
                          <button
                            className="p-1 rounded hover:bg-[#EAF6FF]"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(doc._id, e);
                            }}
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen === doc._id}
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {dropdownOpen === doc._id && (
                            <div
                              className="absolute right-0 z-50 mt-2 bg-white border border-[#1EC6D7]/30 rounded-lg shadow-lg w-44 animate-fadeIn"
                              onMouseLeave={handleMouseLeave}
                              onClick={(e) => e.stopPropagation()}
                              onTouchStart={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Home mobile: View clicked', doc._id);
                                  navigate(`/doc/${doc._id}`);
                                  setDropdownOpen(null);
                                }}
                              >
                                <Eye size={14} /> View
                              </button>
                              <button
                                type="button"
                                className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Home mobile: Edit clicked', doc._id);
                                  navigate(`/doc/${doc._id}/edit`);
                                  setDropdownOpen(null);
                                }}
                              >
                                <Edit size={14} /> Edit
                              </button>
                              <button
                                type="button"
                                className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Home mobile: Favorite clicked', doc._id);
                                  setFavorite(doc._id);
                                  setDropdownOpen(null);
                                }}
                              >
                                <Star size={14} className={doc.favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-500"} /> Favorite
                              </button>
                              <button
                                type="button"
                                className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-[#E6F9FC]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Home mobile: Share clicked', doc._id);
                                  shareDocAsPDF(doc);
                                  setDropdownOpen(null);
                                }}
                              >
                                <Share2 size={14} /> Share
                              </button>
                              <button
                                type="button"
                                className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Home mobile: Delete clicked', doc._id);
                                  setDeleteTarget(doc);
                                  setDeleteInput("");
                                  setDropdownOpen(null);
                                }}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

  {/* Footer sits outside the centered container so it spans full width */}
  <Footer />

      {/* Delete confirmation modal - requires typing doc name */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Confirm deletion</h2>
            <p className="mb-3 text-sm text-gray-600">
              To permanently delete <strong>{deleteTarget.name}</strong>, type the document name below and click <strong>Delete</strong>.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={deleteTarget.name}
              className="w-full px-3 py-2 mb-4 border rounded border-[#1EC6D7]/40"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteInput("");
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded ${deleteInput === deleteTarget.name ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}`}
                onClick={() => confirmDelete()}
                disabled={deleteInput !== deleteTarget.name}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role selection modal (first-time users) */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-2 text-xl font-semibold">Welcome to Pro Doc!</h2>
            <p className="mb-4 text-sm text-gray-600">
              To give you a tailored experience, are you a <strong>Student</strong> or an <strong>Employee</strong>?
            </p>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => saveRole("student")}
                className="flex-1 px-4 py-2 font-semibold text-white rounded bg-[#4066E0] hover:bg-[#3458c6]"
                disabled={loadingRoleSave}
              >
                I'm a Student
              </button>
              <button
                onClick={() => saveRole("employee")}
                className="flex-1 px-4 py-2 font-semibold text-white rounded bg-[#1EC6D7] hover:bg-[#18bfc3]"
                disabled={loadingRoleSave}
              >
                I'm an Employee
              </button>
            </div>
            <div className="text-xs text-gray-500">
              You can update this later in your profile settings.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
