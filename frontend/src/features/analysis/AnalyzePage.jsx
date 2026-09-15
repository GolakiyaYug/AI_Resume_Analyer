import { useRef, useState } from 'react';
import api from '../../shared/utils/api';

const AnalyzePage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Allow re-submitting if file is in state, so user doesn't have to re-upload for JD updates
    const selectedFile = file || event.currentTarget.elements.file?.files[0];
    if (!selectedFile) {
      return;
    }
    setStatus({ loading: true, error: '' });
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    
    const jd = event.currentTarget.elements.job_description?.value;
    if (jd) {
      formData.append('job_description', jd);
    }

    try {
      const response = await api.post('/api/analysis/analyze', formData);
      setAnalysis(response.data.analysis);
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Analysis failed. Please try again.' });
      return;
    }
    setStatus({ loading: false, error: '' });
  };

  const report = analysis?.report_data;
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">🔍 Resume Analyzer</h1>
        <p className="text-gray-500 mt-1">Get an ATS score, resume overview, practical improvements, and suitable job predictions.</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload resume (PDF, DOCX, or TXT)</label>
          <input
            required
            name="file"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={(event) => {
              const selectedFile = event.target.files[0] || null;
              setFile(selectedFile);
              setStatus({ loading: false, error: '' });
            }}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700"
          />
          <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, DOCX, and TXT. Maximum size: 10 MB.</p>
          {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description (Optional)</label>
          <textarea
            name="job_description"
            rows="4"
            placeholder="Paste the target job description here to analyze missing keywords..."
            className="w-full text-sm text-gray-700 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          ></textarea>
        </div>
        {status.error && <p className="text-red-600 text-sm">{status.error}</p>}
        <button type="submit" disabled={!file || status.loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60 transition-colors">
          {status.loading ? 'Analyzing...' : (analysis ? 'Update / Re-analyze' : 'Analyze Resume')}
        </button>
      </form>
      {report && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Analysis overview</h2>
              <p className="text-gray-500 text-sm mt-1">{report.overview}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-4xl font-extrabold text-blue-600">
                {analysis.ats_score}<span className="text-lg text-gray-400">/100</span>
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Overall ATS Score</span>
            </div>
          </div>
          
          {report.score_breakdown && report.score_breakdown.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 border-t border-b border-gray-100 py-5">
              {report.score_breakdown.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-1">{item.category}</span>
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-2xl font-bold ${item.score >= 80 ? 'text-green-600' : (item.score >= 50 ? 'text-amber-500' : 'text-red-500')}`}>
                      {item.score}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{item.feedback}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm font-semibold text-gray-700 mb-2">Resume overview</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-5">
            {report.overview_points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <p className="text-sm font-semibold text-gray-700 mb-2">Checks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {Object.entries(report.checks).map(([name, passed]) => <div key={name} className={`rounded-lg px-3 py-2 text-sm ${passed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{passed ? '✓' : '!' } {name}</div>)}
          </div>

          {report.section_breakdown && report.section_breakdown.length > 0 && (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-2">Section Breakdown</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {report.section_breakdown.map((section, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${section.present ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {section.present ? '✅' : '❌'}
                      </span>
                      <h3 className={`font-bold text-sm ${section.present ? 'text-green-800' : 'text-red-800'}`}>
                        {section.name}
                      </h3>
                    </div>
                    <p className={`text-xs ml-7 ${section.present ? 'text-green-700' : 'text-red-700'}`}>
                      {section.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="text-sm font-semibold text-gray-700 mb-2">Improvement suggestions</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-5">{report.improvement_suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul>
          
          {report.missing_keywords && report.missing_keywords.length > 0 && (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                ⚠️ Missing Keywords from Job Description
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {report.missing_keywords.map((kw, idx) => (
                  <span key={idx} className="bg-red-50 text-red-600 border border-red-200 text-xs font-medium px-2.5 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}

          <p className="text-sm font-semibold text-gray-700 mt-5 mb-2">Predicted job roles</p>
          {report.job_recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.job_recommendations.map((recommendation) => <div key={recommendation.role} className="rounded-lg bg-blue-50 text-blue-700 px-3 py-2 text-sm"><strong>{recommendation.role}</strong> · {recommendation.match_score}% match<br /><span className="text-blue-600">{recommendation.reason}</span></div>)}
            </div>
          ) : <p className="text-sm text-gray-500">Add more technical skills to receive role predictions.</p>}
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
