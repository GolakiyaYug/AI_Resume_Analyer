import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 14: Skills Matrix
const Layout14 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-cyan-700';
  const accentBg = theme?.bgPrimary || 'bg-cyan-700';
  const borderCol = theme?.border || 'border-cyan-700';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-3 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Profile Overview
            </h2>
            <div className="text-[14px] leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className={`mb-8 p-6 bg-gray-50 rounded-xl border ${borderCol} shadow-sm`}>
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-5 text-center`}>
              Core Competencies Matrix
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm hover:shadow-md transition">
                  <div className="text-[13px] font-bold text-gray-800">
                    <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  </div>
                  {/* Visual purely decorative indicator for a "matrix/rating" feel */}
                  <div className="mt-2 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 4 ? accentBg : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-5 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Experience Record
            </h2>
            <div className="space-y-6 pl-9">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="relative">
                  <div className={`absolute -left-9 top-1.5 w-3 h-3 rounded-sm ${accentBg}`}></div>
                  <h3 className="font-bold text-[15px] text-gray-900 mb-0.5">
                    <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Role" />
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-x-2 text-[13px] mb-2">
                    <span className="font-semibold text-gray-800">
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    </span>
                    {exp.location && (
                      <span className="text-gray-500">
                        (<EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />)
                      </span>
                    )}
                    <span className="text-gray-400">|</span>
                    <span className={`font-bold ${accentText}`}>
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[14px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-5 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Key Projects
            </h2>
            <div className="space-y-5 pl-9">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="relative">
                  <div className={`absolute -left-9 top-1.5 w-3 h-3 rounded-sm ${accentBg} opacity-50`}></div>
                  <h3 className="font-bold text-[14px] text-gray-900 mb-0.5">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                  </h3>
                  {proj.link && (
                    <div className={`text-[12px] font-medium ${accentText} mb-1`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Project Link" />
                    </div>
                  )}
                  <div className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-4 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Education
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-9">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-[14px] text-gray-900 leading-snug">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </h3>
                  <div className="text-[13px] text-gray-800 my-0.5">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </div>
                  <div className="text-[12px] text-gray-500 font-semibold">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-4 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Certifications
            </h2>
            <div className="pl-9 space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-center text-[13px] bg-gray-50 px-3 py-2 rounded">
                  <span className="font-bold text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-gray-500 font-medium ml-2">
                      <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-4 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Languages
            </h2>
            <div className="pl-9 grid grid-cols-2 gap-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex items-baseline justify-between text-[13px]">
                  <strong className="font-bold text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  <span className={`text-[11px] font-bold uppercase ${accentText}`}>
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-4 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Achievements
            </h2>
            <div className="pl-9 space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[13px]">
                  <div className="font-bold text-gray-900 mb-0.5">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-gray-700">
                      <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-8">
            <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${accentText} mb-4 flex items-center`}>
              <span className={`w-6 h-[2px] ${accentBg} mr-3`}></span>
              Interests
            </h2>
            <div className="pl-9 flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-gray-100 text-gray-700 text-[13px] font-medium px-3 py-1 rounded-full">
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Ensure skills section appears prominently, often near the top after summary for this specific layout
  const matrixOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'languages', 'achievements', 'interests'];
  const orderedSections = matrixOrder.filter(s => sectionsOrder.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans px-10 py-12">
      <header className="mb-10 pb-8 border-b-2 border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className={`text-lg font-bold ${accentText} tracking-wider uppercase mb-5`}>
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-600 font-medium">
          {data.email && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-400">in</span>
              <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-400">gh</span>
              <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
            </div>
          )}
        </div>
      </header>

      <div>
        {orderedSections.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout14;
