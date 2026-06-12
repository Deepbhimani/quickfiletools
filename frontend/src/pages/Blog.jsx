import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Clock, ArrowRight } from "lucide-react";
import { blogAPI } from "../services/api";

// ─── AdSense Banner ───────────────────────────────────────────────────────────
function AdBanner() {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  return (
    <div className="w-full flex justify-center my-6">
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true" />
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts]     = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getAll({ status: "published" })
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Blog — File Compression, PDF & Image Tips | QuickFileTools</title>
        <meta name="description" content="Learn how to compress images, convert PDFs, resize photos and more. Free tutorials and guides for working with files online." />
        <meta name="keywords" content="image compression tips, pdf tools guide, jpg to png, file converter tutorial, free online tools" />
        <link rel="canonical" href="https://quickfiletools.com/blog" />
        <meta property="og:title" content="Blog — QuickFileTools" />
        <meta property="og:description" content="Tips, tutorials and guides for working with images, PDFs and files online." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Tips, tutorials and file format guides</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search articles…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Top Ad */}
        <AdBanner />

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map((i) => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No articles found</p>
        ) : (
          <div className="space-y-0">
            {filtered.map((post, index) => (
              <>
                <Link key={post.slug} to={`/blog/${post.slug}`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all mb-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} min read</span>
                      {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>}
                    </div>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>

                {/* Ad after every 4th post */}
                {(index + 1) % 4 === 0 && index !== filtered.length - 1 && (
                  <AdBanner key={`ad-${index}`} />
                )}
              </>
            ))}
          </div>
        )}

        {/* Bottom Ad */}
        <AdBanner />
      </div>
    </>
  );
}