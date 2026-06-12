import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Users, BarChart2, CreditCard, FileText, Settings, LayoutDashboard } from "lucide-react";
import { analyticsAPI } from "../services/api";

function AdminNav() {
  const { pathname } = useLocation();
  const links = [
    { to: "/admin",          icon: <LayoutDashboard className="h-4 w-4" />, label: "Overview"  },
    { to: "/admin/users",    icon: <Users className="h-4 w-4" />,           label: "Users"     },
    { to: "/admin/payments", icon: <CreditCard className="h-4 w-4" />,      label: "Payments"  },
    { to: "/admin/blog",     icon: <FileText className="h-4 w-4" />,        label: "Blog"      },
    { to: "/admin/analytics",icon: <BarChart2 className="h-4 w-4" />,       label: "Analytics" },
  ];
  return (
    <aside className="w-52 shrink-0">
      <nav className="space-y-1">
        {links.map(({ to, icon, label }) => (
          <Link key={to} to={to}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === to ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
            {icon} {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { analyticsAPI.getDashboard().then((r) => setStats(r.data)).catch(() => {}); }, []);

  const cards = [
    { label: "Total Users",     value: stats?.totalUsers     ?? "—", color: "text-blue-600"   },
    { label: "Active Today",    value: stats?.activeToday    ?? "—", color: "text-green-600"  },
    { label: "Pro Users",       value: stats?.proUsers       ?? "—", color: "text-amber-600"  },
    { label: "Revenue (₹)",     value: stats?.totalRevenue   ?? "—", color: "text-purple-600" },
    { label: "Files Processed", value: stats?.filesProcessed ?? "—", color: "text-primary-600"},
    { label: "Popular Tool",    value: stats?.popularTool    ?? "—", color: "text-gray-600"   },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPlaceholder({ title }) {
  return <div className="text-center py-16 text-gray-400">{title} management coming soon</div>;
}

export default function AdminPanel() {
  return (
    <>
      <Helmet><title>Admin — QuickFileTools</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>
        <div className="flex gap-8">
          <AdminNav />
          <div className="flex-1 min-w-0">
            <Routes>
              <Route index                  element={<AdminOverview />} />
              <Route path="users"           element={<AdminPlaceholder title="User" />} />
              <Route path="payments"        element={<AdminPlaceholder title="Payment" />} />
              <Route path="blog"            element={<AdminPlaceholder title="Blog" />} />
              <Route path="analytics"       element={<AdminPlaceholder title="Analytics" />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
