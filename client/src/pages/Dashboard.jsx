import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ArrowUpDown,
  Upload,
  Link2,
  MousePointerClick,
  TrendingUp,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateUrlForm from '../components/url/CreateUrlForm';
import UrlTable from '../components/url/UrlTable';
import QRCodeModal from '../components/url/QRCodeModal';
import EditUrlModal from '../components/url/EditUrlModal';
import CsvUpload from '../components/csv/CsvUpload';
import { formatNumber } from '../utils/formatDate';

const Dashboard = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Modals
  const [qrUrl, setQrUrl] = useState(null);
  const [editUrl, setEditUrl] = useState(null);
  const [showCsv, setShowCsv] = useState(false);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/urls', {
        params: {
          page: pagination.page,
          search,
          sortBy,
          sortOrder,
          limit: 20,
        },
      });
      setUrls(res.data.data.urls);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreated = () => {
    fetchUrls();
  };

  const handleDelete = (id) => {
    setUrls((prev) => prev.filter((u) => u._id !== id));
    setPagination((p) => ({ ...p, total: p.total - 1 }));
  };

  const handleEditSaved = () => {
    setEditUrl(null);
    fetchUrls();
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Stats
  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);
  const activeUrls = urls.filter((u) => u.isActive && (!u.expiresAt || new Date(u.expiresAt) > new Date())).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage your shortened URLs and track their performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total URLs',
            value: formatNumber(pagination.total),
            icon: Link2,
            color: 'from-brand-500 to-blue-600',
          },
          {
            label: 'Total Clicks',
            value: formatNumber(totalClicks),
            icon: MousePointerClick,
            color: 'from-emerald-500 to-teal-600',
          },
          {
            label: 'Active Links',
            value: formatNumber(activeUrls),
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create URL Form */}
      <div className="mb-8">
        <CreateUrlForm onCreated={handleCreated} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              className="input pl-9 text-sm"
              placeholder="Search URLs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* CSV Upload */}
          <button
            onClick={() => setShowCsv(true)}
            className="btn-secondary text-sm shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </button>
        </div>

        {/* Sort buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-400">Sort:</span>
          {[
            { key: 'createdAt', label: 'Date' },
            { key: 'clicks', label: 'Clicks' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => toggleSort(opt.key)}
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                sortBy === opt.key
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                  : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {opt.label}
              {sortBy === opt.key && (
                <ArrowUpDown className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* URL List */}
      <UrlTable
        urls={urls}
        loading={loading}
        onDelete={handleDelete}
        onEdit={(url) => setEditUrl(url)}
        onQR={(url) => setQrUrl(url)}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            disabled={pagination.page <= 1}
            className="btn-ghost text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-surface-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            disabled={pagination.page >= pagination.pages}
            className="btn-ghost text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <QRCodeModal
        isOpen={!!qrUrl}
        onClose={() => setQrUrl(null)}
        url={qrUrl}
      />
      <EditUrlModal
        isOpen={!!editUrl}
        onClose={() => setEditUrl(null)}
        url={editUrl}
        onSaved={handleEditSaved}
      />
      <CsvUpload
        isOpen={showCsv}
        onClose={() => setShowCsv(false)}
        onUploaded={() => {
          setShowCsv(false);
          fetchUrls();
        }}
      />
    </div>
  );
};

export default Dashboard;
