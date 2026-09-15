import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 5: Creative Designer Resume
// Modern creative layout, stylish header, unique profile section
// Card-style skill section, beautiful section dividers, portfolio-style appearance
const Layout5 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const headerBg = theme?.bgPrimary || 'bg-emerald-600';
  const accentText = theme?.primary || 'text-emerald-600';
  const accentBorder = theme?.border || 'border-emerald-600';
  const accentBgLight = theme?.bgLight || 'bg-emerald-50';

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">About Me</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className={`text-[11px] leading-relaxed text-gray-600 pl-11`}>
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Write your professional summary..." multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Experience</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="relative">
                  {/* Card-style entry */}
                  <div className={`rounded-lg border border-gray-100 p-3.5 bg-white shadow-sm`}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-[13px] text-gray-900 leading-tight">
                        <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${accentBgLight} ${accentText}`}>
                        <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                      </span>
                    </div>
                    <p className={`text-[11px] font-semibold ${accentText} mb-1.5`}>
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company Name" />
                    </p>
                    <div className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Job Description" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Education</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 space-y-3">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className={`rounded-lg border-l-4 ${accentBorder} pl-4 py-2 pr-3 ${accentBgLight}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-[12px] text-gray-900 leading-tight">
                        <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                        <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School/University" />
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap mt-0.5 shrink-0">
                      <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Skills</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            {/* Card-style skill chips */}
            <div className="pl-11 flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span
                  key={idx}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${accentBorder} ${accentText} ${accentBgLight} shadow-sm`}
                >
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Projects</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 grid grid-cols-1 gap-3">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="rounded-lg border border-gray-100 p-3.5 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[12px] text-gray-900 leading-tight">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className={`text-[10px] ${accentText} font-medium whitespace-nowrap shrink-0`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </span>}
                  </div>
                  <div className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Project Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Certifications</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 grid grid-cols-2 gap-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className={`rounded-lg p-2.5 ${accentBgLight} border ${accentBorder} border-opacity-30`}>
                  <span className="font-semibold text-[11px] text-gray-900 block leading-snug">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-[10px] text-gray-500">
                    <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                  </span>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Achievements</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${headerBg} mt-1.5 shrink-0`}></div>
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                    </h3>
                    <div className="text-[11px] text-gray-600 mt-0.5 whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Languages</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 flex flex-wrap gap-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${accentBorder} ${accentBgLight}`}>
                  <span className={`text-[11px] font-bold ${accentText}`}>
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-[10px] text-gray-500">
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${headerBg} flex items-center justify-center shrink-0`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Interests</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="pl-11 flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-[11px] text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-[297mm] font-sans">
      {/* Creative stylish header */}
      <header className={`${headerBg} relative overflow-hidden`}>
        {/* Abstract decorative shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 px-10 py-8">
          <div className="flex items-center gap-6">
            {/* Profile section */}
            <div className="flex items-center gap-5">
              {data.photo ? (
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-2xl shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/15 border-4 border-white/25 flex items-center justify-center shrink-0">
                  <svg className="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-white leading-tight tracking-tight">
                  <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
                </h1>
                <p className="text-[11px] font-light tracking-[0.3em] text-white/65 uppercase mt-1">
                  <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Creative Professional" />
                </p>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="w-px h-16 bg-white/20 mx-2"></div>

            {/* Contact details — grid style */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 flex-1">
              {data.email && <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                <svg className="w-3 h-3 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="truncate"><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>
              </div>}
              {data.phone && <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                <svg className="w-3 h-3 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>
              </div>}
              {data.location && <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                <svg className="w-3 h-3 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>
              </div>}
              {data.linkedin && <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                <svg className="w-3 h-3 text-white/50 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span className="truncate"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
              </div>}
              {data.github && <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                <svg className="w-3 h-3 text-white/50 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                <span className="truncate"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>
              </div>}
              {data.portfolio && <div className="flex items-center gap-1.5 text-[10px] text-white/75">
                <svg className="w-3 h-3 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                <span className="truncate"><EditableField value={data.portfolio} onSave={(val) => handleInlineEdit('portfolio', val)} placeholder="Portfolio" /></span>
              </div>}
            </div>
          </div>
        </div>
      </header>

      {/* Body with slight background */}
      <div className="px-10 py-8">
        {sectionsOrder.map(sectionId => renderSection(sectionId))}
      </div>
    </div>
  );
};

export default Layout5;
