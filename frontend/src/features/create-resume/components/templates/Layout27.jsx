import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 27: Skills Matrix Resume
// Structure: Full-width horizontal banner header (centred).
// Body is a UNIQUE layout: skills occupy the ENTIRE top band of the body as a
// visual matrix grid of cells. Below the matrix, experience + education are
// presented in a single column with a distinctive "run-in" label style.
// All other sections appear in a 3-across footer row.
const Layout27 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-violet-700';
  const accentText  = theme?.primary   || 'text-violet-700';
  const accentBorder = theme?.border   || 'border-violet-700';

  // Sections that render in the footer row
  const footerSections = ['certifications', 'languages', 'interests', 'achievements'];

  const renderFooterSection = (sectionId) => {
    switch (sectionId) {
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Certifications</h3>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-[10px]">
                  <span className="font-semibold text-gray-800 block leading-snug">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
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
          <div key="languages">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Languages</h3>
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
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Achievements</h3>
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
          <div key="interests">
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

  const footer = sectionsOrder.filter(s => footerSections.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Centred horizontal header ── */}
      <header className="text-center px-10 pt-10 pb-7 border-b-4 border-gray-900">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2 uppercase">
          <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
        </h1>
        <p className={`text-[13px] font-bold ${accentText} uppercase tracking-[0.3em] mb-5`}>
          <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] text-gray-500">
          {data.email    && <span><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></span>}
          {data.phone    && <span><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></span>}
          {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
          {data.linkedin && <span><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
          {data.github   && <span><EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></span>}
        </div>
      </header>

      {/* ── Skills matrix band ── (always shown prominently) */}
      {sectionsOrder.includes('skills') && data.skills?.length ? (
        <div className={`px-8 py-5 ${accentBg}`}>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mb-3">Core Skills</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {data.skills?.map((skill, idx) => skill && (
              <div key={idx} className="bg-white/10 rounded px-2 py-1.5 text-center">
                <span className="text-[11px] font-bold text-white leading-snug break-words">
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Experience & Education run-in column ── */}
      <div className="px-10 py-8">

        {sectionsOrder.includes('summary') && data.summary && (
          <div className="mb-8 flex items-start gap-4">
            <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mt-0.5 w-20 shrink-0 text-right`}>About</div>
            <div className={`w-px self-stretch bg-gray-200 shrink-0 mx-2`} />
            <p className="text-[12px] text-gray-700 leading-relaxed flex-1">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </div>
        )}

        {sectionsOrder.includes('experience') && data.experience?.length ? (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-5">
              <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} w-20 shrink-0 text-right`}>Experience</div>
              <div className={`flex-1 border-t ${accentBorder}`} />
            </div>
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="flex items-start gap-4">
                  <div className="w-20 shrink-0 text-right text-[10px] text-gray-400 pt-0.5">
                    <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="w-px self-stretch bg-gray-100 shrink-0 mx-2" />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between gap-2 items-baseline mb-1">
                      <h3 className="font-black text-[14px] text-gray-900">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                      </h3>
                      <span className={`text-[11px] font-bold ${accentText}`}>
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                      </span>
                    </div>
                    {exp.location && <p className="text-[10px] text-gray-400 mb-1">
                      <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                    </p>}
                    <div className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description…" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {sectionsOrder.includes('education') && data.education?.length ? (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} w-20 shrink-0 text-right`}>Education</div>
              <div className={`flex-1 border-t ${accentBorder}`} />
            </div>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex items-start gap-4">
                  <div className="w-20 shrink-0 text-right text-[10px] text-gray-400 pt-0.5">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </div>
                  <div className="w-px self-stretch bg-gray-100 shrink-0 mx-2" />
                  <div className="flex-1">
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <p className={`text-[11px] font-semibold ${accentText}`}>
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {sectionsOrder.includes('projects') && data.projects?.length ? (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} w-20 shrink-0 text-right`}>Projects</div>
              <div className={`flex-1 border-t ${accentBorder}`} />
            </div>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="flex items-start gap-4">
                  <div className="w-20 shrink-0" />
                  <div className="w-px self-stretch bg-gray-100 shrink-0 mx-2" />
                  <div className="flex-1">
                    <div className="flex gap-2 flex-wrap items-baseline mb-1">
                      <h3 className="font-bold text-[12px] text-gray-900">
                        <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project" />
                      </h3>
                      {proj.link && <span className={`text-[10px] ${accentText}`}>
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                      </span>}
                    </div>
                    <div className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description…" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Footer row of misc sections ── */}
      {footer.length > 0 && (
        <div className="border-t border-gray-200 px-10 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer.map(id => renderFooterSection(id))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout27;
