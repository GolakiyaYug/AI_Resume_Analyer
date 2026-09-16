import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Avatar initials
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-black text-blue-600 group-hover:text-blue-700 transition-colors">
                  Resume<span className="text-slate-800">Craft</span>
                </span>
                <span className="text-[10px] font-medium text-gray-400 tracking-wide">
                  Professional Resume Builder &amp; Analyzer
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-2">
            <Link
              to="/builder"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            >
              ✏️ Create Resume
            </Link>
            <Link
              to="/analyze"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
            >
              🔍 Analyze
            </Link>

            {isAuthenticated ? (
              <>
                {/* User Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="user-menu-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {initials}
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-[fadeIn_0.15s_ease]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        👤 Profile
                      </Link>
                      <Link
                        to="/my-resumes"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        📁 My Resumes
                      </Link>
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  id="navbar-login-btn"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200 hover:border-blue-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  id="navbar-signup-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
