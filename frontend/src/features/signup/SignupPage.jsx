import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, username, email, password, confirmPassword } = form;

    if (!name || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name, username: username.toLowerCase(), email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return { label: '', color: '' };
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500' };
    if (p.length < 10) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  })();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 tracking-tight">Resume<span className="text-blue-600">Craft</span></span>
              <span className="text-xs text-gray-500 mt-1 tracking-widest uppercase font-semibold">Professional Resume Builder</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-6">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Join thousands of professionals building better resumes</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Full Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
            </div>

            {/* Username + Email row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Username</label>
                <input
                  id="signup-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Email</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg" tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${form.password.length < 6 ? 'w-1/3' : form.password.length < 10 ? 'w-2/3' : 'w-full'}`} />
                  </div>
                  <span className={`text-xs font-medium ${strength.color === 'bg-red-500' ? 'text-red-500' : strength.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-green-600'}`}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Confirm Password</label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full bg-white border rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/20'
                }`}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">Passwords don't match</p>
              )}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-600 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
