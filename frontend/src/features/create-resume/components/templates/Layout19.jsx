import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 19: Elegant Divider Resume
const Layout19 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-teal-800';
  const borderCol = theme?.border || 'border-teal-800';

  const Divider = () => (
    <div className="w-full flex items-center justify-center my-8 opacity-60">
      <div className={`flex-1 border-t border-gray-300`}></div>
      <div className={`mx-4 w-2 h-2 rounded-full bg-gray-300`}></div>
      <div className={`flex-1 border-t border-gray-300`}></div>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <div className="text-center mb-6">
      <h2 className={`inline-block text-[15px] font-serif uppercase tracking-[0.2em] ${accentText} pb-2 border-b-2 ${borderCol}`}>
        {title}
      </h2>
    </div>
  );

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary">
            <SectionTitle title="Executive Summary" />
            <div className="text-[14px] leading-relaxed text-gray-700 font-serif text-center max-w-3xl mx-auto">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
            <Divider />
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience">
            <SectionTitle title="Professional Experience" />
            <div className="space-y-8 max-w-4xl mx-auto">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
                  <div className="text-right md:pr-6 md:border-r border-gray-200">
                    <div className="font-bold text-[15px] text-gray-900 font-sans">
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    </div>
                    {exp.location && (
                      <div className="text-[13px] text-gray-500 font-sans mt-0.5">
                        <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                      </div>
                    )}
                    <div className={`text-[12px] font-bold ${accentText} font-sans uppercase tracking-wider mt-2`}>
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-serif text-[17px] italic text-gray-800 mb-2`}>
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <div className="text-[14px] font-sans text-gray-600 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects">
            <SectionTitle title="Selected Projects" />
            <div className="space-y-6 max-w-4xl mx-auto">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="font-bold text-[16px] text-gray-900 font-sans uppercase tracking-wide mb-1">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                  </h3>
                  {proj.link && (
                    <div className={`text-[13px] font-serif italic ${accentText} mb-3`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-[14px] font-sans text-gray-700 whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <div key="education">
            <SectionTitle title="Education" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-center">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="font-bold text-[15px] text-gray-900 font-sans mb-1">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </div>
                  <div className={`text-[14px] font-serif italic text-gray-700 mb-2`}>
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </div>
                  <div className="text-[12px] font-bold text-gray-400 font-sans uppercase tracking-wider">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills">
            <SectionTitle title="Expertise" />
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 max-w-3xl mx-auto">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[14px] font-sans font-medium text-gray-800 flex items-center">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications">
            <SectionTitle title="Certifications" />
            <div className="space-y-3 max-w-2xl mx-auto text-center">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="text-[14px] font-sans text-gray-800">
                  <span className="font-semibold text-gray-900 mr-2">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-gray-500 italic font-serif">
                      <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages">
            <SectionTitle title="Languages" />
            <div className="flex flex-wrap justify-center gap-10 max-w-3xl mx-auto">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="text-center font-sans">
                  <div className="font-bold text-[14px] text-gray-900 mb-1">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </div>
                  <div className={`text-[12px] font-medium text-gray-500 uppercase tracking-wider`}>
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  </div>
                </div>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <div key="achievements">
            <SectionTitle title="Achievements" />
            <div className="space-y-4 max-w-3xl mx-auto text-center">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="font-bold text-[14px] font-sans text-gray-900 mb-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-[13px] font-serif text-gray-600 italic">
                      <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Divider />
          </div>
        );
      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <div key="interests">
            <SectionTitle title="Interests" />
            <div className="flex flex-wrap justify-center gap-4 text-[14px] font-sans text-gray-700 max-w-3xl mx-auto">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-3 text-gray-300">•</span>}
                </span>
              ))}
            </div>
            {/* No divider on last item typically, but mapped array order handles it by slicing later, or we just keep it for consistency. */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#fdfdfc] min-h-[297mm] font-serif px-8 py-14">
      <header className="mb-12 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-black font-sans uppercase tracking-[0.1em] text-gray-900 mb-4">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className={`text-[16px] font-serif italic ${accentText} mb-6`}>
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[12px] font-sans font-medium text-gray-600 uppercase tracking-widest">
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
            <span>LN: <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
          )}
          {data.github && (
            <span>GH: <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>
          )}
        </div>
      </header>

      <div className="w-full h-0.5 bg-gray-900 mb-12 max-w-5xl mx-auto"></div>

      <div className="max-w-5xl mx-auto">
        {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
      </div>
    </div>
  );
};

export default Layout19;
