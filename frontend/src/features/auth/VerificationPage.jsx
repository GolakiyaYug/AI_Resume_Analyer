import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../shared/utils/api';

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/verify-email', { email, code });
      setMessage('Email verified. Redirecting to sign in...');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    try {
      const response = await api.post('/api/auth/resend-verification', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend the code.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
        <p className="text-gray-500 text-sm mt-2">Enter the six-digit code sent to your email address.</p>
        {error && <p className="mt-4 px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}
        {message && <p className="mt-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm">{message}</p>}
        <form onSubmit={submit} className="space-y-4 mt-6">
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          <input type="text" required inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} placeholder="6-digit code" className="w-full border border-gray-300 rounded-lg px-4 py-3 tracking-widest" />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60">{loading ? 'Verifying...' : 'Verify Email'}</button>
        </form>
        <button type="button" onClick={resend} className="w-full text-blue-600 hover:text-blue-800 text-sm font-semibold mt-4">Resend code</button>
        <Link to="/login" className="block text-center text-gray-500 text-sm mt-6">Back to sign in</Link>
      </div>
    </div>
  );
};

export default VerificationPage;
