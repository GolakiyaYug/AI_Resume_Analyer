import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 32: Modern Portfolio Resume
//
// Completely unique structure — PROJECTS are the hero of this layout:
//
//  ┌──────────────────────────────────────────────────────────────┐
//  │  NARROW LEFT STRIP: Name (vertical) + contact stacked        │
//  │  (rotated name, tall and thin)                               │
//  │                                                              │
//  │  MAIN RIGHT AREA:                                            │
//  │    ┌─────────────────────────────────────────────────────┐   │
//  │    │  FEATURED PROJECTS — large numbered showcase cards  │   │
//  │    ├─────────────────────────────────────────────────────┤   │
//  │    │  SKILLS as horizontal category strips               │   │
//  │    ├─────────────────────────────────────────────────────┤   │
//  │    │  EXPERIENCE as compact table (company/title/date)   │   │
//  │    ├─────────────────────────────────────────────────────┤   │
//  │    │  EDUCATION / CERTS / LANGS as bottom footnote band  │   │
//  │    └─────────────────────────────────────────────────────┘   │
//  └──────────────────────────────────────────────────────────────┘
//
// Key differentiators:
//  • Vertical left strip with rotated name — very unusual header placement
//  • Projects as oversized numbered showcase cards (completely different from all others)
//  • Skills as flat labeled horizontal strips (not bubbles, not bullets, not columns)
//  • Experience as minimalist table rows (no long descriptions by default)
//  • Bottom "footnote" band for education / certs / languages in columns

