import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Zap, Crown, ArrowRight, BarChart2, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toolsAPI } from "../services/api";

export default function Dashboard() {
  const { user, userProfile, isPremium } = useAuth();
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    toolsAPI.getUsage().then((r) => setUsage(r.data)).catch(() => {});
  }, []);

  const usagePct = usage ? Math.min((usage.usageCount / usage.usageLimit) * 100, 100) : 0;

  return (
    <>
      <Helmet><title>Dashboard — QuickFileTools</title></Helmet>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userProfile?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Plan card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              {isPremium ? <Crown className="h-5 w-5 text-amber-500" /> : <Zap className="h-5 w-5 text-primary-500" />}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">{userProfile?.plan || "Free"}</p>
            {!isPremium && (
              <Link to="/pricing" className="mt-3 inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline">
                Upgrade to Pro <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {/* Usage card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Usage</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {usage ? `${usage.usageCount} / ${isPremium ? "∞" : usage.usageLimit}` : "—"}
            </p>
            {!isPremium && usage && (
              <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${usagePct}%` }} />
              </div>
            )}
          </div>

          {/* Reset card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Resets At</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {usage?.resetAt ? new Date(usage.resetAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Daily usage resets every 24h</p>
          </div>
        </div>

        {/* Upgrade banner for free users */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 text-white mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-lg">Unlock unlimited conversions</p>
              <p className="text-primary-100 text-sm mt-1">No ads · Unlimited files · Priority processing</p>
            </div>
            <Link to="/pricing" className="shrink-0 bg-white text-primary-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
              Upgrade to Pro
            </Link>
          </div>
        )}

        {/* Quick tool links */}
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { slug: "image-compressor", name: "Compress Image", icon: "🗜️" },
            { slug: "jpg-to-png",       name: "JPG → PNG",      icon: "🔄" },
            { slug: "pdf-merge",        name: "Merge PDF",       icon: "📄" },
            { slug: "pdf-split",        name: "Split PDF",       icon: "✂️" },
          ].map((t) => (
            <Link key={t.slug} to={`/tools/${t.slug}`}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-all">
              <div className="text-2xl mb-1">{t.icon}</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
