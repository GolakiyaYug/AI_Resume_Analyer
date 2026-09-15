import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 8: Centered Elegant
const Layout8 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-indigo-900';
  const borderCol = theme?.border || 'border-indigo-200';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-4 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Professional Profile</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="text-sm leading-relaxed text-gray-700 max-w-3xl mx-auto">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Experience</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto text-left">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="flex flex-col items-center text-center">
                  <h3 className="font-bold text-base text-gray-900">
                    <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-800">
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    </span>
                    {(exp.location || exp.date) && <span className="mx-2">|</span>}
                    {exp.location && (
                      <>
                        <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                        {exp.date && <span className="mx-2">|</span>}
                      </>
                    )}
                    {exp.date && (
                      <span className="italic">
                        <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed w-full">
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
          <div key="education" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Education</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="space-y-5 max-w-3xl mx-auto">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <h3 className="font-bold text-base text-gray-900">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </h3>
                  <div className="text-sm text-gray-700">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </div>
                  <div className="text-xs text-gray-500 italic mt-1">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Skills & Expertise</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="text-sm text-gray-800 leading-relaxed max-w-3xl mx-auto">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  {idx < data.skills.length - 1 && <span className={`mx-3 text-gray-300`}>•</span>}
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Selected Projects</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto text-left">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="flex flex-col items-center text-center">
                  <h3 className="font-bold text-base text-gray-900">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                  </h3>
                  {proj.link && (
                    <div className={`text-sm ${accentText} mb-2`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed w-full">
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
          <div key="certifications" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Certifications</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <div className="text-sm font-medium text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-xs text-gray-500 italic">
                      <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Languages</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="text-sm text-gray-800 max-w-3xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx}>
                  <strong className="font-medium text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  <span className="mx-1">-</span>
                  <span className="italic text-gray-600">
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Achievements</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="text-sm font-bold text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-sm text-gray-700 mt-1">
                      <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-8 text-center">
            <h2 className={`text-lg font-serif italic ${accentText} mb-6 relative inline-block`}>
              <span className="relative z-10 px-4 bg-white">Interests</span>
              <span className={`absolute left-0 top-1/2 w-full border-t ${borderCol} -z-0`}></span>
            </h2>
            <div className="text-sm text-gray-800 leading-relaxed max-w-3xl mx-auto">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className={`mx-3 text-gray-300`}>•</span>}
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
    <div className="w-full bg-white min-h-[297mm] font-serif p-12">
      <header className="mb-12 text-center flex flex-col items-center">
        <h1 className={`text-4xl font-normal text-gray-900 uppercase tracking-[0.15em] mb-3`}>
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className={`text-sm tracking-[0.2em] uppercase ${accentText} mb-6`}>
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[13px] text-gray-600 font-sans font-light">
          {data.email && (
            <span><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>
          )}
          {data.phone && (
            <>
              <span className="text-gray-300">|</span>
              <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>
            </>
          )}
          {data.location && (
            <>
              <span className="text-gray-300">|</span>
              <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>
            </>
          )}
          {data.linkedin && (
            <>
              <span className="text-gray-300">|</span>
              <span><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
            </>
          )}
          {data.github && (
            <>
              <span className="text-gray-300">|</span>
              <span><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>
            </>
          )}
        </div>
      </header>

      <div className="space-y-2">
        {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout8;
