import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 20: Modern Asymmetric Resume
const Layout20 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-violet-700';
  const accentBg = theme?.bgPrimary || 'bg-violet-700';
  const accentLight = theme?.bgLight || 'bg-violet-50';

  const renderSectionContent = (sectionId, customClass = '') => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-4`}>
              Profile
            </h2>
            <div className="text-[16px] font-medium leading-relaxed text-gray-800">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Overview..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center`}>
              Experience <span className={`ml-4 h-px flex-1 bg-gray-200`}></span>
            </h2>
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="relative pl-6">
                  <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full ${accentBg}`}></div>
                  <div className="flex flex-col md:flex-row md:items-baseline mb-2">
                    <h3 className="font-bold text-[16px] text-gray-900 mr-4">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <div className={`text-[13px] font-bold ${accentText} mt-1 md:mt-0`}>
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-gray-500 font-normal ml-2">
                          <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                  </div>
                  <div className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center`}>
              Education <span className={`ml-4 h-px flex-1 bg-gray-200`}></span>
            </h2>
            <div className="space-y-5">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                  <h3 className="font-bold text-[15px] text-gray-900 mb-1">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </h3>
                  <div className={`text-[13px] font-medium ${accentText}`}>
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center`}>
              Projects <span className={`ml-4 h-px flex-1 bg-gray-200`}></span>
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <h3 className="font-bold text-[15px] text-gray-900 mb-1 flex justify-between items-center">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                    {proj.link && (
                      <span className={`text-[11px] font-bold ${accentText} bg-gray-50 px-2 py-0.5 rounded ml-2`}>
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                      </span>
                    )}
                  </h3>
                  <div className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-5`}>
              Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`text-[13px] font-bold text-gray-800 ${accentLight} px-4 py-2 rounded-lg`}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-5`}>
              Certifications
            </h2>
            <div className="space-y-4">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <div className="font-bold text-[14px] text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-[12px] text-gray-500 font-medium mt-0.5">
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
          <div key="languages" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-5`}>
              Languages
            </h2>
            <div className="space-y-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-end border-b border-gray-100 pb-1">
                  <span className="font-bold text-[14px] text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${accentText}`}>
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
          <div key="achievements" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-5`}>
              Awards & Honors
            </h2>
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="font-bold text-[14px] text-gray-900 mb-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-[13px] text-gray-600 leading-relaxed">
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
          <div key="interests" className={`mb-12 ${customClass}`}>
            <h2 className={`text-[12px] font-black uppercase tracking-widest text-gray-400 mb-5`}>
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-white border border-gray-200 text-gray-700 text-[13px] font-medium px-3 py-1 rounded">
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

  // Modern Asymmetric Grid:
  // Left narrow column, Right wide column.
  // We place some dense items left, and main timeline right.
  const leftColSections = ['skills', 'education', 'certifications', 'languages', 'interests', 'achievements'];
  const rightColSections = ['summary', 'experience', 'projects'];

  const left = sectionsOrder.filter(s => leftColSections.includes(s));
  const right = sectionsOrder.filter(s => rightColSections.includes(s));
  const other = sectionsOrder.filter(s => !leftColSections.includes(s) && !rightColSections.includes(s));

  return (
    <div className="w-full bg-[#f8f9fa] min-h-[297mm] font-sans overflow-hidden">
      
      <div className="flex flex-col md:flex-row h-full min-h-[297mm]">
        {/* Left Column (Narrower, ~35%) */}
        <div className="w-full md:w-[35%] bg-white p-8 md:p-10 border-r border-gray-100 flex flex-col relative">
          
          {/* Header area - nested in the left column for an asymmetric layout */}
          <div className="mb-14 relative z-10">
            {data.photo && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 rotate-[-2deg]">
                <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 leading-none">
              <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
            </h1>
            <div className={`text-[15px] font-bold ${accentText} mb-6`}>
              <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
            </div>
            
            <div className="space-y-3 text-[12px] font-medium text-gray-500">
              {data.email && (
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md ${accentLight} flex items-center justify-center ${accentText}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="truncate"><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></div>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md ${accentLight} flex items-center justify-center ${accentText}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></div>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md ${accentLight} flex items-center justify-center ${accentText}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></div>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md ${accentLight} flex items-center justify-center ${accentText} font-black text-[10px]`}>
                    in
                  </div>
                  <div className="truncate"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></div>
                </div>
              )}
              {data.github && (
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md ${accentLight} flex items-center justify-center ${accentText} font-black text-[10px]`}>
                    gh
                  </div>
                  <div className="truncate"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            {left.map(sectionId => renderSectionContent(sectionId))}
          </div>

        </div>

        {/* Right Column (Wider, ~65%) */}
        <div className="w-full md:w-[65%] p-8 md:p-12 md:pt-20">
          
          <div className="max-w-2xl">
            {right.map(sectionId => renderSectionContent(sectionId))}
            {other.map(sectionId => renderSectionContent(sectionId))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Layout20;
