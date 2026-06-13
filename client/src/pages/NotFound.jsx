import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center animate-scale-in">
        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-black text-surface-100 dark:text-surface-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-xl shadow-brand-500/25">
              <Search className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">
          Page not found
        </h2>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or head back home.
        </p>

        <Link to="/" className="btn-primary px-8 py-3">
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
