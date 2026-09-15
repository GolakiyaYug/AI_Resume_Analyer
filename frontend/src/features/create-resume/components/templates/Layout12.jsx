import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 12: Portfolio Showcase
const Layout12 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-rose-600';
  const accentBg = theme?.bgPrimary || 'bg-rose-600';
  const accentLight = theme?.bgLight || 'bg-rose-50';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">
              About Me
            </h2>
            <div className="text-[15px] leading-relaxed text-gray-700 font-light">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Write a short, engaging bio..." multiline />
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-12">
            <h2 className={`text-xl font-extrabold ${accentText} mb-6 flex items-center`}>
              <span className="flex-grow border-t-2 border-gray-100 mr-4"></span>
              Selected Works
              <span className="flex-grow border-t-2 border-gray-100 ml-4"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="group relative overflow-hidden rounded-2xl bg-gray-900 text-white p-6 aspect-[4/3] flex flex-col justify-end transition hover:shadow-xl">
                  {/* Decorative background overlay */}
                  <div className={`absolute inset-0 ${accentBg} opacity-20 group-hover:opacity-40 transition`}></div>
                  <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl font-black italic -mt-4 -mr-2 pointer-events-none text-white mix-blend-overlay">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold text-2xl mb-1 text-white">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                    </h3>
                    {proj.link && (
                      <div className="text-sm font-medium text-white/80 mb-3 truncate">
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Live Link / Repo" />
                      </div>
                    )}
                    <div className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Project details and technologies used..." multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-10 text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
              Tech Stack & Tools
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`px-4 py-2 text-sm font-semibold text-gray-800 ${accentLight} border border-gray-200 rounded-lg shadow-sm transform transition hover:-translate-y-1`}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-10">
            <h2 className={`text-xl font-extrabold ${accentText} mb-6 flex items-center`}>
              <span className="flex-grow border-t-2 border-gray-100 mr-4"></span>
              Experience
              <span className="flex-grow border-t-2 border-gray-100 ml-4"></span>
            </h2>
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:border-gray-300 transition">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Role" />
                      </h3>
                      <div className={`text-[15px] font-medium ${accentText}`}>
                        <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                        {exp.location && (
                          <span className="text-gray-500 font-normal ml-2">
                            (<EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full mt-2 md:mt-0 whitespace-nowrap">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed mt-3">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description..." multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-10">
            <h2 className={`text-xl font-extrabold ${accentText} mb-6 flex items-center`}>
              <span className="flex-grow border-t-2 border-gray-100 mr-4"></span>
              Education
              <span className="flex-grow border-t-2 border-gray-100 ml-4"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="p-5 border-2 border-dashed border-gray-200 rounded-xl text-center">
                  <h3 className="font-bold text-base text-gray-900 mb-1">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </h3>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
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
          <div key="certifications" className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-6 text-center">
              Certifications
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-xs text-gray-400 border-l border-gray-300 pl-2">
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
          <div key="languages" className="mb-10 text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
              Languages
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-center">
                  <div className="font-bold text-gray-900 text-[15px]">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </div>
                  <div className={`text-xs font-semibold ${accentText} uppercase tracking-wider mt-1`}>
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
              Milestones & Achievements
            </h2>
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="font-bold text-sm text-gray-900">
                    ⭐ <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-sm text-gray-600 mt-1">
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
          <div key="interests" className="mb-10 text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
              Beyond Coding
            </h2>
            <div className="text-sm font-medium text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-gray-100 px-3 py-1 rounded">
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

  // Reordering to emphasize Projects and Skills for a Portfolio Showcase
  const portfolioOrder = ['summary', 'projects', 'skills', 'experience', 'education', 'certifications', 'achievements', 'languages', 'interests'];
  const orderedSections = portfolioOrder.filter(s => sectionsOrder.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans px-8 py-12 md:px-16">
      <header className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className={`text-xl font-bold ${accentText} mb-6`}>
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-3 text-[13px] font-medium text-gray-500">
          {data.email && (
            <span className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
              <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
            </span>
          )}
          {data.phone && (
            <span className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
              <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
            </span>
          )}
          {data.location && (
            <span className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
              <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
            </span>
          )}
          {data.linkedin && (
            <span className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
              <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
            </span>
          )}
          {data.github && (
            <span className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
              <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
            </span>
          )}
        </div>
      </header>

      <div>
        {orderedSections.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout12;
