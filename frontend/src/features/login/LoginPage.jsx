import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { loginInit, loginVerify, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInitSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginInit(form);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginVerify(form.username, form.email, code);
      navigate(from, { replace: true });
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
      await resendOtp(form.email);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="relative w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 tracking-tight">Resume<span className="text-blue-600">Craft</span></span>
              <span className="text-xs text-gray-500 mt-1 tracking-widest uppercase font-semibold">Professional Resume Builder</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-6">
              {step === 1 ? 'Welcome back!' : 'Verify your login'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {step === 1 
                ? 'Sign in with your verified credentials' 
                : `We sent a 6-digit code to ${form.email}`}
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleInitSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Username</label>
                <input
                  name="username" type="text" autoComplete="username" value={form.username} onChange={handleChange} placeholder="john_doe"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Email Address</label>
                <input
                  name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="john@email.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Enter your password"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg" tabIndex={-1}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">6-Digit Code</label>
                <input
                  type="text" maxLength="6" value={code} onChange={(e) => { setError(''); setCode(e.target.value.replace(/\D/g, '')); }} placeholder="000000"
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  required
                />
              </div>

              <button
                type="submit" disabled={loading || code.length !== 6}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : 'Verify & Login'}
              </button>
              
              <div className="text-center mt-4 flex flex-col gap-2">
                <button type="button" onClick={handleResend} disabled={loading} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                  Resend OTP
                </button>
                <button type="button" onClick={() => { setStep(1); setCode(''); setError(''); }} className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                  &larr; Back to login
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="text-center mt-4">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                  Forgot password?
                </Link>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-xs font-semibold">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  Create one free
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
