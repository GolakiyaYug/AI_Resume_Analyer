import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 42: Swiss Grid Resume
const Layout42 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-red-600';
  const accentBg = theme?.bgPrimary || 'bg-red-600';

  const SectionHeading = ({ title }) => (
    <div className="col-span-1 md:col-span-3 text-right pr-8 border-r border-black hidden md:block">
      <h2 className="text-[12px] font-bold uppercase tracking-widest text-black whitespace-nowrap sticky top-4">
        {title}
      </h2>
    </div>
  );

  const MobileHeading = ({ title }) => (
    <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-4 md:hidden border-b border-black pb-2">
      {title}
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Profile" />
            <div className="md:col-span-9 pl-0 md:pl-8">
              <MobileHeading title="Profile" />
              <p className="text-xl md:text-2xl font-light text-black leading-tight tracking-tight max-w-4xl">
                <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional profile..." multiline />
              </p>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Experience" />
            <div className="md:col-span-9 pl-0 md:pl-8 space-y-12">
              <MobileHeading title="Experience" />
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3 text-[13px] font-bold text-black mt-1 uppercase tracking-wider">
                    <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="sm:col-span-9">
                    <h3 className="text-lg font-bold text-black leading-tight mb-1">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Role" />
                    </h3>
                    <div className={`text-[14px] font-bold ${accentText} mb-4`}>
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-black font-normal ml-2 normal-case">
                          , <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] leading-relaxed text-black font-normal whitespace-pre-wrap max-w-3xl">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Details..." multiline />
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
          <section key="education" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Education" />
            <div className="md:col-span-9 pl-0 md:pl-8 space-y-8">
              <MobileHeading title="Education" />
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3 text-[13px] font-bold text-black mt-1 uppercase tracking-wider">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="sm:col-span-9">
                    <h3 className="text-[15px] font-bold text-black mb-1">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="text-[14px] text-black">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
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
          <section key="projects" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Projects" />
            <div className="md:col-span-9 pl-0 md:pl-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              <MobileHeading title="Projects" />
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break">
                  <h3 className="text-[16px] font-bold text-black mb-1">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                  </h3>
                  {proj.link && (
                    <div className={`text-[12px] font-bold ${accentText} mb-3 truncate`}>
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-[14px] leading-relaxed text-black font-normal whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Skills" />
            <div className="md:col-span-9 pl-0 md:pl-8">
              <MobileHeading title="Skills" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-8">
                {data.skills?.map((skill, idx) => skill && (
                  <div key={idx} className="text-[14px] font-bold text-black">
                    <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Languages" />
            <div className="md:col-span-9 pl-0 md:pl-8">
              <MobileHeading title="Languages" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                {data.languages?.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-baseline border-b border-black pb-1">
                    <span className="text-[15px] font-bold text-black">
                      <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                    </span>
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${accentText}`}>
                      <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Certifications" />
            <div className="md:col-span-9 pl-0 md:pl-8 space-y-6">
              <MobileHeading title="Certifications" />
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3 text-[13px] font-bold text-black mt-1 uppercase tracking-wider">
                    <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="sm:col-span-9 text-[15px] font-bold text-black">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Achievements" />
            <div className="md:col-span-9 pl-0 md:pl-8 space-y-8">
              <MobileHeading title="Achievements" />
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break">
                  <h3 className="text-[15px] font-bold text-black mb-2">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </h3>
                  {ach.desc && (
                    <div className="text-[14px] leading-relaxed text-black font-normal whitespace-pre-wrap max-w-3xl">
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
          <section key="interests" className="grid grid-cols-1 md:grid-cols-12 mb-16 relative">
            <SectionHeading title="Interests" />
            <div className="md:col-span-9 pl-0 md:pl-8">
              <MobileHeading title="Interests" />
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {data.interests?.map((interest, idx) => interest && (
                  <span key={idx} className="text-[14px] font-bold text-black">
                    <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  </span>
                ))}
              </div>
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] p-12 md:p-16 font-sans antialiased text-black">
      
      {/* Swiss Header */}
      <header className="grid grid-cols-1 md:grid-cols-12 mb-20 relative">
        <div className="md:col-span-3 text-right pr-8 border-r border-black hidden md:block">
          {/* Empty spacer for grid alignment */}
        </div>
        
        <div className="md:col-span-9 pl-0 md:pl-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 text-black">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="First Last" />
            </h1>
            <p className={`text-xl md:text-2xl font-bold ${accentText} tracking-tight`}>
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Title" />
            </p>
          </div>

          <div className="text-[13px] font-bold text-black flex flex-col gap-1 tracking-tight text-left md:text-right">
            {data.email && <div><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
            {data.phone && <div><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
            {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
            <div className="flex gap-4 mt-2 justify-start md:justify-end">
              {data.linkedin && <span className="underline decoration-2"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
              {data.github && <span className="underline decoration-2"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
            </div>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="w-full relative before:content-[''] before:absolute before:left-0 md:before:left-[24.5%] md:before:w-px md:before:h-full md:before:bg-black md:before:-z-10">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout42;
