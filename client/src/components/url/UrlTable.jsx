import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Trash2,
  BarChart3,
  ExternalLink,
  QrCode,
  Edit3,
  Check,
  Clock,
  MousePointerClick,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { formatDate, timeAgo, formatNumber } from '../../utils/formatDate';

const UrlTable = ({ urls, onDelete, onEdit, onQR, loading }) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/urls/${id}`);
      toast.success('URL deleted');
      onDelete?.(id);
    } catch {
      toast.error('Failed to delete URL');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="shimmer h-5 w-3/4 rounded mb-3" />
            <div className="shimmer h-4 w-1/2 rounded mb-2" />
            <div className="shimmer h-4 w-1/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
          <MousePointerClick className="w-8 h-8 text-surface-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
          No URLs yet
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Create your first short URL using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => {
        const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
        return (
          <div
            key={url._id}
            className={`glass-card p-5 hover:shadow-lg transition-all duration-200 ${
              isExpired ? 'opacity-60' : ''
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* URL Info */}
              <div className="flex-1 min-w-0">
                {/* Short URL */}
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline truncate"
                  >
                    {url.shortUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(url.shortUrl, url._id)}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    title="Copy short URL"
                  >
                    {copiedId === url._id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-surface-400" />
                    )}
                  </button>
                </div>

                {/* Original URL */}
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 truncate block max-w-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5 inline mr-1" />
                  {url.originalUrl}
                </a>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-xs text-surface-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(url.createdAt)}
                  </span>
                  <span className="text-xs text-surface-400 flex items-center gap-1">
                    <MousePointerClick className="w-3.5 h-3.5" />
                    {formatNumber(url.clicks)} clicks
                  </span>
                  {url.lastVisitedAt && (
                    <span className="text-xs text-surface-400">
                      Last visit: {timeAgo(url.lastVisitedAt)}
                    </span>
                  )}
                  {/* Status badges */}
                  {isExpired ? (
                    <span className="badge-danger">Expired</span>
                  ) : url.isActive ? (
                    <span className="badge-success">Active</span>
                  ) : (
                    <span className="badge-warning">Inactive</span>
                  )}
                  {url.customAlias && (
                    <span className="badge-info">Custom</span>
                  )}
                  {url.expiresAt && !isExpired && (
                    <span className="text-xs text-amber-500">
                      Expires: {formatDate(url.expiresAt, true)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to={`/analytics/${url._id}`}
                  className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-500 transition-colors"
                  title="View analytics"
                >
                  <BarChart3 className="w-4.5 h-4.5" />
                </Link>
                <button
                  onClick={() => onQR?.(url)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 transition-colors"
                  title="QR Code"
                >
                  <QrCode className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => onEdit?.(url)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => handleDelete(url._id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UrlTable;
