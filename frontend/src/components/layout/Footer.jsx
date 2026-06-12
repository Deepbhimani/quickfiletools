import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3">
              <Zap className="h-5 w-5 text-primary-500" /> QuickFileTools
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free online tools to compress, convert, and manage your files. No signup, no watermarks.
            </p>
          </div>

          {/* Free Tools */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Free Tools</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[
                ["image-compressor", "Image Compressor"],
                ["jpg-to-png",       "JPG to PNG"],
                ["pdf-merge",        "PDF Merge"],
                ["pdf-split",        "PDF Split"],
                ["image-resizer",    "Image Resizer"],
                ["image-to-webp",    "Image to WebP"],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link to={`/tools/${slug}`} className="hover:text-primary-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Company</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[
                ["About",   "/about"],
                ["Blog",    "/blog"],
                ["Contact", "/contact"],
                ["Tools",   "/tools"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
            {/* ── PRO VERSION: add Pricing link back ──────────────────────
            <li><Link to="/pricing" className="hover:text-primary-600">Pricing</Link></li>
            ── END PRO VERSION ── */}
          </div>

          {/* Legal */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Legal</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {[
                ["Privacy Policy",    "/privacy"],
                ["Terms & Conditions","/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} QuickFileTools. All rights reserved.</span>
          <span>Made with ❤️ — Free forever</span>
        </div>
      </div>
    </footer>
  );
}