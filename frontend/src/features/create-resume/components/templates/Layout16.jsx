import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 16: Infographic Resume
const Layout16 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-amber-500';
  const accentText = theme?.primary || 'text-amber-600';
  const textMuted = 'text-gray-500';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-10 relative pl-8">
            <div className={`absolute left-0 top-0 w-2 h-full ${accentBg} rounded-full`}></div>
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-2">Profile Overview</h2>
            <div className="text-[14px] leading-relaxed text-gray-700 italic">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-10 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h2 className="text-lg font-black uppercase tracking-wide text-gray-800">Experience Map</h2>
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${accentBg} text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-wrap justify-between items-baseline mb-1 gap-2">
                      <h3 className="font-bold text-gray-900 text-[15px]">
                        <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                      </h3>
                      <div className={`text-xs font-bold ${accentText} bg-amber-50 px-2 py-0.5 rounded`}>
                        <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                      </div>
                    </div>
                    <div className="text-[13px] font-semibold text-gray-800 mb-2">
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-gray-500 font-normal ml-1">
                          • <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                    </div>
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
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
              </div>
              <h2 className="text-lg font-black uppercase tracking-wide text-gray-800">Education Timeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="bg-gray-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm">
                  <h3 className="font-bold text-[14px] text-gray-900 leading-snug mb-1">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </h3>
                  <div className="text-[13px] text-gray-800 font-medium mb-2">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </div>
                  <div className={`inline-block text-[11px] font-bold uppercase tracking-wider ${accentText} bg-white px-2 py-1 rounded border border-gray-200`}>
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h2 className="text-lg font-black uppercase tracking-wide text-gray-800">Project Highlights</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className={`h-2 w-full ${accentBg}`}></div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-[15px] text-gray-900 mb-1">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                    </h3>
                    {proj.link && (
                      <div className={`text-[12px] font-semibold ${accentText} mb-2 truncate flex items-center gap-1`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                      </div>
                    )}
                    <div className="text-[13px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
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
          <div key="skills" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h2 className="text-lg font-black uppercase tracking-wide text-gray-800">Skill Cloud</h2>
            </div>
            <div className="flex flex-wrap gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${accentBg}`}></div>
                  <span className="text-[14px] font-bold text-gray-700">
                    <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  </span>
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center text-white font-bold shadow-sm`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              </div>
              <h2 className="text-[15px] font-black uppercase tracking-wide text-gray-800">Certifications</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-center text-[13px] bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                  <span className="font-bold text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
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
          <div key="languages" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center text-white font-bold shadow-sm`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <h2 className="text-[15px] font-black uppercase tracking-wide text-gray-800">Languages</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pl-11">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex flex-col text-center">
                  <div className="font-bold text-gray-900 text-[14px]">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 mb-1 overflow-hidden">
                    {/* Visual indicator (mock progress) */}
                    <div className={`h-full ${accentBg}`} style={{width: '75%'}}></div>
                  </div>
                  <span className={`text-[11px] font-semibold ${accentText} uppercase`}>
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
          <div key="achievements" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center text-white font-bold shadow-sm`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              </div>
              <h2 className="text-[15px] font-black uppercase tracking-wide text-gray-800">Achievements</h2>
            </div>
            <div className="space-y-4 pl-11">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[13px] bg-white p-3 rounded-lg border border-gray-100 shadow-sm border-l-4 border-l-amber-400">
                  <div className="font-bold text-gray-900 mb-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-gray-600">
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
          <div key="interests" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center text-white font-bold shadow-sm`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <h2 className="text-[15px] font-black uppercase tracking-wide text-gray-800">Interests</h2>
            </div>
            <div className="pl-11 flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-gray-100 text-gray-800 text-[13px] font-medium px-4 py-1.5 rounded-full border border-gray-200">
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
    <div className="w-full bg-white min-h-[297mm] font-sans">
      {/* Header Infographic block */}
      <header className={`relative ${accentBg} text-white pt-16 pb-12 px-10 overflow-hidden`}>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {data.photo && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-sm">
              <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
            </h1>
            <div className="text-lg md:text-xl font-medium text-white/90 tracking-widest uppercase bg-black/20 inline-block px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
              <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[13px] font-medium text-white">
              {data.email && (
                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-md backdrop-blur-sm">
                  <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
                </span>
              )}
              {data.phone && (
                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-md backdrop-blur-sm">
                  <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                  <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
                </span>
              )}
              {data.location && (
                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-md backdrop-blur-sm">
                  <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                  <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
                </span>
              )}
              {data.linkedin && (
                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-md backdrop-blur-sm">
                  <span className="font-black text-[10px] uppercase opacity-70">in</span>
                  <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
                </span>
              )}
              {data.github && (
                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-md backdrop-blur-sm">
                  <span className="font-black text-[10px] uppercase opacity-70">gh</span>
                  <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default Layout16;
