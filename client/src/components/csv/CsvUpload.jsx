import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';

const CsvUpload = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selected);
    setResult(null);

    // Preview first 5 rows
    Papa.parse(selected, {
      header: true,
      preview: 5,
      complete: (results) => {
        setPreview(results.data);
      },
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/api/urls/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data);
      toast.success(res.data.message);
      onUploaded?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload URLs" maxWidth="max-w-xl">
      {!result ? (
        <div className="space-y-4">
          <div className="text-sm text-surface-500 dark:text-surface-400">
            <p>Upload a CSV file with columns: <code className="text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">url</code> (required), <code className="text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">alias</code> (optional)</p>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 dark:hover:border-brand-600 transition-colors"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Click to select a CSV file</p>
              </>
            )}
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-xs font-medium text-surface-500 mb-2">Preview (first 5 rows):</p>
              <div className="overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-50 dark:bg-surface-800">
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left font-medium text-surface-500">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t border-surface-200 dark:border-surface-700">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-surface-600 dark:text-surface-400 truncate max-w-[200px]">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload & Create URLs
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {result.message}
            </p>
          </div>

          {result.data?.errors?.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
              <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Errors ({result.data.errors.length})
              </p>
              <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                {result.data.errors.map((err, i) => (
                  <li key={i}>Line {err.line}: {err.error} — {err.url}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CsvUpload;
