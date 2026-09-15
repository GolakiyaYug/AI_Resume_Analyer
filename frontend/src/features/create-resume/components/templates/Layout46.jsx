import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 46: Newspaper Editorial Resume
const Layout46 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-stone-900';
  const accentBorder = theme?.border || 'border-stone-900';

  const SectionTitle = ({ title }) => (
    <h2 className="font-serif text-[20px] font-black uppercase text-stone-900 tracking-tight border-b-4 border-stone-900 pb-1 mb-4">
      {title}
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-8 col-span-1 md:col-span-12 border-b-2 border-stone-300 pb-6">
            <h2 className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-2">Exclusive Profile</h2>
            <p className="font-serif text-[18px] md:text-[22px] leading-relaxed text-stone-900 font-semibold drop-cap">
              <span className="float-left text-[60px] leading-[45px] font-black pr-2 pt-2 text-stone-900">
                {data.summary ? data.summary.charAt(0) : 'T'}
              </span>
              <EditableField value={data.summary ? data.summary.substring(1) : ''} onSave={v => handleInlineEdit('summary', (data.summary?.charAt(0) || 'T') + v)} placeholder="he executive profile details..." multiline />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-8 col-span-1 md:col-span-8 pr-0 md:pr-6 md:border-r border-stone-300">
            <SectionTitle title="Professional History" />
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break mb-6 border-b border-stone-200 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-serif text-[24px] font-bold leading-tight text-stone-900 mb-1">
                    <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company Name" />
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <span className="font-sans text-[14px] font-bold text-stone-700 uppercase tracking-wide">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Role Title" />
                    </span>
                    <span className="hidden sm:inline text-stone-300">|</span>
                    <span className="font-serif text-[14px] italic text-stone-600">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date Range" />
                    </span>
                    {exp.location && (
                      <>
                        <span className="hidden sm:inline text-stone-300">|</span>
                        <span className="font-sans text-[13px] text-stone-500 uppercase tracking-widest">
                          <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </span>
                      </>
                    )}
                  </div>
                  <div className="font-serif text-[15px] leading-relaxed text-stone-800 text-justify columns-1 sm:columns-2 gap-6">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Detailed description of professional responsibilities and major accomplishments..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-8 col-span-1 md:col-span-4">
            <SectionTitle title="Featured Works" />
            <div className="space-y-6">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break bg-stone-100 p-4 border border-stone-300">
                  <h3 className="font-serif text-[18px] font-bold text-stone-900 leading-tight mb-2">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Headline" />
                  </h3>
                  <div className="font-serif text-[14px] leading-relaxed text-stone-700 whitespace-pre-wrap mb-2">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Article description..." multiline />
                  </div>
                  {proj.link && (
                    <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500 border-t border-stone-300 pt-2 mt-2">
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Read More Link" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-8 col-span-1 md:col-span-4">
            <SectionTitle title="Education" />
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break border-b border-stone-200 pb-3 last:border-0">
                  <h3 className="font-serif text-[16px] font-bold text-stone-900 leading-tight">
                    <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                  </h3>
                  <div className="font-sans text-[13px] font-semibold text-stone-600 my-1">
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                  </div>
                  <div className="font-serif text-[13px] italic text-stone-500">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Year" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-8 col-span-1 md:col-span-4">
            <SectionTitle title="Expertise" />
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="font-sans text-[12px] font-bold uppercase tracking-widest text-stone-800 bg-stone-200 px-2 py-1">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-8 col-span-1 md:col-span-4 border-l border-stone-300 pl-0 md:pl-6">
            <SectionTitle title="Honors" />
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break relative pl-4">
                  <span className="absolute left-0 top-1 text-[20px] leading-none text-stone-400">“</span>
                  <h3 className="font-serif text-[15px] font-bold text-stone-900 mb-1">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Award Title" />
                  </h3>
                  {ach.desc && (
                    <div className="font-serif text-[13px] leading-relaxed text-stone-700 italic">
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
          <section key="languages" className="mb-8 col-span-1 md:col-span-4">
            <SectionTitle title="Languages" />
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-end border-b border-stone-200 border-dotted pb-1">
                  <span className="font-serif text-[15px] font-bold text-stone-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-stone-500">
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
          <section key="certifications" className="mb-8 col-span-1 md:col-span-4 border-l border-stone-300 pl-0 md:pl-6">
            <SectionTitle title="Credentials" />
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break font-serif text-[14px] text-stone-800">
                  <span className="font-bold">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="italic block mt-0.5 text-stone-500">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-8 col-span-1 md:col-span-4">
            <SectionTitle title="Interests" />
            <p className="font-serif text-[14px] text-stone-800 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-1 text-stone-400">,</span>}
                </span>
              ))}
            </p>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#f4f1ea] min-h-[297mm] p-10 md:p-14 font-serif selection:bg-stone-300">
      
      {/* Newspaper Masthead */}
      <header className="text-center border-b-[6px] border-stone-900 pb-6 mb-6">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-4 flex justify-between items-center max-w-4xl mx-auto border-y border-stone-300 py-1">
          <span>Vol. 1</span>
          <span><EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" /></span>
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        
        <h1 className="font-serif text-6xl md:text-[80px] font-black tracking-tighter text-stone-900 leading-none mb-4 uppercase">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="FIRST LAST" />
        </h1>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 font-sans text-[12px] font-bold uppercase tracking-widest text-stone-700">
          {data.email && <span><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></span>}
          {data.phone && <span><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></span>}
          {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 font-sans text-[11px] font-bold uppercase tracking-widest text-stone-500 mt-2">
          {data.linkedin && <span className="underline"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
          {data.github && <span className="underline"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
        </div>
      </header>

      {/* Multi-column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8">
        {/* Force Summary First Across full width */}
        {sectionsOrder.includes('summary') && renderSection('summary')}

        {/* Dynamic Grid Mapping for remaining sections */}
        {sectionsOrder.filter(s => s !== 'summary').map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout46;
