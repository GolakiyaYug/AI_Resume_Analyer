import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 33: Minimal Elegant Resume
//
// Completely unique structure — extreme whitespace, typographic hierarchy only:
//
//  ┌──────────────────────────────────────────────────────────┐
//  │                                                          │
//  │   FULL NAME (very large serif, centered, no color)       │
//  │                                                          │
//  │   ─────── thin hairline rule ──────────────────────      │
//  │                                                          │
//  │   title · email · phone · location  (1 gentle line)      │
//  │                                                          │
//  │   ─────── thin hairline rule ──────────────────────      │
//  │                                                          │
//  │  [SECTION LABEL]  content in wide generous column        │
//  │                   no colored boxes, no sidebars          │
//  │                   date aligned far right on same line    │
//  │                                                          │
//  │  [SECTION LABEL]  …                                      │
//  │                                                          │
//  └──────────────────────────────────────────────────────────┘
//
// Key differentiators:
//  • Absolutely NO colored backgrounds — pure white throughout
//  • Section labels are tiny uppercase left-margin annotations (not inline headings)
//  • Content flows in wide single central column (no multi-column layout)
//  • Dates shown on the far right of the entry row (table-like alignment)
//  • Skills: horizontal comma-separated elegant list, no chips/bubbles
//  • Experience: company bold + title italic + date right — very different hierarchy
//  • Huge breathing room between every element

