import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 50: Portfolio Showcase Resume
const Layout50 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-violet-600';
  const accentText = theme?.primary || 'text-violet-600';

  const SectionHeading = ({ title }) => (
    <h2 className="text-[32px] md:text-[40px] font-black text-gray-900 tracking-tighter mb-8 leading-none">
      {title}<span className={accentText}>.</span>
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-20 max-w-4xl">
            <p className="text-[20px] md:text-[24px] leading-[1.6] font-medium text-gray-700">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Hi, I'm a creative professional..." multiline />
            </p>
          </section>
        );

      case 'projects':
        // Portfolio Showcase prioritizes Projects at the top, typically large cards.
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-20">
            <SectionHeading title="Selected Works" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break group">
                  <div className={`aspect-[4/3] w-full rounded-2xl mb-6 flex items-center justify-center p-8 transition-transform group-hover:-translate-y-2 group-hover:shadow-xl ${idx % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}`}>
                    <div className="text-center">
                       <span className={`text-[64px] font-black opacity-10 ${accentText}`}>0{idx + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-[24px] font-bold text-gray-900 mb-2">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                  </h3>
                  <div className="text-[15px] leading-relaxed text-gray-600 whitespace-pre-wrap mb-4">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project details and impact..." multiline />
                  </div>
                  {proj.link && (
                    <div className="inline-flex items-center text-[14px] font-bold text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-gray-600 transition-colors">
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="View Case Study →" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-20">
            <SectionHeading title="Experience" />
            <div className="space-y-12 max-w-4xl">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break flex flex-col md:flex-row gap-4 md:gap-12">
                  <div className="md:w-1/4 shrink-0">
                    <div className="text-[14px] font-bold text-gray-400 uppercase tracking-widest sticky top-4">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Timeline" />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-[22px] font-bold text-gray-900 leading-tight">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Role" />
                    </h3>
                    <div className={`text-[16px] font-medium ${accentText} mb-4`}>
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-gray-400 ml-2">
                          / <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                    <div className="text-[15px] leading-relaxed text-gray-600 whitespace-pre-wrap">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description..." multiline />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-20">
            <SectionHeading title="Toolkit" />
            <div className="flex flex-wrap gap-3 max-w-4xl">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[15px] font-medium text-gray-900 bg-white border-2 border-gray-200 px-6 py-3 rounded-full hover:border-gray-900 transition-colors">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-20">
            <SectionHeading title="Education" />
            <div className="space-y-8 max-w-4xl">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break flex flex-col md:flex-row gap-4 md:gap-12">
                   <div className="md:w-1/4 shrink-0">
                    <div className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Year" />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-[20px] font-bold text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="text-[16px] text-gray-600 mt-1">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-20">
            <SectionHeading title="Awards" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break">
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Award Title" />
                  </h3>
                  {ach.desc && (
                    <div className="text-[15px] leading-relaxed text-gray-600 whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description..." multiline />
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
          <section key="certifications" className="mb-20">
            <SectionHeading title="Certifications" />
            <div className="space-y-6 max-w-4xl">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break flex flex-col md:flex-row justify-between items-baseline border-b border-gray-200 pb-4">
                  <span className="text-[18px] font-bold text-gray-900">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification Name" />
                  </span>
                  {cert.date && (
                    <span className="text-[14px] font-bold text-gray-400 mt-2 md:mt-0 uppercase tracking-widest">
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
          <section key="languages" className="mb-20">
            <SectionHeading title="Languages" />
            <div className="flex flex-wrap gap-8 max-w-4xl">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx}>
                  <div className="text-[18px] font-bold text-gray-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </div>
                  <div className={`text-[13px] font-bold ${accentText} mt-1 uppercase tracking-widest`}>
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-20">
            <SectionHeading title="Interests" />
            <div className="flex flex-wrap gap-x-6 gap-y-3 max-w-4xl">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-[16px] font-medium text-gray-600">
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-3 text-gray-300">•</span>}
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] px-10 md:px-20 py-24 font-sans selection:bg-gray-200">
      
      {/* Portfolio Header */}
      <header className="mb-24 max-w-4xl">
        <h1 className="text-6xl md:text-[80px] font-black tracking-tighter text-gray-900 leading-[0.9] mb-8">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Name" />
        </h1>
        <div className={`text-[20px] md:text-[24px] font-bold ${accentText} mb-12 uppercase tracking-[0.2em]`}>
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Creative Role" />
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-x-12 gap-y-4 text-[14px] font-bold text-gray-900">
          {data.email && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">Email</span>
              <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="hello@example.com" />
            </div>
          )}
          {data.phone && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">Phone</span>
              <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" />
            </div>
          )}
          {data.location && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">Location</span>
              <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" />
            </div>
          )}
          
          {(data.linkedin || data.github) && (
             <div className="flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">Social</span>
              <div className="flex gap-4">
                {data.linkedin && <span className="hover:text-gray-500 transition-colors underline underline-offset-2"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
                {data.github && <span className="hover:text-gray-500 transition-colors underline underline-offset-2"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full">
        {/* Force Summary First */}
        {sectionsOrder.includes('summary') && renderSection('summary')}
        
        {/* Force Projects Second (it's a portfolio!) */}
        {sectionsOrder.includes('projects') && renderSection('projects')}

        {/* Map remaining sections */}
        {sectionsOrder.filter(s => !['summary', 'projects'].includes(s)).map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout50;
