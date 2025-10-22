import React, { useState, useRef, useEffect } from 'react';
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import axios from "axios";



import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Star, Download, Save, FileText, FolderOpen, Share2, 
  Trash2, Edit3, Undo, Redo, Scissors, Copy, Clipboard, MousePointer,
  Maximize, Image, Table, Hash, Link, Bold, Italic, Underline,
  Strikethrough, AlignLeft, AlignCenter, MoreHorizontal,
  AlignRight, AlignJustify, List, ListOrdered, Indent, Outdent,
  Palette, Plus, HelpCircle, Keyboard, Info, Printer, Edit
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const CreateDoc = () => {
  const [documentName, setDocumentName] = useState('');
  
  // Page margin / alignment state
  const [pageMargins, setPageMargins] = useState({ top: 64, bottom: 64, left: 64, right: 64 });
  const [pageAlign, setPageAlign] = useState('center'); // 'left' | 'center' | 'right'
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [docContent, setDocContent] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [_saved, setSaved] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const [docId, setDocId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [textColor, setTextColor] = useState("#000000");
  const [_backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState('text');
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
const fileInputRef = useRef(null);
const [imageUrl, setImageUrl] = useState("");
const [selectedImage, setSelectedImage] = useState(null);
const [showTableGrid, setShowTableGrid] = useState(false);
const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteConfirmText, setDeleteConfirmText] = useState("");
const [showEditor, setShowEditor] = useState(false);
const [isLoading, setIsLoading] = useState(false);


const loadDocument = async (docId) => {
  setIsLoading(true); // 🌀 start loader
  setShowEditor(false);

  try {
    const response = await fetch(`http://localhost:5000/api/docs/my-docs/${docId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    if (response.ok) {
      const doc = await response.json();
      setDocumentName(doc.name);
      setDocContent(doc.content || '<p>Start writing your document...</p>');
      setIsFavorite(doc.favorite || false);
      setDocId(docId);

      // ✨ delay to show loading animation for 2 seconds
      setTimeout(() => {
        setShowEditor(true);
        setIsLoading(false);
      }, 2000);
    } else {
      toast.error("Failed to load document");
      navigate('/home');
    }
  } catch (error) {
    console.error("Error loading document:", error);
    toast.error("Server error while loading document");
    navigate('/home');
  }
};






  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const editorRef = useRef(null);
  const token = localStorage.getItem('token');

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      // clear any stale token and send to login
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [token, navigate]);

  const fontFamilies = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New'];
  const fontSizes = [9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];
  const zoomOptions = [75, 90, 100, 125, 150, 200];
  
  const [activeFormats, setActiveFormats] = useState({
  bold: false,
  italic: false,
  underline: false,
});
const [showNewDocModal, setShowNewDocModal] = useState(false);
const [newDocName, setNewDocName] = useState("");
const [newDocError, setNewDocError] = useState("");

const [showLinkMenu, setShowLinkMenu] = useState(false);
const [linkText, setLinkText] = useState("");
const [linkUrl, setLinkUrl] = useState("");
const [errorMessage, setErrorMessage] = useState("");
// Rename modal states
// Rename modal state (add near other states)
const [showRenameModal, setShowRenameModal] = useState(false);
const [renameValue, setRenameValue] = useState("");
const [renameError, setRenameError] = useState("");
const [isRenaming, setIsRenaming] = useState(false);

const [_nameError, setNameError] = useState("");

useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (!documentName.trim()) {
      setNameError("Document name cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/docs/check-name",
        { name: documentName.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' } }
      );

      if (res.data.exists) {
        setNameError("This document name is already in use.");
      } else {
        setNameError("");
      }
    } catch (err) {
      // if unauthorized, redirect to login
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      console.error("Name check failed", err);
    }
  }, 500); // debounce 500ms

  return () => clearTimeout(delayDebounce);
}, [documentName]);



useEffect(() => {
  const editor = editorRef.current;

  if (!editor) return;

  const handleClick = (e) => {
    const link = e.target.closest("a");
    if (link && editor.contains(link)) {
      e.preventDefault();
      window.open(link.href, "_blank");
    }
  };

  editor.addEventListener("click", handleClick);
  return () => editor.removeEventListener("click", handleClick);
}, []);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', handleResize);
  handleResize();
  return () => window.removeEventListener('resize', handleResize);
}, []);



useEffect(() => {
  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  document.addEventListener("selectionchange", checkFormats);
  return () => document.removeEventListener("selectionchange", checkFormats);
}, []);
useEffect(() => {
  const handleClick = (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("doc-image")) {
      setSelectedImage(e.target);
      e.target.classList.add("selected");
    } else {
      if (selectedImage) selectedImage.classList.remove("selected");
      setSelectedImage(null);
    }
  };


  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, [selectedImage]);

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc'
  ];

 // 1. Active formats
useEffect(() => {
  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  document.addEventListener("selectionchange", checkFormats);
  return () => document.removeEventListener("selectionchange", checkFormats);
}, []);

// 2. Load document
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  if (id) {
    loadDocument(id);
  }
}, [id]);

// If route state requests tools (openTools) or URL ends with /edit, set edit mode
useEffect(() => {
  const wantsTools = location?.state?.openTools === true;
  const pathEndsWithEdit = window.location.pathname.endsWith('/edit');
  if (wantsTools || pathEndsWithEdit) {
    setIsEditMode(true);
  } else {
    // keep existing behavior (default view after load is showEditor true but isEditMode may be false)
    setIsEditMode((prev) => prev);
  }
}, [location]);

// 3. Keyboard shortcuts
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  const handleKeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "z": e.preventDefault(); document.execCommand("undo"); break;
        case "y": e.preventDefault(); document.execCommand("redo"); break;
        case "s": e.preventDefault(); saveDocument(); break;
        case "b": e.preventDefault(); formatText("bold"); break;
        case "i": e.preventDefault(); formatText("italic"); break;
        case "u": e.preventDefault(); formatText("underline"); break;
        case "p": e.preventDefault(); printDocument(); break;
        default: break; // ✅ fixes default-case warning
      }
    }
  };

  if (showEditor) {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }
}, [showEditor]);

  // loadDocument already declared earlier; duplicate removed to avoid redeclaration error.

// Open modal (replaces the old prompt-based renameDocument)
const renameDocument = () => {
  setRenameValue(documentName || "");
  setRenameError("");
  setShowRenameModal(true);
};

// Submit rename (form handler)
const handleRename = async (e) => {
  if (e && e.preventDefault) e.preventDefault();

  const newName = (renameValue || "").trim();
  if (!newName) {
    setRenameError("Document name is required");
    return;
  }

  // If no docId (not saved yet) you might want to create first — guard:
  if (!docId) {
    setRenameError("Please save the document first before renaming.");
    return;
  }

    try {
    setIsRenaming(true);

    // 1) fetch existing docs to check duplicate names
    const res = await fetch("http://localhost:5000/api/docs/my-docs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    if (!res.ok) {
      setRenameError("Failed to validate name uniqueness");
      setIsRenaming(false);
      return;
    }

    const docs = await res.json();

    const exists = docs.some(
      (d) => d.name.toLowerCase() === newName.toLowerCase() && d._id !== docId
    );

    if (exists) {
      setRenameError("⚠️ That name is already used. Choose another.");
      setIsRenaming(false);
      return;
    }

    // 2) update the current doc's name (PUT to your endpoint)
    const updateRes = await fetch(`http://localhost:5000/api/docs/my-docs/${docId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName,
        // send current content so the server has full doc — adapt if your API uses PATCH for name only
        content: editorRef.current?.innerHTML || docContent,
        favorite: isFavorite
      })
    });
    if (updateRes.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      setRenameError(updateData.message || "Failed to rename document");
      setIsRenaming(false);
      return;
    }

    // Success
    setDocumentName(newName);
    setShowRenameModal(false);
    setRenameError("");
    setSaved(false);
    toast.success("Document renamed");
  } catch (err) {
    console.error("Rename error:", err);
    setRenameError("Server error while renaming");
  } finally {
    setIsRenaming(false);
  }
};




  const createNewDocument = async () => {
  if (!newDocName.trim()) {
    setNewDocError("Document name is required");
    return;
  }

  try {
    // Fetch all docs
    const res = await fetch("http://localhost:5000/api/docs/my-docs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const docs = await res.json();

    // Check duplicate
    const exists = docs.some(
      (doc) => doc.name.toLowerCase() === newDocName.trim().toLowerCase()
    );
    if (exists) {
      setNewDocError("⚠️ Document name already exists");
      return;
    }

    // Create new doc
    const response = await fetch("http://localhost:5000/api/docs/my-docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newDocName.trim(),
        content: "<p>Start writing your document...</p>",
        favorite: false,
      }),
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const data = await response.json();
    if (response.ok) {
      setDocId(data._id);
      setDocumentName(newDocName.trim());
      setDocContent("<p>Start writing your document...</p>");
      setShowEditor(true);
      setIsEditMode(true);
      setSaved(false);
      setShowNewDocModal(false); // close modal
      setNewDocName("");
      setNewDocError("");
      toast.success("New document created!");
    } else {
      setNewDocError(data.message || "Failed to create document");
    }
  } catch (error) {
    console.error("Error creating document:", error);
    setNewDocError("Server error, please try again.");
  }
};

  const createDocument = async () => {
  if (!documentName.trim()) {
    setErrorMessage("Document name is required");
    return;
  }

  try {
    // 🔎 Step 1: Fetch existing docs
    const res = await fetch("http://localhost:5000/api/docs/my-docs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const docs = await res.json();

    // 🔎 Step 2: Check duplicate
    const exists = docs.some(
      (doc) => doc.name.toLowerCase() === documentName.trim().toLowerCase()
    );

    if (exists) {
      setErrorMessage("⚠️ Document name already exists, please choose another.");
      return;
    }

    // 🔎 Step 3: Clear error + create doc
    setErrorMessage("");

    const response = await fetch("http://localhost:5000/api/docs/my-docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: documentName.trim(),
        content: "<p>Start writing your document...</p>",
        favorite: false,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setDocId(data._id);
      setShowEditor(true);
      setDocContent("<p>Start writing your document...</p>");
      setIsEditMode(true);
      // ✅ Optional toast instead of alert
      // toast.success("Document created successfully!");
    } else {
      setErrorMessage(data.message || "Failed to create document");
    }
  } catch (error) {
    console.error("Error creating document:", error);
    setErrorMessage("Server error, please try again later.");
  }
};


  const saveDocument = async () => {
    if (!docId) return;
    
    const content = editorRef.current?.innerHTML || docContent;
    
    try {
      const response = await fetch(`http://localhost:5000/api/docs/my-docs/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: documentName,
          content: content,
          favorite: isFavorite
        })
      });

      if (response.ok) {
        setSaved(true);
        setIsEditMode(false);
        toast.success("Document saved successfully!");
      } else {
        toast.error("Failed to save document");
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error("Server error while saving document");
    }
  };

  const toggleFavorite = async () => {
    if (!docId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/docs/my-docs/${docId}/favorite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.favorite);
        setSaved(false);
      } else {
        toast.error("Failed to update favorite status");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Server error while updating favorite");
    }
  };

 
// Delete doc (no alert, no fetchDocs here)
const deleteDocument = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/docs/my-docs/${docId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Document deleted successfully!");
    navigate("/home"); // 👈 go back to Home after delete
  } catch (err) {
    console.error("Error deleting doc:", err);
    toast.error("Failed to delete document");
  }
};


const formatText = (command, value = null) => {
  document.execCommand(command, false, value);
  setSaved(false);
  editorRef.current?.focus();

  // ✅ Immediately refresh active formats state
  setActiveFormats({
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
  });
};


const formatHeading = (level) => {
  editorRef.current?.focus();
  if (level === "p") {
    document.execCommand("formatBlock", false, "<P>");
  } else {
    document.execCommand("formatBlock", false, `<H${level}>`);
  }
  setSaved(false);
};

const insertImageFromUrl = () => {
  if (imageUrl) {
    const img = `
      <div class="doc-image-wrapper" contenteditable="false" style="display:inline-block; position:relative; max-width:100%;">
        <img src="${imageUrl}" alt="doc-image" class="doc-image" style="max-width:100%; height:auto;" />
      </div>
    `;
    formatText("insertHTML", img);
    setImageUrl("");
    setShowImageMenu(false);
  }
};


useEffect(() => {
  const editor = editorRef.current;

  const onMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      e.preventDefault();
      const wrapper = e.target.closest(".resizable");
      const img = wrapper.querySelector("img");

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = img.offsetWidth;
      const startHeight = img.offsetHeight;

      const onMouseMove = (moveEvent) => {
        const diffX = moveEvent.clientX - startX;
        const diffY = moveEvent.clientY - startY;

        img.style.width = startWidth + diffX + "px";
        img.style.height = startHeight + diffY + "px";
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  editor?.addEventListener("mousedown", onMouseDown);
  return () => editor?.removeEventListener("mousedown", onMouseDown);
}, []);

const openFilePicker = () => {
  fileInputRef.current?.click();
  setShowImageMenu(false);
};


const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  // show local preview immediately
  const localUrl = URL.createObjectURL(file);
  const placeholderId = `img-placeholder-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  const placeholderHtml = `
    <div class="doc-image-wrapper" contenteditable="false" style="display:inline-block; position:relative; max-width:100%;">
      <img id="${placeholderId}" src="${localUrl}" loading="lazy" alt="doc-image" class="doc-image" style="max-width:100%; height:auto;" />
    </div>
  `;

  // insert preview immediately
  formatText("insertHTML", placeholderHtml);
  event.target.value = "";
  setShowImageMenu(false);

  // upload in background and replace placeholder when done
  const formData = new FormData();
  formData.append("image", file);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to upload images.");
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const response = await fetch("http://localhost:5000/api/docs/upload-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // If the server returns 401, force re-login and show a clear message
    if (response.status === 401) {
      try {
        const errJson = await response.json().catch(() => null);
        console.error('Upload unauthorized:', errJson || { status: 401 });
      } catch (e) {}
      toast.error('Session expired — please login again.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const data = await response.json();
    if (response.ok && data.url) {
      const imgEl = document.getElementById(placeholderId);
      if (imgEl) {
        // if backend returned a local path (starts with /static/), prefix backend origin
        let finalUrl = data.url;
        if (finalUrl.startsWith('/')) {
          const backendOrigin = window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin;
          finalUrl = backendOrigin + finalUrl;
        }
        imgEl.src = finalUrl + (finalUrl.includes("?") ? "&" : "?") + `t=${Date.now()}`;
        imgEl.removeAttribute('id');
        // ensure the uploaded image is visible on mobile
        try { imgEl.classList.add('doc-image'); imgEl.style.maxWidth = '100%'; imgEl.style.height = 'auto'; imgEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){}
      }
    } else {
      console.error('Upload failed:', data);
      // Show server-provided message (error or message) if available
      const msg = data?.error || data?.message || 'Failed to upload image';
      toast.error(msg);
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Server error while uploading image");
  } finally {
    // revoke local object URL shortly after replacing to free memory
    setTimeout(() => URL.revokeObjectURL(localUrl), 2000);
  }
};

const insertTable = (rows, cols) => {
  if (!rows || !cols) return;

  let tableHTML = `
    <table contenteditable="true" class="resizable-table"
           style="border-collapse: collapse; margin: 10px 0; width: auto;">
  `;
  for (let i = 0; i < rows; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < cols; j++) {
      tableHTML += `
        <td style="
          padding: 8px;
          border: 1px solid #ccc;
          min-width: 60px;
          min-height: 30px;
          position: relative;
        ">&nbsp;</td>
      `;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table><p>&nbsp;</p>";

  // ✅ Ensure editor is focused before inserting
  editorRef.current?.focus();
  document.execCommand("insertHTML", false, tableHTML);

  setShowTableGrid(false);
  setTimeout(makeTablesResizable, 0);
};

const makeTablesResizable = () => {
  const tables = editorRef.current.querySelectorAll(".resizable-table");

  tables.forEach((table) => {
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td, th");

      cells.forEach((cell) => {
        // Prevent duplicate handles
        if (cell.querySelector(".col-resizer") || cell.querySelector(".row-resizer")) return;

        // Column resizer
        const colResizer = document.createElement("div");
        colResizer.classList.add("col-resizer");
        Object.assign(colResizer.style, {
          position: "absolute",
          right: "0",
          top: "0",
          width: "5px",
          height: "100%",
          cursor: "col-resize",
          userSelect: "none",
        });
        cell.appendChild(colResizer);

        // Row resizer
        const rowResizer = document.createElement("div");
        rowResizer.classList.add("row-resizer");
        Object.assign(rowResizer.style, {
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "5px",
          cursor: "row-resize",
          userSelect: "none",
        });
        cell.appendChild(rowResizer);

        let startX, startY, startWidth, startHeight;

        // Column resize
        colResizer.addEventListener("mousedown", (e) => {
          e.preventDefault();
          startX = e.pageX;
          startWidth = cell.offsetWidth;

          const doDrag = (e) => {
            cell.style.width = startWidth + (e.pageX - startX) + "px";
          };

          const stopDrag = () => {
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
          };

          document.addEventListener("mousemove", doDrag);
          document.addEventListener("mouseup", stopDrag);
        });

        // Row resize
        rowResizer.addEventListener("mousedown", (e) => {
          e.preventDefault();
          startY = e.pageY;
          startHeight = cell.offsetHeight;

          const doDrag = (e) => {
            cell.style.height = startHeight + (e.pageY - startY) + "px";
          };

          const stopDrag = () => {
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
          };

          document.addEventListener("mousemove", doDrag);
          document.addEventListener("mouseup", stopDrag);
        });
      });
    });
  });
};
useEffect(() => {
  if (showEditor) {
    makeTablesResizable();
  }
}, [showEditor]);


const insertLink = () => {
  if (linkUrl) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // Normalize URL
    let finalUrl = linkUrl.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    const a = document.createElement("a");
    a.href = finalUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.color = "#1a73e8";
    a.style.textDecoration = "underline";

    // ✅ If user gave text, use it. Otherwise use selected text. Fallback = URL
    if (linkText) {
      a.textContent = linkText;
    } else if (!selection.isCollapsed) {
      a.textContent = selection.toString();
    } else {
      a.textContent = finalUrl;
    }

    // Replace selection with link
    range.deleteContents();
    range.insertNode(a);

    // Move cursor after the link
    range.setStartAfter(a);
    range.setEndAfter(a);
    selection.removeAllRanges();
    selection.addRange(range);

    // ✅ Update document state so it survives re-render
    setDocContent(editorRef.current?.innerHTML || "");

    // Reset popup state
    setShowLinkMenu(false);
    setLinkText("");
    setLinkUrl("");
    setSaved(false);
  }
};


// (openColorPicker removed; use setColorPickerType + setShowColorPicker directly where needed)

// Apply color (fix for bullet/number points)
const applyColor = (color) => {
  editorRef.current?.focus();
  const selection = window.getSelection();
  if (!selection) return;

  const range = selection.getRangeAt(0);
  const node =
    range.startContainer.nodeType === 3
      ? range.startContainer.parentNode
      : range.startContainer;

  const liElement = node.closest("li");

  if (liElement) {
    // ✅ Apply color to li → both text + bullet/number inherit the color
    liElement.style.color = color;
  } else {
    // Normal case (non-list text or background)
    if (colorPickerType === "text") {
      document.execCommand("foreColor", false, color);
    } else {
      document.execCommand("hiliteColor", false, color);
    }
  }

  // Update toolbar indicators
  if (colorPickerType === "text") {
    setTextColor(color);
  } else {
    setBackgroundColor(color);
  }

  setShowColorPicker(false);
};

  const downloadAsPDF = () => {
    // Convert current editor HTML into PDF using jsPDF and trigger download
    (async () => {
      try {
        const content = editorRef.current?.innerHTML || docContent;
        const doc = new jsPDF("p", "pt", "a4");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(documentName || "Document", 40, 50);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        await doc.html(`<div>${content}</div>`, {
          x: 40,
          y: 80,
          width: 500,
          windowWidth: 800,
        });

        doc.save(`${documentName || "document"}.pdf`);
        toast("PDF downloaded");
      } catch (err) {
        console.error("Download PDF failed:", err);
        toast.error("Failed to generate PDF, try Share → Download");
      }
    })();
  };

  const printDocument = () => {
    const content = editorRef.current?.innerHTML || docContent;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };



const shareDocument = async () => {
  try {
    const content = editorRef.current?.innerHTML || docContent;

    // Create a new jsPDF instance
    const doc = new jsPDF("p", "pt", "a4");

    // Add document title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(documentName, 40, 50);

    // Convert HTML to PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    await doc.html(content, {
      x: 40,
      y: 80,
      width: 500,
      windowWidth: 800,
    });

    // Output as Blob
    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], `${documentName}.pdf`, {
      type: "application/pdf",
    });

    // ✅ Try to share
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [pdfFile] })
    ) {
      try {
        await navigator.share({
          title: documentName,
          text: "Sharing my document from Pro Doc",
          files: [pdfFile],
        });
        
      } catch (err) {
        // User cancelled the share sheet
        toast("Sharing cancelled");
      }
    } else {
      // ✅ Fallback → download PDF
      doc.save(`${documentName}.pdf`);
      toast("Sharing not supported, PDF downloaded instead");
    }
  } catch (error) {
    console.error("Share failed:", error);
    toast.error("❌ Failed to share document");
  }
};



  


  const openRecentDocs = () => {
    navigate('/home');
  };

 // 🌀 If URL has ID → show loading animation before document editor
