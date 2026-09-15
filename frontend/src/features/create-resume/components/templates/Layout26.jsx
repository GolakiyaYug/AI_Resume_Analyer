import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 26: Bold Profile Resume
// Structure: Full-bleed horizontal hero band spans the page with a diagonal cut at the bottom.
// Below the hero: a single wide centred column, but sections are laid out as numbered
// labelled blocks separated by full-width ruled dividers — a very different rhythm from 1-25.
const Layout26 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-sky-700';
  const accentText  = theme?.primary   || 'text-sky-700';
  const accentBorder = theme?.border   || 'border-sky-700';

  let sectionCounter = 0;
  const nextNum = () => { sectionCounter++; return String(sectionCounter).padStart(2, '0'); };

  const Rule = () => <div className="w-full h-px bg-gray-200 my-6" />;

  const SectionLabel = ({ label }) => {
    const num = nextNum();
    return (
      <div className="flex items-start gap-4 mb-4">
        <span className={`text-[10px] font-black ${accentText} opacity-60 mt-0.5 shrink-0 w-5`}>{num}</span>
        <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] text-gray-400`}>{label}</h2>
      </div>
    );
  };

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary">
            <SectionLabel label="Profile" />
            <div className="pl-9 text-[13px] leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </div>
            <Rule />
          </div>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience">
            <SectionLabel label="Experience" />
            <div className="pl-9 space-y-7">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="grid grid-cols-[1fr_2fr] gap-8">
                  {/* Left meta */}
                  <div className="text-right">
                    <div className={`text-[10px] font-black ${accentText} uppercase tracking-wider`}>
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </div>
                    <div className="text-[11px] font-semibold text-gray-600 mt-1">
                      <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                    </div>
                    {exp.location && (
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" />
                      </div>
                    )}
                  </div>
                  {/* Right content */}
                  <div>
                    <h3 className="font-black text-[14px] text-gray-900 mb-1">
                      <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                    </h3>
                    <div className="text-[12px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Responsibilities…" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education">
            <SectionLabel label="Education" />
            <div className="pl-9 space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="grid grid-cols-[1fr_2fr] gap-8">
                  <div className="text-right">
                    <div className={`text-[10px] font-black ${accentText} uppercase tracking-wider`}>
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <div className="text-[11px] font-semibold text-gray-600">
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills">
            <SectionLabel label="Skills" />
            <div className="pl-9 flex flex-wrap gap-2 mb-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`text-[11px] font-bold px-3 py-1 rounded-sm border-b-2 ${accentBorder} text-gray-800 bg-gray-50`}>
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects">
            <SectionLabel label="Projects" />
            <div className="pl-9 space-y-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="grid grid-cols-[1fr_2fr] gap-8">
                  <div className="text-right">
                    {proj.link && (
                      <div className={`text-[10px] font-bold ${accentText} break-all`}>
                        <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900 mb-1">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Title" />
                    </h3>
                    <div className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description…" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications">
            <SectionLabel label="Certifications" />
            <div className="pl-9 space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="grid grid-cols-[1fr_2fr] gap-8">
                  <div className="text-right text-[10px] text-gray-400">
                    {cert.date && <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />}
                  </div>
                  <div className="text-[12px] font-semibold text-gray-800">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </div>
                </div>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages">
            <SectionLabel label="Languages" />
            <div className="pl-9 flex flex-wrap gap-x-10 gap-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-[12px]">
                  <span className="font-bold text-gray-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-gray-400 mx-1">·</span>
                  <span className="text-gray-500 italic">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements">
            <SectionLabel label="Achievements" />
            <div className="pl-9 space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="grid grid-cols-[1fr_2fr] gap-8">
                  <div />
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                    </h3>
                    {ach.desc && <p className="text-[11px] text-gray-600 whitespace-pre-wrap mt-0.5">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details" />
                    </p>}
                  </div>
                </div>
              ))}
            </div>
            <Rule />
          </div>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests">
            <SectionLabel label="Interests" />
            <div className="pl-9 text-[12px] text-gray-600">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-2 text-gray-300">·</span>}
                </span>
              ))}
            </div>
            <Rule />
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">

      {/* ── Bold full-width hero: two-tone horizontal bands ── */}
      <header>
        {/* Top band — accent color, holds name */}
        <div className={`${accentBg} px-10 pt-10 pb-6`}>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase break-words">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
          </h1>
        </div>

        {/* Bottom band — dark, holds title + contact row */}
        <div className="bg-gray-900 px-10 py-5 flex flex-wrap items-center gap-x-10 gap-y-3">
          <p className="text-[14px] font-semibold text-white/70 uppercase tracking-[0.2em] shrink-0">
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-white/50">
            {data.email    && <span><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></span>}
            {data.phone    && <span><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></span>}
            {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
            {data.linkedin && <span>in: <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github   && <span>gh: <EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></span>}
          </div>
        </div>
      </header>

      {/* ── Numbered block body ── */}
      <div className="px-10 pt-10 pb-10 max-w-4xl">
        {sectionsOrder.map(id => renderSection(id))}
      </div>
    </div>
  );
};

export default Layout26;
