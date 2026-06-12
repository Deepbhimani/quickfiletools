import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

// ─── PRO VERSION NOTE ─────────────────────────────────────────────────────────
// AuthProvider and auth-related imports are commented out for FREE version.
// ProtectedRoute, AdminRoute, Pricing, Login, Signup, Dashboard, AdminPanel
// are all disabled. Re-enable when launching Pro version.
// ─────────────────────────────────────────────────────────────────────────────

// import { AuthProvider } from "./context/AuthContext";
// import { ProtectedRoute, AdminRoute } from "./components/common/ProtectedRoute";

import Navbar    from "./components/layout/Navbar";
import Footer    from "./components/layout/Footer";
import Home      from "./pages/Home";
import Tools     from "./pages/Tools";
import SingleTool from "./pages/SingleTool";
import Blog      from "./pages/Blog";
import BlogPost  from "./pages/BlogPost";
import About     from "./pages/About";
import Contact   from "./pages/Contact";
import Privacy   from "./pages/Privacy";
import Terms     from "./pages/Terms";
import NotFound  from "./pages/NotFound";

// ── PRO VERSION PAGES (commented out) ────────────────────────────────────────
// import Pricing    from "./pages/Pricing";
// import Login      from "./pages/Login";
// import Signup     from "./pages/Signup";
// import Dashboard  from "./pages/Dashboard";
// import AdminPanel from "./pages/AdminPanel";
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark" ||
         window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Initialize AdSense ads on route change
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}
  }, []);

  return (
    <HelmetProvider>
      {/* ── PRO VERSION: wrap with AuthProvider ──────────────────────────
      <AuthProvider>
      ── END PRO VERSION ── */}
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="flex-1">
              <Routes>
                {/* ── Public routes ── */}
                <Route path="/"            element={<Home />}       />
                <Route path="/tools"       element={<Tools />}      />
                <Route path="/tools/:slug" element={<SingleTool />} />
                <Route path="/blog"        element={<Blog />}       />
                <Route path="/blog/:slug"  element={<BlogPost />}   />
                <Route path="/about"       element={<About />}      />
                <Route path="/contact"     element={<Contact />}    />
                <Route path="/privacy"     element={<Privacy />}    />
                <Route path="/terms"       element={<Terms />}      />

                {/* ── PRO VERSION ROUTES (commented out) ──────────────────
                <Route path="/pricing"  element={<Pricing />}  />
                <Route path="/login"    element={<Login />}    />
                <Route path="/signup"   element={<Signup />}   />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <AdminRoute><AdminPanel /></AdminRoute>
                } />
                ── END PRO VERSION ── */}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </BrowserRouter>
      {/* ── PRO VERSION: close AuthProvider ──────────────────────────────
      </AuthProvider>
      ── END PRO VERSION ── */}
    </HelmetProvider>
  );
}