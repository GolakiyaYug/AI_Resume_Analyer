import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="text-center py-20 px-4">
      {/* Welcome back message for logged-in users */}
      {isAuthenticated && (
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span>👋</span> Welcome back, <strong>{user?.name?.split(' ')[0]}</strong>!
        </div>
      )}

      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Build Your Professional Resume<br />
        <span className="text-blue-600">with AI</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Create ATS-friendly resumes in minutes using our 50+ premium templates.
        Analyze your existing resume and get AI-powered feedback to land your dream job.
      </p>

      <div className="flex justify-center flex-wrap gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/builder"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg transition-all hover:-translate-y-1"
            >
              ✏️ Create Resume
            </Link>
            <Link
              to="/my-resumes"
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 shadow-lg transition-all hover:-translate-y-1"
            >
              📁 My Saved Resumes
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg transition-all hover:-translate-y-1"
            >
              🚀 Sign Up Free
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 shadow-lg transition-all hover:-translate-y-1"
            >
              Login to Get Started
            </Link>
          </>
        )}
      </div>

      {/* Feature cards */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-4">50+</div>
          <h3 className="text-xl font-bold mb-2">Premium Templates</h3>
          <p className="text-gray-600">Choose from modern, professional, and creative designs tailored for different industries.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-4">✓</div>
          <h3 className="text-xl font-bold mb-2">ATS Optimized</h3>
          <p className="text-gray-600">Ensure your resume passes Applicant Tracking Systems with our structured formats.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-4">💾</div>
          <h3 className="text-xl font-bold mb-2">Cloud Saved</h3>
          <p className="text-gray-600">Save your resumes to your account and access them anytime. Your work is never lost.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
