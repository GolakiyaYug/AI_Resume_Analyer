import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 3: Executive Two-Column Resume
// Elegant corporate design: thin left column for metadata, wide right for content
// Experience timeline style on right, clean professional spacing
const Layout3 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-indigo-800';
  const accentText = theme?.primary || 'text-indigo-800';
  const accentBorder = theme?.border || 'border-indigo-800';
  const headerBg = theme?.headerBg || 'bg-gray-900';

  // Thin left column: photo, contact, skills, languages, interests
  // Wide right column: summary, experience, education, projects, achievements, certifications
  const leftSections = ['skills', 'languages', 'certifications', 'interests'];
  const rightSections = ['summary', 'experience', 'education', 'projects', 'achievements'];

  const left = sectionsOrder.filter(s => leftSections.includes(s));
  const right = sectionsOrder.filter(s => rightSections.includes(s));

  const renderLeftSection = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Skills</h2>
            <div className="flex flex-col gap-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="text-[11px] text-gray-700 font-medium flex items-center gap-2">
                  <span className={`w-1 h-4 rounded-full ${accentBg} shrink-0 opacity-70`}></span>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Languages</h2>
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx}>
                  <span className="text-[11px] font-semibold text-gray-800 block">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className={`text-[10px] ${accentText} font-medium`}>
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Certifications</h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <span className="text-[11px] font-semibold text-gray-800 block leading-snug">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-[10px] text-gray-400">
                    <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
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
            <h2 className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Interests</h2>
            <div className="text-[11px] text-gray-600 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-gray-300 mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  const renderRightSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-6 h-0.5 ${accentBg}`}></div>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText}`}>Profile</h2>
            </div>
            <div className="text-[11px] leading-relaxed text-gray-700 italic border-l-2 border-gray-200 pl-4">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Professional summary..." multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-6 h-0.5 ${accentBg}`}></div>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText}`}>Professional Experience</h2>
            </div>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="relative pl-5">
                  {/* Timeline spine */}
                  <div className={`absolute left-0 top-2 bottom-0 w-px ${accentBorder.replace('border', 'bg')} opacity-30`}></div>
                  {/* Timeline dot */}
                  <div className={`absolute left-[-4px] top-[7px] w-2 h-2 rounded-full border-2 ${accentBorder} bg-white`}></div>

                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-bold text-[13px] text-gray-900 leading-tight">
                        <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                      </h3>
                      <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                        <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap mt-0.5 shrink-0 uppercase tracking-wider">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1.5 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-6 h-0.5 ${accentBg}`}></div>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText}`}>Education</h2>
            </div>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <p className={`text-[11px] font-semibold ${accentText} mt-0.5`}>
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap mt-0.5 shrink-0 uppercase tracking-wider">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-6 h-0.5 ${accentBg}`}></div>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText}`}>Projects</h2>
            </div>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="relative pl-5">
                  <div className={`absolute left-0 top-2 bottom-0 w-px ${accentBorder.replace('border', 'bg')} opacity-30`}></div>
                  <div className={`absolute left-[-4px] top-[7px] w-2 h-2 rounded-full border-2 ${accentBorder} bg-white`}></div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className={`text-[10px] ${accentText} font-medium`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </span>}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-6 h-0.5 ${accentBg}`}></div>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentText}`}>Achievements</h2>
            </div>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[12px] text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </h3>
                  <div className="text-[11px] text-gray-600 mt-0.5 whitespace-pre-wrap">
                    <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">
      {/* Elegant top bar with name — spans full width */}
      <header className={`${headerBg} px-0`}>
        <div className="flex">
          {/* Narrow left header */}
          <div className={`w-[28%] ${accentBg} px-7 py-8 flex flex-col justify-end shrink-0`}>
            {data.photo && (
              <img
                src={data.photo}
                alt="Profile"
                className="w-20 h-20 rounded object-cover border-2 border-white/30 shadow-lg mb-4"
              />
            )}
            <div className="space-y-0.5 text-[10px] text-white/70">
              {data.email && <div className="truncate"><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></div>}
              {data.phone && <div><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></div>}
              {data.location && <div><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></div>}
              {data.linkedin && <div className="truncate"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></div>}
              {data.github && <div className="truncate"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></div>}
              {data.portfolio && <div className="truncate"><EditableField value={data.portfolio} onSave={(val) => handleInlineEdit('portfolio', val)} placeholder="Portfolio" /></div>}
            </div>
          </div>
          {/* Wide right header — name + title */}
          <div className={`flex-1 ${headerBg} px-10 py-8 flex flex-col justify-center`}>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none">
              <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
            </h1>
            <p className="text-sm font-light tracking-[0.3em] text-white/55 uppercase mt-3">
              <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
            </p>
          </div>
        </div>
      </header>

      {/* Two-column body */}
      <div className="flex min-h-0">
        {/* Thin left column */}
        <div className="w-[28%] bg-gray-50 px-7 py-7 border-r border-gray-200 shrink-0">
          {left.map(sectionId => renderLeftSection(sectionId))}
        </div>
        {/* Wide right column */}
        <div className="flex-1 px-10 py-7">
          {right.map(sectionId => renderRightSection(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default Layout3;