const Layout33 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-gray-700';

  // ── Small-caps left-margin section annotation ─────────────────────
  const Annotation = ({ children }) => (
    <div className="w-[100px] shrink-0 pt-0.5">
      <p
        className="text-[8px] font-bold uppercase tracking-[0.35em] text-gray-400"
        style={{ fontVariant: 'small-caps' }}
      >
        {children}
      </p>
    </div>
  );

  // ── Section row container: annotation left + content right ────────
  const Row = ({ label, children }) => (
    <div className="flex gap-8 mb-10">
      <Annotation>{label}</Annotation>
      <div className="flex-1">{children}</div>
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {

      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <Row key="summary" label="Profile">
            <p className="text-[12.5px] leading-relaxed text-gray-600 font-light">
              <EditableField
                value={data.summary}
                onSave={v => handleInlineEdit('summary', v)}
                placeholder="A brief, thoughtful professional summary…"
                multiline
              />
            </p>
          </Row>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <Row key="experience" label="Experience">
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  {/* Company + Date on one line */}
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[14px] font-bold text-gray-900">
                      <EditableField
                        value={exp.company}
                        onSave={v => updateArrayItem('experience', idx, 'company', v)}
                        placeholder="Company Name"
                      />
                    </h3>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide shrink-0 ml-4">
                      <EditableField
                        value={exp.date}
                        onSave={v => updateArrayItem('experience', idx, 'date', v)}
                        placeholder="2020 – Present"
                      />
                    </span>
                  </div>
                  {/* Title (italic, below) */}
                  <p className="text-[12px] italic text-gray-500 mt-0.5 mb-2">
                    <EditableField
                      value={exp.title}
                      onSave={v => updateArrayItem('experience', idx, 'title', v)}
                      placeholder="Job Title"
                    />
                    {exp.location && (
                      <span className="not-italic text-gray-400 ml-2">
                        · <EditableField
                          value={exp.location}
                          onSave={v => updateArrayItem('experience', idx, 'location', v)}
                          placeholder="Location"
                        />
                      </span>
                    )}
                  </p>
                  {/* Description */}
                  <p className="text-[11.5px] text-gray-600 leading-relaxed whitespace-pre-wrap font-light">
                    <EditableField
                      value={exp.desc}
                      onSave={v => updateArrayItem('experience', idx, 'desc', v)}
                      placeholder="Describe your responsibilities and impact…"
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </Row>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <Row key="education" label="Education">
            <div className="space-y-5">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[13px] font-bold text-gray-900">
                      <EditableField
                        value={edu.degree}
                        onSave={v => updateArrayItem('education', idx, 'degree', v)}
                        placeholder="Degree"
                      />
                    </h3>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide shrink-0 ml-4">
                      <EditableField
                        value={edu.date}
                        onSave={v => updateArrayItem('education', idx, 'date', v)}
                        placeholder="Year"
                      />
                    </span>
                  </div>
                  <p className="text-[12px] italic text-gray-500 mt-0.5">
                    <EditableField
                      value={edu.school}
                      onSave={v => updateArrayItem('education', idx, 'school', v)}
                      placeholder="Institution"
                    />
                  </p>
                </div>
              ))}
            </div>
          </Row>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <Row key="skills" label="Skills">
            <p className="text-[12px] text-gray-600 leading-relaxed font-light">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx}>
                  <EditableField
                    value={skill}
                    onSave={v => updateSimpleArrayItem('skills', idx, v)}
                    placeholder="Skill"
                  />
                  {idx < data.skills.length - 1 && (
                    <span className="text-gray-300 mx-1.5">,</span>
                  )}
                </span>
              ))}
            </p>
          </Row>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <Row key="projects" label="Projects">
            <div className="space-y-6">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-[13px] font-bold text-gray-900">
                      <EditableField
                        value={proj.title}
                        onSave={v => updateArrayItem('projects', idx, 'title', v)}
                        placeholder="Project Title"
                      />
                    </h3>
                    {proj.link && (
                      <span className="text-[10px] italic text-gray-400">
                        <EditableField
                          value={proj.link}
                          onSave={v => updateArrayItem('projects', idx, 'link', v)}
                          placeholder="link"
                        />
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-gray-600 leading-relaxed whitespace-pre-wrap font-light mt-1">
                    <EditableField
                      value={proj.desc}
                      onSave={v => updateArrayItem('projects', idx, 'desc', v)}
                      placeholder="What this project does, your role, and its outcome…"
                      multiline
                    />
                  </p>
                </div>
              ))}
            </div>
          </Row>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <Row key="certifications" label="Licences">
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline">
                  <span className="text-[12px] text-gray-700">
                    <EditableField
                      value={cert.title}
                      onSave={v => updateArrayItem('certifications', idx, 'title', v)}
                      placeholder="Certification Name"
                    />
                  </span>
                  {cert.date && (
                    <span className="text-[10px] text-gray-400 ml-4 shrink-0">
                      <EditableField
                        value={cert.date}
                        onSave={v => updateArrayItem('certifications', idx, 'date', v)}
                        placeholder="Date"
                      />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Row>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <Row key="languages" label="Languages">
            <p className="text-[12px] text-gray-600 font-light">
              {data.languages?.map((lang, idx) => (
                <span key={lang.id || idx}>
                  <span className="font-medium text-gray-800">
                    <EditableField
                      value={lang.name}
                      onSave={v => updateArrayItem('languages', idx, 'name', v)}
                      placeholder="Language"
                    />
                  </span>
                  <span className="text-gray-400 ml-1 italic">
                    (<EditableField
                      value={lang.fluency}
                      onSave={v => updateArrayItem('languages', idx, 'fluency', v)}
                      placeholder="level"
                    />)
                  </span>
                  {idx < data.languages.length - 1 && <span className="text-gray-300 mx-2">·</span>}
                </span>
              ))}
            </p>
          </Row>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <Row key="achievements" label="Honours">
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="text-[12.5px] font-bold text-gray-800">
                    <EditableField
                      value={ach.title}
                      onSave={v => updateArrayItem('achievements', idx, 'title', v)}
                      placeholder="Award or Recognition"
                    />
                  </h3>
                  {ach.desc && (
                    <p className="text-[11px] text-gray-500 font-light leading-relaxed whitespace-pre-wrap mt-0.5">
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
          </Row>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <Row key="interests" label="Interests">
            <p className="text-[12px] text-gray-500 font-light italic">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField
                    value={interest}
                    onSave={v => updateSimpleArrayItem('interests', idx, v)}
                    placeholder="Interest"
                  />
                  {idx < data.interests.length - 1 && <span className="not-italic text-gray-300 mx-1.5">·</span>}
                </span>
              ))}
            </p>
          </Row>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-serif">

      {/* ── Pure typographic header ── */}
      <header className="px-14 pt-14 pb-0">

        {/* Large centered name */}
        <h1 className="text-[44px] font-bold text-gray-900 text-center leading-tight tracking-[-0.01em] mb-3">
          <EditableField
            value={data.name}
            onSave={v => handleInlineEdit('name', v)}
            placeholder="Your Full Name"
          />
        </h1>

        {/* Hairline rule */}
        <div className="h-px bg-gray-300 mb-4" />

        {/* Single contact line */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] text-gray-500 font-sans font-light tracking-wide mb-4">
          {data.title && (
            <span className="font-medium text-gray-700 italic">
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
            </span>
          )}
          {data.email && (
            <span>
              <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="email" />
            </span>
          )}
          {data.phone && (
            <span>
              <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="phone" />
            </span>
          )}
          {data.location && (
            <span>
              <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="location" />
            </span>
          )}
          {data.linkedin && (
            <span>
              <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="linkedin" />
            </span>
          )}
          {data.github && (
            <span>
              <EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="github" />
            </span>
          )}
          {data.portfolio && (
            <span>
              <EditableField value={data.portfolio} onSave={v => handleInlineEdit('portfolio', v)} placeholder="portfolio" />
            </span>
          )}
        </div>

        {/* Second hairline rule */}
        <div className="h-px bg-gray-200" />
      </header>

      {/* ── Body: annotation + content rows ── */}
      <main className="px-14 pt-12 pb-14">
        {sectionsOrder.map(id => renderSection(id))}
      </main>

    </div>
  );
};

export default Layout33;
