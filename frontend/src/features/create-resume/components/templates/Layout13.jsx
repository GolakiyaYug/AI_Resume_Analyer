import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 13: Compact Executive
const Layout13 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-slate-900';
  const borderCol = theme?.border || 'border-slate-800';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Executive Summary
            </h2>
            <div className="text-[11px] leading-snug text-gray-800 text-justify">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Professional Experience
            </h2>
            <div className="space-y-2">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[12px] text-gray-900">
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-gray-600 font-normal ml-1 text-[11px]">
                          — <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap ml-2">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className={`text-[11px] font-semibold italic ${accentText} mb-0.5`}>
                    <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                  </div>
                  <div className="text-[11px] text-gray-800 whitespace-pre-wrap leading-snug">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Education
            </h2>
            <div className="space-y-1.5">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[12px] text-gray-900 leading-tight">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <div className="text-[11px] text-gray-700">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap ml-2">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Core Competencies
            </h2>
            <div className="text-[11px] text-gray-800 leading-snug">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  {idx < data.skills.length - 1 && <span className="mx-1.5 text-gray-400">|</span>}
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Selected Projects
            </h2>
            <div className="space-y-2">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[11px] text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && (
                      <span className={`text-[10px] ${accentText} truncate ml-2`}>
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-800 whitespace-pre-wrap leading-snug">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Certifications
            </h2>
            <div className="space-y-1">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-gray-700 ml-2 whitespace-nowrap">
                      <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Languages
            </h2>
            <div className="text-[11px] text-gray-800 leading-snug">
              {data.languages?.map((lang, idx) => (
                <span key={lang.id || idx}>
                  <strong className="font-semibold text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  {' - '}
                  <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  {idx < data.languages.length - 1 && <span className="mx-1.5 text-gray-400">|</span>}
                </span>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Achievements
            </h2>
            <div className="space-y-1">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[11px] text-gray-800 leading-snug">
                  <span className="font-bold text-gray-900 mr-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </span>
                  {ach.desc && (
                    <span>
                      - <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-3">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest ${accentText} border-b ${borderCol} pb-0.5 mb-1.5`}>
              Interests
            </h2>
            <div className="text-[11px] text-gray-800 leading-snug">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-1.5 text-gray-400">,</span>}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-serif p-8">
      <header className="mb-4">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1 text-center">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-[10px] text-gray-700 font-sans uppercase tracking-wider mb-2">
          {data.email && <span><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>}
          {data.phone && <><span className="text-gray-300">|</span><span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span></>}
          {data.location && <><span className="text-gray-300">|</span><span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span></>}
          {data.linkedin && <><span className="text-gray-300">|</span><span><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span></>}
          {data.github && <><span className="text-gray-300">|</span><span><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span></>}
        </div>
        <div className={`text-center text-[12px] font-bold ${accentText} border-t border-b ${borderCol} py-1`}>
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
      </header>

      {/* Two-column dense layout for executive styling */}
      <div className="flex gap-6">
        <div className="w-2/3">
          {sectionsOrder.filter(s => ['summary', 'experience', 'projects'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
        </div>
        <div className="w-1/3">
          {sectionsOrder.filter(s => ['skills', 'education', 'certifications', 'achievements', 'languages', 'interests'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default Layout13;
