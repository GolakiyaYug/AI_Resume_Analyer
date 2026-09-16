import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, profileEditInit, profileEditVerify, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('VIEW'); // VIEW | EDIT | OTP
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    password: ''
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!user) return null;

  const handleChange = (e) => {
    setError('');
    setSuccess('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await profileEditInit(form);
      if (res.otp_required) {
        setMode('OTP');
      } else {
        setSuccess('Profile updated successfully!');
        setMode('VIEW');
        setForm({ ...form, password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await profileEditVerify(code);
      setSuccess('Profile updated securely!');
      setMode('VIEW');
      setForm({ ...form, password: '' });
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await profileEditInit(form);
      setSuccess('A new OTP has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 px-8 py-10 text-white flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-black shadow-inner">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-blue-200 mt-1 font-medium">@{user?.username}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
              <span>✅</span> {success}
            </div>
          )}

          {mode === 'VIEW' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                  <p className="text-gray-900 font-medium text-lg">{user.username}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                  <p className="text-gray-900 font-medium text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                  <p className="text-gray-900 font-medium text-lg tracking-widest">********</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => setMode('EDIT')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {mode === 'EDIT' && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    name="name" type="text" value={form.name} onChange={handleChange} required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <input
                    name="username" type="text" value={form.username} onChange={handleChange} required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span></label>
                  <div className="relative">
                    <input
                      name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg" tabIndex={-1}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4 items-center">
                <button
                  type="submit" disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button" onClick={() => { setMode('VIEW'); setForm({...user, password: ''}); setError(''); }} disabled={loading}
                  className="text-gray-600 hover:text-gray-900 font-medium py-2.5 px-4 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {mode === 'OTP' && (
            <form onSubmit={handleVerifySubmit} className="space-y-6 max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Verify your changes</h2>
                <p className="text-gray-500 text-sm mt-1">Enter the 6-digit code sent to {form.email}</p>
              </div>

              <div>
                <input
                  type="text" maxLength="6" value={code} onChange={(e) => { setError(''); setCode(e.target.value.replace(/\D/g, '')); }} placeholder="000000" required
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>

              <button
                type="submit" disabled={loading || code.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify & Save'}
              </button>
              
              <div className="text-center mt-4 flex flex-col gap-2">
                <button type="button" onClick={handleResend} disabled={loading} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                  Resend OTP
                </button>
                <button type="button" onClick={() => { setMode('EDIT'); setCode(''); setError(''); }} className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                  &larr; Back to edit
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
