import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 43: Academic Research Resume (Curriculum Vitae)
const Layout43 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-slate-800';
  const accentBorder = theme?.border || 'border-slate-800';

  const SectionHeading = ({ title }) => (
    <h2 className={`font-serif text-[18px] font-bold text-black border-b-2 ${accentBorder} pb-1 mb-6 mt-2 tracking-wide`}>
      {title}
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-10">
            <p className="font-serif text-[15px] leading-relaxed text-black text-justify">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Academic profile summary..." multiline />
            </p>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-10">
            <SectionHeading title="Education" />
            <div className="space-y-6">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break flex flex-col md:flex-row md:items-baseline gap-2">
                  <div className="w-32 shrink-0 font-serif text-[14px] font-bold text-black">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Year" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[16px] font-bold text-black">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="font-serif text-[15px] text-black italic">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-10">
            <SectionHeading title="Academic Appointments & Research" />
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                    <h3 className="font-serif text-[16px] font-bold text-black">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Position Title" />
                    </h3>
                    <span className="font-serif text-[14px] font-bold text-black whitespace-nowrap">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="font-serif text-[15px] text-black italic mb-2">
                    <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Institution / Organization" />
                    {exp.location && (
                      <span>, <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" /></span>
                    )}
                  </div>
                  <div className="font-serif text-[14px] text-black leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-gray-200">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Research focus, teaching responsibilities..." multiline />
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
            <SectionHeading title="Selected Publications & Projects" />
            <div className="space-y-6">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break flex items-start gap-3">
                  <span className="font-serif text-[15px] font-bold text-black mt-0.5">[{idx + 1}]</span>
                  <div className="flex-1 font-serif text-[14px] leading-relaxed text-black">
                    <span className="font-bold">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Title / Authors" />.
                    </span>{' '}
                    <span className="whitespace-pre-wrap">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Journal, Volume, Details..." multiline />
                    </span>
                    {proj.link && (
                      <span className={`block mt-1 font-sans text-[12px] ${accentText} underline underline-offset-2`}>
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="DOI / Link" />
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-10">
            <SectionHeading title="Grants, Honors & Awards" />
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break pl-4 border-l-2 border-gray-200">
                  <h3 className="font-serif text-[15px] font-bold text-black">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Award Name" />
                  </h3>
                  {ach.desc && (
                    <div className="font-serif text-[14px] text-black mt-1 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details/Amount..." multiline />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-10">
            <SectionHeading title="Professional Affiliations & Certifications" />
            <ul className="list-disc list-inside space-y-2 font-serif text-[14px] text-black marker:text-gray-400">
              {data.certifications?.map((cert, idx) => (
                <li key={cert.id || idx} className="pdf-no-break">
                  <span className="font-bold">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Affiliation/Certification" />
                  </span>
                  {cert.date && (
                    <span className="italic ml-2">
                      (<EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Year" />)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-10">
            <SectionHeading title="Methodological & Technical Skills" />
            <p className="font-serif text-[14px] text-black leading-relaxed">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx}>
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                  {idx < data.skills.length - 1 && <span className="mx-2 text-gray-400">|</span>}
                </span>
              ))}
            </p>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-10">
            <SectionHeading title="Languages" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-serif text-[14px] text-black">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex gap-2 items-baseline">
                  <span className="font-bold">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />:
                  </span>
                  <span className="italic">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-10">
            <SectionHeading title="Research Interests" />
            <p className="font-serif text-[14px] text-black leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-2">, </span>}
                </span>
              ))}
            </p>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] px-16 py-16 font-serif selection:bg-gray-200">
      
      {/* Formal Academic Header */}
      <header className="mb-12 text-center border-b-[3px] border-black pb-8">
        <h1 className="font-serif text-[32px] md:text-[40px] font-bold text-black tracking-wide uppercase mb-2 leading-tight">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Name" />
        </h1>
        <p className="font-serif text-[18px] md:text-[22px] italic text-black mb-6">
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Academic Title" />
        </p>
        
        <div className="font-serif text-[13px] text-black flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-3xl mx-auto">
          {data.email && <span><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></span>}
          {(data.email && data.phone) && <span className="text-gray-400">•</span>}
          {data.phone && <span><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></span>}
          {((data.email || data.phone) && data.location) && <span className="text-gray-400">•</span>}
          {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
        </div>
        <div className="font-serif text-[13px] text-black flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-2">
          {data.linkedin && <span><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
          {(data.linkedin && data.github) && <span className="text-gray-400">•</span>}
          {data.github && <span><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub/Website" /></span>}
        </div>
      </header>

      {/* CV Content - Single Column, Highly Structured */}
      <div className="max-w-4xl mx-auto">
        {/* Force Education to be immediately after Summary typically in academic CVs */}
        {sectionsOrder.includes('summary') && renderSection('summary')}
        {sectionsOrder.includes('education') && renderSection('education')}
        
        {/* Render rest, excluding summary and education to avoid duplicates */}
        {sectionsOrder.filter(s => !['summary', 'education'].includes(s)).map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout43;
