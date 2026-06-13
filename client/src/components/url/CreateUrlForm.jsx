import { useState } from 'react';
import { Link2, Wand2, Calendar, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CreateUrlForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    originalUrl: '',
    customAlias: '',
    expiresAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        originalUrl: form.originalUrl,
        ...(form.customAlias && { customAlias: form.customAlias }),
        ...(form.expiresAt && { expiresAt: form.expiresAt }),
      };

      const res = await api.post('/api/urls', payload);
      toast.success('Short URL created!');
      setForm({ originalUrl: '', customAlias: '', expiresAt: '' });
      setShowAdvanced(false);
      onCreated?.(res.data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create short URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-white" />
        </div>
        Shorten a URL
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start gap-2 animate-slide-down">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="url"
              required
              className="input pl-10"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={form.originalUrl}
              onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary shrink-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Shorten
              </>
            )}
          </button>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          {showAdvanced ? '− Hide' : '+ Show'} advanced options
        </button>

        {/* Advanced Fields */}
        {showAdvanced && (
          <div className="grid sm:grid-cols-2 gap-3 animate-slide-down">
            <div>
              <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">
                Custom Alias (optional)
              </label>
              <div className="relative">
                <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  className="input pl-9 text-sm"
                  placeholder="my-custom-link"
                  value={form.customAlias}
                  onChange={(e) => setForm({ ...form, customAlias: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">
                Expiration Date (optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="datetime-local"
                  className="input pl-9 text-sm"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUrlForm;
