import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 10: Modern Grid
const Layout10 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-teal-700';
  const accentText = theme?.primary || 'text-teal-700';
  const cardBg = 'bg-white';
  const cardBorder = 'border border-gray-200';
  const cardShadow = 'shadow-sm';

  const fullWidthSections = ['summary', 'experience', 'projects'];
  const halfWidthSections = ['education', 'skills', 'certifications', 'languages', 'achievements', 'interests'];

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className={`col-span-1 md:col-span-2 p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-3 flex items-center gap-2`}>
              Profile
            </h2>
            <div className="text-sm leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className={`col-span-1 md:col-span-2 p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-5`}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="border-l-2 border-gray-100 pl-4 relative">
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full ${cardBg} border-2 border-gray-200`}></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-[15px] text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="mb-2 text-sm font-medium text-gray-800">
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    {exp.location && (
                      <span className="text-gray-500 font-normal ml-2 text-xs">
                        (<EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
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
          <div key="projects" className={`col-span-1 md:col-span-2 p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-5`}>
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-[14px] text-gray-900 mb-1">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                  </h3>
                  {proj.link && (
                    <div className={`text-xs ${accentText} font-medium mb-2 truncate`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
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
          <div key="education" className={`p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-4`}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <h3 className="font-bold text-[14px] text-gray-900 leading-tight">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </h3>
                  <div className="text-sm text-gray-700 mt-1">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className={`p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-4`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`px-2.5 py-1 text-xs font-semibold ${accentText} bg-gray-50 border border-gray-100 rounded-md`}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className={`p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-4`}>
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <div className="font-medium text-[13px] text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className={`p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-4`}>
              Languages
            </h2>
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-center text-[13px]">
                  <strong className="font-semibold text-gray-800">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  <span className="text-gray-600 bg-gray-50 px-2 rounded">
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
          <div key="achievements" className={`p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-4`}>
              Achievements
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="font-bold text-[13px] text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-xs text-gray-600 mt-1 leading-relaxed">
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
          <div key="interests" className={`p-6 rounded-xl ${cardBg} ${cardBorder} ${cardShadow}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide ${accentText} mb-4`}>
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-[13px] text-gray-700 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
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

  return (
    <div className="w-full bg-gray-50 min-h-[297mm] font-sans p-6 sm:p-8">
      {/* Grid Header */}
      <header className={`rounded-2xl ${accentBg} text-white p-8 mb-6 shadow-md`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
            </h1>
            <div className="text-lg font-medium text-white/90 tracking-wide uppercase">
              <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/80 font-medium">
            {data.email && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">@</span>
                <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">#</span>
                <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">📍</span>
                <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
              </div>
            )}
            {data.linkedin && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">in</span>
                <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
              </div>
            )}
            {data.github && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">gh</span>
                <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout10;
