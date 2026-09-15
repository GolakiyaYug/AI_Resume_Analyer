import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 41: Dashboard Resume
const Layout41 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-indigo-600';
  const accentText = theme?.primary || 'text-indigo-600';
  const accentBorder = theme?.border || 'border-indigo-600';

  const WidgetHeader = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
      <span className={`text-lg ${accentText}`}>{icon}</span>
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{title}</h2>
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="col-span-12 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <WidgetHeader title="Executive Overview" icon="📊" />
              <p className="text-[15px] leading-relaxed text-slate-600 font-medium">
                <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Overview summary..." multiline />
              </p>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="col-span-12 lg:col-span-8 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <WidgetHeader title="Work History" icon="🏢" />
              <div className="space-y-4">
                {data.experience?.map((exp, idx) => (
                  <article key={exp.id || idx} className="pdf-no-break bg-slate-50 rounded-lg p-5 border border-slate-100 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                        </h3>
                        <div className={`text-[13px] font-semibold ${accentText}`}>
                          <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                          {exp.location && (
                            <span className="text-slate-400 font-normal ml-2">
                              • <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[12px] font-bold text-slate-500 bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200 whitespace-nowrap">
                        <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                      </div>
                    </div>
                    <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Job description..." multiline />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="col-span-12 lg:col-span-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <WidgetHeader title="Education" icon="🎓" />
              <div className="space-y-4">
                {data.education?.map((edu, idx) => (
                  <article key={edu.id || idx} className="pdf-no-break border-l-4 border-slate-300 pl-4 py-1">
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className={`text-[13px] font-semibold ${accentText} mb-1`}>
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="School" />
                    </div>
                    <div className="text-[12px] font-medium text-slate-500">
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="col-span-12 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <WidgetHeader title="Project Portfolio" icon="🚀" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects?.map((proj, idx) => (
                  <article key={proj.id || idx} className={`pdf-no-break bg-white rounded-lg p-5 border border-slate-200 shadow-sm border-t-4 ${accentBorder}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[15px] font-bold text-slate-900">
                        <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                      </h3>
                      {proj.link && (
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                          <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                        </div>
                      )}
                    </div>
                    <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project details..." multiline />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="col-span-12 lg:col-span-8 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <WidgetHeader title="Core Competencies" icon="⚡" />
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, idx) => skill && (
                  <div key={idx} className="bg-slate-800 text-white text-[13px] font-medium px-4 py-2 rounded-lg shadow-sm">
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
          <section key="languages" className="col-span-12 lg:col-span-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <WidgetHeader title="Languages" icon="🌍" />
              <div className="space-y-3">
                {data.languages?.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[14px] font-bold text-slate-800">
                      <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                    </span>
                    <span className={`text-[12px] font-bold ${accentText} bg-white px-2 py-1 rounded shadow-sm`}>
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
          <section key="certifications" className="col-span-12 lg:col-span-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <WidgetHeader title="Certifications" icon="🏅" />
              <div className="space-y-3">
                {data.certifications?.map((cert, idx) => (
                  <article key={cert.id || idx} className="pdf-no-break flex flex-col justify-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h3 className="text-[14px] font-bold text-slate-900 mb-1">
                      <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                    </h3>
                    {cert.date && (
                      <div className="text-[12px] font-medium text-slate-500">
                        <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="col-span-12 lg:col-span-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
              <WidgetHeader title="Achievements" icon="⭐" />
              <div className="space-y-4">
                {data.achievements?.map((ach, idx) => (
                  <article key={ach.id || idx} className="pdf-no-break">
                    <h3 className="text-[14px] font-bold text-slate-900 mb-1">
                      <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                    </h3>
                    {ach.desc && (
                      <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                        <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="col-span-12 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <WidgetHeader title="Interests" icon="🎯" />
              <div className="flex flex-wrap gap-2">
                {data.interests?.map((interest, idx) => interest && (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-[13px] font-medium px-4 py-2 rounded-lg border border-slate-200">
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
    <div className="w-full bg-slate-100 min-h-[297mm] p-8 md:p-10 font-sans">
      
      {/* Dashboard Profile Header */}
      <header className={`bg-slate-900 text-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${accentBg} rounded-full blur-3xl opacity-20 -mr-20 -mt-20`}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
          
          <div className="md:col-span-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Full Name" />
            </h1>
            <p className={`text-xl md:text-2xl font-bold ${accentText} mb-6`}>
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col justify-center space-y-3 text-[13px] font-medium text-slate-300 bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            {data.email && <div className="flex items-center gap-3"><span className="w-5 text-center text-slate-500">@</span> <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
            {data.phone && <div className="flex items-center gap-3"><span className="w-5 text-center text-slate-500">📞</span> <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
            {data.location && <div className="flex items-center gap-3"><span className="w-5 text-center text-slate-500">📍</span> <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
            <div className="pt-3 mt-1 border-t border-slate-700 flex flex-col gap-2">
              {data.linkedin && <div className="flex items-center gap-3"><span className="w-5 text-center text-slate-500">in</span> <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></div>}
              {data.github && <div className="flex items-center gap-3"><span className="w-5 text-center text-slate-500">gh</span> <EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></div>}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Grid System */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-0">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout41;
