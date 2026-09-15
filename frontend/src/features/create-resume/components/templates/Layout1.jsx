import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 1: Professional Left Sidebar Resume
// Large left sidebar: photo + contact + skills + languages + certifications
// Main right panel: summary + experience + education + projects + achievements
const Layout1 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const sidebarBg = theme?.bgPrimary || 'bg-blue-800';
  const accentText = theme?.primary || 'text-blue-800';
  const accentBorder = theme?.border || 'border-blue-800';

  const sidebarSections = ['skills', 'languages', 'certifications', 'interests'];
  const mainSections = ['summary', 'experience', 'education', 'projects', 'achievements'];
  const sidebar = sectionsOrder.filter(s => sidebarSections.includes(s));
  const main = sectionsOrder.filter(s => mainSections.includes(s));

  const renderSidebarSection = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-white/20"></span>Skills<span className="flex-1 h-px bg-white/20"></span>
            </h2>
            <div className="flex flex-col gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/60 shrink-0"></div>
                  <span className="text-xs text-white/90 font-medium leading-snug">
                    <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-white/20"></span>Languages<span className="flex-1 h-px bg-white/20"></span>
            </h2>
            <div className="space-y-1.5">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between text-xs">
                  <span className="font-semibold text-white/90">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-white/50 italic">
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-white/20"></span>Certifications<span className="flex-1 h-px bg-white/20"></span>
            </h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <span className="text-xs font-semibold text-white/90 block leading-snug">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-[10px] text-white/50">
                    <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                  </span>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
              <span className="flex-1 h-px bg-white/20"></span>Interests<span className="flex-1 h-px bg-white/20"></span>
            </h2>
            <div className="text-xs text-white/80 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-white/30 mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  const renderMainSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.22em] ${accentText} whitespace-nowrap`}>Professional Summary</h2>
              <div className={`flex-1 h-[1.5px] ${accentBorder.replace('border', 'bg')}`}></div>
            </div>
            <div className="text-[11px] leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Write your professional summary..." multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.22em] ${accentText} whitespace-nowrap`}>Work Experience</h2>
              <div className={`flex-1 h-[1.5px] ${accentBorder.replace('border', 'bg')}`}></div>
            </div>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-[13px] text-gray-900 leading-tight">
                        <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                        <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company Name" />
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap uppercase tracking-wider mt-0.5 shrink-0">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[11px] mt-1.5 text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Job Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.22em] ${accentText} whitespace-nowrap`}>Education</h2>
              <div className={`flex-1 h-[1.5px] ${accentBorder.replace('border', 'bg')}`}></div>
            </div>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School/University" />
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap uppercase tracking-wider mt-0.5 shrink-0">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.22em] ${accentText} whitespace-nowrap`}>Projects</h2>
              <div className={`flex-1 h-[1.5px] ${accentBorder.replace('border', 'bg')}`}></div>
            </div>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className={`text-[10px] ${accentText} font-medium`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </span>}
                  </div>
                  <div className="text-[11px] mt-1 text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Project Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.22em] ${accentText} whitespace-nowrap`}>Achievements</h2>
              <div className={`flex-1 h-[1.5px] ${accentBorder.replace('border', 'bg')}`}></div>
            </div>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </h3>
                  <div className="text-[11px] text-gray-600 mt-0.5 whitespace-pre-wrap">
                    <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans flex">
      {/* Left Sidebar — colored, wide */}
      <div className={`w-[35%] ${sidebarBg} flex flex-col shrink-0`}>
        {/* Top profile area */}
        <div className="px-7 pt-10 pb-6 flex flex-col items-center text-center">
          {data.photo ? (
            <img
              src={data.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/25 shadow-lg mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/15 border-4 border-white/25 mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          )}
          <h1 className="text-lg font-black text-white leading-tight uppercase tracking-wide">
            <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
          </h1>
          <p className="text-[10px] font-light tracking-[0.2em] text-white/65 uppercase mt-1.5">
            <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
          </p>
        </div>

        {/* Contact info */}
        <div className="px-7 py-4 border-t border-white/15">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
            <span className="flex-1 h-px bg-white/20"></span>Contact<span className="flex-1 h-px bg-white/20"></span>
          </h2>
          <div className="space-y-1.5 text-[11px] text-white/80">
            {data.email && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-white/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="break-all"><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-white/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>
              </div>
            )}
            {data.location && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-white/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>
              </div>
            )}
            {data.linkedin && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-white/50 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span className="break-all"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
              </div>
            )}
            {data.github && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-white/50 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                <span className="break-all"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>
              </div>
            )}
            {data.portfolio && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 text-white/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                <span className="break-all"><EditableField value={data.portfolio} onSave={(val) => handleInlineEdit('portfolio', val)} placeholder="Portfolio" /></span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar sections */}
        <div className="px-7 py-4 flex-1">
          {sidebar.map(sectionId => renderSidebarSection(sectionId))}
        </div>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Top accent strip */}
        <div className={`h-1.5 w-full ${sidebarBg}`}></div>
        <div className="px-8 pt-8 pb-8 flex-1">
          {main.map(sectionId => renderMainSection(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default Layout1;
