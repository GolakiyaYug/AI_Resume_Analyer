import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../shared/utils/api';

const MyResumesPage = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState('');

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/resume/');
      setResumes(res.data);
    } catch {
      setError('Failed to load your resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/resume/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
      showToast('✅ Resume deleted');
    } catch {
      showToast('❌ Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">📁 My Resumes</h1>
          <p className="text-gray-500 mt-1">
            {user?.name && <span>Hi <strong>{user.name.split(' ')[0]}</strong> · </span>}
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          ✏️ Create New Resume
        </Link>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-[fadeIn_0.2s_ease]">
          {toast}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-24">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchResumes} className="text-blue-600 hover:underline text-sm">Try again</button>
        </div>
      )}

      {!loading && !error && resumes.length === 0 && (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No resumes yet</h3>
          <p className="text-gray-500 mb-6">Create your first resume to get started</p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            ✏️ Create Resume
          </Link>
        </div>
      )}

      {!loading && !error && resumes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col justify-between"
            >
              {/* Resume info */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0">
                    📄
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full border border-blue-100">
                    {resume.template_id}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1 truncate" title={resume.title}>
                  {resume.title}
                </h3>
                <p className="text-xs text-gray-400">
                  Last updated: {formatDate(resume.updated_at)}
                </p>
                <p className="text-xs text-gray-400">
                  Created: {formatDate(resume.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/builder?resume=${resume.id}`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
                >
                  Open
                </Link>
                <button
                  onClick={() => handleDelete(resume.id)}
                  disabled={deletingId === resume.id}
                  className="flex-1 text-center bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deletingId === resume.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumesPage;
