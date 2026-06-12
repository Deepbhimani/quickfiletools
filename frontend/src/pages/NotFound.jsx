import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 Not Found — QuickFileTools</title></Helmet>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-black text-primary-100 dark:text-gray-800 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Go Home
        </Link>
      </div>
    </>
  );
}
