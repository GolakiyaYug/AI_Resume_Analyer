import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 28: Three-Zone Resume
// The page is divided into THREE horizontal zones, not a column layout:
//
//   ZONE 1 (top ~28%): Full-width IDENTITY bar — name, title, contact, summary
//   ZONE 2 (middle ~42%): Full-width WORK RECORD — experience ONLY (max visual weight)
//   ZONE 3 (bottom ~30%): Four equal mini-columns — education / skills / certs+langs / projects+interests
//
// This is a purely horizontal zone-stacking approach, not found in any template 1–27.
const Layout28 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-teal-700';
  const accentText  = theme?.primary   || 'text-teal-700';
  const accentBorder = theme?.border   || 'border-teal-700';
  const accentLight = theme?.bgLight   || 'bg-teal-50';

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans flex flex-col">

      {/* ══════════════════════════════════════════
          ZONE 1 — Identity
      ══════════════════════════════════════════ */}
      <div className={`${accentBg} px-8 py-8`}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Name block */}
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-1">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
            </h1>
            <p className="text-[13px] font-semibold text-white/60 uppercase tracking-[0.25em]">
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
            </p>
          </div>

          {/* Contact cluster */}
          <div className="flex flex-col text-right text-[11px] text-white/65 gap-0.5">
            {data.email    && <span><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></span>}
            {data.phone    && <span><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></span>}
            {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
            {data.linkedin && <span><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github   && <span><EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></span>}
          </div>
        </div>

        {/* Summary in-zone */}
        {sectionsOrder.includes('summary') && data.summary && (
          <div className="mt-5 pt-5 border-t border-white/20">
            <p className="text-[12px] text-white/75 leading-relaxed max-w-3xl">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          ZONE 2 — Work Record (full-width experience)
      ══════════════════════════════════════════ */}
      <div className="bg-gray-50 px-8 py-8 border-b-2 border-gray-900">
        <div className="flex items-center gap-4 mb-6">
          <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${accentText} whitespace-nowrap`}>Work Record</h2>
          <div className={`flex-1 border-t ${accentBorder}`} />
        </div>

        {sectionsOrder.includes('experience') && data.experience?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {data.experience?.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-start gap-3 mb-1">
                  <h3 className="font-black text-[14px] text-gray-900 leading-snug">
                    <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                  </h3>
                  <span className={`text-[9px] font-black ${accentText} uppercase tracking-wider shrink-0 mt-0.5`}>
                    <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                  </span>
                </div>
                <div className={`text-[11px] font-semibold ${accentText} mb-2`}>
                  <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                  {exp.location && <span className="text-gray-400 font-normal ml-1">· <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" /></span>}
                </div>
                <div className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                  <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description…" multiline />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-gray-400 italic">No experience entries yet.</p>
        )}
      </div>

      {/* ══════════════════════════════════════════
          ZONE 3 — Four mini-columns
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">

        {/* Col A: Education */}
        <div className="flex-1 px-6 py-7">
          <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-4`}>Education</h2>
          {sectionsOrder.includes('education') && data.education?.length ? (
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                  </h3>
                  <p className={`text-[10px] font-semibold ${accentText}`}>
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                  </p>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Col B: Skills */}
        <div className="flex-1 px-6 py-7">
          <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-4`}>Skills</h2>
          {sectionsOrder.includes('skills') && data.skills?.length ? (
            <div className="flex flex-col gap-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[11px] font-medium text-gray-700">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Col C: Certifications + Languages */}
        <div className="flex-1 px-6 py-7">
          {sectionsOrder.includes('certifications') && data.certifications?.length ? (
            <div className="mb-5">
              <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>Certifications</h2>
              <div className="space-y-2">
                {data.certifications?.map((cert, idx) => (
                  <div key={cert.id || idx} className="text-[10px]">
                    <span className="font-semibold text-gray-800 block">
                      <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                    </span>
                    {cert.date && <span className="text-gray-400">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                    </span>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {sectionsOrder.includes('languages') && data.languages?.length ? (
            <div>
              <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>Languages</h2>
              <div className="space-y-1.5">
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
          ) : null}
        </div>

        {/* Col D: Projects + Interests + Achievements */}
        <div className="flex-1 px-6 py-7">
          {sectionsOrder.includes('projects') && data.projects?.length ? (
            <div className="mb-5">
              <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>Projects</h2>
              <div className="space-y-3">
                {data.projects?.map((proj, idx) => (
                  <div key={proj.id || idx}>
                    <h3 className="font-bold text-[11px] text-gray-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project" />
                    </h3>
                    {proj.link && <p className={`text-[9px] ${accentText}`}>
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </p>}
                    <p className="text-[10px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description…" multiline />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {sectionsOrder.includes('achievements') && data.achievements?.length ? (
            <div className="mb-5">
              <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>Achievements</h2>
              <div className="space-y-2">
                {data.achievements?.map((ach, idx) => (
                  <div key={ach.id || idx} className="text-[10px]">
                    <span className="font-semibold text-gray-800 block">
                      <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {sectionsOrder.includes('interests') && data.interests?.length ? (
            <div>
              <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Interests</h2>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                {data.interests?.map((interest, idx) => interest && (
                  <span key={idx}>
                    <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                    {idx < data.interests.length - 1 && <span className="text-gray-300 mx-1">·</span>}
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default Layout28;
