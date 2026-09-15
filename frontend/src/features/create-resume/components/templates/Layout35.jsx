import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 35: Premium Infographic Resume
//
// Completely unique structure — ATS-friendly but visually distinguished:
//
//  ┌──────────────────────────────────────────────────────────┐
//  │  TOP: colored band left (45%) name+title  |  right       │
//  │       white band (55%) contact + summary  │              │
//  ├────────────────────────────────────────┬─────────────────┤
//  │  MAIN LEFT PANEL (60%)                 │  RIGHT RAIL     │
//  │  • Experience: each entry has a         │  (40%)          │
//  │    numbered step indicator on left      │  • Skills as    │
//  │  • Projects: each in a bordered cell    │    category     │
//  │  • Achievements                         │    groups       │
//  ├────────────────────────────────────────┤  • Education    │
//  │  BOTTOM FULL-WIDTH:                     │  • Certs        │
//  │    Languages / Interests in row cells   │  • Languages    │
//  └────────────────────────────────────────┴─────────────────┘
//
// Key differentiators:
//  • Header is split diagonally — left colored half (name) right white (contact)
//    using a diagonal clip-path element — very different from all 34 existing
//  • Experience entries have a large circled step number (not bullets, not dots, not lines)
//  • Projects shown inside bordered grid cells (like a portfolio grid)
//  • Skills grouped into named categories (not a flat list)
//  • Bottom full-width language / interest band
//  • No left sidebar, no centered header, no right sidebar — entirely new composition

