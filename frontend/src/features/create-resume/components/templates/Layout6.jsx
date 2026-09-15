import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 6: Classic Professional
const Layout6 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-slate-800';
  const borderCol = theme?.border || 'border-slate-400';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Professional Summary
            </h2>
            <div className="text-[13px] leading-relaxed text-gray-800">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[14px] text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-[13px] font-semibold text-gray-700">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <p className={`text-[13px] font-semibold ${accentText}`}>
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    </p>
                    {exp.location && (
                      <span className="text-[12px] text-gray-600">
                        <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">
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
          <div key="education" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Education
            </h2>
            <div className="space-y-3">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[14px] text-gray-900">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </h3>
                    <span className="text-[13px] font-semibold text-gray-700">
                      <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className={`text-[13px] ${accentText}`}>
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Skills
            </h2>
            <div className="text-[13px] leading-relaxed text-gray-800">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  {idx < data.skills.length - 1 && <span className="mx-2 text-gray-400">|</span>}
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[14px] text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && (
                      <span className={`text-[13px] ${accentText}`}>
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">
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
          <div key="certifications" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline">
                  <span className="font-semibold text-[13px] text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-[13px] text-gray-700">
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
          <div key="languages" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Languages
            </h2>
            <div className="text-[13px] text-gray-800">
              {data.languages?.map((lang, idx) => (
                <span key={lang.id || idx}>
                  <strong className="font-semibold text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  {' - '}
                  <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  {idx < data.languages.length - 1 && <span className="mx-2 text-gray-400">|</span>}
                </span>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Achievements
            </h2>
            <div className="space-y-2">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[13px] text-gray-800">
                  <strong className="font-semibold text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </strong>
                  {ach.desc && (
                    <span>
                      {' - '}
                      <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" />
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
          <div key="interests" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b-2 ${borderCol} pb-1 mb-3`}>
              Interests
            </h2>
            <div className="text-[13px] text-gray-800">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-2 text-gray-400">,</span>}
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
    <div className="w-full bg-white min-h-[297mm] font-serif p-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] text-gray-700">
          {data.email && (
            <span>
              <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
            </span>
          )}
          {data.phone && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
              </span>
            </>
          )}
          {data.location && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
              </span>
            </>
          )}
          {data.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
              </span>
            </>
          )}
          {data.github && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
              </span>
            </>
          )}
        </div>
      </header>

      <div>
        {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout6;
