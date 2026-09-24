import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LuLayoutTemplate,
  LuCircleCheck,
  LuCloud,
  LuMic,
  LuFileText,
  LuDollarSign
} from 'react-icons/lu';

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
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
            <LuLayoutTemplate className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Premium Templates</h3>
          <p className="text-gray-600">Choose from modern, professional, and creative designs tailored for different industries.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
            <LuCircleCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">ATS Optimized</h3>
          <p className="text-gray-600">Ensure your resume passes Applicant Tracking Systems with our structured formats.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 border border-purple-100 shadow-sm">
            <LuCloud className="w-6 h-6" />
          </div>
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
            Supercharge your job search with our AI-powered interview preparation, cover letter builder, and salary market predictor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* AI Salary Negotiator Card */}
          <Link to="/salary-negotiator" className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-5 border border-teal-100 shadow-sm">
                <LuDollarSign className="w-7 h-7 text-teal-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">Salary Negotiator</h3>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">New</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                Predict your market salary range (Min, Avg, Max), receive value justification points, and get AI recruiter negotiation scripts.
              </p>
            </div>
            <div className="mt-6 text-sm font-bold text-teal-600 group-hover:underline flex items-center gap-1">
              <span>Predict Salary</span>
              <span>→</span>
            </div>
          </Link>

          {/* AI Interview Prep Card */}
          <Link to="/career-tools" className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 border border-indigo-100 shadow-sm">
                <LuMic className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">AI Interview Prep</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Generate domain-specific technical &amp; behavioral interview questions tailored directly to your target role and resume skills.
              </p>
            </div>
            <div className="mt-6 text-sm font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
              <span>Practice Questions</span>
              <span>→</span>
            </div>
          </Link>

          {/* Cover Letter Generator Card */}
          <Link to="/career-tools" className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 border border-purple-100 shadow-sm">
                <LuFileText className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Cover Letter Generator</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Create tailored, compelling cover letters in seconds using customized tone settings, target company details, and AI skill extraction.
              </p>
            </div>
            <div className="mt-6 text-sm font-bold text-purple-600 group-hover:underline flex items-center gap-1">
              <span>Generate Letter</span>
              <span>→</span>
            </div>
          </Link>
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
