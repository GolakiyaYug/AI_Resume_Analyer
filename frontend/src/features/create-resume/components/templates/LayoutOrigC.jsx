import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Original Layout4 (preserved for Templates 16-20): Diagonal Split Header — Creative diagonal color split, two-column body layout
const LayoutOrigC = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.headerBg || 'bg-slate-900';
  const accentText = theme?.primary || 'text-teal-600';
  const accentBorder = theme?.border || 'border-teal-600';
  const accentBgLight = theme?.bgLight || 'bg-teal-50';

  const leftSections = ['summary', 'experience', 'achievements'];
  const rightSections = ['education', 'skills', 'projects', 'certifications', 'languages', 'interests'];
  const left = sectionsOrder.filter(s => leftSections.includes(s));
  const right = sectionsOrder.filter(s => rightSections.includes(s));
  const unassigned = sectionsOrder.filter(s => !leftSections.includes(s) && !rightSections.includes(s));

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-2`}>Summary</h2>
            <div className="text-sm leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </section>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Experience</h2>
            <div className="space-y-4">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className={`text-xs font-bold ${accentText} uppercase tracking-wider mt-0.5`}>
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                  </p>
                  <div className="text-xs text-gray-700 mt-1.5 whitespace-pre-wrap leading-relaxed">
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
          <section key="education" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Education</h2>
            <div className="space-y-3">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-sm text-gray-900">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </h3>
                  <p className={`text-xs font-semibold ${accentText}`}>
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </p>
                  <span className="text-xs text-gray-500">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`px-2 py-1 text-xs font-semibold ${accentBgLight} ${accentText} rounded-sm`}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </section>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Projects</h2>
            <div className="space-y-3">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <h3 className="font-bold text-sm text-gray-900">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                  </h3>
                  {proj.link && <span className={`text-xs ${accentText}`}>
                    <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                  </span>}
                  <div className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Certifications</h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <span className="font-bold text-sm text-gray-900 block">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-xs text-gray-500">
                    <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                  </span>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Languages</h2>
            <div className="space-y-1.5">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-xs text-gray-500">
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-3`}>Achievements</h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-sm text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </h3>
                  <div className="text-xs text-gray-700 whitespace-pre-wrap">
                    <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-6">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${accentText} mb-2`}>Interests</h2>
            <div className="text-sm text-gray-700">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-gray-400 mx-1.5">·</span>}
                </span>
              ))}
            </div>
          </section>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">
      {/* Diagonal Split Header */}
      <header className="relative overflow-hidden" style={{ minHeight: '140px' }}>
        {/* Dark bg for entire header */}
        <div className={`absolute inset-0 ${accentBg}`}></div>
        {/* White diagonal overlay on right */}
        <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 45% 100%)' }}></div>

        <div className="relative z-10 flex items-center px-10 py-8">
          {/* Left: Name + Title */}
          <div className="w-[50%]">
            {data.photo && (
              <img src={data.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/30 mb-3" />
            )}
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
              <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
            </h1>
            <p className="text-sm text-white/70 font-light tracking-[0.2em] uppercase mt-1">
              <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
            </p>
          </div>
          {/* Right: Contact on white bg */}
          <div className="w-[50%] pl-10 text-xs space-y-1 text-gray-700">
            {data.email && <div><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></div>}
            {data.phone && <div><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></div>}
            {data.location && <div><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></div>}
            {data.linkedin && <div className="break-all"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></div>}
            {data.github && <div className="break-all"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></div>}
          </div>
        </div>
      </header>

      {/* Two Column Body */}
      <div className="flex gap-0">
        <div className="flex-1 px-8 py-7 border-r border-gray-200">
          {left.map(sectionId => renderSection(sectionId))}
          {unassigned.map(sectionId => renderSection(sectionId))}
        </div>
        <div className="w-[38%] px-7 py-7">
          {right.map(sectionId => renderSection(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default LayoutOrigC;