if (id && (isLoading || !showEditor)) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          {/* Blue rotating ring */}
          <div className="absolute w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          {/* Soft blue glow */}
          <div className="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>

        <p className="text-lg font-semibold text-gray-700 animate-fadeIn">
          Loading your document...
        </p>
      </div>
      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// 📝 If no ID (creating new doc) → show document name asking page
if (!id && !showEditor) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
          <div className="mb-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Enter your Document Name :</h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={documentName}
                onChange={(e) => {
                  setDocumentName(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="PROJECT - 1"
                className={`w-full px-4 py-3 text-lg text-center border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && createDocument()}
              />
              {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
            </div>

            <button
              onClick={createDocument}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              NEXT
            </button>

            <button
              onClick={() => navigate("/home")}
              className="w-full py-2 text-gray-600 transition-colors hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


  // 🌀 Show loading animation while document data is being fetched





  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && <Header />}
      
      <div className="flex flex-col h-screen">
        {/* Top Header - responsive: stack on small screens */}
<div className="px-3 py-2 bg-white border-b border-gray-200">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    {/* Left Section */}
    <div className="flex items-center space-x-2">
      {/* Back button */}
      <button
        onClick={() => navigate('/home')}
        className="p-2 transition-colors rounded-lg hover:bg-gray-100"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Document Name + Favorite */}
      <div className="flex items-center min-w-0 space-x-2">
        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className={`px-2 py-1 text-lg sm:text-xl font-semibold rounded outline-none truncate w-full
            ${isEditMode
              ? "text-gray-900 bg-white border border-transparent focus:border-primary focus:ring-2 focus:ring-primary"
              : "text-gray-900 bg-transparent border-none"
            }`}
          readOnly={!isEditMode}
        />

        <button
          onClick={toggleFavorite}
          className="p-1 rounded hover:bg-gray-100"
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
        </button>
      </div>
    </div>

    {/* Right Section (Buttons) - collapse labels on small screens */}
    <div className="flex items-center justify-end gap-2">
      {/* Download */}
      <button
        onClick={downloadAsPDF}
        className="flex items-center px-2 py-2 space-x-1 text-gray-700 transition-colors rounded-lg sm:px-3 hover:bg-gray-100"
        aria-label="Download"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </button>

      {/* Save / Edit (buttons larger on mobile for touch) */}
      {isEditMode ? (
        <button
          onClick={saveDocument}
          className="flex items-center px-3 py-2 space-x-1 text-white transition-colors rounded-lg sm:px-4 bg-primary hover:opacity-95"
        >
          <Save className="w-4 h-4" />
          <span className="hidden xs:inline">Save</span>
        </button>
      ) : (
        <button
          onClick={() => setIsEditMode(true)}
          className="flex items-center px-3 py-2 space-x-1 text-white transition-colors bg-green-600 rounded-lg sm:px-4 hover:opacity-95"
        >
          <Edit className="w-4 h-4" />
          <span className="hidden xs:inline">Edit</span>
        </button>
      )}
    </div>
  </div>
</div>


  {/* Menu Bar */}
        {isEditMode && (
          <div className="px-3 bg-white border-b border-gray-200 sm:px-4">
            <div className="flex flex-wrap items-center gap-2 py-2 text-sm">
              {/* File Menu */}
{/* File Menu */}
<div className="relative">
  <button
    className="px-2 py-1 text-sm rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "file" ? null : "file");
    }}
  >
    File
  </button>

  {activeDropdown === "file" && (
    <div
      className="absolute left-0 z-50 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        onClick={() => {
          setShowNewDocModal(true);
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Plus className="w-4 h-4 mr-2" /> New
      </button>

      <button
        onClick={() => {
          openRecentDocs();
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <FolderOpen className="w-4 h-4 mr-2" /> Open
      </button>

      <button
        onClick={() => {
          shareDocument();
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Share2 className="w-4 h-4 mr-2" /> Share
      </button>

      <button
        onClick={() => {
          downloadAsPDF();
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Download className="w-4 h-4 mr-2" /> Download
      </button>

      {/* ✅ Only open modal here */}
  <button
  onClick={() => {
    renameDocument();
    setActiveDropdown(null);
  }}
  className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
>
  <Edit3 className="w-4 h-4 mr-2" /> Rename
</button>



      <hr className="my-1" />

      <button
  onClick={() => {
    setShowDeleteModal(true);
    setActiveDropdown(null);
  }}
  className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50"
>
  <Trash2 className="w-4 h-4 mr-2" /> Delete
</button>

    </div>
  )}
</div>



             {/* Edit Menu */}
<div className="relative">
  <button
    className="px-2 py-1 rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "edit" ? null : "edit");
    }}
  >
    Edit
  </button>

  {activeDropdown === "edit" && (
    <div
      className="absolute left-0 z-50 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)} // ✅ closes when leaving container
    >
      <button
        onClick={() => {
          formatText("undo");
          setActiveDropdown(null);
        }}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex items-center">
          <Undo className="w-4 h-4 mr-2" /> Undo
        </span>
        <span className="text-xs text-gray-400">Ctrl+Z</span>
      </button>

      <button
        onClick={() => {
          formatText("redo");
          setActiveDropdown(null);
        }}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex items-center">
          <Redo className="w-4 h-4 mr-2" /> Redo
        </span>
        <span className="text-xs text-gray-400">Ctrl+Y</span>
      </button>

      <hr className="my-1" />

      <button
        onClick={() => {
          formatText("cut");
          setActiveDropdown(null);
        }}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex items-center">
          <Scissors className="w-4 h-4 mr-2" /> Cut
        </span>
        <span className="text-xs text-gray-400">Ctrl+X</span>
      </button>

      <button
        onClick={() => {
          formatText("copy");
          setActiveDropdown(null);
        }}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex items-center">
          <Copy className="w-4 h-4 mr-2" /> Copy
        </span>
        <span className="text-xs text-gray-400">Ctrl+C</span>
      </button>

      <button
        onClick={() => {
          formatText("paste");
          setActiveDropdown(null);
        }}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex items-center">
          <Clipboard className="w-4 h-4 mr-2" /> Paste
        </span>
        <span className="text-xs text-gray-400">Ctrl+V</span>
      </button>

      <button
        onClick={() => {
          formatText("selectAll");
          setActiveDropdown(null);
        }}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-50"
      >
        <span className="flex items-center">
          <MousePointer className="w-4 h-4 mr-2" /> Select All
        </span>
        <span className="text-xs text-gray-400">Ctrl+A</span>
      </button>
    </div>
  )}
</div>

{/* View Menu */}
<div className="relative">
  <button
    className="px-2 py-1 rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "view" ? null : "view");
    }}
  >
    View
  </button>

  {activeDropdown === "view" && (
    <div
      className="absolute left-0 z-50 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)} // ✅ closes when mouse leaves
    >
      <button
        onClick={() => {
          setIsFullscreen(!isFullscreen);
          setActiveDropdown(null); // ✅ close after clicking
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Maximize className="w-4 h-4 mr-2" /> Full Screen
      </button>
    </div>
  )}
</div>


{/* Insert Menu */}
<div className="relative">
  <button
    className="px-2 py-1 rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "insert" ? null : "insert");
    }}
  >
    Insert
  </button>

  {activeDropdown === "insert" && (
    <div
      className="absolute left-0 z-50 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)} // ✅ closes menu when leaving
    >
      {/* Image */}
      <button
        onClick={() => {
          setShowImageMenu(true);
          setActiveDropdown(null); // ✅ close after clicking
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Image className="w-4 h-4 mr-2" /> Image
      </button>

      {/* Table */}
      <div className="relative">
        <button
          onClick={() => setShowTableGrid(!showTableGrid)}
          className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
        >
          <Table className="w-4 h-4 mr-2" /> Table
        </button>

        {showTableGrid && (
          <div className={`absolute top-0 z-50 p-3 bg-white border rounded-lg shadow-lg ${isMobile ? 'inset-0 m-4 w-auto h-auto overflow-auto left-0' : 'left-full'}`}>
            {/* Dynamic Hover Grid */}
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${Math.max(
                  8,
                  gridSize.cols + 2
                )}, 20px)`,
              }}
            >
              {Array.from({
                length: Math.max(8, gridSize.rows + 2),
              }).map((_, row) =>
                Array.from({
                  length: Math.max(8, gridSize.cols + 2),
                }).map((_, col) => {
                  const r = row + 1;
                  const c = col + 1;
                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseEnter={() => setGridSize({ rows: r, cols: c })}
                      onTouchStart={() => setGridSize({ rows: r, cols: c })}
                      onClick={() => {
                        insertTable(r, c);
                        setShowTableGrid(false); // ✅ close after inserting
                        setActiveDropdown(null);
                      }}
                      className={`w-5 h-5 border cursor-pointer ${
                        gridSize.rows >= r && gridSize.cols >= c
                          ? "bg-blue-500"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    />
                  );
                })
              )}
            </div>

            {/* Size Display */}
            <div className="mt-2 text-xs text-center text-gray-600">
              {gridSize.rows} × {gridSize.cols}
            </div>
          </div>
        )}
      </div>

      {/* Link */}
      <div className="relative">
        <button
          onClick={() => setShowLinkMenu(!showLinkMenu)}
          className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
        >
          <Link className="w-4 h-4 mr-2" /> Link
        </button>

        {showLinkMenu && (
          <div className={`absolute z-50 w-64 p-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg ${isMobile ? 'inset-0 m-4 w-auto h-auto overflow-auto' : ''}`}>
            <input
              type="text"
              placeholder="Link Text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full px-2 py-1 mb-2 text-sm border rounded"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-2 py-1 mb-2 text-sm border rounded"
            />
            <button
              onClick={() => {
                insertLink();
                setShowLinkMenu(false); // ✅ close after inserting
                setActiveDropdown(null);
              }}
              className="w-full py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Insert Link
            </button>
          </div>
        )}
      </div>

      {/* Symbol */}
      <button
        onClick={() => {
          formatText("insertHTML", "&nbsp;");
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Hash className="w-4 h-4 mr-2" /> Symbol
      </button>
    </div>
  )}
</div>



              {/* Page Menu */}
<div className="relative">
  <button
    className="px-2 py-1 rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "page" ? null : "page");
    }}
  >
    Page
  </button>

  {activeDropdown === "page" && (
    <div
      className="absolute left-0 z-50 w-64 p-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="mb-2 text-sm text-gray-700">Margins (px)</div>
      <label className="text-xs">Top: {pageMargins.top}px</label>
      <input
        type="range"
        min={0}
        max={200}
        value={pageMargins.top}
        onChange={(e) => setPageMargins((p) => ({ ...p, top: Number(e.target.value) }))}
        className="w-full mb-2"
      />
      <label className="text-xs">Bottom: {pageMargins.bottom}px</label>
      <input
        type="range"
        min={0}
        max={200}
        value={pageMargins.bottom}
        onChange={(e) => setPageMargins((p) => ({ ...p, bottom: Number(e.target.value) }))}
        className="w-full mb-2"
      />
      <label className="text-xs">Left: {pageMargins.left}px</label>
      <input
        type="range"
        min={0}
        max={200}
        value={pageMargins.left}
        onChange={(e) => setPageMargins((p) => ({ ...p, left: Number(e.target.value) }))}
        className="w-full mb-2"
      />
      <label className="text-xs">Right: {pageMargins.right}px</label>
      <input
        type="range"
        min={0}
        max={200}
        value={pageMargins.right}
        onChange={(e) => setPageMargins((p) => ({ ...p, right: Number(e.target.value) }))}
        className="w-full mb-3"
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">Alignment</div>
        <div className="space-x-1">
          <button onClick={() => setPageAlign('left')} className={`px-2 py-1 rounded ${pageAlign==='left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>Left</button>
          <button onClick={() => setPageAlign('center')} className={`px-2 py-1 rounded ${pageAlign==='center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>Center</button>
          <button onClick={() => setPageAlign('right')} className={`px-2 py-1 rounded ${pageAlign==='right' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>Right</button>
        </div>
      </div>
    </div>
  )}
</div>

              {/* Format Menu */}
<div className="relative">
  <button
    className="px-2 py-1 rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "format" ? null : "format");
    }}
  >
    Format
  </button>

  {activeDropdown === "format" && (
    <div
      className="absolute left-0 z-50 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* Bold */}
      <button
        onClick={() => {
          formatText("bold");
          setActiveDropdown(null);
        }}
        className={`flex items-center w-full px-3 py-2 hover:bg-gray-50 ${
          activeFormats.bold ? "bg-purple-100 font-semibold" : ""
        }`}
      >
        <Bold className="w-4 h-4 mr-2" /> Bold
      </button>

      {/* Italic */}
      <button
        onClick={() => {
          formatText("italic");
          setActiveDropdown(null);
        }}
        className={`flex items-center w-full px-3 py-2 hover:bg-gray-50 ${
          activeFormats.italic ? "bg-purple-100 font-semibold" : ""
        }`}
      >
        <Italic className="w-4 h-4 mr-2" /> Italic
      </button>

      {/* Underline */}
      <button
        onClick={() => {
          formatText("underline");
          setActiveDropdown(null);
        }}
        className={`flex items-center w-full px-3 py-2 hover:bg-gray-50 ${
          activeFormats.underline ? "bg-purple-100 font-semibold" : ""
        }`}
      >
        <Underline className="w-4 h-4 mr-2" /> Underline
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => {
          formatText("strikeThrough");
          setActiveDropdown(null);
        }}
        className={`flex items-center w-full px-3 py-2 hover:bg-gray-50 ${
          activeFormats.strikeThrough ? "bg-purple-100 font-semibold" : ""
        }`}
      >
        <Strikethrough className="w-4 h-4 mr-2" /> Strikethrough
      </button>

      <hr className="my-1" />

      {/* Subscript */}
      <button
        onClick={() => {
          formatText("subscript");
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        X<sub className="ml-1">2</sub> Subscript
      </button>

      {/* Superscript */}
      <button
        onClick={() => {
          formatText("superscript");
          setActiveDropdown(null);
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        X<sup className="ml-1">2</sup> Superscript
      </button>
    </div>
  )}
</div>
{/* Help Menu */}
<div className="relative">
  <button
    className="px-2 py-1 rounded hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      setActiveDropdown(activeDropdown === "help" ? null : "help");
    }}
  >
    Help
  </button>

  {activeDropdown === "help" && (
    <div
      className="absolute left-0 z-50 w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full animate-fadeIn"
      onMouseLeave={() => setActiveDropdown(null)} // ✅ closes when mouse leaves
    >
      {/* Doc Help */}
      <button
        onClick={() => {
          alert(
            "Pro Doc Help:\n\n" +
              "Keyboard Shortcuts:\n" +
              "Ctrl+B - Bold\n" +
              "Ctrl+I - Italic\n" +
              "Ctrl+U - Underline\n" +
              "Ctrl+S - Save\n" +
              "Ctrl+P - Print\n" +
              "Ctrl+Z - Undo\n" +
              "Ctrl+Y - Redo"
          );
          setActiveDropdown(null); // ✅ close after click
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <HelpCircle className="w-4 h-4 mr-2" /> Doc Help
      </button>

      {/* Keyboard Shortcuts */}
      <button
        onClick={() => {
          alert(
            "Keyboard Shortcuts:\n\n" +
              "Ctrl+B - Bold\n" +
              "Ctrl+I - Italic\n" +
              "Ctrl+U - Underline\n" +
              "Ctrl+S - Save\n" +
              "Ctrl+P - Print\n" +
              "Ctrl+Z - Undo\n" +
              "Ctrl+Y - Redo\n" +
              "Ctrl+A - Select All\n" +
              "Ctrl+C - Copy\n" +
              "Ctrl+V - Paste\n" +
              "Ctrl+X - Cut"
          );
          setActiveDropdown(null); // ✅ close after click
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Keyboard className="w-4 h-4 mr-2" /> Keyboard Shortcuts
      </button>

      {/* About */}
      <button
        onClick={() => {
          navigate("/about");
          setActiveDropdown(null); // ✅ close after click
        }}
        className="flex items-center w-full px-3 py-2 hover:bg-gray-50"
      >
        <Info className="w-4 h-4 mr-2" /> About
      </button>
    </div>
  )}
</div>


              
            </div>
          </div>
        )}

        {/* Toolbar */}
        {isEditMode && (
           <div className="px-4 py-2 bg-white border-b border-gray-200">
             <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <button onClick={() => formatText('undo')} className="p-1 rounded hover:bg-gray-100" title="Undo">
                <Undo className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('redo')} className="p-1 rounded hover:bg-gray-100" title="Redo">
                <Redo className="w-4 h-4" />
              </button>
              <button onClick={printDocument} className="p-1 rounded hover:bg-gray-100" title="Print">
                <Printer className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 mx-2 bg-gray-300"></div>
              
              <select 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="hidden px-2 py-1 text-sm border border-gray-300 rounded sm:inline-block"
              >
                {zoomOptions.map(z => (
                  <option key={z} value={z}>{z}%</option>
                ))}
              </select>
              
              <div className="hidden w-px h-6 mx-2 bg-gray-300 sm:block"></div>
              
<select
  onChange={(e) => formatHeading(e.target.value)}
  className="hidden sm:inline-block border border-gray-300 rounded px-2 py-1 text-sm min-w-[140px] focus:ring-2 focus:ring-purple-500"
>
  <option value="p">Normal text</option>
  <option value="1">Heading 1</option>
  <option value="2">Heading 2</option>
  <option value="3">Heading 3</option>
  <option value="4">Heading 4</option>
  <option value="5">Heading 5</option>
  <option value="6">Heading 6</option>
</select>

              
              <select 
                value={fontFamily} 
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  formatText('fontName', e.target.value);
                }}
                className="hidden sm:inline-block border border-gray-300 rounded px-2 py-1 text-sm min-w-[100px]"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              
              <select 
                value={fontSize} 
                onChange={(e) => {
                  setFontSize(Number(e.target.value));
                  formatText('fontSize', '3');
                  formatText('insertHTML', `<span style="font-size: ${e.target.value}px">${window.getSelection().toString()}</span>`);
                }}
                className="hidden w-16 px-2 py-1 text-sm border border-gray-300 rounded sm:inline-block"
              >
                {fontSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              
              <div className="w-px h-6 mx-2 bg-gray-300"></div>
              <button
  onClick={() => {
    editorRef.current?.focus();
    document.execCommand("bold"); // toggle bold
    setActiveFormats((prev) => ({
      ...prev,
      bold: !prev.bold, // instantly toggle state
    }));
  }}
  className={`p-1 rounded ${activeFormats.bold ? "bg-purple-200" : "hover:bg-gray-100"}`}
  title="Bold (Ctrl+B)"
>
  <Bold className="w-4 h-4" />
</button>

<button
  onClick={() => {
    editorRef.current?.focus();
    document.execCommand("italic"); // toggle italic
    setActiveFormats((prev) => ({
      ...prev,
      italic: !prev.italic,
    }));
  }}
  className={`p-1 rounded ${activeFormats.italic ? "bg-purple-200" : "hover:bg-gray-100"}`}
  title="Italic (Ctrl+I)"
>
  <Italic className="w-4 h-4" />
</button>

<button
  onClick={() => {
    editorRef.current?.focus();
    document.execCommand("underline"); // toggle underline
    setActiveFormats((prev) => ({
      ...prev,
      underline: !prev.underline,
    }));
  }}
  className={`p-1 rounded ${activeFormats.underline ? "bg-purple-200" : "hover:bg-gray-100"}`}
  title="Underline (Ctrl+U)"
>
  <Underline className="w-4 h-4" />
</button>
<div className="relative">
  <button
    onClick={() => {
      setColorPickerType("text");
      setShowColorPicker(!showColorPicker);
    }}
    className="relative p-1 rounded hover:bg-gray-100"
    title="Text Color"
  >
    <Palette className="w-5 h-5" />
    {/* Active color indicator */}
    <span
      className="absolute w-4 h-1 transform -translate-x-1/2 rounded-sm left-1/2 -bottom-1"
      style={{ backgroundColor: textColor }}
    />
  </button>
</div>


              
              <div className="w-px h-6 mx-2 bg-gray-300"></div>
              
             <div className="relative">
  <button 
    onClick={() => setShowLinkMenu(!showLinkMenu)} 
    className="p-1 rounded hover:bg-gray-100" 
    title="Insert Link"
  >
    <Link className="w-4 h-4" />
  </button>

  {showLinkMenu && (
    <div className="absolute z-50 w-64 p-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
      <input
        type="text"
        placeholder="Link Text"
        value={linkText}
        onChange={(e) => setLinkText(e.target.value)}
        className="w-full px-2 py-1 mb-2 text-sm border rounded"
      />
      <input
        type="url"
        placeholder="https://example.com"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        className="w-full px-2 py-1 mb-2 text-sm border rounded"
      />
      <button
        onClick={insertLink}
        className="w-full py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Insert Link
      </button>
    </div>
  )}
</div>

             {/* Image Insert Dropdown (desktop) + Mobile More menu */}
<div className="relative">
  <button 
    onClick={() => setShowImageMenu(true)} 
    className="items-center hidden px-3 py-2 sm:flex hover:bg-gray-50"
  >
    <Image className="w-4 h-4 mr-2" /> Image
  </button>

  {/* Mobile 'More' overflow button */}
  <button
    onClick={() => setShowMobileMore((s) => !s)}
    className="p-1 rounded sm:hidden hover:bg-gray-100"
    title="More"
  >
    <MoreHorizontal className="w-5 h-5" />
  </button>

  {/* Mobile overflow menu */}
  {showMobileMore && (
    <div className="absolute z-50 p-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg right-2 sm:hidden">
      <div className="flex flex-col w-56 space-y-2">
        <label className="text-xs text-gray-500">Zoom</label>
        <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="px-2 py-1 border rounded">
          {zoomOptions.map(z => (<option key={z} value={z}>{z}%</option>))}
        </select>

        <label className="text-xs text-gray-500">Style</label>
        <select onChange={(e) => formatHeading(e.target.value)} className="px-2 py-1 border rounded">
          <option value="p">Normal text</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        <label className="text-xs text-gray-500">Font</label>
        <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); formatText('fontName', e.target.value); }} className="px-2 py-1 border rounded">
          {fontFamilies.map(f => (<option key={f} value={f}>{f}</option>))}
        </select>

        <label className="text-xs text-gray-500">Size</label>
        <select value={fontSize} onChange={(e) => { setFontSize(Number(e.target.value)); formatText('fontSize','3'); formatText('insertHTML', `<span style="font-size: ${e.target.value}px">${window.getSelection().toString()}</span>`); }} className="px-2 py-1 border rounded">
          {fontSizes.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>

  <button onClick={() => { openFilePicker(); setShowMobileMore(false); }} className="px-2 py-1 text-left border rounded">Insert Image</button>
  <button onClick={() => { setShowTableGrid(true); setShowMobileMore(false); }} className="px-2 py-1 text-left border rounded">Insert Table</button>
        <button onClick={() => { setShowLinkMenu(true); setShowMobileMore(false); }} className="px-2 py-1 text-left border rounded">Insert Link</button>
        <button onClick={() => { setShowColorPicker(true); setShowMobileMore(false); }} className="px-2 py-1 text-left border rounded">Text Color</button>
      </div>
    </div>
  )}

  {showImageMenu && (
    <div className={`absolute z-50 w-64 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg ${isMobile ? 'inset-0 m-4 w-auto h-auto overflow-auto' : ''}`}>
      {/* URL Input */}
      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full px-2 py-1 mb-2 text-sm border rounded"
      />
      <button
        onClick={insertImageFromUrl}   // ✅ use helper function
        className="w-full py-1 mb-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Insert from URL
      </button>

      <div className="my-2 text-xs text-center text-gray-500">OR</div>

      <button
        onClick={openFilePicker}   // ✅ use helper function
        className="w-full py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
      >
        Upload from Computer
      </button>
    </div>
  )}
</div>


              
              <div className="w-px h-6 mx-2 bg-gray-300"></div>
              
              <button onClick={() => formatText('justifyLeft')} className="p-1 rounded hover:bg-gray-100" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('justifyCenter')} className="p-1 rounded hover:bg-gray-100" title="Align Center">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('justifyRight')} className="p-1 rounded hover:bg-gray-100" title="Align Right">
                <AlignRight className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('justifyFull')} className="p-1 rounded hover:bg-gray-100" title="Justify">
                <AlignJustify className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 mx-2 bg-gray-300"></div>
              
              <button onClick={() => formatText('insertUnorderedList')} className="p-1 rounded hover:bg-gray-100" title="Bullet List">
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('insertOrderedList')} className="p-1 rounded hover:bg-gray-100" title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('outdent')} className="p-1 rounded hover:bg-gray-100" title="Decrease Indent">
                <Outdent className="w-4 h-4" />
              </button>
              <button onClick={() => formatText('indent')} className="p-1 rounded hover:bg-gray-100" title="Increase Indent">
                <Indent className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Color Picker */}
    {showColorPicker && (
    <div className={`absolute z-50 p-4 mt-10 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg left-1/2 ${isMobile ? 'inset-0 left-0 top-0 m-4 transform-none' : ''}`}>
      <div className="grid grid-cols-10 gap-1 mb-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => applyColor(color)}
            className="w-6 h-6 transition-transform border border-gray-300 rounded hover:scale-110"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <button
        onClick={() => setShowColorPicker(false)}
        className="w-full px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
      >
        Close
      </button>
    </div>
  )}

   







        {/* Document Area */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="px-3 py-6 sm:px-0">
            <div className={`bg-white shadow-lg mx-auto min-h-[600px] ${isMobile ? 'w-full' : 'max-w-4xl'}`} style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
             <div
  ref={editorRef}
  contentEditable={isEditMode}
  suppressContentEditableWarning={true}
  className={`editor prose prose-purple outline-none ${isMobile ? 'min-h-[400px] p-4' : 'min-h-[800px]'}`}
  style={{
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxWidth: isMobile ? '100%' : "816px",   // use full-width on mobile
    paddingTop: isMobile ? 24 : `${pageMargins.top}px`,
    paddingBottom: isMobile ? 24 : `${pageMargins.bottom}px`,
    paddingLeft: isMobile ? 16 : `${pageMargins.left}px`,
    paddingRight: isMobile ? 16 : `${pageMargins.right}px`,
    marginLeft: pageAlign === 'left' ? '0' : pageAlign === 'center' ? 'auto' : 'auto',
    marginRight: pageAlign === 'left' ? 'auto' : pageAlign === 'center' ? 'auto' : '0',
  }}
  onInput={() => setSaved(false)}
  dangerouslySetInnerHTML={{ __html: docContent }}
/> 




              
             
              
              {/* Additional page space */}
              <div className="min-h-[400px] p-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      {!isFullscreen && <Footer />}
      
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {/* Click outside to close dropdowns */}
      {(activeDropdown || showColorPicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setActiveDropdown(null);
            setShowColorPicker(false);
          }}
        />
      )}
     
