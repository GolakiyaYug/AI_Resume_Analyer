import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 44: Startup Founder / Pitch Resume
const Layout44 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-amber-400';
  const accentText = theme?.primary || 'text-amber-500';
  const accentBorder = theme?.border || 'border-amber-400';

  const SectionHeading = ({ title }) => (
    <h2 className="text-[28px] font-black tracking-tighter text-slate-900 mb-6 flex items-center">
      {title}
      <span className={`inline-block ml-3 w-8 h-1 ${accentBg}`}></span>
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-14">
            <h2 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vision & Mission</h2>
            <p className="text-[22px] md:text-[28px] font-bold text-slate-800 leading-snug tracking-tight">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Founder vision statement..." multiline />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-14">
            <SectionHeading title="Ventures & Experience" />
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className={`pdf-no-break pl-5 border-l-4 ${accentBorder}`}>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-2 gap-1">
                    <h3 className="text-[20px] font-black text-slate-900 leading-none">
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Startup / Company" />
                    </h3>
                    <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-sm inline-block">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Timeline" />
                    </span>
                  </div>
                  <div className="text-[16px] font-bold text-slate-600 mb-3">
                    <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Founder / CEO" />
                    {exp.location && (
                      <span className="text-slate-400 font-medium ml-2 text-[14px]">
                        @ <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Scale, growth, metrics, fundraising..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-14">
            <SectionHeading title="Products Built" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[18px] font-black text-slate-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Product Name" />
                    </h3>
                    {proj.link && (
                      <span className={`text-[12px] font-bold ${accentText}`}>
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Product URL" />
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-wrap mt-2">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Problem solved, tech stack, user base..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-14">
            <SectionHeading title="Core Arsenal" />
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[14px] font-bold text-slate-800 bg-white border-2 border-slate-900 px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-14">
            <SectionHeading title="Milestones" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break bg-slate-900 text-white p-5 rounded-xl">
                  <h3 className={`text-[16px] font-bold ${accentText} mb-1`}>
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Milestone / Funding" />
                  </h3>
                  {ach.desc && (
                    <div className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details..." multiline />
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
          <section key="education" className="mb-14">
            <SectionHeading title="Education" />
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break border-b border-slate-200 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="text-[16px] font-bold text-slate-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <span className="text-[13px] font-bold text-slate-500">
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[15px] font-medium text-slate-600 mt-1">
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-14">
            <SectionHeading title="Certifications" />
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                  <span className="text-[15px] font-bold text-slate-800">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-[12px] font-bold text-slate-400">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-14">
            <SectionHeading title="Languages" />
            <div className="flex flex-wrap gap-4">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex flex-col bg-slate-100 px-4 py-2 rounded-lg">
                  <span className="text-[14px] font-bold text-slate-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className={`text-[12px] font-bold ${accentText}`}>
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
          <section key="interests" className="mb-14">
            <SectionHeading title="Interests" />
            <div className="text-[15px] font-medium text-slate-600">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-2 text-slate-300">|</span>}
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] p-10 md:p-16 font-sans">
      
      {/* Startup Pitch Header */}
      <header className="mb-14">
        <h1 className="text-6xl md:text-[80px] font-black tracking-tighter text-slate-900 leading-none mb-3">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="First Last" />
          <span className={accentText}>.</span>
        </h1>
        <div className={`text-2xl md:text-3xl font-black ${accentText} tracking-tight mb-8`}>
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Founder / Innovator" />
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] font-bold text-slate-600">
          {data.email && <div className="flex items-center gap-2"><span className="text-slate-300">✉</span><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
          {data.phone && <div className="flex items-center gap-2"><span className="text-slate-300">📱</span><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
          {data.location && <div className="flex items-center gap-2"><span className="text-slate-300">📍</span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
          {data.linkedin && <div className="flex items-center gap-2"><span className="text-slate-300">in</span><span className="underline decoration-2"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span></div>}
          {data.github && <div className="flex items-center gap-2"><span className="text-slate-300">gh</span><span className="underline decoration-2"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span></div>}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout44;
