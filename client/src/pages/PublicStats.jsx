import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MousePointerClick,
  Clock,
  Calendar,
  ExternalLink,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';
import { formatDate, timeAgo, formatNumber } from '../utils/formatDate';
import { APP_NAME } from '../utils/constants';

const PublicStats = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/api/public/${code}`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Stats not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-lg text-surface-500 mb-4">{error}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="glass-card p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white">
              Link Statistics
            </h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Public stats for /{data.shortCode}
            </p>
          </div>

          {/* Destination */}
          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 mb-6">
            <p className="text-xs text-surface-500 mb-1">Destination URL</p>
            <a
              href={data.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 break-all"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {data.originalUrl}
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center">
              <MousePointerClick className="w-6 h-6 text-brand-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {formatNumber(data.clicks)}
              </p>
              <p className="text-xs text-surface-500">Total Clicks</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center">
              <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-surface-900 dark:text-white">
                {data.lastVisitedAt ? timeAgo(data.lastVisitedAt) : 'Never'}
              </p>
              <p className="text-xs text-surface-500">Last Visit</p>
            </div>

            <div className="col-span-2 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 text-center">
              <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-surface-900 dark:text-white">
                {formatDate(data.createdAt)}
              </p>
              <p className="text-xs text-surface-500">Created</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-surface-400">
              Powered by {APP_NAME}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStats;
