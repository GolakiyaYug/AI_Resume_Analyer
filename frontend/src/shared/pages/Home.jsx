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

      {/* Quick Stats Bar */}
      <div className="mt-16 bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-2">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">50+</div>
            <div className="text-sm font-semibold text-gray-700">Resume Templates</div>
            <div className="text-xs text-gray-500 mt-1">ATS-Friendly & Modern</div>
          </div>
          <div className="p-2">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">95%</div>
            <div className="text-sm font-semibold text-gray-700">ATS Pass Rate</div>
            <div className="text-xs text-gray-500 mt-1">Optimized Formatting</div>
          </div>
          <div className="p-2">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">4.9/5</div>
            <div className="text-sm font-semibold text-gray-700">User Rating</div>
            <div className="text-xs text-gray-500 mt-1">From 10,000+ Job Seekers</div>
          </div>
          <div className="p-2">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">100%</div>
            <div className="text-sm font-semibold text-gray-700">Cloud Storage</div>
            <div className="text-xs text-gray-500 mt-1">Secure & Access Anytime</div>
          </div>
        </div>
      </div>

      {/* Quick Career Tools Shortcut Row */}
      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quick Career Tools</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Supercharge your job search with our AI-powered interview preparation and cover letter builder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* AI Interview Prep Card */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-3xl mb-5">
              🎙️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Interview Prep</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate domain-specific technical & behavioral interview questions tailored directly to your target role and resume skills. Practice with instant AI answers.
            </p>
          </div>

          {/* Cover Letter Generator Card */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-3xl mb-5">
              ✉️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Cover Letter Generator</h3>
            <p className="text-gray-600 leading-relaxed">
              Create tailored, compelling cover letters in seconds using customized tone settings, target company details, and AI skill extraction.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Guide */}
      <div className="mt-24 mb-8 text-left">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Build your professional resume in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all relative">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-extrabold mb-6 shadow-md">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pick a Template or Upload</h3>
            <p className="text-gray-600 leading-relaxed">
              Select from over 50+ professionally formatted ATS templates or upload your existing resume to parse and improve.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all relative">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-extrabold mb-6 shadow-md">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customize with AI Assistance</h3>
            <p className="text-gray-600 leading-relaxed">
              Use smart skill analysis, live formatting preview, and real-time ATS feedback to tailor your resume for top employers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all relative">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-extrabold mb-6 shadow-md">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Download & Ace Interviews</h3>
            <p className="text-gray-600 leading-relaxed">
              Export high-resolution PDFs ready for application portals, and utilize our AI interview prep tool to land the job.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
