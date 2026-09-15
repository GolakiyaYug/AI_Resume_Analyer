import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 37: Executive Corporate Resume
const Layout37 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-slate-800';
  const accentText = theme?.primary || 'text-slate-800';
  const accentBorder = theme?.border || 'border-slate-800';

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-10 text-center px-12">
            <div className="inline-block border-t-2 border-b-2 border-gray-300 py-6">
              <p className="text-sm text-gray-700 leading-loose max-w-3xl mx-auto font-serif italic">
                <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Executive profile summary..." multiline />
              </p>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-10">
            <h2 className={`text-lg font-bold ${accentText} uppercase tracking-[0.2em] mb-6 pb-2 border-b-2 ${accentBorder}`}>Executive Experience</h2>
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Position Title" />
                    </h3>
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-sm">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date Period" />
                    </span>
                  </div>
                  <div className={`text-sm font-bold ${accentText} mb-3`}>
                    <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company Name" />
                    {exp.location && (
                      <span className="text-gray-500 font-normal ml-2">
                        — <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ml-4 border-l border-gray-200 pl-4">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Key achievements and responsibilities..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-10">
            <h2 className={`text-lg font-bold ${accentText} uppercase tracking-[0.2em] mb-6 pb-2 border-b-2 ${accentBorder}`}>Education</h2>
            <div className="space-y-6">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-[15px]">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <span className="text-sm font-semibold text-gray-500">
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Year" />
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="University/Institution" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-10">
            <h2 className={`text-lg font-bold ${accentText} uppercase tracking-[0.2em] mb-6 pb-2 border-b-2 ${accentBorder}`}>Key Initiatives</h2>
            <div className="space-y-6">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break">
                  <h3 className="font-bold text-gray-900 text-[15px] mb-1">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Initiative Name" />
                  </h3>
                  {proj.link && (
                    <div className={`text-xs font-medium ${accentText} mb-2`}>
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Reference Link" />
                    </div>
                  )}
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ml-4 border-l border-gray-200 pl-4">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Initiative description and impact..." multiline />
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
            <h2 className={`text-[13px] font-bold ${accentText} uppercase tracking-widest mb-4`}>Core Competencies</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {data.skills?.map((skill, idx) => skill && (
                <li key={idx} className="flex items-center text-sm text-gray-700 before:content-['▹'] before:mr-2 before:text-gray-400">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </li>
              ))}
            </ul>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-10">
            <h2 className={`text-[13px] font-bold ${accentText} uppercase tracking-widest mb-4`}>Languages</h2>
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-800 text-sm">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
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
            <h2 className={`text-[13px] font-bold ${accentText} uppercase tracking-widest mb-4`}>Certifications</h2>
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-sm">
                  <div className="font-bold text-gray-800">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-xs text-gray-500 mt-0.5">
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
          <section key="achievements" className="mb-10">
            <h2 className={`text-[13px] font-bold ${accentText} uppercase tracking-widest mb-4`}>Key Honors</h2>
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Honor/Award" />
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
            <h2 className={`text-[13px] font-bold ${accentText} uppercase tracking-widest mb-4`}>Interests</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="inline-block mr-4 mb-2 bg-gray-50 px-3 py-1 border border-gray-200">
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  const leftColumnSections = ['skills', 'education', 'certifications', 'languages', 'achievements', 'interests'];
  const rightColumnSections = ['experience', 'projects'];

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">
      
      {/* Executive Header */}
      <header className={`px-12 py-16 ${accentBg} text-center`}>
        <h1 className="text-5xl font-light text-white tracking-widest uppercase mb-4">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="First Last" />
        </h1>
        <div className="text-lg text-white/80 uppercase tracking-[0.3em] font-semibold mb-6">
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Executive Title" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/90">
          {data.email && <span><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></span>}
          {data.phone && <span><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></span>}
          {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
          {data.linkedin && <span><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
          {data.github && <span><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
        </div>
      </header>

      {/* Summary spans full width */}
      <div className="pt-10">
        {sectionsOrder.includes('summary') && renderSection('summary')}
      </div>

      {/* Two Column Content */}
      <div className="px-12 pb-12 flex flex-col md:flex-row gap-12">
        
        {/* Left Column (Narrower) */}
        <aside className="w-full md:w-1/3">
          {sectionsOrder.filter(s => leftColumnSections.includes(s)).map(id => renderSection(id))}
        </aside>

        {/* Right Column (Wider) */}
        <main className="w-full md:w-2/3">
          {sectionsOrder.filter(s => rightColumnSections.includes(s)).map(id => renderSection(id))}
        </main>
        
      </div>
    </div>
  );
};

export default Layout37;
