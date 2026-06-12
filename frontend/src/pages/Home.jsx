import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Zap, Shield, Clock, Download, ArrowRight, Star } from "lucide-react";

// ─── Free tools shown on homepage ────────────────────────────────────────────
const TOOLS = [
  { slug: "image-compressor", name: "Image Compressor",  desc: "Reduce image size without losing quality",   icon: "🗜️" },
  { slug: "image-resizer",    name: "Image Resizer",      desc: "Resize images to any dimension instantly",   icon: "📐" },
  { slug: "image-to-pdf",     name: "Image to PDF",       desc: "Convert images into a PDF document",         icon: "🖼️" },
  { slug: "pdf-merge",        name: "PDF Merge",          desc: "Combine multiple PDFs into one",             icon: "📄" },
  { slug: "pdf-split",        name: "PDF Split",          desc: "Split a PDF into separate pages",            icon: "✂️" },
  { slug: "jpg-to-png",       name: "JPG to PNG",         desc: "Convert JPG images to PNG format",           icon: "🔄" },
  { slug: "png-to-jpg",       name: "PNG to JPG",         desc: "Convert PNG images to JPG format",           icon: "🔄" },
  { slug: "image-to-webp",    name: "Image to WebP",      desc: "Convert images to modern WebP format",       icon: "⚡" },
];

const FEATURES = [
  { icon: <Zap className="h-6 w-6 text-primary-500" />,   title: "Lightning Fast",   desc: "Process files in seconds using optimised infrastructure." },
  { icon: <Shield className="h-6 w-6 text-green-500" />,  title: "100% Secure",      desc: "Files are deleted from our servers within 1 hour automatically." },
  { icon: <Clock className="h-6 w-6 text-purple-500" />,  title: "No Registration",  desc: "Use all tools instantly — no account needed, ever." },
  { icon: <Download className="h-6 w-6 text-blue-500" />, title: "Instant Download", desc: "Download your processed files immediately after conversion." },
];

// ─── AdSense Banner Component ─────────────────────────────────────────────────
// Replace data-ad-client and data-ad-slot with your real AdSense values
function AdBanner({ slot = "horizontal" }) {
  return (
    <div className="w-full flex justify-center my-8">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"   // TODO: replace with your AdSense publisher ID
        data-ad-slot={slot === "horizontal" ? "1234567890" : "0987654321"} // TODO: replace with your ad slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>QuickFileTools — Free Online File Converter, Compressor & PDF Tools</title>
        <meta name="description" content="100% free online tools to compress images, convert PDFs, merge documents, resize images and more. No signup required. Fast, secure and easy to use." />
        <meta name="keywords" content="free image compressor, pdf merge, jpg to png, image resizer, pdf split, online file tools" />
        <meta property="og:title" content="QuickFileTools — Free Online File Tools" />
        <meta property="og:description" content="Compress images, convert PDFs, merge documents and more. Free, fast, no signup." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://quickfiletools.com" />
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="h-4 w-4" /> 100% Free — no signup needed
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Free Online File Tools<br />Fast & Secure
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Compress images, convert PDFs, resize photos — all free, all in your browser.
            No installation, no watermarks, no limits.
          </p>
          <Link to="/tools"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg">
            Browse All Free Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Ad Banner (top of content) ── */}
      <div className="max-w-6xl mx-auto px-4">
        <AdBanner slot="horizontal" />
      </div>

      {/* ── Free Tools Grid ── */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🆓 Free Tools</h2>
          <span className="text-sm text-gray-400">{TOOLS.length} tools available</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-8">No account needed — start instantly</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS.map((tool) => (
            <Link key={tool.slug} to={`/tools/${tool.slug}`}
              className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:underline">
            View all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Ad Banner (mid content) ── */}
      <div className="max-w-6xl mx-auto px-4">
        <AdBanner slot="square" />
      </div>

      {/* ── Features ── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">Why QuickFileTools?</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10">Built for speed, privacy and simplicity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog CTA ── */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-3xl p-8 sm:p-12 text-center border border-primary-100 dark:border-primary-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Learn Tips & Tricks</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Read our guides on image compression, PDF tools, file formats and more.</p>
          <Link to="/blog"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Read the Blog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── FAQ Section (helps SEO) ── */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Are all tools completely free?", a: "Yes! All tools on QuickFileTools are 100% free to use. No hidden charges, no subscription, no credit card required." },
            { q: "Do I need to create an account?", a: "No account is needed. Simply upload your file, process it, and download the result instantly." },
            { q: "Is my file data safe?", a: "Yes. All uploaded files are automatically deleted from our servers within 1 hour. We never share your files with third parties." },
            { q: "What file formats are supported?", a: "We support JPG, PNG, WebP for images, and PDF for documents. More formats are being added regularly." },
            { q: "Is there a file size limit?", a: "You can upload files up to 50MB per file. For most images and PDFs this is more than enough." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 cursor-pointer">
              <summary className="font-semibold text-gray-900 dark:text-white list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Bottom Ad Banner ── */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner slot="horizontal" />
      </div>
    </>
  );
}
