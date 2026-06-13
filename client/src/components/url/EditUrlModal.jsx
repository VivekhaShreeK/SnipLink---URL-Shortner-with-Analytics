import { useState } from 'react';
import { Link2, Wand2, Calendar, Save, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';

const EditUrlModal = ({ isOpen, onClose, url, onSaved }) => {
  const [form, setForm] = useState({
    originalUrl: url?.originalUrl || '',
    customAlias: url?.customAlias || '',
    expiresAt: url?.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
    isActive: url?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form when url prop changes
  useState(() => {
    if (url) {
      setForm({
        originalUrl: url.originalUrl || '',
        customAlias: url.customAlias || '',
        expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
        isActive: url.isActive ?? true,
      });
    }
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.patch(`/api/urls/${url._id}`, {
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
      });
      toast.success('URL updated!');
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update URL.');
    } finally {
      setLoading(false);
    }
  };

  if (!url) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit URL">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Destination URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="url"
              required
              className="input pl-9 text-sm"
              value={form.originalUrl}
              onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Custom Alias
          </label>
          <div className="relative">
            <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              className="input pl-9 text-sm"
              placeholder="Leave empty to use auto-generated code"
              value={form.customAlias}
              onChange={(e) => setForm({ ...form, customAlias: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Expiration Date
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

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-200 dark:bg-surface-700 peer-focus:ring-2 peer-focus:ring-brand-500/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
          </label>
          <span className="text-sm text-surface-700 dark:text-surface-300">
            Active
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUrlModal;
