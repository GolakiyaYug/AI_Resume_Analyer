import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 34: Creative Magazine Resume
//
// Completely unique structure — editorial / broadsheet newspaper layout:
//
//  ┌────────────────────────────────────────────────────────────┐
//  │  ██████████████████████████████████████████████████████   │
//  │  █ BANNER: Name as oversized left-anchored masthead,    █  │
//  │  █ with "Issue" label top-right & horizontal rule belt  █  │
//  │  ██████████████████████████████████████████████████████   │
//  │  ┌──────────────────────┐  ┌────────────────────────┐     │
//  │  │ LEFT WIDE COLUMN     │  │ RIGHT NARROW COLUMN    │     │
//  │  │ (65%) — Experience   │  │ (35%) — Skills, Edu,   │     │
//  │  │ and Summary flow     │  │ Certs, Languages,      │     │
//  │  │ as editorial copy    │  │ Interests              │     │
//  │  │                      │  │ (no color bg, just     │     │
//  │  │ Projects as inset    │  │ clean typographic      │     │
//  │  │ quote-box style      │  │ list format)           │     │
//  │  └──────────────────────┘  └────────────────────────┘     │
//  │  ─────────────── FULL-WIDTH RULED FOOTER ───────────────   │
//  └────────────────────────────────────────────────────────────┘
//
// Key differentiators:
//  • Name is NOT centered — it's left-anchored in huge editorial type with an
//    "edition" label top-right (broadsheet layout, never done in 1–33)
//  • Split is 65/35 (not 60/40 or 50/50 or sidebar-type)
//  • Left column uses vertical text rule separator between columns
//  • Experience shown with oversized company name as chapter heading
//  • Projects shown as inset "pullquote" box with border-left styling
//  • Skills in right column as spaced rows with small number badges
//  • Contact info is embedded INSIDE the header masthead belt (not a separate section)

