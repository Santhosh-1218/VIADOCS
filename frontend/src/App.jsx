import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGA from "react-ga4"; // ✅ Google Analytics 4

// 🛡 Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";

// 🌐 General Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreateDoc from "./pages/CreateDoc";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Tools from "./pages/Tools";
import DocAI from "./pages/DocAI";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ComingSoon from "./pages/ComingSoon";
import ForgotPassword from "./pages/ForgotPassword";

// 🛠 Tools
import PdfToWord from "./pages/tools/pdf-to-word";
import WordToPdf from "./pages/tools/word-to-pdf";
import PdfMerge from "./pages/tools/pdf-merge";
import PdfSplit from "./pages/tools/pdf-split";
import PdfCompress from "./pages/tools/pdf-compress";
import PdfEditor from "./pages/tools/pdf-editor";
import ImageToPdf from "./pages/tools/image-to-pdf";
import PdfToImage from "./pages/tools/pdf-to-image";
import PasswordProtect from "./pages/tools/password-protect";
import UnlockPdf from "./pages/tools/unlock-pdf";
import ExcelToPdf from "./pages/tools/excel-to-pdf";
import PowerpointToPdf from "./pages/tools/powerpoint-to-pdf";
import EsignPdf from "./pages/tools/esign-pdf";
import DocTranslator from "./pages/tools/doc-translator";

// 🧠 Lazy import for global loader
const PageLoader = React.lazy(() => import("./components/PageLoader/PageLoader"));

// ✅ Initialize Google Analytics (replace with your ID)
ReactGA.initialize("G-DM9KZJCSF6");

// 🧩 Helper: Track user activity in backend
const trackUserActivity = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch("http://localhost:5000/api/activity/track-usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ duration: 5 }), // ⏱ Add 5 minutes usage to today's log
    });
  } catch (err) {
    console.error("Activity log failed:", err);
  }
};

function App() {
  const Inner = () => {
    const location = useLocation();
    const [loading, setLoading] = React.useState(false);

    // ⏳ Page loader animation on route change
    useEffect(() => {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 150);
      return () => clearTimeout(t);
    }, [location.pathname]);

    // ✅ Google Analytics route tracking
    useEffect(() => {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }, [location]);

    // ⏱ Track user activity every 5 minutes
    useEffect(() => {
      const interval = setInterval(() => {
        trackUserActivity();
      }, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }, []);

    // 🧠 Initial activity log after login
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) trackUserActivity();
    }, []);

    return (
      <>
        <PageLoader visible={loading} />
        <div className="app-with-fixed-header">
          <Routes>
            {/* 🌐 General Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/create-doc" element={<CreateDoc />} />
            <Route path="/doc/:id" element={<CreateDoc />} />
            <Route path="/doc/:id/edit" element={<CreateDoc />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/DocAI" element={<DocAI />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 🛡 Admin Dashboard */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* 🛠 Tool Pages */}
            <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
            <Route path="/tools/word-to-pdf" element={<WordToPdf />} />
            <Route path="/tools/pdf-merge" element={<PdfMerge />} />
            <Route path="/tools/pdf-split" element={<PdfSplit />} />
            <Route path="/tools/pdf-compress" element={<PdfCompress />} />
            <Route path="/tools/pdf-editor" element={<PdfEditor />} />
            <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
            <Route path="/tools/password-protect" element={<PasswordProtect />} />
            <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/tools/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/tools/powerpoint-to-pdf" element={<PowerpointToPdf />} />
            <Route path="/tools/esign-pdf" element={<EsignPdf />} />
            <Route path="/tools/doc-translator" element={<DocTranslator />} />
          </Routes>
        </div>
      </>
    );
  };

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />
      <React.Suspense fallback={null}>
        <Inner />
      </React.Suspense>
    </Router>
  );
}

export default App;