{/* Floating toolbar for selected images */}
{selectedImage && (
  <div className="fixed z-50 flex p-2 space-x-2 transform -translate-x-1/2 bg-white border rounded shadow-lg bottom-10 left-1/2">
    {/* Align Left */}
    <button
      onClick={() => {
        const wrapper = selectedImage.closest(".doc-image-wrapper");
        wrapper.style.float = "left";
        wrapper.style.margin = "0 10px 10px 0";
        wrapper.style.display = "inline-block";
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Align Left
    </button>

    {/* Align Center */}
    <button
      onClick={() => {
        const wrapper = selectedImage.closest(".doc-image-wrapper");
        wrapper.style.float = "none";
        wrapper.style.display = "block";
        wrapper.style.margin = "10px auto";
        selectedImage.style.display = "block";
        selectedImage.style.margin = "0 auto";
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Align Center
    </button>

    {/* Align Right */}
    <button
      onClick={() => {
        const wrapper = selectedImage.closest(".doc-image-wrapper");
        wrapper.style.float = "right";
        wrapper.style.margin = "0 0 10px 10px";
        wrapper.style.display = "inline-block";
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Align Right
    </button>

    {/* Small */}
    <button
      onClick={() => {
        selectedImage.style.width = "150px";
        selectedImage.style.height = "auto";
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Small
    </button>

    {/* Medium */}
    <button
      onClick={() => {
        selectedImage.style.width = "300px";
        selectedImage.style.height = "auto";
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Medium
    </button>

    {/* Large */}
    <button
      onClick={() => {
        selectedImage.style.width = "500px";
        selectedImage.style.height = "auto";
      }}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      Large
    </button>

    {/* Delete */}
    <button
      onClick={() => {
        const wrapper = selectedImage.closest(".doc-image-wrapper");
        wrapper.remove();
        setSelectedImage(null);
      }}
      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Delete
    </button>
    {/* Separator */}
    <div className="w-px h-6 bg-gray-200" />

    {/* Width slider + aspect lock + rotate */}
    <div className="flex items-center px-2 py-1 space-x-2 rounded bg-gray-50">
      <label className="text-xs text-gray-600">Width</label>
      <input
        type="range"
        min={50}
        max={800}
        defaultValue={selectedImage?.clientWidth || 300}
        onChange={(e) => {
          const w = `${e.target.value}px`;
          if (!selectedImage) return;
          const aspectLocked = selectedImage.dataset?.aspectLocked === "true";
          if (aspectLocked) {
            const origW = parseInt(selectedImage.dataset.origWidth || selectedImage.naturalWidth || selectedImage.clientWidth, 10);
            const origH = parseInt(selectedImage.dataset.origHeight || selectedImage.naturalHeight || selectedImage.clientHeight, 10);
            const ratio = origH && origW ? origH / origW : (selectedImage.clientHeight / selectedImage.clientWidth || 1);
            selectedImage.style.width = w;
            selectedImage.style.height = `${Math.round(parseInt(e.target.value, 10) * ratio)}px`;
          } else {
            selectedImage.style.width = w;
          }
        }}
        className="w-40 h-2"
      />

      <button
        onClick={() => {
          if (!selectedImage) return;
          const locked = selectedImage.dataset?.aspectLocked === "true";
          selectedImage.dataset = selectedImage.dataset || {};
          selectedImage.dataset.aspectLocked = locked ? "false" : "true";
          if (!selectedImage.dataset.origWidth) {
            selectedImage.dataset.origWidth = selectedImage.naturalWidth || selectedImage.clientWidth;
            selectedImage.dataset.origHeight = selectedImage.naturalHeight || selectedImage.clientHeight;
          }
        }}
        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        title="Toggle aspect ratio lock"
      >
        Aspect
      </button>

      <button
        onClick={() => {
          if (!selectedImage) return;
          const current = parseInt(selectedImage.dataset?.rotate || "0", 10);
          const next = (current - 90 + 360) % 360;
          selectedImage.style.transform = `rotate(${next}deg)`;
          selectedImage.dataset.rotate = `${next}`;
        }}
        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        title="Rotate -90°"
      >
        ↺
      </button>

      <button
        onClick={() => {
          if (!selectedImage) return;
          const current = parseInt(selectedImage.dataset?.rotate || "0", 10);
          const next = (current + 90) % 360;
          selectedImage.style.transform = `rotate(${next}deg)`;
          selectedImage.dataset.rotate = `${next}`;
        }}
        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        title="Rotate +90°"
      >
        ↻
      </button>
    </div>
    {/* Vertical spacing controls */}
    <div className="flex items-center px-2 py-1 space-x-2 rounded bg-gray-50">
      <div className="flex flex-col items-center">
        <label className="text-xs text-gray-600">Top</label>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              const wrapper = selectedImage.closest('.doc-image-wrapper');
              const cur = parseInt(wrapper.style.marginTop || '0', 10) || 0;
              wrapper.style.marginTop = `${cur - 8}px`;
            }}
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="range"
            min={-200}
            max={200}
            defaultValue={parseInt(selectedImage?.closest('.doc-image-wrapper')?.style.marginTop || '10', 10)}
            onChange={(e) => {
              const wrapper = selectedImage.closest('.doc-image-wrapper');
              wrapper.style.marginTop = `${e.target.value}px`;
            }}
            className="h-2 w-28"
          />
          <button
            onClick={() => {
              const wrapper = selectedImage.closest('.doc-image-wrapper');
              const cur = parseInt(wrapper.style.marginTop || '0', 10) || 0;
              wrapper.style.marginTop = `${cur + 8}px`;
            }}
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <label className="text-xs text-gray-600">Bottom</label>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              const wrapper = selectedImage.closest('.doc-image-wrapper');
              const cur = parseInt(wrapper.style.marginBottom || '0', 10) || 0;
              wrapper.style.marginBottom = `${cur - 8}px`;
            }}
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="range"
            min={-200}
            max={200}
            defaultValue={parseInt(selectedImage?.closest('.doc-image-wrapper')?.style.marginBottom || '10', 10)}
            onChange={(e) => {
              const wrapper = selectedImage.closest('.doc-image-wrapper');
              wrapper.style.marginBottom = `${e.target.value}px`;
            }}
            className="h-2 w-28"
          />
          <button
            onClick={() => {
              const wrapper = selectedImage.closest('.doc-image-wrapper');
              const cur = parseInt(wrapper.style.marginBottom || '0', 10) || 0;
              wrapper.style.marginBottom = `${cur + 8}px`;
            }}
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{showNewDocModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Create New Document</h2>
      <input
        type="text"
        value={newDocName}
        onChange={(e) => {
          setNewDocName(e.target.value);
          setNewDocError("");
        }}
        placeholder="Enter document name"
        className={`w-full px-3 py-2 border rounded ${
          newDocError ? "border-red-500" : "border-gray-300"
        }`}
      />
      {newDocError && <p className="mt-2 text-sm text-red-500">{newDocError}</p>}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setShowNewDocModal(false)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={createNewDocument}
          className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}
{showRenameModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Rename Document</h2>

      <form onSubmit={handleRename}>
        <input
          type="text"
          value={renameValue}
          onChange={(e) => {
            setRenameValue(e.target.value);
            setRenameError("");
          }}
          placeholder="Enter new name"
          autoFocus
          className={`w-full px-3 py-2 border rounded ${
            renameError ? "border-red-500" : "border-gray-300"
          }`}
        />

        {renameError && <p className="mt-2 text-sm text-red-500">{renameError}</p>}

        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            onClick={() => {
              setShowRenameModal(false);
              setRenameError("");
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isRenaming}
            className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-60"
          >
            {isRenaming ? "Renaming..." : "Rename"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}



{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800">
        Delete Document
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Please type <span className="font-bold">{documentName}</span> to confirm deletion.
      </p>

      <input
        type="text"
        value={deleteConfirmText}
        onChange={(e) => setDeleteConfirmText(e.target.value)}
        className="w-full px-3 py-2 mt-4 text-sm border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
        placeholder="Type document name"
      />

      {/* Error */}
      {deleteConfirmText &&
        deleteConfirmText !== documentName && (
          <p className="mt-1 text-sm text-red-500">
            Name does not match
          </p>
        )}

      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteConfirmText("");
          }}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await deleteDocument();
            setShowDeleteModal(false);
            setDeleteConfirmText("");
          }}
          disabled={deleteConfirmText !== documentName}
          className={`px-4 py-2 text-sm text-white rounded 
            ${deleteConfirmText === documentName
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-300 cursor-not-allowed"}`}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
};

export default CreateDoc;