const Layout34 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary  || 'bg-rose-700';
  const accentText = theme?.primary    || 'text-rose-700';
  const accentBdr  = theme?.border     || 'border-rose-700';

  // ── Left-column sections ────────────────────────────────────────────
  const leftSections  = ['summary', 'experience', 'projects', 'achievements'];
  // ── Right-column sections ───────────────────────────────────────────
  const rightSections = ['skills', 'education', 'certifications', 'languages', 'interests'];

  // ── Right-column section heading ────────────────────────────────────
  const RightHeading = ({ children }) => (
    <div className="mb-3">
      <h2 className={`text-[9px] font-black uppercase tracking-[0.35em] ${accentText}`}>{children}</h2>
      <div className={`h-px ${accentBdr.replace('border', 'bg')} mt-1`} />
    </div>
  );

  const renderLeft = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-7">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-200 pb-1">
              About
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-700">
              <EditableField
                value={data.summary}
                onSave={v => handleInlineEdit('summary', v)}
                placeholder="Your editorial professional summary…"
                multiline
              />
            </p>
          </div>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-7">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5 border-b border-gray-200 pb-1">
              Career
            </h2>
            <div className="space-y-7">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  {/* Company as chapter heading */}
                  <div className="flex justify-between items-baseline mb-1 flex-wrap gap-2">
                    <h3 className="text-[18px] font-black text-gray-900 leading-tight uppercase tracking-tight">
                      <EditableField
                        value={exp.company}
                        onSave={v => updateArrayItem('experience', idx, 'company', v)}
                        placeholder="Company Name"
                      />
                    </h3>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                      <EditableField
                        value={exp.date}
                        onSave={v => updateArrayItem('experience', idx, 'date', v)}
                        placeholder="Period"
                      />
                    </span>
                  </div>
                  {/* Title as italic byline */}
                  <p className={`text-[13px] italic ${accentText} mb-2`}>
                    <EditableField
                      value={exp.title}
                      onSave={v => updateArrayItem('experience', idx, 'title', v)}
                      placeholder="Your Role Title"
                    />
                    {exp.location && (
                      <span className="not-italic text-gray-400 ml-2 text-[11px]">
                        — <EditableField
                          value={exp.location}
                          onSave={v => updateArrayItem('experience', idx, 'location', v)}
                          placeholder="Location"
                        />
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField
                      value={exp.desc}
                      onSave={v => updateArrayItem('experience', idx, 'desc', v)}
                      placeholder="Responsibilities and achievements…"
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-7">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 border-b border-gray-200 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                // Inset "pullquote" box style
                <div key={proj.id || idx} className={`pl-4 border-l-4 ${accentBdr}`}>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="font-black text-[14px] text-gray-900 uppercase tracking-tight">
                      <EditableField
                        value={proj.title}
                        onSave={v => updateArrayItem('projects', idx, 'title', v)}
                        placeholder="Project Title"
                      />
                    </h3>
                    {proj.link && (
                      <span className="text-[10px] text-gray-400 italic">
                        <EditableField
                          value={proj.link}
                          onSave={v => updateArrayItem('projects', idx, 'link', v)}
                          placeholder="link"
                        />
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap mt-1.5">
                    <EditableField
                      value={proj.desc}
                      onSave={v => updateArrayItem('projects', idx, 'desc', v)}
                      placeholder="Project description…"
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-7">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 border-b border-gray-200 pb-1">
              Recognition
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[13px] text-gray-900">
                    <EditableField
                      value={ach.title}
                      onSave={v => updateArrayItem('achievements', idx, 'title', v)}
                      placeholder="Award / Honour"
                    />
                  </h3>
                  {ach.desc && (
                    <p className="text-[11px] text-gray-500 leading-relaxed whitespace-pre-wrap italic">
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
          </div>
        );

      default: return null;
    }
  };

  const renderRight = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <RightHeading>Skills</RightHeading>
            <div className="space-y-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`text-[9px] font-black w-5 h-5 rounded-full ${accentBg} text-white flex items-center justify-center shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-[12px] text-gray-800">
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
            <RightHeading>Education</RightHeading>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900 leading-tight">
                    <EditableField
                      value={edu.degree}
                      onSave={v => updateArrayItem('education', idx, 'degree', v)}
                      placeholder="Degree"
                    />
                  </h3>
                  <p className={`text-[11px] ${accentText} italic`}>
                    <EditableField
                      value={edu.school}
                      onSave={v => updateArrayItem('education', idx, 'school', v)}
                      placeholder="Institution"
                    />
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
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
            <RightHeading>Certifications</RightHeading>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <p className="text-[11px] font-semibold text-gray-800">
                    <EditableField
                      value={cert.title}
                      onSave={v => updateArrayItem('certifications', idx, 'title', v)}
                      placeholder="Certification"
                    />
                  </p>
                  {cert.date && (
                    <p className="text-[10px] text-gray-400">
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
            <RightHeading>Languages</RightHeading>
            <div className="space-y-1.5">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between text-[11px]">
                  <span className="font-semibold text-gray-800">
                    <EditableField
                      value={lang.name}
                      onSave={v => updateArrayItem('languages', idx, 'name', v)}
                      placeholder="Language"
                    />
                  </span>
                  <span className="text-gray-400 italic">
                    <EditableField
                      value={lang.fluency}
                      onSave={v => updateArrayItem('languages', idx, 'fluency', v)}
                      placeholder="Level"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-6">
            <RightHeading>Interests</RightHeading>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField
                    value={interest}
                    onSave={v => updateSimpleArrayItem('interests', idx, v)}
                    placeholder="Interest"
                  />
                  {idx < data.interests.length - 1 && <span className="mx-1 text-gray-300">/</span>}
                </span>
              ))}
            </p>
          </div>
        );

      default: return null;
    }
  };

  const leftContent  = sectionsOrder.filter(s => leftSections.includes(s));
  const rightContent = sectionsOrder.filter(s => rightSections.includes(s));
  const other        = sectionsOrder.filter(s => !leftSections.includes(s) && !rightSections.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Editorial masthead header ── */}
      <header className="border-b-4 border-black px-8 pt-6 pb-0">

        {/* Top info bar */}
        <div className="flex justify-between items-center mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">
          <span>Curriculum Vitæ</span>
          <div className="flex gap-5">
            {data.email && (
              <span><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="email" /></span>
            )}
            {data.phone && (
              <span><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="phone" /></span>
            )}
            {data.location && (
              <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="location" /></span>
            )}
          </div>
        </div>

        {/* Thin rule */}
        <div className="h-px bg-gray-300 mb-3" />

        {/* Name + title */}
        <div className="flex justify-between items-end gap-4 pb-4">
          <h1 className="text-[50px] font-black leading-none tracking-tighter text-gray-900 uppercase flex-1 min-w-0">
            <EditableField
              value={data.name}
              onSave={v => handleInlineEdit('name', v)}
              placeholder="Your Name"
            />
          </h1>
          <div className="text-right shrink-0 mb-1">
            <p className="text-[14px] italic text-gray-500">
              <EditableField
                value={data.title}
                onSave={v => handleInlineEdit('title', v)}
                placeholder="Professional Title"
              />
            </p>
            {(data.linkedin || data.github || data.portfolio) && (
              <div className="text-[9px] text-gray-400 mt-1 space-y-0.5">
                {data.linkedin && <div><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="linkedin" /></div>}
                {data.github && <div><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="github" /></div>}
                {data.portfolio && <div><EditableField value={data.portfolio} onSave={v => handleInlineEdit('portfolio', v)} placeholder="portfolio" /></div>}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Editorial body: 65% / 35% columns with ruled vertical separator ── */}
      <div className="flex">

        {/* Left column (65%) */}
        <div className="w-[65%] px-8 pt-6 pb-8 border-r-2 border-gray-200">
          {leftContent.map(id => renderLeft(id))}
          {other.map(id => renderLeft(id))}
        </div>

        {/* Right column (35%) */}
        <div className="w-[35%] px-6 pt-6 pb-8">
          {rightContent.map(id => renderRight(id))}
        </div>
      </div>

    </div>
  );
};

export default Layout34;
