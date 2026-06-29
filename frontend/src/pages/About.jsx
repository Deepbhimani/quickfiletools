import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Zap, Shield, Users, Globe, ArrowRight, Heart, Lock, RefreshCw } from "lucide-react";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About QuickFileTools — Free Online File Tools</title>
        <meta name="description" content="QuickFileTools is a free platform for compressing, converting and managing files online. No installs, no watermarks, no fees." />
        <link rel="canonical" href="https://www.quickfiletools.xyz/about" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About QuickFileTools</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
          QuickFileTools is a free online platform for compressing, converting, and managing your files —
          without software installs, watermarks, or hidden fees.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Whether you need to shrink an image for a website, merge a stack of PDFs into one document,
          convert a photo to a different format, or extract pages from a large file — you can do it
          here in seconds, directly in your browser, with no account needed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: <Zap className="h-6 w-6 text-primary-500" />,    title: "Fast & Simple",      desc: "We believe file tools should just work — no complex interfaces, no waiting. Upload, process, download in seconds." },
            { icon: <Shield className="h-6 w-6 text-green-500" />,   title: "Privacy First",       desc: "Your files are processed securely and deleted from our servers within 1 hour. We never share your files with anyone." },
            { icon: <Users className="h-6 w-6 text-purple-500" />,   title: "Built for Everyone",  desc: "From students to professionals — our tools are designed to be intuitive for all skill levels, no tutorials needed." },
            { icon: <Globe className="h-6 w-6 text-blue-500" />,     title: "Always Accessible",   desc: "Works in any browser on any device, anywhere in the world. No installation, no plugins, no app downloads." },
            { icon: <Heart className="h-6 w-6 text-red-400" />,      title: "Genuinely Free",      desc: "All tools are free with no hidden limits. No file count caps, no quality reductions, and no mandatory sign-up." },
            { icon: <Lock className="h-6 w-6 text-amber-500" />,     title: "No Account Required", desc: "We don't ask for your email or personal information. Open a tool, use it, close it — that's the entire experience." },
            { icon: <RefreshCw className="h-6 w-6 text-teal-500" />, title: "Constantly Improving", desc: "We regularly add new tools and improve existing ones based on what users actually need. More formats coming soon." },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We got tired of slow, ad-heavy, or paywalled file tools that make you jump through hoops
          just to compress a photo or merge a PDF. Most tools either throttle quality, add watermarks,
          force you to create an account, or hide basic features behind a subscription. We built
          QuickFileTools to be the tool we always wanted — fast, honest, and completely free.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          All tools are free to use with no account required. Your files are processed securely
          and never stored permanently on our servers. We keep the service running through
          non-intrusive advertising, which means you get a genuinely free product without
          compromising on quality or privacy.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          QuickFileTools currently offers tools across two main categories:
        </p>
        <ul className="space-y-2 mb-6 text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span><span><strong className="text-gray-800 dark:text-gray-200">Image tools</strong> — compress, resize, convert between JPG, PNG, and WebP formats, convert images to PDF, and remove backgrounds or watermarks.</span></li>
          <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span><span><strong className="text-gray-800 dark:text-gray-200">PDF tools</strong> — merge multiple PDFs, split pages, compress file size, add digital signatures, remove passwords, and extract text via OCR.</span></li>
        </ul>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          We're actively working on expanding the tool library. If there's a specific file tool
          you'd like to see added, you can reach us through our <Link to="/contact" className="text-primary-600 hover:underline">Contact page</Link>.
        </p>

        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8 text-center border border-primary-100 dark:border-primary-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Start Using Free Tools</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">No signup. No credit card. Just upload and go.</p>
          <Link to="/tools"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Browse All Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}