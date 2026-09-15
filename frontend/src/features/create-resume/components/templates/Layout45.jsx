import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 45: Luxury Executive Resume
const Layout45 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-zinc-800';
  const accentBorder = theme?.border || 'border-zinc-800';

  const SectionHeading = ({ title }) => (
    <div className="mb-8 flex items-center justify-center">
      <div className={`h-px bg-zinc-200 flex-1`}></div>
      <h2 className={`font-serif text-[12px] uppercase tracking-[0.4em] text-zinc-500 px-6 font-medium`}>
        {title}
      </h2>
      <div className={`h-px bg-zinc-200 flex-1`}></div>
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-16">
            <p className="font-serif text-[17px] leading-[2] text-zinc-700 text-center max-w-4xl mx-auto italic">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Executive profile statement..." multiline />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-16">
            <SectionHeading title="Executive Experience" />
            <div className="space-y-12 max-w-4xl mx-auto">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2">
                    <div>
                      <h3 className={`font-serif text-[20px] text-zinc-900 ${accentText}`}>
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company Name" />
                      </h3>
                      <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Executive Title" />
                      </h4>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Tenure" />
                      </div>
                      {exp.location && (
                        <div className="font-serif text-[13px] text-zinc-500 italic mt-0.5">
                          <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-serif text-[14px] leading-relaxed text-zinc-600 mt-4 whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Key responsibilities and strategic impact..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-16">
            <SectionHeading title="Education" />
            <div className="space-y-8 max-w-4xl mx-auto">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <h3 className="font-serif text-[18px] text-zinc-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </div>
                  </div>
                  <div className="font-serif text-[14px] italic text-zinc-400 mt-2 md:mt-0">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Year" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-16">
            <SectionHeading title="Strategic Initiatives" />
            <div className="space-y-8 max-w-4xl mx-auto">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif text-[18px] text-zinc-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Initiative Name" />
                    </h3>
                    {proj.link && (
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-300">
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Reference Link" />
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-[14px] leading-relaxed text-zinc-600 whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Strategic impact..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-16">
            <SectionHeading title="Core Competencies" />
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-4xl mx-auto">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-16">
            <SectionHeading title="Honors & Awards" />
            <div className="space-y-6 max-w-4xl mx-auto text-center">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break">
                  <h3 className="font-serif text-[16px] text-zinc-900 mb-1">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Award Title" />
                  </h3>
                  {ach.desc && (
                    <div className="font-serif text-[14px] text-zinc-500 italic whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-16">
            <SectionHeading title="Languages" />
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-4xl mx-auto">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-center">
                  <div className="font-serif text-[16px] text-zinc-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </div>
                  <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-16">
            <SectionHeading title="Certifications" />
            <div className="space-y-6 max-w-4xl mx-auto text-center">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break">
                  <div className="font-serif text-[16px] text-zinc-900">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
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
          <section key="interests" className="mb-16">
            <SectionHeading title="Interests" />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-4xl mx-auto">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="font-serif text-[14px] text-zinc-500 italic">
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-3 text-zinc-300 not-italic">•</span>}
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#fafafa] min-h-[297mm] px-12 md:px-20 py-20 font-sans antialiased selection:bg-zinc-200">
      
      {/* Luxury Header */}
      <header className="mb-16 text-center">
        <h1 className={`font-serif text-5xl md:text-[56px] text-zinc-900 tracking-tight leading-none mb-6 ${accentText}`}>
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Executive Name" />
        </h1>
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-8">
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Executive Title" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-serif text-[13px] text-zinc-500">
          {data.email && <span className="hover:text-zinc-800 transition-colors"><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></span>}
          {(data.email && data.phone) && <span className="text-zinc-300">|</span>}
          {data.phone && <span className="hover:text-zinc-800 transition-colors"><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></span>}
          {((data.email || data.phone) && data.location) && <span className="text-zinc-300">|</span>}
          {data.location && <span className="hover:text-zinc-800 transition-colors"><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-serif text-[13px] text-zinc-500 mt-3">
          {data.linkedin && <span className="hover:text-zinc-800 transition-colors"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
          {(data.linkedin && data.github) && <span className="text-zinc-300">|</span>}
          {data.github && <span className="hover:text-zinc-800 transition-colors"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout45;
