import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 23: Asymmetric Split Resume
// Large left column (≈55%) with colored background holds personal info, summary, skills, extras.
// Narrow right column (≈45%) carries experience, education, projects in a clean white pane.
// This is the OPPOSITE split from Layout1 and uses completely different styling.
const Layout23 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-slate-800';
  const accentText  = theme?.primary   || 'text-slate-800';
  const accentLight = 'bg-slate-50';

  // Sections that live in the left colored panel
  const leftSections  = ['summary', 'skills', 'languages', 'certifications', 'interests'];
  // Sections that live in the right white panel
  const rightSections = ['experience', 'education', 'projects', 'achievements'];

  const left  = sectionsOrder.filter(s => leftSections.includes(s));
  const right = sectionsOrder.filter(s => rightSections.includes(s));

  // ── LEFT panel renderers ──────────────────────────────────────────────
  const renderLeft = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-7">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45 mb-2">About</h2>
            <p className="text-[11px] text-white/80 leading-relaxed">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-7">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45 mb-3">Skills</h2>
            <div className="space-y-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                  <span className="text-[11px] font-medium text-white/85">
                    <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-7">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45 mb-2">Certifications</h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-[10px]">
                  <span className="font-semibold text-white/85 block">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-white/40">
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
          <div key="languages" className="mb-7">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45 mb-2">Languages</h2>
            <div className="space-y-1.5">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between text-[10px]">
                  <span className="font-semibold text-white/85">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-white/45 italic">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-7">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/45 mb-2">Interests</h2>
            <p className="text-[10px] text-white/70 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-white/30 mx-1">·</span>}
                </span>
              ))}
            </p>
          </div>
        );
      default: return null;
    }
  };

  // ── RIGHT panel renderers ─────────────────────────────────────────────
  const renderRight = (sectionId) => {
    switch (sectionId) {
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} whitespace-nowrap`}>Experience</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-[13px] text-gray-900">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText}`}>
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                        {exp.location && <span className="text-gray-400 font-normal ml-1">· <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" /></span>}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold shrink-0">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1.5 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description…" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} whitespace-nowrap`}>Education</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                    </h3>
                    <p className={`text-[11px] font-semibold ${accentText}`}>
                      <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold shrink-0">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} whitespace-nowrap`}>Projects</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className={`text-[10px] ${accentText} font-medium`}>
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </span>}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Project description…" multiline />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText} whitespace-nowrap`}>Achievements</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                  </h3>
                  {ach.desc && <p className="text-[11px] text-gray-600 mt-0.5 whitespace-pre-wrap">
                    <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Details" />
                  </p>}
                </div>
              ))}
            </div>
          </section>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans flex">

      {/* ── Left colored panel (55%) ── */}
      <div className={`w-[55%] ${accentBg} flex flex-col shrink-0`}>
        {/* Name block — pushed to bottom of a short top area */}
        <div className="px-8 pt-10 pb-7 flex flex-col justify-end">
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight mb-0.5">
            <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
          </h1>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-white/55">
            <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
          </p>

          {/* Contact row */}
          <div className="mt-5 flex flex-col gap-1.5 text-[10px] text-white/65">
            {data.email    && <span><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></span>}
            {data.phone    && <span><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></span>}
            {data.location && <span><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></span>}
            {data.linkedin && <span>LinkedIn: <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
            {data.github   && <span>GitHub: <EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></span>}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-8 bg-white/15" />

        {/* Left section content */}
        <div className="px-8 pt-6 flex-1">
          {left.map(id => renderLeft(id))}
        </div>
      </div>

      {/* ── Right white panel (45%) ── */}
      <div className="flex-1 bg-white px-7 py-10">
        {right.map(id => renderRight(id))}
      </div>

    </div>
  );
};

export default Layout23;
