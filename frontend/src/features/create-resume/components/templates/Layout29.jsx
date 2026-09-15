import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 29: Experience Focus Resume
// Structure is radically experience-centric:
//   • The LEFT column (60%) is ENTIRELY dedicated to experience — large numbered entries
//   • The RIGHT column (40%) stacks: name+title+contact (top), then all other sections below
// Experience entries use a large running-number indicator, company as the headline, and
// generous vertical space — making each role feel like a primary document section.
const Layout29 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-rose-700';
  const accentText  = theme?.primary   || 'text-rose-700';
  const accentBorder = theme?.border   || 'border-rose-700';

  const renderRightSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>About</h2>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Summary…" multiline />
            </p>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>Education</h2>
            <div className="space-y-3">
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
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`text-[10px] font-semibold ${accentText} border ${accentBorder} px-2 py-0.5 rounded-full`}>
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>Projects</h2>
            <div className="space-y-3">
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
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Certifications</h2>
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
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Languages</h2>
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
          <div key="achievements" className="mb-6">
            <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-2`}>Achievements</h2>
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
          <div key="interests" className="mb-6">
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
        );
      default: return null;
    }
  };

  const rightSections = sectionsOrder.filter(s => s !== 'experience');

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans flex">

      {/* ══════════ LEFT — Experience Focus (60%) ══════════ */}
      <div className="w-[60%] shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">

        {/* Experience section label — pinned at top */}
        <div className={`${accentBg} px-7 py-4`}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Work Experience</h2>
        </div>

        {sectionsOrder.includes('experience') && data.experience?.length ? (
          <div className="flex-1 px-7 py-6 space-y-0 divide-y divide-gray-200">
            {data.experience?.map((exp, idx) => (
              <div key={exp.id || idx} className="py-6 flex gap-5 items-start">
                {/* Big ordinal */}
                <div className={`text-5xl font-black ${accentText} opacity-15 leading-none shrink-0 w-10 text-right select-none`}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Company as headline */}
                  <h3 className="font-black text-[15px] text-gray-900 leading-snug">
                    <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company Name" />
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline mt-0.5 mb-2">
                    <span className={`text-[12px] font-semibold ${accentText}`}>
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                    {exp.location && <span className="text-[10px] text-gray-400">
                      <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                    </span>}
                  </div>
                  <div className="text-[12px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Responsibilities & impact…" multiline />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center px-7">
            <p className="text-[12px] text-gray-400 italic">No experience entries yet.</p>
          </div>
        )}
      </div>

      {/* ══════════ RIGHT — Identity + Everything else (40%) ══════════ */}
      <div className="flex-1 flex flex-col">

        {/* Identity block at top of right panel */}
        <div className="px-7 pt-8 pb-6 border-b border-gray-100">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-0.5">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
          </h1>
          <p className={`text-[11px] font-bold ${accentText} uppercase tracking-[0.2em] mb-4`}>
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
          </p>
          <div className="flex flex-col gap-1 text-[10px] text-gray-500">
            {data.email    && <span><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></span>}
            {data.phone    && <span><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></span>}
            {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
            {data.linkedin && <span><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github   && <span><EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></span>}
          </div>
        </div>

        {/* All other sections */}
        <div className="flex-1 px-7 py-6 overflow-y-auto">
          {rightSections.map(id => renderRightSection(id))}
        </div>
      </div>

    </div>
  );
};

export default Layout29;
