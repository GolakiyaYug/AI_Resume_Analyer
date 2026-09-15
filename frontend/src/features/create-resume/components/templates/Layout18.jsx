import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 18: Project Focus Resume
const Layout18 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-emerald-700';
  const accentBg = theme?.bgPrimary || 'bg-emerald-700';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-[14px] leading-relaxed text-gray-700 font-medium">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Overview..." multiline />
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-10">
            <h2 className={`text-[15px] font-black uppercase tracking-widest ${accentText} mb-6 border-b-2 border-gray-200 pb-2 flex items-center`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Key Projects & Initiatives
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  {/* Left decorative or numeric area */}
                  <div className={`hidden md:flex flex-col items-center justify-center w-16 ${accentBg} text-white font-black text-2xl`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  {/* Project Content */}
                  <div className="p-5 flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                      <h3 className="font-bold text-[18px] text-gray-900 leading-tight">
                        <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                      </h3>
                      {proj.link && (
                        <div className={`text-[12px] font-bold ${accentText} bg-emerald-50 px-3 py-1 rounded-full whitespace-nowrap`}>
                          <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Project Link" />
                        </div>
                      )}
                    </div>
                    <div className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed mt-3 border-l-4 border-gray-200 pl-4">
                      <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Detailed description of the project, architecture, and impact..." multiline />
                    </div>
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
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[14px] text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Role" />
                    </h3>
                    <div className="text-[12px] font-bold text-gray-500 uppercase">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </div>
                  </div>
                  <div className="text-[13px] font-medium text-gray-700 mb-2">
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    {exp.location && (
                      <span className="text-gray-400 font-normal ml-1">
                        | <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-gray-600 whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-8">
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="bg-gray-100 text-gray-800 text-[12px] font-bold px-3 py-1.5 rounded border border-gray-200">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-8">
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Education
            </h2>
            <div className="space-y-3">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="font-bold text-[13px] text-gray-900">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </div>
                  <div className="text-[13px] text-gray-700">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </div>
                  <div className="text-[12px] font-semibold text-gray-500 uppercase">
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
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-[13px]">
                  <span className="font-bold text-gray-900 block">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-[12px] text-gray-500 font-semibold uppercase">
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
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-[13px] flex justify-between">
                  <span className="font-bold text-gray-800">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-gray-500">
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
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Achievements
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[13px]">
                  <div className="font-bold text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-gray-600 mt-0.5">
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
            <h2 className={`text-[13px] font-black uppercase tracking-widest ${accentText} mb-4 border-b border-gray-200 pb-2`}>
              Interests
            </h2>
            <div className="flex flex-wrap gap-2 text-[13px] text-gray-700">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-1 text-gray-300">,</span>}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Enforce Projects near the top for Project Focus structure
  const customOrder = ['summary', 'projects', 'skills', 'experience', 'education', 'certifications', 'achievements', 'languages', 'interests'];
  const orderedSections = customOrder.filter(s => sectionsOrder.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans p-10 max-w-5xl mx-auto">
      <header className="mb-10 text-center flex flex-col items-center border-b-4 border-gray-900 pb-8">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className={`text-xl font-bold uppercase tracking-widest ${accentText} mb-6`}>
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-[13px] font-bold text-gray-500 uppercase">
          {data.email && (
            <span><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>
          )}
          {data.phone && (
            <><span className="w-1 h-1 rounded-full bg-gray-300"></span><span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span></>
          )}
          {data.location && (
            <><span className="w-1 h-1 rounded-full bg-gray-300"></span><span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span></>
          )}
          {data.linkedin && (
            <><span className="w-1 h-1 rounded-full bg-gray-300"></span><span>IN: <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span></>
          )}
          {data.github && (
            <><span className="w-1 h-1 rounded-full bg-gray-300"></span><span>GH: <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span></>
          )}
        </div>
      </header>

      {/* Grid: 1 column full width for top elements (summary, projects), then 2 columns for the rest */}
      <div>
        {/* Full width components */}
        <div>
          {orderedSections.filter(s => ['summary', 'projects'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
        </div>
        
        {/* Two column split for remaining */}
        <div className="flex flex-col md:flex-row gap-10 mt-6">
          <div className="w-full md:w-1/2">
            {orderedSections.filter(s => ['experience', 'languages'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
          </div>
          <div className="w-full md:w-1/2">
            {orderedSections.filter(s => ['skills', 'education', 'certifications', 'achievements', 'interests'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout18;
