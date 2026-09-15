import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 22: Portfolio / Project-Focused Resume
// Projects dominate the top half in a large card grid.
// A narrow right rail holds contact + skills.
// Experience and education fill the lower main area.
const Layout22 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary || 'bg-emerald-700';
  const accentText = theme?.primary   || 'text-emerald-700';
  const accentBorder = theme?.border  || 'border-emerald-700';

  // Which sections go in the right rail vs main body
  const railSections = ['skills', 'languages', 'certifications', 'interests', 'achievements'];
  const mainSections = ['summary', 'experience', 'education'];

  const renderRailSection = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.25em] ${accentText} mb-2`}>Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[10px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-6">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.25em] ${accentText} mb-2`}>Certifications</h3>
            <div className="space-y-1.5">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-[10px] text-gray-700">
                  <span className="font-semibold block">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Cert" />
                  </span>
                  {cert.date && <span className="text-gray-400">
                    <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                  </span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-6">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.25em] ${accentText} mb-2`}>Languages</h3>
            <div className="space-y-1">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between text-[10px]">
                  <span className="font-semibold text-gray-800">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-gray-400 italic">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-6">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.25em] ${accentText} mb-2`}>Achievements</h3>
            <div className="space-y-2">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[10px]">
                  <span className="font-semibold text-gray-800 block">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </span>
                  {ach.desc && <span className="text-gray-500">
                    <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details" />
                  </span>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-6">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.25em] ${accentText} mb-2`}>Interests</h3>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-gray-300 mx-1">·</span>}
                </span>
              ))}
            </p>
          </div>
        );
      default: return null;
    }
  };

  const renderMainSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-8">
            <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} mb-3`}>About</h2>
            <p className="text-[12px] text-gray-700 leading-relaxed">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </section>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-8">
            <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} mb-4`}>Experience</h2>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-[13px] text-gray-900">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText}`}>
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                        {exp.location && <span className="text-gray-400 font-normal ml-1">· <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" /></span>}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1.5 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description…" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-8">
            <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} mb-4`}>Education</h2>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <p className={`text-[11px] font-semibold ${accentText}`}>
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      default: return null;
    }
  };

  const rail   = sectionsOrder.filter(s => railSections.includes(s));
  const main   = sectionsOrder.filter(s => mainSections.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Top: Name + title strip ── */}
      <header className="px-8 pt-8 pb-5 border-b border-gray-100">
        <div className="flex justify-between items-end gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
            </h1>
            <p className={`text-sm font-bold ${accentText} uppercase tracking-widest mt-1`}>
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
            </p>
          </div>
          <div className="text-right text-[11px] text-gray-500 space-y-0.5">
            {data.email    && <div><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></div>}
            {data.phone    && <div><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></div>}
            {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
            {data.linkedin && <div>in: <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></div>}
            {data.github   && <div>gh: <EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></div>}
          </div>
        </div>
      </header>

      {/* ── Projects full-width banner ── */}
      {sectionsOrder.includes('projects') && data.projects?.length ? (
        <div className={`${accentBg} px-8 py-6`}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.projects?.map((proj, idx) => (
              <div key={proj.id || idx} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                  <h3 className="font-bold text-[13px] text-white">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Title" />
                  </h3>
                  {proj.link && (
                    <span className="text-[10px] text-white/60">
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/75 whitespace-pre-wrap leading-relaxed">
                  <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project description…" multiline />
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Bottom: main content + right rail ── */}
      <div className="flex gap-0">
        {/* Main */}
        <div className="flex-1 min-w-0 px-8 py-7 border-r border-gray-100">
          {main.map(id => renderMainSection(id))}
        </div>
        {/* Right rail */}
        <div className="w-48 shrink-0 px-5 py-7 bg-gray-50">
          {rail.map(id => renderRailSection(id))}
        </div>
      </div>

    </div>
  );
};

export default Layout22;
