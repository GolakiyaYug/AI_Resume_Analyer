import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 11: Academic CV
const Layout11 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-slate-800';
  const borderCol = 'border-gray-300';
  const divider = `border-t-2 ${borderCol} my-4`;

  // Academic CVs usually put education and research (projects) first.
  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-3`}>
              Research Interests & Profile
            </h2>
            <div className="text-[13px] leading-relaxed text-gray-800 text-justify">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Academic Summary or Research Interests..." multiline />
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-4`}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[14px] text-gray-900">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <span className="text-[13px] text-gray-700 whitespace-nowrap">
                      <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[13px] text-gray-800 italic">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="Institution" />
                  </div>
                </div>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-4`}>
              Academic & Professional Appointments
            </h2>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[14px] text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Position Title" />
                    </h3>
                    <span className="text-[13px] text-gray-700 whitespace-nowrap">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-gray-800 mb-1.5">
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Institution / Organization" />
                    {exp.location && (
                      <span className="text-gray-600 font-normal ml-2">
                        (<EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />)
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description of duties/research" multiline />
                  </div>
                </div>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-4`}>
              Publications & Research Projects
            </h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="text-[13px] text-gray-800 leading-relaxed">
                  <span className="font-bold text-gray-900 mr-2">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Title of Publication/Project" />
                  </span>
                  {proj.link && (
                    <span className={`text-[13px] ${accentText} italic mr-2`}>
                      [<EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link / DOI" />]
                    </span>
                  )}
                  <span className="whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description or Citation" multiline />
                  </span>
                </div>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-3`}>
              Technical & Research Skills
            </h2>
            <div className="text-[13px] text-gray-800 leading-relaxed">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx}>
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  {idx < data.skills.length - 1 && <span className="mx-2 text-gray-400">•</span>}
                </span>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-4`}>
              Certifications & Awards
            </h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline text-[13px]">
                  <span className="font-semibold text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Award or Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-gray-700">
                      <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Year" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-3`}>
              Languages
            </h2>
            <div className="text-[13px] text-gray-800">
              {data.languages?.map((lang, idx) => (
                <span key={lang.id || idx} className="mr-4">
                  <strong className="font-semibold text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  {' ('}
                  <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  {')'}
                </span>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-4`}>
              Academic Achievements & Grants
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="text-[13px] text-gray-800 leading-relaxed">
                  <strong className="font-semibold text-gray-900 mr-2">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </strong>
                  {ach.desc && (
                    <span className="whitespace-pre-wrap">
                      <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests" className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} mb-3`}>
              Academic Affiliations & Interests
            </h2>
            <div className="text-[13px] text-gray-800">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest/Affiliation" />
                  {idx < data.interests.length - 1 && <span className="mx-2 text-gray-400">|</span>}
                </span>
              ))}
            </div>
            <div className={divider}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-serif p-12">
      <header className="mb-8 border-b-4 border-gray-900 pb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Curriculum Vitae Name" />
        </h1>
        <div className="text-[15px] italic text-gray-700 mb-4">
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Academic Title or Position" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] text-gray-600 font-sans">
          {data.email && (
            <span>
              <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
            </span>
          )}
          {data.phone && (
            <>
              <span className="text-gray-400">•</span>
              <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>
            </>
          )}
          {data.location && (
            <>
              <span className="text-gray-400">•</span>
              <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>
            </>
          )}
          {data.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <span><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
            </>
          )}
          {data.github && (
            <>
              <span className="text-gray-400">•</span>
              <span><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub / Scholar Link" /></span>
            </>
          )}
        </div>
      </header>

      <div className="text-left">
        {/* For Academic CV, we manually reorder common sections if user didn't explicitly order them or we just use their order but emphasize academic fields. 
            Here we just use sectionsOrder to respect the user's choice, but the styling reflects CV standards. */}
        {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout11;
