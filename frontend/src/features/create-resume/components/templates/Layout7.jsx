import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 7: Minimal Clean
const Layout7 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  // Using very clean and subtle styling, mostly relying on grays for a minimal look
  const accentText = theme?.primary || 'text-gray-900';
  const dividerColor = 'border-gray-200';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Summary
            </h2>
            <div className="text-sm font-light leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="text-base font-medium text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-xs font-medium text-gray-400 mt-1 sm:mt-0">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className={`text-sm font-medium ${accentText}`}>
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    </span>
                    {exp.location && (
                      <span className="text-sm text-gray-500 ml-2">
                        <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-light text-gray-600 whitespace-pre-wrap leading-relaxed">
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
          <div key="education" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Education
            </h2>
            <div className="space-y-6">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="text-base font-medium text-gray-900">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </h3>
                    <span className="text-xs font-medium text-gray-400 mt-1 sm:mt-0">
                      <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-light">
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
          <div key="skills" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Skills
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-sm font-light text-gray-700">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Projects
            </h2>
            <div className="space-y-6">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-base font-medium text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && (
                      <span className={`text-xs ${accentText}`}>
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-light text-gray-600 whitespace-pre-wrap leading-relaxed">
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
          <div key="certifications" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Certifications
            </h2>
            <div className="space-y-4">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-800">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-xs text-gray-400 font-light">
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
          <div key="languages" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Languages
            </h2>
            <div className="space-y-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-800">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-xs text-gray-500 font-light">
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
          <div key="achievements" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Achievements
            </h2>
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-sm font-light text-gray-600">
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
          <div key="interests" className={`mb-10 pb-10 border-b ${dividerColor}`}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
              Interests
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-sm font-light text-gray-700">
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
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
    <div className="w-full bg-white min-h-[297mm] font-sans p-12 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-6">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm font-light text-gray-500">
          {data.email && (
            <span><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>
          )}
          {data.phone && (
            <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>
          )}
          {data.location && (
            <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>
          )}
          {data.linkedin && (
            <span><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
          )}
          {data.github && (
            <span><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>
          )}
        </div>
      </header>

      <div className="space-y-1">
        {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout7;
