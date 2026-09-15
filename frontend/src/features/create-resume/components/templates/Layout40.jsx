import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 40: Minimal Scandinavian Resume
const Layout40 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-stone-800';
  const accentBorder = theme?.border || 'border-stone-800';

  const SectionHeading = ({ title }) => (
    <h2 className={`text-[11px] font-medium tracking-[0.3em] uppercase text-stone-400 mb-8 border-b-[0.5px] border-stone-200 pb-4`}>
      {title}
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-16">
            <p className={`text-xl leading-[1.8] font-light ${accentText}`}>
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="A minimalist introduction..." multiline />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-16">
            <SectionHeading title="Experience" />
            <div className="space-y-12">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 text-[13px] font-medium text-stone-400 mt-1">
                    <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-lg font-normal text-stone-900 mb-1">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Role Title" />
                    </h3>
                    <div className="text-[13px] tracking-wide uppercase text-stone-500 mb-4">
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      {exp.location && (
                        <span className="ml-2 font-light normal-case">
                          / <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] leading-relaxed text-stone-600 font-light whitespace-pre-wrap">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Experience description..." multiline />
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
          <section key="education" className="mb-16">
            <SectionHeading title="Education" />
            <div className="space-y-10">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 text-[13px] font-medium text-stone-400 mt-1">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Year" />
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-lg font-normal text-stone-900 mb-1">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="text-[14px] text-stone-500 font-light">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="School/University" />
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
          <section key="projects" className="mb-16">
            <SectionHeading title="Projects" />
            <div className="space-y-12">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-[16px] font-normal text-stone-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                    </h3>
                    {proj.link && (
                      <span className="text-[12px] text-stone-400 hover:text-stone-800 transition">
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] leading-relaxed text-stone-600 font-light whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project details..." multiline />
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
            <SectionHeading title="Skills" />
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[14px] text-stone-700 font-light">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-16">
            <SectionHeading title="Languages" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex flex-col">
                  <span className="text-[15px] text-stone-900 font-normal">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-[13px] text-stone-400 font-light mt-1">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency level" />
                  </span>
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
            <div className="space-y-6">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 text-[13px] font-medium text-stone-400 mt-1">
                    <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="md:col-span-9 text-[15px] text-stone-800 font-normal">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification Title" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-16">
            <SectionHeading title="Achievements" />
            <div className="space-y-8">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break">
                  <h3 className="text-[15px] font-normal text-stone-900 mb-2">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </h3>
                  {ach.desc && (
                    <div className="text-[14px] leading-relaxed text-stone-600 font-light whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description..." multiline />
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
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-stone-600 font-light">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-3 text-stone-300">/</span>}
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#fdfdfd] min-h-[297mm] px-16 py-20 font-sans">
      
      {/* Minimal Header */}
      <header className="mb-24 flex flex-col md:flex-row md:justify-between md:items-end gap-10">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl font-light text-stone-900 tracking-tight leading-none mb-4">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Name" />
          </h1>
          <p className="text-[15px] tracking-widest uppercase text-stone-400 font-medium">
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Title" />
          </p>
        </div>

        <div className="text-[13px] text-stone-500 font-light flex flex-col gap-2 md:text-right">
          {data.email && <div><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
          {data.phone && <div><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
          {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
          <div className="flex gap-4 mt-1 md:justify-end">
            {data.linkedin && <span className="hover:text-stone-900 transition"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github && <span className="hover:text-stone-900 transition"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-5xl">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout40;
