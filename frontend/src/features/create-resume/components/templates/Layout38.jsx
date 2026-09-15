import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 38: Magazine Editorial Resume
const Layout38 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-red-700';
  const accentBorder = theme?.border || 'border-red-700';
  const accentBg = theme?.bgPrimary || 'bg-red-700';

  const SectionTitle = ({ title }) => (
    <h2 className={`font-serif text-3xl font-black uppercase tracking-widest ${accentText} mb-6 border-t-4 ${accentBorder} pt-2 mt-4`}>
      {title}
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-12">
            <p className="font-serif text-xl leading-relaxed text-gray-900 first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Write a compelling editorial introduction..." multiline />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-12">
            <SectionTitle title="Experience" />
            <div className="space-y-10">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-3">
                    <h3 className="font-serif text-2xl font-bold text-gray-900 leading-none">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Title" />
                    </h3>
                    <div className="text-sm font-sans font-bold text-gray-400 uppercase tracking-widest">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </div>
                  </div>
                  <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-gray-600 mb-4 border-b border-gray-200 pb-2">
                    <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                    {exp.location && (
                      <> • <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" /></>
                    )}
                  </h4>
                  <div className="font-serif text-sm text-gray-800 leading-loose whitespace-pre-wrap columns-1 md:columns-2 gap-8">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Editorial description of responsibilities and impact..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-12">
            <SectionTitle title="Education" />
            <div className="grid grid-cols-1 gap-6">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <p className="font-sans text-sm text-gray-600 uppercase tracking-widest mt-1">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </p>
                  </div>
                  <div className={`font-sans font-bold ${accentText} bg-gray-100 px-4 py-2 mt-3 md:mt-0`}>
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
          <section key="projects" className="mb-12">
            <SectionTitle title="Features" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break bg-gray-50 p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 ${accentBg}`}></div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                  </h3>
                  {proj.link && (
                    <p className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </p>
                  )}
                  <div className="font-serif text-sm text-gray-700 leading-loose whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Feature story about this project..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-12">
            <h2 className="font-sans text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-6 pb-2 border-b-2 border-gray-900">Expertise</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="font-serif text-lg text-gray-800 italic">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-12">
            <h2 className="font-sans text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-6 pb-2 border-b-2 border-gray-900">Credentials</h2>
            <div className="space-y-4">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break">
                  <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </h3>
                  {cert.date && (
                    <p className="font-sans text-xs text-gray-500 uppercase tracking-widest mt-1">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-12">
            <h2 className="font-sans text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-6 pb-2 border-b-2 border-gray-900">Languages</h2>
            <div className="space-y-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-baseline border-b border-dotted border-gray-300 pb-1">
                  <span className="font-serif text-lg text-gray-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-12">
            <h2 className="font-sans text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-6 pb-2 border-b-2 border-gray-900">Awards</h2>
            <div className="space-y-6">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break">
                  <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Award Title" />
                  </h3>
                  {ach.desc && (
                    <p className="font-serif text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Award details..." />
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-12">
            <h2 className="font-sans text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-6 pb-2 border-b-2 border-gray-900">Interests</h2>
            <p className="font-serif text-base text-gray-700 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className={`mx-2 ${accentText}`}>•</span>}
                </span>
              ))}
            </p>
          </section>
        );

      default: return null;
    }
  };

  const mainSections = ['summary', 'experience', 'projects', 'education'];
  const sideSections = ['skills', 'achievements', 'certifications', 'languages', 'interests'];

  return (
    <div className="w-full bg-[#fdfbf7] min-h-[297mm] p-10 font-sans border-8 border-white shadow-2xl">
      
      {/* Editorial Header */}
      <header className="mb-12 border-b-8 border-gray-900 pb-8 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="flex-1">
          <h1 className="font-serif text-6xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-4">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="YOUR NAME" />
          </h1>
          <p className={`font-sans text-xl md:text-2xl font-bold ${accentText} tracking-[0.3em] uppercase`}>
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="PROFESSIONAL TITLE" />
          </p>
        </div>
        
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest text-right flex flex-col gap-1">
          {data.email && <div><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
          {data.phone && <div><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
          {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
          <div className="flex gap-4 mt-2 justify-end">
            {data.linkedin && <span className="text-gray-900 underline decoration-2 underline-offset-4"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github && <span className="text-gray-900 underline decoration-2 underline-offset-4"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
          </div>
        </div>
      </header>

      {/* Asymmetrical Layout */}
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Main Editorial Content */}
        <main className="w-full md:w-[65%]">
          {sectionsOrder.filter(s => mainSections.includes(s)).map(id => renderSection(id))}
        </main>

        {/* Sidebar Info Blocks */}
        <aside className="w-full md:w-[35%]">
          <div className="bg-white p-8 border border-gray-200 shadow-md">
            {sectionsOrder.filter(s => sideSections.includes(s)).map(id => renderSection(id))}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Layout38;
