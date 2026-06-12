import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, Zap } from "lucide-react";

// ─── PRO VERSION NOTE ─────────────────────────────────────────────────────────
// The following are commented out for the FREE version:
// - Login / Signup links
// - Dashboard link
// - PRO badge
// - Pricing link
// - useAuth / logout logic
// To re-enable for Pro version: uncomment these sections and restore auth imports
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Free version nav links — no Pricing, no Login
  const navLinks = [
    { to: "/tools", label: "Tools"  },
    { to: "/blog",  label: "Blog"   },
    { to: "/about", label: "About"  },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <Zap className="h-6 w-6 text-primary-500" />
            QuickFileTools
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`text-sm transition-colors ${
                  isActive(to)
                    ? "text-primary-600 dark:text-primary-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">

            {/* Dark mode toggle */}
            <button onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* ── PRO VERSION: Auth buttons ────────────────────────────────
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {isPremium && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">PRO</span>
                )}
                <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"  className="text-sm text-gray-600 hover:text-primary-600">Login</Link>
                <Link to="/signup" className="text-sm font-medium px-4 py-2 bg-primary-600 text-white rounded-lg">Get Started</Link>
              </div>
            )}
            ── END PRO VERSION ── */}

            {/* Free version: simple CTA */}
            <Link to="/tools"
              className="hidden md:inline-flex items-center text-sm font-medium px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              Try Free Tools
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium border-b border-gray-50 dark:border-gray-800">
              {label}
            </Link>
          ))}
          <Link to="/tools" onClick={() => setMenuOpen(false)}
            className="block mt-2 py-2.5 text-center bg-primary-600 text-white rounded-xl font-semibold">
            Try Free Tools
          </Link>

          {/* ── PRO VERSION: Mobile auth ──────────────────────────────────
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Dashboard</Link>
              <button onClick={handleLogout} className="block py-2 text-red-500 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"  onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2 text-primary-600 font-medium">Sign Up</Link>
            </>
          )}
          ── END PRO VERSION ── */}
        </div>
      )}
    </header>
  );
}