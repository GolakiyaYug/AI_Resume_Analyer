import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 39: Portfolio Grid Resume
const Layout39 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-teal-600';
  const accentText = theme?.primary || 'text-teal-600';
  
  const SectionTitle = ({ title }) => (
    <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6 flex items-center">
      <span className={`w-8 h-1 ${accentBg} mr-4 rounded-full`}></span>
      {title}
    </h2>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-14 col-span-1 lg:col-span-3">
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl shadow-gray-200/50">
              <p className="text-lg leading-relaxed font-light">
                <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Designer/Developer portfolio summary..." multiline />
              </p>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-12 col-span-1 lg:col-span-2">
            <SectionTitle title="Experience" />
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Role" />
                      </h3>
                      <div className={`text-sm font-semibold ${accentText} mt-1`}>
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Role description..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-12 col-span-1 lg:col-span-3">
            <SectionTitle title="Portfolio Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break flex flex-col bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
                  <div className={`w-12 h-12 rounded-2xl ${accentBg} flex items-center justify-center text-white font-black text-xl mb-4 opacity-90`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                  </h3>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap flex-grow mb-4">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project description..." multiline />
                  </div>
                  {proj.link && (
                    <div className="text-xs font-semibold text-gray-500 mt-auto truncate pt-4 border-t border-gray-100">
                      🔗 <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
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
          <section key="education" className="mb-12 col-span-1">
            <SectionTitle title="Education" />
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break bg-gray-50 p-5 rounded-2xl">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                  </h3>
                  <div className={`text-sm font-semibold ${accentText} mb-2`}>
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="School" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded inline-block">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-12 col-span-1 lg:col-span-3">
            <SectionTitle title="Tech Stack" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="bg-white border border-gray-200 text-center py-3 px-2 rounded-xl shadow-sm text-sm font-bold text-gray-800">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-12 col-span-1 lg:col-span-2">
            <SectionTitle title="Achievements" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">🏆 <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Award" /></h3>
                  {ach.desc && (
                    <p className="text-xs text-gray-600">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details" />
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-12 col-span-1">
            <SectionTitle title="Certs" />
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-800">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Cert" />
                  </span>
                  {cert.date && (
                    <span className="text-xs text-gray-400 font-semibold">
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
          <section key="languages" className="mb-12 col-span-1">
            <SectionTitle title="Languages" />
            <div className="space-y-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex flex-col bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-sm font-bold text-gray-900 mb-1">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className={`text-xs font-semibold ${accentText}`}>
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
          <section key="interests" className="mb-12 col-span-1 lg:col-span-2">
            <SectionTitle title="Interests" />
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-2 rounded-full">
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-[297mm] p-10 md:p-14 font-sans">
      
      {/* Profile Header Grid */}
      <header className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        
        {/* Name Area */}
        <div className="md:col-span-2">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none mb-3">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="First Last" />
          </h1>
          <p className={`text-xl md:text-2xl font-bold ${accentText}`}>
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Designer / Developer" />
          </p>
        </div>

        {/* Contact Grid */}
        <div className="md:col-span-1 flex flex-col justify-end gap-3 text-sm font-medium text-gray-600 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          {data.email && <div className="flex items-center gap-3"><span className="text-gray-400">@</span> <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
          {data.phone && <div className="flex items-center gap-3"><span className="text-gray-400">#</span> <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
          {data.location && <div className="flex items-center gap-3"><span className="text-gray-400">⚲</span> <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
          <div className="pt-3 mt-1 border-t border-gray-100 flex gap-4">
            {data.linkedin && <span className={`${accentText}`}><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github && <span className={`${accentText}`}><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
          </div>
        </div>

      </header>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-0 items-start">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout39;
