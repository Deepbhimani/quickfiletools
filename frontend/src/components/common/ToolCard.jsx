import { Link } from "react-router-dom";

export default function ToolCard({ tool }) {
  return (
    <Link to={`/tools/${tool.slug}`}
      className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all">
      {tool.premium && (
        <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">PRO</span>
      )}
      <div className="text-3xl mb-3">{tool.icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{tool.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
    </Link>
  );
}
