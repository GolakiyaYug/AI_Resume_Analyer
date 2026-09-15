import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 30: Futuristic Professional Resume
// Structure is an entirely new composition:
//
//   • Narrow header strip: dark full-width bar with name left-anchored and a MONOSPACE
//     terminal-style "> role" prefix on the title
//   • Below header: LEFT RAIL (28%) — compact dark panel with contact, skills, and certs
//     displayed as key-value terminal entries
//   • RIGHT MAIN (72%) — white panel, each section uses a CODE-FILE-style path heading
//     e.g.  ~/experience/  ~/education/  ~/projects/
//   • Experience entries use a diff-style (+) indicator prefix on achievements
//   • The entire aesthetic references developer tooling / terminals without being illegible
const Layout30 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-cyan-600';
  const accentText  = theme?.primary   || 'text-cyan-600';
  const accentBorder = theme?.border   || 'border-cyan-600';

  // ── Section path heading style ─────────────────────────────────────
  const PathHeading = ({ path }) => (
    <div className="flex items-center gap-2 mb-4">
      <span className={`font-mono text-[11px] font-bold ${accentText}`}>~/</span>
      <span className="font-mono text-[11px] font-bold text-gray-500">{path}/</span>
      <div className="flex-1 border-t border-dashed border-gray-200" />
    </div>
  );

  const renderMainSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-8">
            <PathHeading path="about" />
            <div className="font-mono text-[11px] text-gray-700 leading-relaxed pl-4 border-l-2 border-dashed border-gray-200">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="// professional summary…" multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-8">
            <PathHeading path="experience" />
            <div className="space-y-7">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="pl-4 border-l-2 border-gray-200">
                  {/* Filename-style heading */}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline mb-1">
                    <span className={`font-mono text-[13px] font-black text-gray-900`}>
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="company-name" />
                    </span>
                    <span className={`font-mono text-[11px] font-bold ${accentText}`}>
                      [<EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="job-title" />]
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">
                      @<EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="date-range" />
                    </span>
                    {exp.location && <span className="font-mono text-[10px] text-gray-400">
                      (<EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="location" />)
                    </span>}
                  </div>
                  {/* Description as diff-style block */}
                  <div className="font-mono text-[10px] text-gray-600 whitespace-pre-wrap leading-relaxed mt-2">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="+ impact and responsibilities…" multiline />
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
            <PathHeading path="education" />
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="pl-4 border-l-2 border-gray-200 font-mono">
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline">
                    <span className="text-[12px] font-bold text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="degree-title" />
                    </span>
                    <span className={`text-[11px] ${accentText} font-semibold`}>
                      @<EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="institution" />
                    </span>
                    <span className="text-[10px] text-gray-400">
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="year" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-8">
            <PathHeading path="projects" />
            <div className="space-y-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="pl-4 border-l-2 border-gray-200 font-mono">
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline mb-1">
                    <span className="text-[12px] font-bold text-gray-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="project-name" />
                    </span>
                    {proj.link && <span className={`text-[10px] ${accentText}`}>
                      [<EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="url" />]
                    </span>}
                  </div>
                  <div className="text-[10px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="// description…" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-8">
            <PathHeading path="achievements" />
            <div className="space-y-3 pl-4 border-l-2 border-gray-200 font-mono">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <span className={`text-[11px] font-bold text-gray-900`}>
                    + <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="achievement" />
                  </span>
                  {ach.desc && <p className="text-[10px] text-gray-500 mt-0.5 ml-4">
                    <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="// details" />
                  </p>}
                </div>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  // Sections that belong in the left rail
  const railSections = ['skills', 'certifications', 'languages', 'interests'];
  const mainSections = ['summary', 'experience', 'education', 'projects', 'achievements'];

  const rail = sectionsOrder.filter(s => railSections.includes(s));
  const main = sectionsOrder.filter(s => mainSections.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-mono">

      {/* ── Terminal header strip ── */}
      <header className="bg-gray-950 px-7 py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
        {/* Traffic-light dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="your-name" />
          </h1>
          <p className="font-mono text-[12px] text-gray-400 mt-0.5">
            <span className={`${accentText} mr-1`}>&gt;</span>
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="professional-title" />
          </p>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex min-h-[240mm]">

        {/* Left rail — dark, terminal-key-value */}
        <div className="w-[28%] shrink-0 bg-gray-900 px-5 py-7 flex flex-col gap-6">

          {/* Contact block */}
          <div>
            <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.3em] ${accentText} mb-3`}>$ contact</p>
            <div className="font-mono text-[10px] text-gray-400 space-y-1.5">
              {data.email    && <div><span className="text-gray-600">email:</span> <EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="email" /></div>}
              {data.phone    && <div><span className="text-gray-600">phone:</span> <EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="phone" /></div>}
              {data.location && <div><span className="text-gray-600">loc:  </span> <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="location" /></div>}
              {data.linkedin && <div><span className="text-gray-600">in:   </span> <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="linkedin" /></div>}
              {data.github   && <div><span className="text-gray-600">gh:   </span> <EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="github" /></div>}
            </div>
          </div>

          {/* Skills */}
          {sectionsOrder.includes('skills') && data.skills?.length ? (
            <div>
              <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.3em] ${accentText} mb-3`}>$ skills[]</p>
              <div className="space-y-1">
                {data.skills?.map((skill, idx) => skill && (
                  <div key={idx} className="font-mono text-[10px] text-gray-300 flex items-center gap-1.5">
                    <span className="text-gray-600 shrink-0">-</span>
                    <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="skill" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Certifications */}
          {sectionsOrder.includes('certifications') && data.certifications?.length ? (
            <div>
              <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.3em] ${accentText} mb-3`}>$ certs[]</p>
              <div className="space-y-2">
                {data.certifications?.map((cert, idx) => (
                  <div key={cert.id || idx} className="font-mono text-[10px] text-gray-300">
                    <span className="text-gray-600">- </span>
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="certification" />
                    {cert.date && <span className="text-gray-500 ml-1">({cert.date})</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Languages */}
          {sectionsOrder.includes('languages') && data.languages?.length ? (
            <div>
              <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.3em] ${accentText} mb-3`}>$ languages</p>
              <div className="space-y-1.5">
                {data.languages?.map((lang, idx) => (
                  <div key={lang.id || idx} className="font-mono text-[10px] text-gray-300">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="language" />
                    <span className="text-gray-500 ml-1">: <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="level" /></span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Interests */}
          {sectionsOrder.includes('interests') && data.interests?.length ? (
            <div>
              <p className={`font-mono text-[9px] font-bold uppercase tracking-[0.3em] ${accentText} mb-3`}>$ interests</p>
              <div className="font-mono text-[10px] text-gray-300 leading-relaxed">
                {data.interests?.map((interest, idx) => interest && (
                  <span key={idx}>
                    <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="interest" />
                    {idx < data.interests.length - 1 && <span className="text-gray-600 mx-1">,</span>}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right main — white */}
        <div className="flex-1 bg-white px-8 py-7">
          {main.map(id => renderMainSection(id))}
        </div>

      </div>
    </div>
  );
};

export default Layout30;
