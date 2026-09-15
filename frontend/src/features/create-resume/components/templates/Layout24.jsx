import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 24: Editorial / Magazine Resume
// Full-width centred masthead, then a deliberate 3-column bento grid:
//   col-A (40%) → experience  |  col-B (35%) → education + projects  |  col-C (25%) → skills / extras
// Strong typographic contrast between headlines and body copy.
const Layout24 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary || 'bg-rose-700';
  const accentText = theme?.primary   || 'text-rose-700';
  const accentBorder = theme?.border  || 'border-rose-700';

  // Column A: experience
  const colASections = ['experience'];
  // Column B: education, projects, achievements
  const colBSections = ['education', 'projects', 'achievements'];
  // Column C: summary, skills, certifications, languages, interests
  const colCSections = ['summary', 'skills', 'certifications', 'languages', 'interests'];

  const colA = sectionsOrder.filter(s => colASections.includes(s));
  const colB = sectionsOrder.filter(s => colBSections.includes(s));
  const colC = sectionsOrder.filter(s => colCSections.includes(s));

  // ── Column A ──────────────────────────────────────────────────────────
  const renderColA = (sectionId) => {
    if (sectionId === 'experience') {
      if (!data.experience?.length && !handleInlineEdit) return null;
      return (
        <section key="experience">
          <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-4 border-b ${accentBorder} pb-1`}>
            Work History
          </h2>
          <div className="space-y-6">
            {data.experience?.map((exp, idx) => (
              <div key={exp.id || idx}>
                <h3 className="font-black text-[13px] text-gray-900 leading-snug">
                  <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                </h3>
                <div className={`text-[11px] font-bold ${accentText} mt-0.5`}>
                  <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                </div>
                <div className="flex items-center gap-2 mt-0.5 mb-2">
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                    <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                  </span>
                  {exp.location && <>
                    <span className="text-gray-200">|</span>
                    <span className="text-[9px] text-gray-400">
                      <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                    </span>
                  </>}
                </div>
                <div className="text-[10px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                  <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description…" multiline />
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }
    return null;
  };

  // ── Column B ──────────────────────────────────────────────────────────
  const renderColB = (sectionId) => {
    switch (sectionId) {
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3 border-b ${accentBorder} pb-1`}>Education</h2>
            <div className="space-y-3">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                  </h3>
                  <p className={`text-[10px] font-semibold ${accentText}`}>
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                  </p>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3 border-b ${accentBorder} pb-1`}>Projects</h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <h3 className="font-bold text-[11px] text-gray-900">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project" />
                  </h3>
                  {proj.link && <p className={`text-[9px] ${accentText} mb-0.5`}>
                    <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                  </p>}
                  <p className="text-[10px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description…" multiline />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3 border-b ${accentBorder} pb-1`}>Achievements</h2>
            <div className="space-y-2">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[11px] text-gray-900">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </h3>
                  {ach.desc && <p className="text-[10px] text-gray-500 whitespace-pre-wrap">
                    <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details" />
                  </p>}
                </div>
              ))}
            </div>
          </section>
        );
      default: return null;
    }
  };

  // ── Column C ──────────────────────────────────────────────────────────
  const renderColC = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-5">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Profile</h3>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-5">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Skills</h3>
            <div className="flex flex-col gap-1">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[10px] font-medium text-gray-700">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-5">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Certifications</h3>
            <div className="space-y-1.5">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-[10px]">
                  <span className="font-semibold text-gray-800 block">
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
          <div key="languages" className="mb-5">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Languages</h3>
            <div className="space-y-1">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-[10px] flex justify-between">
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
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-5">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Interests</h3>
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

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Masthead ── */}
      <header className="relative border-b-4 border-gray-900 px-8 pt-10 pb-6">
        {/* Large decorative letter */}
        <div className={`absolute top-0 right-8 text-[120px] font-black leading-none ${accentText} opacity-5 select-none pointer-events-none`}>
          {(data.name || 'R').charAt(0).toUpperCase()}
        </div>

        <div className="flex justify-between items-end gap-8 flex-wrap relative z-10">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
            </h1>
            <p className={`text-[13px] font-bold ${accentText} uppercase tracking-[0.25em] mt-2`}>
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
            </p>
          </div>
          <div className="text-[10px] text-gray-500 text-right space-y-0.5">
            {data.email    && <div><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></div>}
            {data.phone    && <div><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></div>}
            {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
            {data.linkedin && <div><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></div>}
            {data.github   && <div><EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></div>}
          </div>
        </div>
      </header>

      {/* ── 3-column editorial grid ── */}
      <div className="flex gap-0 min-h-[200mm]">

        {/* Column A — 40% */}
        <div className="w-[40%] px-7 pt-7 pb-7 border-r border-gray-100">
          {colA.map(id => renderColA(id))}
        </div>

        {/* Column B — 35% */}
        <div className="w-[35%] px-6 pt-7 pb-7 border-r border-gray-100">
          {colB.map(id => renderColB(id))}
        </div>

        {/* Column C — 25% */}
        <div className="w-[25%] px-5 pt-7 pb-7 bg-gray-50">
          {colC.map(id => renderColC(id))}
        </div>

      </div>
    </div>
  );
};

export default Layout24;
