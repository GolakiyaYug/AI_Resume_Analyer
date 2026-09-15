import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 31: Executive Corporate Resume
//
// Completely unique structure — a "T-shaped" executive layout:
//
//  ┌──────────────────────────────────────────────────────────┐
//  │         PREMIUM FULL-WIDTH NAME + TITLE BANNER           │
//  │              (centered, large, with gold rule)           │
//  ├──────────────────────────────────────────────────────────┤
//  │  CONTACT (left)  │  EXECUTIVE PROFILE (center)  │  META │
//  │    tight column  │     summary / competencies    │ right │
//  ├──────────────────────────────────────────────────────────┤
//  │         FULL-WIDTH EXPERIENCE / EDUCATION etc.           │
//  │         each entry: left date column + right content     │
//  └──────────────────────────────────────────────────────────┘
//
// Key differentiators:
//  • Name and title as a centered premium masthead (no sidebar)
//  • Horizontal info belt below the name (3 equal cells)
//  • Experience entries use a wide left-date + right-content table pattern
//  • Skills rendered as 2-column inline text blocks with category dots
//  • Projects shown as slim ruled rows (title | description | link)
//  • All section headings: small-caps with dual thin rules flanking

const Layout31 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary  || 'bg-slate-800';
  const accentText = theme?.primary    || 'text-slate-800';
  const accentBdr  = theme?.border     || 'border-slate-800';
  const mutedText  = theme?.textMuted  || 'text-gray-500';

  // ── Dual-rule section heading (flanked by thin lines) ───────────────
  const SectionHeading = ({ title }) => (
    <div className="flex items-center gap-4 mb-5">
      <div className={`h-px flex-1 ${accentBdr.replace('border', 'bg')}`} />
      <h2
        className={`text-[10px] font-bold uppercase tracking-[0.35em] ${accentText} whitespace-nowrap`}
        style={{ fontVariant: 'small-caps' }}
      >
        {title}
      </h2>
      <div className={`h-px flex-1 ${accentBdr.replace('border', 'bg')}`} />
    </div>
  );

  // ── Entry row: date on left (fixed width), content on right ─────────
  const EntryRow = ({ dateNode, children }) => (
    <div className="flex gap-6 mb-6">
      <div className="w-[90px] shrink-0 text-right">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
          {dateNode}
        </span>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-7">
            <SectionHeading title="Executive Profile" />
            <div className="px-4 text-[12px] leading-relaxed text-gray-700">
              <EditableField
                value={data.summary}
                onSave={v => handleInlineEdit('summary', v)}
                placeholder="Write your executive profile summary…"
                multiline
              />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <SectionHeading title="Career History" />
            <div>
              {data.experience?.map((exp, idx) => (
                <EntryRow
                  key={exp.id || idx}
                  dateNode={
                    <EditableField
                      value={exp.date}
                      onSave={v => updateArrayItem('experience', idx, 'date', v)}
                      placeholder="Period"
                    />
                  }
                >
                  <div className="mb-0.5">
                    <h3 className="font-bold text-[14px] text-gray-900 leading-tight">
                      <EditableField
                        value={exp.title}
                        onSave={v => updateArrayItem('experience', idx, 'title', v)}
                        placeholder="Position Title"
                      />
                    </h3>
                    <p className={`text-[12px] font-semibold ${accentText} mt-0.5`}>
                      <EditableField
                        value={exp.company}
                        onSave={v => updateArrayItem('experience', idx, 'company', v)}
                        placeholder="Organisation"
                      />
                      {exp.location && (
                        <span className={`font-normal ml-2 ${mutedText}`}>
                          — <EditableField
                            value={exp.location}
                            onSave={v => updateArrayItem('experience', idx, 'location', v)}
                            placeholder="Location"
                          />
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap mt-1.5 border-l-2 border-gray-100 pl-3">
                    <EditableField
                      value={exp.desc}
                      onSave={v => updateArrayItem('experience', idx, 'desc', v)}
                      placeholder="Key responsibilities and achievements…"
                      multiline
                    />
                  </div>
                </EntryRow>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-7">
            <SectionHeading title="Education & Qualifications" />
            <div>
              {data.education?.map((edu, idx) => (
                <EntryRow
                  key={edu.id || idx}
                  dateNode={
                    <EditableField
                      value={edu.date}
                      onSave={v => updateArrayItem('education', idx, 'date', v)}
                      placeholder="Year"
                    />
                  }
                >
                  <h3 className="font-bold text-[13px] text-gray-900">
                    <EditableField
                      value={edu.degree}
                      onSave={v => updateArrayItem('education', idx, 'degree', v)}
                      placeholder="Degree / Qualification"
                    />
                  </h3>
                  <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                    <EditableField
                      value={edu.school}
                      onSave={v => updateArrayItem('education', idx, 'school', v)}
                      placeholder="Institution"
                    />
                  </p>
                </EntryRow>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-7">
            <SectionHeading title="Core Competencies" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-1.5 px-4">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="flex items-center gap-2 text-[12px] text-gray-700">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentBg}`} />
                  <EditableField
                    value={skill}
                    onSave={v => updateSimpleArrayItem('skills', idx, v)}
                    placeholder="Competency"
                  />
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <SectionHeading title="Notable Initiatives" />
            <div className="divide-y divide-gray-100">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="py-3 flex gap-6">
                  <div className="w-[180px] shrink-0">
                    <h3 className="font-bold text-[12px] text-gray-900 leading-tight">
                      <EditableField
                        value={proj.title}
                        onSave={v => updateArrayItem('projects', idx, 'title', v)}
                        placeholder="Initiative Title"
                      />
                    </h3>
                    {proj.link && (
                      <p className={`text-[10px] ${accentText} font-medium mt-0.5 break-all`}>
                        <EditableField
                          value={proj.link}
                          onSave={v => updateArrayItem('projects', idx, 'link', v)}
                          placeholder="Reference / Link"
                        />
                      </p>
                    )}
                  </div>
                  <div className="flex-1 text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField
                      value={proj.desc}
                      onSave={v => updateArrayItem('projects', idx, 'desc', v)}
                      placeholder="Scope and outcome…"
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-7">
            <SectionHeading title="Awards & Recognition" />
            <div className="divide-y divide-gray-100">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="py-3 flex gap-6">
                  <h3 className="font-bold text-[12px] text-gray-900 w-[180px] shrink-0">
                    <EditableField
                      value={ach.title}
                      onSave={v => updateArrayItem('achievements', idx, 'title', v)}
                      placeholder="Award Title"
                    />
                  </h3>
                  {ach.desc && (
                    <p className="flex-1 text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField
                        value={ach.desc}
                        onSave={v => updateArrayItem('achievements', idx, 'desc', v)}
                        placeholder="Details…"
                        multiline
                      />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-7">
            <SectionHeading title="Certifications" />
            <div className="grid grid-cols-2 gap-x-10 gap-y-2 px-4">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex gap-2 items-start">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${accentBg}`} />
                  <div>
                    <p className="text-[12px] font-semibold text-gray-800">
                      <EditableField
                        value={cert.title}
                        onSave={v => updateArrayItem('certifications', idx, 'title', v)}
                        placeholder="Certification"
                      />
                    </p>
                    {cert.date && (
                      <p className={`text-[10px] ${mutedText}`}>
                        <EditableField
                          value={cert.date}
                          onSave={v => updateArrayItem('certifications', idx, 'date', v)}
                          placeholder="Issuer / Date"
                        />
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-7">
            <SectionHeading title="Languages" />
            <div className="flex flex-wrap gap-x-10 gap-y-1.5 px-4">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex items-center gap-2 text-[12px]">
                  <span className="font-semibold text-gray-800">
                    <EditableField
                      value={lang.name}
                      onSave={v => updateArrayItem('languages', idx, 'name', v)}
                      placeholder="Language"
                    />
                  </span>
                  <span className={`text-[10px] ${mutedText} font-medium`}>
                    <EditableField
                      value={lang.fluency}
                      onSave={v => updateArrayItem('languages', idx, 'fluency', v)}
                      placeholder="Level"
                    />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-7">
            <SectionHeading title="Interests" />
            <div className="flex flex-wrap gap-x-8 gap-y-1 px-4">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className={`text-[12px] ${mutedText}`}>
                  <EditableField
                    value={interest}
                    onSave={v => updateSimpleArrayItem('interests', idx, v)}
                    placeholder="Interest"
                  />
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Premium masthead: full-width centered name banner ── */}
      <header className="bg-white pt-10 pb-0 text-center border-b-0">
        {/* Thin top rule */}
        <div className={`mx-10 h-[3px] ${accentBg} mb-6`} />

        <h1 className="text-[38px] font-black text-gray-900 tracking-[0.05em] uppercase leading-none px-8">
          <EditableField
            value={data.name}
            onSave={v => handleInlineEdit('name', v)}
            placeholder="Executive Name"
          />
        </h1>
        <p className={`text-[13px] font-semibold uppercase tracking-[0.4em] ${accentText} mt-2`}>
          <EditableField
            value={data.title}
            onSave={v => handleInlineEdit('title', v)}
            placeholder="Chief Executive Officer"
          />
        </p>

        {/* Double rule: thin + thick */}
        <div className="mx-10 mt-5">
          <div className="h-px bg-gray-300" />
          <div className={`h-[3px] ${accentBg} mt-1`} />
        </div>
      </header>

      {/* ── Three-cell horizontal info belt ── */}
      <div className="grid grid-cols-3 border-b border-gray-200">

        {/* Cell 1: Contact */}
        <div className="px-8 py-5 border-r border-gray-200">
          <p className={`text-[8px] font-black uppercase tracking-[0.35em] ${accentText} mb-3`}>Contact</p>
          <div className={`space-y-1 text-[11px] text-gray-600`}>
            {data.email && (
              <div>
                <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="email@address.com" />
              </div>
            )}
            {data.phone && (
              <div>
                <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="+1 (555) 000-0000" />
              </div>
            )}
            {data.location && (
              <div>
                <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="City, Country" />
              </div>
            )}
            {data.linkedin && (
              <div className="truncate">
                <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="linkedin.com/in/…" />
              </div>
            )}
            {data.github && (
              <div className="truncate">
                <EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="github.com/…" />
              </div>
            )}
            {data.portfolio && (
              <div className="truncate">
                <EditableField value={data.portfolio} onSave={v => handleInlineEdit('portfolio', v)} placeholder="portfolio.com" />
              </div>
            )}
          </div>
        </div>

        {/* Cell 2: Executive summary (center) */}
        <div className="px-8 py-5 border-r border-gray-200">
          <p className={`text-[8px] font-black uppercase tracking-[0.35em] ${accentText} mb-3`}>Profile Snapshot</p>
          <div className="text-[11px] text-gray-700 leading-relaxed">
            {data.summary ? (
              <EditableField
                value={data.summary}
                onSave={v => handleInlineEdit('summary', v)}
                placeholder="One-line executive profile…"
                multiline
              />
            ) : (
              <span className="text-gray-400 italic">Add your executive summary…</span>
            )}
          </div>
        </div>

        {/* Cell 3: Key facts / skills preview */}
        <div className="px-8 py-5">
          <p className={`text-[8px] font-black uppercase tracking-[0.35em] ${accentText} mb-3`}>Key Expertise</p>
          <div className="space-y-1">
            {data.skills?.slice(0, 6).map((skill, idx) => skill && (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-700">
                <span className={`w-1 h-1 rounded-full shrink-0 ${accentBg}`} />
                <EditableField
                  value={skill}
                  onSave={v => updateSimpleArrayItem('skills', idx, v)}
                  placeholder="Skill"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main body: full-width sections ── */}
      <main className="px-10 pt-8 pb-10">
        {sectionsOrder
          .filter(id => id !== 'summary') // summary already shown in belt
          .map(id => renderSection(id))}
      </main>

    </div>
  );
};

export default Layout31;
