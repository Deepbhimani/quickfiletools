import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Zap, Shield, Users, Globe, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About QuickFileTools — Free Online File Tools</title>
        <meta name="description" content="QuickFileTools is a free platform for compressing, converting and managing files online. No installs, no watermarks, no fees." />
        <link rel="canonical" href="https://quickfiletools.com/about" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About QuickFileTools</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          QuickFileTools is a free online platform for compressing, converting, and managing your files —
          without software installs, watermarks, or hidden fees.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: <Zap className="h-6 w-6 text-primary-500" />,   title: "Fast & Simple",     desc: "We believe file tools should just work — no complex interfaces, no waiting." },
            { icon: <Shield className="h-6 w-6 text-green-500" />,  title: "Privacy First",      desc: "Your files are processed securely and deleted from our servers within 1 hour." },
            { icon: <Users className="h-6 w-6 text-purple-500" />,  title: "Built for Everyone", desc: "From students to professionals — our tools work for all skill levels." },
            { icon: <Globe className="h-6 w-6 text-blue-500" />,    title: "Always Accessible",  desc: "Works in any browser on any device, anywhere in the world. No installation needed." },
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
          just to compress a photo or merge a PDF. We built QuickFileTools to be the tool we always
          wanted — fast, honest, and completely free.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          All 8 tools are free to use with no account required. Your files are processed securely
          and never stored permanently on our servers.
        </p>

        {/* ── PRO VERSION NOTE ─────────────────────────────────────────────────
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Pro users help us keep the lights on and unlock more AI-powered features for everyone.
        </p>
        ── END PRO VERSION ── */}

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