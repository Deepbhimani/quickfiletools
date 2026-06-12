import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";

// ─── FREE TOOLS ONLY ─────────────────────────────────────────────────────────
// ── PRO VERSION: add pro tools back here when launching paid plan ─────────
const ALL_TOOLS = [
  { slug: "image-compressor", name: "Image Compressor", desc: "Reduce image size without quality loss",    icon: "🗜️", category: "Image" },
  { slug: "jpg-to-png",       name: "JPG to PNG",       desc: "Convert JPG to PNG format",                icon: "🔄", category: "Image" },
  { slug: "png-to-jpg",       name: "PNG to JPG",       desc: "Convert PNG to JPG format",                icon: "🔄", category: "Image" },
  { slug: "image-to-webp",    name: "Image to WebP",    desc: "Convert images to WebP",                   icon: "⚡", category: "Image" },
  { slug: "image-resizer",    name: "Image Resizer",    desc: "Resize images to any dimension",           icon: "📐", category: "Image" },
  { slug: "image-to-pdf",     name: "Image to PDF",     desc: "Convert images into a PDF document",       icon: "🖼️", category: "Image" },
  { slug: "pdf-merge",        name: "PDF Merge",        desc: "Combine multiple PDFs into one",           icon: "📄", category: "PDF"   },
  { slug: "pdf-split",        name: "PDF Split",        desc: "Split PDF into separate pages",            icon: "✂️", category: "PDF"   },
];

const CATEGORIES = ["All", "Image", "PDF"];

export default function Tools() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  const filtered = ALL_TOOLS.filter((t) => {
    const matchCat    = category === "All" || t.category === category;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>All Free File Tools — QuickFileTools</title>
        <meta name="description" content="Browse all free online file tools — image compression, PDF merge, format conversion and more. No signup required." />
        <link rel="canonical" href="https://quickfiletools.com/tools" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Free Tools</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {ALL_TOOLS.length} tools — no account needed, start instantly
        </p>

        {/* Search + Category filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search tools..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-primary-600 text-white"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* All Tools Grid — single section, no Pro separation */}
        {filtered.length > 0 ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">🆓 Free Tools</h2>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                {filtered.length} tools
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((tool) => (
                <Link key={tool.slug} to={`/tools/${tool.slug}`}
                  className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all">
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">No tools found for "{search}"</div>
        )}

        {/* ── PRO VERSION: Pro Tools section (commented out) ───────────────────
        {premiumTools.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">👑 Pro Tools</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{premiumTools.length} tools</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {premiumTools.map((tool) => (
                <Link key={tool.slug} to={`/tools/${tool.slug}`}
                  className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-amber-300 hover:shadow-md transition-all">
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">PRO</span>
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600">{tool.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        ── END PRO VERSION ── */}
      </div>
    </>
  );
}