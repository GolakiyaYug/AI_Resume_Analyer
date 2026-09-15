import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 49: Command Center Resume
const Layout49 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-cyan-400';
  const accentBg = theme?.bgPrimary || 'bg-cyan-400';
  const accentBorder = theme?.border || 'border-cyan-400';

  const PanelHeader = ({ title, status = 'ONLINE' }) => (
    <div className="flex justify-between items-end border-b-2 border-slate-700 pb-2 mb-4">
      <h2 className="text-[13px] font-black text-slate-100 uppercase tracking-[0.2em]">{title}</h2>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`}></span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{status}</span>
      </div>
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="col-span-12 mb-6">
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 shadow-inner">
              <PanelHeader title="System Overview" />
              <p className="text-[15px] leading-relaxed text-slate-300 font-mono">
                <span className={`${accentText}`}>&gt; </span>
                <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Executive operations summary..." multiline />
              </p>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="col-span-12 lg:col-span-8 mb-6">
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 h-full">
              <PanelHeader title="Operations History" />
              <div className="space-y-4">
                {data.experience?.map((exp, idx) => (
                  <article key={exp.id || idx} className="pdf-no-break bg-slate-900/50 p-5 rounded border border-slate-700 border-l-4 border-l-cyan-500">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 gap-2">
                      <div>
                        <h3 className="text-[16px] font-bold text-slate-100">
                          <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Command Role" />
                        </h3>
                        <div className={`text-[13px] font-bold ${accentText} mt-1`}>
                          <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Organization" />
                          {exp.location && (
                            <span className="text-slate-500 ml-2">
                              [{<EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Sector" />}]
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-600 uppercase">
                        T: <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Timeframe" />
                      </div>
                    </div>
                    <div className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Operational details..." multiline />
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
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700">
              <PanelHeader title="Deployed Initiatives" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.projects?.map((proj, idx) => (
                  <article key={proj.id || idx} className="pdf-no-break bg-slate-900/50 p-5 rounded border border-slate-700 flex flex-col h-full hover:border-cyan-500/50 transition-colors">
                    <h3 className="text-[15px] font-bold text-slate-100 mb-2">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                    </h3>
                    <div className="text-[13px] text-slate-400 leading-relaxed whitespace-pre-wrap flex-grow mb-4 font-mono">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Initiative details..." multiline />
                    </div>
                    {proj.link && (
                      <div className={`text-[11px] font-bold ${accentText} mt-auto pt-3 border-t border-slate-700 font-mono truncate`}>
                        LINK: <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="URL" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="col-span-12 lg:col-span-4 mb-6">
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 h-full">
              <PanelHeader title="System Capabilities" />
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, idx) => skill && (
                  <div key={idx} className="bg-slate-900 text-cyan-50 text-[12px] font-mono font-bold px-3 py-1.5 rounded border border-slate-600">
                    <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Capability" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="col-span-12 lg:col-span-6 mb-6">
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 h-full">
              <PanelHeader title="Knowledge Base" />
              <div className="space-y-4">
                {data.education?.map((edu, idx) => (
                  <article key={edu.id || idx} className="pdf-no-break border-l-2 border-slate-500 pl-4">
                    <h3 className="text-[14px] font-bold text-slate-100">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="text-[13px] font-medium text-slate-400 mt-1">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </div>
                    <div className={`text-[11px] font-bold ${accentText} mt-1 font-mono uppercase`}>
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                    </div>
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
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 h-full">
              <PanelHeader title="Performance Metrics" />
              <div className="space-y-4">
                {data.achievements?.map((ach, idx) => (
                  <article key={ach.id || idx} className="pdf-no-break bg-slate-900/50 p-4 rounded border border-slate-700">
                    <h3 className="text-[14px] font-bold text-slate-100 mb-1 flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Metric / Award" />
                    </h3>
                    {ach.desc && (
                      <div className="text-[12px] text-slate-400 font-mono ml-5">
                        <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details..." multiline />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="col-span-12 lg:col-span-6 mb-6">
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 h-full">
              <PanelHeader title="Comms Protocols" />
              <div className="space-y-3">
                {data.languages?.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded border border-slate-700">
                    <span className="text-[13px] font-bold text-slate-100">
                      <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${accentText} bg-slate-800 px-2 py-1 rounded uppercase tracking-widest`}>
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
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700 h-full">
              <PanelHeader title="Security Clearances" />
              <div className="space-y-3">
                {data.certifications?.map((cert, idx) => (
                  <article key={cert.id || idx} className="pdf-no-break flex justify-between items-center bg-slate-900/50 p-3 rounded border border-slate-700 border-l-2 border-l-green-500">
                    <span className="text-[13px] font-bold text-slate-100">
                      <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                    </span>
                    {cert.date && (
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                      </span>
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
            <div className="bg-slate-800/80 p-6 rounded-lg border border-slate-700">
              <PanelHeader title="Secondary Functions" />
              <div className="flex flex-wrap gap-3">
                {data.interests?.map((interest, idx) => interest && (
                  <span key={idx} className="text-[12px] font-medium text-slate-400 border border-slate-600 px-3 py-1 rounded">
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
    <div className="w-full bg-slate-900 min-h-[297mm] p-8 md:p-10 font-sans text-slate-100 selection:bg-slate-700">
      
      {/* Command Center Dashboard Header */}
      <header className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 mb-8 flex flex-col md:flex-row justify-between items-start gap-8 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 w-full md:w-2/3">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">ID: CMD-01</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-50 uppercase mb-2">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Operator Name" />
          </h1>
          <p className={`text-xl font-mono font-bold ${accentText} tracking-widest uppercase`}>
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Designation" />
          </p>
        </div>

        <div className="relative z-10 w-full md:w-1/3 flex flex-col gap-2 text-[12px] font-mono font-bold text-slate-300">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-700 pb-1">Comms Link</div>
          {data.email && <div className="flex justify-between items-center bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700"><span className="text-slate-500">EML:</span> <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
          {data.phone && <div className="flex justify-between items-center bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700"><span className="text-slate-500">TEL:</span> <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
          {data.location && <div className="flex justify-between items-center bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700"><span className="text-slate-500">LOC:</span> <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
          
          {(data.linkedin || data.github) && (
            <div className="flex gap-4 mt-2">
              {data.linkedin && <span className="hover:text-cyan-400 transition-colors underline"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
              {data.github && <span className="hover:text-cyan-400 transition-colors underline"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
            </div>
          )}
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-0 relative z-10">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout49;