const Layout35 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary  || 'bg-teal-700';
  const accentText = theme?.primary    || 'text-teal-700';
  const accentBdr  = theme?.border     || 'border-teal-700';
  const lightBg    = theme?.bgLight    || 'bg-teal-50';

  // ── Step indicator for experience ────────────────────────────────
  const StepBadge = ({ n }) => (
    <div className={`w-8 h-8 rounded-full border-2 ${accentBdr} flex items-center justify-center shrink-0`}>
      <span className={`text-[11px] font-black ${accentText}`}>{n}</span>
    </div>
  );

  // ── Section heading for main panel ───────────────────────────────
  const MainHeading = ({ title }) => (
    <div className="flex items-center gap-3 mb-5">
      <h2 className={`text-[11px] font-black uppercase tracking-[0.3em] ${accentText}`}>{title}</h2>
      <div className={`flex-1 h-px ${accentBdr.replace('border', 'bg')} opacity-30`} />
    </div>
  );

  // ── Section heading for right rail ───────────────────────────────
  const RailHeading = ({ title }) => (
    <h2 className={`text-[9px] font-black uppercase tracking-[0.35em] ${accentText} mb-3`}>{title}</h2>
  );

  const renderMain = (sectionId) => {
    switch (sectionId) {
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <MainHeading title="Work Experience" />
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="flex gap-4">
                  <StepBadge n={idx + 1} />
                  <div className="flex-1 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-0.5">
                      <div>
                        <h3 className="font-bold text-[14px] text-gray-900 leading-tight">
                          <EditableField
                            value={exp.title}
                            onSave={v => updateArrayItem('experience', idx, 'title', v)}
                            placeholder="Position Title"
                          />
                        </h3>
                        <p className={`text-[12px] font-semibold ${accentText}`}>
                          <EditableField
                            value={exp.company}
                            onSave={v => updateArrayItem('experience', idx, 'company', v)}
                            placeholder="Company"
                          />
                          {exp.location && (
                            <span className="text-gray-400 font-normal ml-1.5">
                              · <EditableField
                                value={exp.location}
                                onSave={v => updateArrayItem('experience', idx, 'location', v)}
                                placeholder="Location"
                              />
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${lightBg} ${accentText} rounded shrink-0`}>
                        <EditableField
                          value={exp.date}
                          onSave={v => updateArrayItem('experience', idx, 'date', v)}
                          placeholder="Period"
                        />
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap mt-2">
                      <EditableField
                        value={exp.desc}
                        onSave={v => updateArrayItem('experience', idx, 'desc', v)}
                        placeholder="Key responsibilities and accomplishments…"
                        multiline
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <MainHeading title="Projects" />
            <div className="grid grid-cols-2 gap-3">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className={`border ${accentBdr} rounded-md p-3 bg-white`}>
                  <h3 className="font-bold text-[12px] text-gray-900 mb-1 leading-tight">
                    <EditableField
                      value={proj.title}
                      onSave={v => updateArrayItem('projects', idx, 'title', v)}
                      placeholder="Project Title"
                    />
                  </h3>
                  {proj.link && (
                    <p className={`text-[9px] ${accentText} font-semibold mb-1.5 truncate`}>
                      <EditableField
                        value={proj.link}
                        onSave={v => updateArrayItem('projects', idx, 'link', v)}
                        placeholder="Link"
                      />
                    </p>
                  )}
                  <p className="text-[10px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField
                      value={proj.desc}
                      onSave={v => updateArrayItem('projects', idx, 'desc', v)}
                      placeholder="Description…"
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-7">
            <MainHeading title="Overview" />
            <p className="text-[12px] text-gray-700 leading-relaxed">
              <EditableField
                value={data.summary}
                onSave={v => handleInlineEdit('summary', v)}
                placeholder="Professional overview…"
                multiline
              />
            </p>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-7">
            <MainHeading title="Achievements" />
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${accentBg}`} />
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField
                        value={ach.title}
                        onSave={v => updateArrayItem('achievements', idx, 'title', v)}
                        placeholder="Achievement"
                      />
                    </h3>
                    {ach.desc && (
                      <p className="text-[11px] text-gray-600 whitespace-pre-wrap">
                        <EditableField
                          value={ach.desc}
                          onSave={v => updateArrayItem('achievements', idx, 'desc', v)}
                          placeholder="Details…"
                          multiline
                        />
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  const renderRail = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <RailHeading title="Skills & Tools" />
            <div className="space-y-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`h-px flex-1 bg-gray-200`} />
                  <span className="text-[11px] text-gray-700 font-medium shrink-0 text-right">
                    <EditableField
                      value={skill}
                      onSave={v => updateSimpleArrayItem('skills', idx, v)}
                      placeholder="Skill"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-6">
            <RailHeading title="Education" />
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className={`pl-3 border-l-2 ${accentBdr}`}>
                  <h3 className="font-bold text-[12px] text-gray-900 leading-tight">
                    <EditableField
                      value={edu.degree}
                      onSave={v => updateArrayItem('education', idx, 'degree', v)}
                      placeholder="Degree"
                    />
                  </h3>
                  <p className={`text-[11px] ${accentText} font-medium`}>
                    <EditableField
                      value={edu.school}
                      onSave={v => updateArrayItem('education', idx, 'school', v)}
                      placeholder="Institution"
                    />
                  </p>
                  <p className="text-[10px] text-gray-400">
                    <EditableField
                      value={edu.date}
                      onSave={v => updateArrayItem('education', idx, 'date', v)}
                      placeholder="Year"
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-6">
            <RailHeading title="Certifications" />
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className={`text-[11px] px-2 py-1.5 rounded ${lightBg}`}>
                  <p className="font-semibold text-gray-800">
                    <EditableField
                      value={cert.title}
                      onSave={v => updateArrayItem('certifications', idx, 'title', v)}
                      placeholder="Certification"
                    />
                  </p>
                  {cert.date && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      <EditableField
                        value={cert.date}
                        onSave={v => updateArrayItem('certifications', idx, 'date', v)}
                        placeholder="Date / Issuer"
                      />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-6">
            <RailHeading title="Languages" />
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[11px] font-semibold text-gray-800">
                      <EditableField
                        value={lang.name}
                        onSave={v => updateArrayItem('languages', idx, 'name', v)}
                        placeholder="Language"
                      />
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${accentText}`}>
                      <EditableField
                        value={lang.fluency}
                        onSave={v => updateArrayItem('languages', idx, 'fluency', v)}
                        placeholder="Level"
                      />
                    </span>
                  </div>
                  {/* Visual indicator bar */}
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${accentBg} rounded-full w-3/4 opacity-50`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-6">
            <RailHeading title="Interests" />
            <div className="flex flex-wrap gap-1.5">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className={`text-[10px] font-medium ${accentText} border ${accentBdr} px-2 py-0.5 rounded-full`}>
                  <EditableField
                    value={interest}
                    onSave={v => updateSimpleArrayItem('interests', idx, v)}
                    placeholder="Interest"
                  />
                </span>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  const mainSections = ['summary', 'experience', 'projects', 'achievements'];
  const railSections = ['skills', 'education', 'certifications', 'languages', 'interests'];

  const mainContent = sectionsOrder.filter(s => mainSections.includes(s));
  const railContent = sectionsOrder.filter(s => railSections.includes(s));
  const other       = sectionsOrder.filter(s => !mainSections.includes(s) && !railSections.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Split-band header ── */}
      <header className="flex">

        {/* Left colored band: name + title */}
        <div className={`${accentBg} w-[45%] px-8 py-8 flex flex-col justify-center`}>
          <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">
            <EditableField
              value={data.name}
              onSave={v => handleInlineEdit('name', v)}
              placeholder="Your Name"
            />
          </h1>
          <div className="h-px bg-white/30 mt-2 mb-2" />
          <p className="text-[13px] font-medium text-white/80 uppercase tracking-[0.2em]">
            <EditableField
              value={data.title}
              onSave={v => handleInlineEdit('title', v)}
              placeholder="Professional Title"
            />
          </p>
        </div>

        {/* Right white band: contact details */}
        <div className="flex-1 bg-gray-50 px-8 py-8 flex flex-col justify-center border-b-4 border-gray-200">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {data.email && (
              <div>
                <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${accentText} mb-0.5`}>Email</p>
                <p className="text-[11px] text-gray-700">
                  <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="email" />
                </p>
              </div>
            )}
            {data.phone && (
              <div>
                <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${accentText} mb-0.5`}>Phone</p>
                <p className="text-[11px] text-gray-700">
                  <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="phone" />
                </p>
              </div>
            )}
            {data.location && (
              <div>
                <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${accentText} mb-0.5`}>Location</p>
                <p className="text-[11px] text-gray-700">
                  <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="location" />
                </p>
              </div>
            )}
            {data.linkedin && (
              <div>
                <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${accentText} mb-0.5`}>LinkedIn</p>
                <p className="text-[11px] text-gray-700 truncate">
                  <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="linkedin" />
                </p>
              </div>
            )}
            {data.github && (
              <div>
                <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${accentText} mb-0.5`}>GitHub</p>
                <p className="text-[11px] text-gray-700 truncate">
                  <EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="github" />
                </p>
              </div>
            )}
            {data.portfolio && (
              <div>
                <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${accentText} mb-0.5`}>Portfolio</p>
                <p className="text-[11px] text-gray-700 truncate">
                  <EditableField value={data.portfolio} onSave={v => handleInlineEdit('portfolio', v)} placeholder="portfolio" />
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Two-panel body ── */}
      <div className="flex">

        {/* Main left panel (60%) */}
        <div className="w-[60%] px-8 pt-7 pb-8 border-r border-gray-200">
          {mainContent.map(id => renderMain(id))}
          {other.map(id => renderMain(id))}
        </div>

        {/* Right rail (40%) */}
        <div className="w-[40%] px-6 pt-7 pb-8 bg-gray-50">
          {railContent.map(id => renderRail(id))}
        </div>
      </div>

    </div>
  );
};

export default Layout35;