const Layout32 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary  || 'bg-emerald-700';
  const accentText = theme?.primary    || 'text-emerald-700';
  const accentBdr  = theme?.border     || 'border-emerald-700';
  const lightBg    = theme?.bgLight    || 'bg-emerald-50';

  // ── Section label ────────────────────────────────────────────────────
  const Label = ({ children }) => (
    <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${accentText} mb-4`}>{children}</p>
  );

  // ── Horizontal divider ───────────────────────────────────────────────
  const Divider = () => <div className={`border-t-2 ${accentBdr} mb-6 mt-6`} />;

  const renderSection = (sectionId) => {
    switch (sectionId) {

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-0">
            <Label>Featured Work</Label>
            <div className="space-y-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="flex gap-5 group">
                  {/* Large project number */}
                  <div className={`text-[42px] font-black leading-none ${accentText} opacity-20 w-12 shrink-0 select-none mt-1`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  {/* Project content */}
                  <div className="flex-1 border-b border-gray-100 pb-5 last:border-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="font-black text-[15px] text-gray-900 tracking-tight">
                        <EditableField
                          value={proj.title}
                          onSave={v => updateArrayItem('projects', idx, 'title', v)}
                          placeholder="Project Title"
                        />
                      </h3>
                      {proj.link && (
                        <span className={`text-[10px] font-bold ${accentText} uppercase tracking-wider`}>
                          <EditableField
                            value={proj.link}
                            onSave={v => updateArrayItem('projects', idx, 'link', v)}
                            placeholder="Live / Repo Link"
                          />
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap mt-2">
                      <EditableField
                        value={proj.desc}
                        onSave={v => updateArrayItem('projects', idx, 'desc', v)}
                        placeholder="Describe the project, your role, and the impact…"
                        multiline
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-0">
            <Divider />
            <Label>Technical Skills</Label>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span
                  key={idx}
                  className={`text-[11px] font-semibold text-gray-700 border border-gray-300 px-3 py-1 rounded-sm`}
                >
                  <EditableField
                    value={skill}
                    onSave={v => updateSimpleArrayItem('skills', idx, v)}
                    placeholder="Skill"
                  />
                </span>
              ))}
            </div>
          </section>
        );

      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-0">
            <Divider />
            <Label>About</Label>
            <p className="text-[12px] text-gray-700 leading-relaxed">
              <EditableField
                value={data.summary}
                onSave={v => handleInlineEdit('summary', v)}
                placeholder="Short bio about you and your work…"
                multiline
              />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-0">
            <Divider />
            <Label>Experience</Label>
            <table className="w-full text-[11px]">
              <tbody>
                {data.experience?.map((exp, idx) => (
                  <tr key={exp.id || idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 pr-4 w-[120px] align-top">
                      <span className="text-[10px] text-gray-400 font-medium leading-tight block">
                        <EditableField
                          value={exp.date}
                          onSave={v => updateArrayItem('experience', idx, 'date', v)}
                          placeholder="Period"
                        />
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 align-top">
                      <div className="font-bold text-gray-900">
                        <EditableField
                          value={exp.title}
                          onSave={v => updateArrayItem('experience', idx, 'title', v)}
                          placeholder="Role"
                        />
                      </div>
                      <div className={`font-medium ${accentText} text-[11px]`}>
                        <EditableField
                          value={exp.company}
                          onSave={v => updateArrayItem('experience', idx, 'company', v)}
                          placeholder="Company"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 align-top text-gray-600 hidden md:table-cell">
                      <EditableField
                        value={exp.desc}
                        onSave={v => updateArrayItem('experience', idx, 'desc', v)}
                        placeholder="Key contribution…"
                        multiline
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-0">
            <Divider />
            <Label>Education</Label>
            <div className="space-y-2">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-baseline gap-3">
                  <div>
                    <span className="font-bold text-[12px] text-gray-900">
                      <EditableField
                        value={edu.degree}
                        onSave={v => updateArrayItem('education', idx, 'degree', v)}
                        placeholder="Degree"
                      />
                    </span>
                    <span className={`text-[11px] ${accentText} font-medium ml-2`}>
                      <EditableField
                        value={edu.school}
                        onSave={v => updateArrayItem('education', idx, 'school', v)}
                        placeholder="Institution"
                      />
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    <EditableField
                      value={edu.date}
                      onSave={v => updateArrayItem('education', idx, 'date', v)}
                      placeholder="Year"
                    />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-0">
            <Divider />
            <Label>Certifications</Label>
            <div className="space-y-1.5">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between text-[11px]">
                  <span className="font-semibold text-gray-800">
                    <EditableField
                      value={cert.title}
                      onSave={v => updateArrayItem('certifications', idx, 'title', v)}
                      placeholder="Certification"
                    />
                  </span>
                  {cert.date && (
                    <span className="text-gray-400">
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
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-0">
            <Divider />
            <Label>Languages</Label>
            <div className="flex flex-wrap gap-4">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-[11px]">
                  <span className="font-bold text-gray-900">
                    <EditableField
                      value={lang.name}
                      onSave={v => updateArrayItem('languages', idx, 'name', v)}
                      placeholder="Language"
                    />
                  </span>
                  <span className="text-gray-400 ml-1">
                    (<EditableField
                      value={lang.fluency}
                      onSave={v => updateArrayItem('languages', idx, 'fluency', v)}
                      placeholder="Level"
                    />)
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-0">
            <Divider />
            <Label>Achievements</Label>
            <div className="space-y-2">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
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
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-0">
            <Divider />
            <Label>Interests</Label>
            <p className="text-[11px] text-gray-600">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField
                    value={interest}
                    onSave={v => updateSimpleArrayItem('interests', idx, v)}
                    placeholder="Interest"
                  />
                  {idx < data.interests.length - 1 && <span className="mx-2 text-gray-300">·</span>}
                </span>
              ))}
            </p>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans flex">

      {/* ── Left vertical identity strip ── */}
      <div className={`w-[60px] shrink-0 ${accentBg} flex flex-col items-center justify-between py-8`}>

        {/* Name — rotated 90deg, reads bottom-to-top */}
        <div
          className="text-white font-black text-[13px] tracking-[0.15em] uppercase whitespace-nowrap select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <EditableField
            value={data.name}
            onSave={v => handleInlineEdit('name', v)}
            placeholder="Your Name"
          />
        </div>

        {/* Small decorative dots */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
          <div className="w-1 h-1 rounded-full bg-white/15" />
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col">

        {/* Top header: title + contact inline */}
        <div className={`${lightBg} px-8 py-5 flex justify-between items-center gap-6 border-b border-gray-200`}>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${accentText} mb-0.5`}>Portfolio</p>
            <h2 className="text-[18px] font-black text-gray-900 tracking-tight">
              <EditableField
                value={data.title}
                onSave={v => handleInlineEdit('title', v)}
                placeholder="Designer & Developer"
              />
            </h2>
          </div>
          <div className="text-[10px] text-gray-500 text-right space-y-0.5">
            {data.email && <div><EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="email" /></div>}
            {data.phone && <div><EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="phone" /></div>}
            {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="location" /></div>}
            {data.github && <div><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="github" /></div>}
            {data.linkedin && <div><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="linkedin" /></div>}
            {data.portfolio && <div><EditableField value={data.portfolio} onSave={v => handleInlineEdit('portfolio', v)} placeholder="portfolio" /></div>}
          </div>
        </div>

        {/* Sections */}
        <div className="px-8 pt-6 pb-8 flex-1">
          {sectionsOrder.map(id => renderSection(id))}
        </div>
      </div>

    </div>
  );
};

export default Layout32;
