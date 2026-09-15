import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 21: Timeline Resume
// Distinctive vertical timeline running down the center of the page.
// Left side shows dates/companies, right side shows details.
const Layout21 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg   = theme?.bgPrimary   || 'bg-blue-700';
  const accentText = theme?.primary     || 'text-blue-700';
  const accentBorder = theme?.border    || 'border-blue-700';

  // ── header contact pills ──────────────────────────────────────────────
  const ContactPill = ({ children }) => (
    <span className="inline-flex items-center text-[11px] text-gray-600 bg-gray-100 rounded-full px-3 py-1">
      {children}
    </span>
  );

  // ── timeline dot ──────────────────────────────────────────────────────
  const Dot = ({ large }) => (
    <div className={`relative z-10 flex-shrink-0 ${large ? 'w-4 h-4' : 'w-3 h-3'} rounded-full ${accentBg} border-2 border-white shadow-md`} />
  );

  // ── section heading ───────────────────────────────────────────────────
  const SectionHeading = ({ title }) => (
    <div className="flex items-center gap-3 mb-6">
      <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} whitespace-nowrap`}>{title}</h2>
      <div className={`flex-1 border-t ${accentBorder}`} />
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {

      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-10">
            <SectionHeading title="Profile" />
            <p className="text-[12px] leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-10">
            <SectionHeading title="Experience" />
            <div className="relative">
              {/* vertical line */}
              <div className={`absolute left-[7.5rem] top-0 bottom-0 w-0.5 ${accentBg} opacity-20`} />
              <div className="space-y-8">
                {data.experience?.map((exp, idx) => (
                  <div key={exp.id || idx} className="flex gap-5 items-start">
                    {/* left: date + company */}
                    <div className="w-28 shrink-0 text-right pt-0.5">
                      <div className={`text-[10px] font-bold ${accentText} uppercase tracking-wider leading-tight`}>
                        <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 leading-snug">
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      </div>
                    </div>
                    {/* dot */}
                    <div className="flex flex-col items-center pt-1">
                      <Dot />
                    </div>
                    {/* right: title + location + desc */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[13px] text-gray-900 leading-snug">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                      </h3>
                      {exp.location && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                        </p>
                      )}
                      <div className="text-[11px] text-gray-600 mt-1.5 leading-relaxed whitespace-pre-wrap">
                        <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Describe your role…" multiline />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-10">
            <SectionHeading title="Education" />
            <div className="relative">
              <div className={`absolute left-[7.5rem] top-0 bottom-0 w-0.5 ${accentBg} opacity-20`} />
              <div className="space-y-6">
                {data.education?.map((edu, idx) => (
                  <div key={edu.id || idx} className="flex gap-5 items-start">
                    <div className="w-28 shrink-0 text-right pt-0.5">
                      <div className={`text-[10px] font-bold ${accentText} uppercase tracking-wider`}>
                        <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center pt-1">
                      <Dot />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[13px] text-gray-900">
                        <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                        <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-10">
            <SectionHeading title="Projects" />
            <div className="space-y-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className={`pl-4 border-l-2 ${accentBorder}`}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Title" />
                    </h3>
                    {proj.link && (
                      <span className={`text-[10px] ${accentText} font-medium`}>
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project description…" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-10">
            <SectionHeading title="Skills" />
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`text-[11px] font-semibold ${accentText} bg-blue-50 px-3 py-1 rounded-full border ${accentBorder}`}>
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-10">
            <SectionHeading title="Certifications" />
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-gray-900">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-gray-400">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
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
          <section key="languages" className="mb-10">
            <SectionHeading title="Languages" />
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-[11px]">
                  <span className="font-bold text-gray-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-gray-400 ml-1">–</span>
                  <span className="text-gray-500 ml-1 italic">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-10">
            <SectionHeading title="Achievements" />
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </h3>
                  {ach.desc && (
                    <p className="text-[11px] text-gray-600 mt-0.5 whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details" />
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
          <section key="interests" className="mb-10">
            <SectionHeading title="Interests" />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
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
    <div className="w-full bg-white min-h-[297mm] font-sans">
      {/* ── Top header bar ── */}
      <header className={`${accentBg} px-10 pt-10 pb-8`}>
        <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-1">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
        </h1>
        <p className="text-[13px] font-medium text-white/70 uppercase tracking-[0.2em] mb-5">
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
        </p>
        <div className="flex flex-wrap gap-2">
          {data.email    && <ContactPill>{data.email}</ContactPill>}
          {data.phone    && <ContactPill>{data.phone}</ContactPill>}
          {data.location && <ContactPill>{data.location}</ContactPill>}
          {data.linkedin && <ContactPill>in/{data.linkedin}</ContactPill>}
          {data.github   && <ContactPill>gh/{data.github}</ContactPill>}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="px-10 pt-10">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
    </div>
  );
};

export default Layout21;
