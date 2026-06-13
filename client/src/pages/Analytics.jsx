import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MousePointerClick,
  Clock,
  ExternalLink,
  Download,
  TrendingUp,
  Monitor,
  Globe,
  Link2,
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import ClickChart from '../components/analytics/ClickChart';
import DeviceChart from '../components/analytics/DeviceChart';
import LocationTable from '../components/analytics/LocationTable';
import VisitLog from '../components/analytics/VisitLog';
import { formatDate, timeAgo, formatNumber } from '../utils/formatDate';

const Analytics = () => {
  const { urlId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/api/analytics/${urlId}`);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [urlId]);

  const handleExport = async () => {
    try {
      const res = await api.get(`/api/analytics/${urlId}/export`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success('Analytics exported!');
    } catch {
      toast.error('Failed to export analytics.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/dashboard" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { url, analytics } = data;
  const shortUrl = `${window.location.origin.replace(':5173', ':5000')}/${url.customAlias || url.shortCode}`;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'visits', label: 'Visit Log' },
    { id: 'locations', label: 'Locations' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-brand-500" />
              Analytics
            </h1>
            <div className="mt-2 space-y-1">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 font-medium hover:underline text-sm"
              >
                {shortUrl}
              </a>
              <a
                href={url.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-surface-500 dark:text-surface-400 text-sm hover:text-surface-700 dark:hover:text-surface-300 flex items-center gap-1 truncate max-w-lg"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {url.originalUrl}
              </a>
            </div>
          </div>

          <button onClick={handleExport} className="btn-secondary shrink-0">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Clicks',
            value: formatNumber(analytics.totalClicks),
            icon: MousePointerClick,
            color: 'from-brand-500 to-blue-600',
          },
          {
            label: 'Last Visit',
            value: url.lastVisitedAt ? timeAgo(url.lastVisitedAt) : 'Never',
            icon: Clock,
            color: 'from-emerald-500 to-teal-600',
          },
          {
            label: 'Created',
            value: formatDate(url.createdAt),
            icon: Link2,
            color: 'from-purple-500 to-pink-600',
          },
          {
            label: 'Status',
            value: url.isActive ? 'Active' : 'Inactive',
            icon: Globe,
            color: url.isActive ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600',
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-surface-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-surface-200 dark:border-surface-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Click Trends */}
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Click Trends (Last 30 Days)
            </h3>
            <ClickChart data={analytics.dailyClicks} />
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                Devices
              </h3>
              <DeviceChart data={analytics.deviceBreakdown} />
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                Browsers
              </h3>
              <DeviceChart data={analytics.browserBreakdown.map((b) => ({ device: b.browser, count: b.count }))} />
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-500" />
                Referrers
              </h3>
              <DeviceChart data={analytics.referrerBreakdown.map((r) => ({ device: r.referrer, count: r.count }))} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="glass-card p-6 animate-fade-in">
          <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
            Recent Visits (Last 50)
          </h3>
          <VisitLog visits={analytics.recentVisits} />
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="glass-card p-6 animate-fade-in">
          <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            Top Locations
          </h3>
          <LocationTable data={analytics.locationBreakdown} />
        </div>
      )}
    </div>
  );
};

export default Analytics;
