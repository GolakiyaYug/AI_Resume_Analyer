import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 25: Creative Card-Based Resume
// Every section is presented as a distinct elevated card on a subtle off-white page.
// The header is a hero card spanning the full width.
// Below it, sections flow in a responsive masonry-style 2-column card grid.
// Each card has a top-coloured accent bar that matches the theme colour.
const Layout25 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg    = theme?.bgPrimary || 'bg-purple-700';
  const accentText  = theme?.primary   || 'text-purple-700';
  const accentBorder = theme?.border   || 'border-purple-700';

  // ── Card wrapper ──────────────────────────────────────────────────────
  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className={`h-1 w-full ${accentBg}`} />
      <div className="p-5">
        {children}
      </div>
    </div>
  );

  // ── Section heading inside a card ────────────────────────────────────
  const CardTitle = ({ title }) => (
    <h2 className={`text-[9px] font-black uppercase tracking-[0.3em] ${accentText} mb-3`}>{title}</h2>
  );

  // ── Render each section as a card ────────────────────────────────────
  const renderCard = (sectionId) => {
    switch (sectionId) {

      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <Card key="summary" className="col-span-2">
            <CardTitle title="Profile" />
            <p className="text-[12px] text-gray-700 leading-relaxed">
              <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary…" multiline />
            </p>
          </Card>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <Card key="experience" className="col-span-2">
            <CardTitle title="Experience" />
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div>
                      <h3 className="font-bold text-[13px] text-gray-900">
                        <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Job Title" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText}`}>
                        <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                        {exp.location && <span className="text-gray-400 font-normal ml-1">· <EditableField value={exp.location} onSave={v => updateArrayItem('experience', idx, 'location', v)} placeholder="Location" /></span>}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1.5 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Description…" multiline />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <Card key="education">
            <CardTitle title="Education" />
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                  </h3>
                  <p className={`text-[11px] font-semibold ${accentText}`}>
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                  </p>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <Card key="skills">
            <CardTitle title="Skills" />
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`text-[11px] font-semibold ${accentText} border ${accentBorder} px-2.5 py-0.5 rounded-full`}>
                  <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </Card>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <Card key="projects" className="col-span-2">
            <CardTitle title="Projects" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className={`text-[10px] ${accentText} font-medium`}>
                      <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </span>}
                  </div>
                  <p className="text-[10px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description…" multiline />
                  </p>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <Card key="certifications">
            <CardTitle title="Certifications" />
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-gray-900">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-gray-400">
                    <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                  </span>}
                </div>
              ))}
            </div>
          </Card>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <Card key="languages">
            <CardTitle title="Languages" />
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-gray-900">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className={`text-[10px] font-bold ${accentText} uppercase tracking-wider`}>
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <Card key="achievements">
            <CardTitle title="Achievements" />
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
          </Card>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <Card key="interests">
            <CardTitle title="Interests" />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-gray-300 mx-1">·</span>}
                </span>
              ))}
            </p>
          </Card>
        );

      default: return null;
    }
  };

  // Cards that always span both columns
  const fullWidthCards = ['summary', 'experience', 'projects'];
  // Cards that sit in the 2-column grid
  const halfWidthCards = ['education', 'skills', 'certifications', 'languages', 'achievements', 'interests'];

  const fullWidth = sectionsOrder.filter(s => fullWidthCards.includes(s));
  const halfWidth = sectionsOrder.filter(s => halfWidthCards.includes(s));

  return (
    <div className="w-full bg-[#f4f5f7] min-h-[297mm] font-sans">

      {/* ── Hero header card ── */}
      <div className={`${accentBg} px-8 pt-10 pb-8`}>
        <div className="flex justify-between items-center gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-1">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Your Name" />
            </h1>
            <p className="text-[13px] font-medium text-white/65 uppercase tracking-[0.2em]">
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Professional Title" />
            </p>
          </div>
          <div className="text-[11px] text-white/70 space-y-1 text-right">
            {data.email    && <div><EditableField value={data.email}    onSave={v => handleInlineEdit('email', v)}    placeholder="Email" /></div>}
            {data.phone    && <div><EditableField value={data.phone}    onSave={v => handleInlineEdit('phone', v)}    placeholder="Phone" /></div>}
            {data.location && <div><EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
            {data.linkedin && <div>in: <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></div>}
            {data.github   && <div>gh: <EditableField value={data.github}   onSave={v => handleInlineEdit('github', v)}   placeholder="GitHub" /></div>}
          </div>
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="p-6 flex flex-col gap-4">

        {/* Full-width cards */}
        {fullWidth.map(id => renderCard(id))}

        {/* Half-width 2-column grid */}
        {halfWidth.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {halfWidth.map(id => renderCard(id))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Layout25;
