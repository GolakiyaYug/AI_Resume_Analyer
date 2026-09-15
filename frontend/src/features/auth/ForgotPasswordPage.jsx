import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../shared/utils/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', code: '', password: '' });
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const requestCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/forgot-password', { email: form.email });
      setMessage(response.data.message);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not request a reset code.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/reset-password', form);
      setMessage(response.data.message);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="text-gray-500 text-sm mt-2">Request a code, then choose a new password.</p>
        {error && <p className="mt-4 px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}
        {message && <p className="mt-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm">{message}</p>}
        {!sent ? (
          <form onSubmit={requestCode} className="space-y-4 mt-6">
            <input name="email" type="email" required value={form.email} onChange={update} placeholder="Email address" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60">{loading ? 'Sending...' : 'Send reset code'}</button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4 mt-6">
            <input name="code" required inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={form.code} onChange={update} placeholder="6-digit code" className="w-full border border-gray-300 rounded-lg px-4 py-3 tracking-widest" />
            <input name="password" type="password" required minLength="6" value={form.password} onChange={update} placeholder="New password" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60">{loading ? 'Updating...' : 'Reset password'}</button>
          </form>
        )}
        <Link to="/login" className="block text-center text-gray-500 text-sm mt-6">Back to sign in</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
