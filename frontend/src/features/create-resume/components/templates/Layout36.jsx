import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 36: Creative Split Timeline Resume
const Layout36 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-indigo-600';
  const accentText = theme?.primary || 'text-indigo-600';
  const accentBorder = theme?.border || 'border-indigo-600';

  const ContactIcon = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 text-sm text-gray-200">
      <span className="opacity-80">{Icon}</span>
      {children}
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-10">
            <h2 className="text-4xl font-extrabold text-gray-100 opacity-20 uppercase -ml-4 -mb-4 pointer-events-none select-none tracking-widest">About</h2>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl relative z-10 text-gray-300 text-sm leading-loose">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary..." multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-12 relative">
            <h2 className="text-5xl font-black text-gray-100 opacity-30 uppercase -mb-6 -ml-4 pointer-events-none select-none tracking-tighter">Experience</h2>
            <div className="relative z-10 pl-4 border-l-2 border-gray-300 ml-4 space-y-8 mt-8">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="relative pdf-no-break">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${accentBg} ring-4 ring-white`} />
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                      </h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${accentBg} text-white mt-2 sm:mt-0`}>
                        <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${accentText} mb-3`}>
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-gray-500 font-normal ml-2">
                          | <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Role description..." multiline />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-12 relative">
            <h2 className="text-5xl font-black text-gray-100 opacity-30 uppercase -mb-6 -ml-4 pointer-events-none select-none tracking-tighter">Education</h2>
            <div className="relative z-10 pl-4 border-l-2 border-gray-300 ml-4 space-y-6 mt-8">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="relative pdf-no-break">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${accentBg} ring-4 ring-white`} />
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[15px] text-gray-900">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="School" />
                    </h3>
                    <div className="text-sm font-medium text-gray-700 mt-1">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </div>
                    <div className={`text-xs font-semibold ${accentText} mt-2`}>
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-12 relative">
            <h2 className="text-5xl font-black text-gray-100 opacity-30 uppercase -mb-6 -ml-4 pointer-events-none select-none tracking-tighter">Projects</h2>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-t-4 ${accentBorder} pdf-no-break`}>
                  <h3 className="font-bold text-[15px] text-gray-900 mb-1">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Title" />
                  </h3>
                  {proj.link && (
                    <div className="text-xs text-gray-500 mb-3 truncate">
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project description..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-10">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="bg-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-gray-700">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-10">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">Languages</h2>
            <div className="space-y-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <span className="font-semibold text-gray-200 text-sm">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className={`text-xs font-medium ${accentText} bg-white/10 px-2 py-1 rounded`}>
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-10">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">Certifications</h2>
            <div className="space-y-4">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                  <div className="font-semibold text-gray-200 text-sm">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-xs text-gray-400 mt-1">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-12 relative">
            <h2 className="text-5xl font-black text-gray-100 opacity-30 uppercase -mb-6 -ml-4 pointer-events-none select-none tracking-tighter">Awards</h2>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 pdf-no-break">
                  <h3 className="font-bold text-[14px] text-gray-900 mb-1">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </h3>
                  {ach.desc && (
                    <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-10">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-gray-700">
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  const leftColumnSections = ['summary', 'skills', 'languages', 'certifications', 'interests'];
  const rightColumnSections = ['experience', 'education', 'projects', 'achievements'];

  return (
    <div className="flex flex-col md:flex-row min-h-[297mm] bg-gray-50 font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-full md:w-[32%] bg-gray-900 text-gray-100 p-8 flex flex-col relative overflow-hidden shrink-0">
        <div className={`absolute top-0 right-0 w-32 h-32 ${accentBg} rounded-bl-full opacity-20 pointer-events-none`}></div>
        
        {/* Header Profile */}
        <div className="mb-12 relative z-10">
          <h1 className="text-4xl font-black text-white leading-tight mb-2 tracking-tight">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
          </h1>
          <div className={`text-lg font-medium ${accentText} tracking-wide`}>
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-12 relative z-10 pb-8 border-b border-gray-800">
          {data.email && <ContactIcon icon="@"><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></ContactIcon>}
          {data.phone && <ContactIcon icon="📱"><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></ContactIcon>}
          {data.location && <ContactIcon icon="📍"><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></ContactIcon>}
          {data.linkedin && <ContactIcon icon="in"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></ContactIcon>}
          {data.github && <ContactIcon icon="gh"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></ContactIcon>}
        </div>

        {/* Sidebar Sections */}
        <div className="relative z-10 flex-1">
          {sectionsOrder.filter(s => leftColumnSections.includes(s)).map(id => renderSection(id))}
        </div>
      </aside>

      {/* Right Content */}
      <main className="flex-1 p-8 md:p-12 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        {sectionsOrder.filter(s => rightColumnSections.includes(s)).map(id => renderSection(id))}
      </main>

    </div>
  );
};

export default Layout36;
