import { useAuth } from '../../context/AuthContext';
import {
  LuFilePlus,
  LuSearch,
  LuBriefcase,
  LuDollarSign,
  LuShare2,
  LuFilePenLine,
  LuSparkles,
  LuCircleCheck,
  LuFileText
} from 'react-icons/lu';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-16 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. SaaS Hero Banner Section (Clean Informational View, Zero CTAs) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800/80">
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Welcome Back, {user?.name?.split(' ')[0]}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              <LuSparkles className="w-4 h-4 text-blue-400" />
              <span>AI-Powered Career Intelligence Suite</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Accelerate Your Career with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">Next-Gen AI Intelligence</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            ResumeCraft unifies 6 core career modules—from ATS resume optimization and compensation benchmarking to catchy LinkedIn portfolio bios and custom document building—into one seamless professional platform.
          </p>
        </div>
      </div>

      {/* 2. Exact 6-Card Grid Matching Navbar (3x2 Desktop Layout, Zero Buttons/CTAs) */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/80">
            Navbar Integration Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            6 Intelligent Career Modules
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of every feature module accessible directly from the top navigation bar.
          </p>
        </div>

        {/* 6-Card Balanced Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Create Resume */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all p-7 space-y-5 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-blue-100/50 transition-colors"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                <LuFilePlus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/60">
                  Module 01 • Resume Builder
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Create Resume
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Choose from ATS-optimized professional templates or construct customized resume layouts with dynamic live editing and section customization.
              </p>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[11px] font-medium text-slate-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Multi-style ATS-tested resume templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Dynamic section reordering &amp; layout controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Instant visual output &amp; high-res PDF export</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: AI Resume Parser & ATS Analyzer */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all p-7 space-y-5 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-indigo-100/50 transition-colors"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                <LuSearch className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100/60">
                  Module 02 • ATS Intelligence
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  AI Resume Parser &amp; ATS Analyzer
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Scans resume uploads against ATS algorithms to evaluate keyword density, contact completeness, formatting structure, and section scores.
              </p>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[11px] font-medium text-slate-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Real-time ATS score algorithm &amp; check breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Job Description match matrix &amp; missing keywords</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Instant section-by-section optimization tips</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Cover Letter & Career Tools */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all p-7 space-y-5 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-purple-100/50 transition-colors"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-105 transition-transform">
                <LuBriefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100/60">
                  Module 03 • Application Tools
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Cover Letter Generator
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Synthesizes customized, company-tailored cover letters matching job descriptions, supporting tone adjustments (Formal, Executive, Creative) and PDF export.
              </p>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[11px] font-medium text-slate-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Company &amp; role-aligned personalized narratives</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Multi-tone generator &amp; dynamic variation engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>One-click formatted PDF export for job applications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 4: Salary Negotiator & Market Worth */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all p-7 space-y-5 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-teal-100/50 transition-colors"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100 shadow-sm group-hover:scale-105 transition-transform">
                <LuDollarSign className="w-6 h-6 text-teal-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100/60">
                  Module 04 • Compensation Data
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Salary Negotiator &amp; Market Worth
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Predicts role-specific compensation ranges (Min, Average, Max) filtered by location and experience, generating counter-offer scripts for recruiters.
              </p>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[11px] font-medium text-slate-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Benchmarked market range predictions (Min, Avg, Max)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Recruiter phone negotiation script generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Tailored email counter-offer response templates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 5: LinkedIn AI Hub */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all p-7 space-y-5 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-emerald-100/50 transition-colors"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                <LuShare2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100/60">
                  Module 05 • Networking Hub
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  LinkedIn AI Hub &amp; Network Intelligence
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Parses experience highlights from your resume to synthesize catchy LinkedIn headlines, "About" summaries with hashtags, and personalized connection notes.
              </p>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[11px] font-medium text-slate-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Catchy "About" Bio with relevant domain hashtags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Concise recruiter outreach notes (&lt;300 chars)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dynamic multi-tone headline generation engine</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 6: WordPad Resume Editor */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all p-7 space-y-5 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50/50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-sky-100/50 transition-colors"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center border border-sky-100 shadow-sm group-hover:scale-105 transition-transform">
                <LuFilePenLine className="w-6 h-6 text-sky-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100/60">
                  Module 06 • Document Editor
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  WordPad Resume Editor
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Integrated rich text formatting suite offering typography control, alignment options, section ordering, live visual layout styling, and document exporting.
              </p>
              <div className="border-t border-slate-100 pt-4">
                <ul className="text-[11px] font-medium text-slate-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Full-featured rich text toolbar &amp; styling controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Custom typography, font sizing, and line spacing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LuCircleCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Direct export to Microsoft Word (DOCX) &amp; PDF</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SaaS Metrics & Performance Showcase */}
      <div className="bg-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
          <div className="p-2 space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-blue-400">95%+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">ATS Pass Rate</div>
            <p className="text-[11px] text-slate-400">Optimized layout &amp; keyword matching</p>
          </div>
          <div className="p-2 space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-teal-400">50+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">Resume Templates</div>
            <p className="text-[11px] text-slate-400">Professional &amp; modern designs</p>
          </div>
          <div className="p-2 space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">$15k+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">Avg Salary Lift</div>
            <p className="text-[11px] text-slate-400">Data-backed negotiation scripts</p>
          </div>
          <div className="p-2 space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-purple-400">100%</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">Cloud Storage</div>
            <p className="text-[11px] text-slate-400">Secure &amp; accessible anywhere</p>
          </div>
        </div>
      </div>

      {/* 4. 3-Step Success Workflow */}
      <div className="space-y-8 pt-2">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/80">
            Workflow Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How ResumeCraft Works</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Build your high-converting resume and accelerate your job search in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-md shadow-blue-600/20">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">Upload or Create Resume</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select from ATS-optimized templates or upload your existing PDF/DOCX file to extract skills, experience, and contact details automatically.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-md shadow-indigo-600/20">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">Run AI Analysis &amp; Tools</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluate your ATS score, benchmark target market salary worth, generate catchy LinkedIn portfolio bios, and create tailored cover letters.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-md shadow-emerald-600/20">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">Export &amp; Land Top Roles</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export high-resolution PDFs or DOCX files, reach out to recruiters with custom connection notes, and negotiate top offers with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
