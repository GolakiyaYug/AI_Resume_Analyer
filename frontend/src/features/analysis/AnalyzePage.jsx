import { useRef, useState } from 'react';
import api from '../../shared/utils/api';

const AnalyzePage = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedFile = event.currentTarget.elements.file.files[0];
    if (!selectedFile) {
      return;
    }
    setStatus({ loading: true, error: '' });
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
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
        {status.error && <p className="text-red-600 text-sm">{status.error}</p>}
        <button type="submit" disabled={!file || status.loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60">
          {status.loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
      {report && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div><h2 className="text-xl font-bold text-gray-900">Analysis overview</h2><p className="text-gray-500 text-sm mt-1">{report.overview}</p></div>
            <div className="text-4xl font-extrabold text-blue-600">{analysis.ats_score}<span className="text-lg text-gray-400">/100</span></div>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Resume overview</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-5">
            {report.overview_points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <p className="text-sm font-semibold text-gray-700 mb-2">Checks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {Object.entries(report.checks).map(([name, passed]) => <div key={name} className={`rounded-lg px-3 py-2 text-sm ${passed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{passed ? '✓' : '!' } {name}</div>)}
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Improvement suggestions</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">{report.improvement_suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul>
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
