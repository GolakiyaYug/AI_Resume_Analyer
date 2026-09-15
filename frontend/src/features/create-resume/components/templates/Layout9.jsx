import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 9: Career Timeline
const Layout9 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-orange-600';
  const accentBg = theme?.bgPrimary || 'bg-orange-600';
  const timelineLine = 'border-l-2 border-gray-200';
  const timelineDot = `w-3 h-3 rounded-full ${accentBg} absolute -left-[7px] top-2 ring-4 ring-white`;

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Profile
            </h2>
            <div className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-6`}>
              Professional Journey
            </h2>
            <div className={`relative ${timelineLine} ml-3 pl-6 space-y-8`}>
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="relative">
                  <div className={timelineDot}></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1.5">
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className={`text-xs font-bold ${accentText} px-2 py-0.5 bg-orange-50 rounded mt-1 sm:mt-0`}>
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    {exp.location && (
                      <span className="text-gray-500 font-normal ml-2">
                        <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
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
          <div key="education" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-6`}>
              Education History
            </h2>
            <div className={`relative ${timelineLine} ml-3 pl-6 space-y-6`}>
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="relative">
                  <div className={timelineDot}></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </h3>
                    <span className={`text-xs font-bold ${accentText} px-2 py-0.5 bg-orange-50 rounded mt-1 sm:mt-0`}>
                      <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-6`}>
              Key Projects
            </h2>
            <div className={`relative ${timelineLine} ml-3 pl-6 space-y-6`}>
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="relative">
                  <div className={timelineDot}></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && (
                      <span className={`text-xs ${accentText} font-medium`}>
                        <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed mt-2">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                  <span className="text-sm font-medium text-gray-800">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
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
          <div key="languages" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className={`text-xs ${accentText} font-semibold`}>
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
          <div key="achievements" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Achievements
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-sm font-bold text-gray-900 mb-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-sm text-gray-600">
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
          <div key="interests" className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded">
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
    <div className="w-full bg-white min-h-[297mm] font-sans">
      <div className="flex flex-col md:flex-row min-h-[297mm]">
        {/* Left Column for Timeline / Main Content */}
        <div className="w-full md:w-2/3 p-10 pr-6">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
            </h1>
            <div className={`text-lg font-medium ${accentText}`}>
              <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
            </div>
          </header>

          <div className="space-y-2">
            {sectionsOrder.filter(s => ['summary', 'experience', 'education', 'projects'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
          </div>
        </div>

        {/* Right Column for Details / Skills */}
        <div className="w-full md:w-1/3 p-10 pl-6 bg-gray-50 border-l border-gray-200">
          <div className="mb-10">
            <h2 className={`text-sm font-bold uppercase tracking-widest ${accentText} mb-4`}>
              Contact
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              {data.email && (
                <div className="flex items-start">
                  <span className="w-6 text-gray-400 mt-0.5">✉</span>
                  <div className="flex-1 break-all">
                    <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
                  </div>
                </div>
              )}
              {data.phone && (
                <div className="flex items-start">
                  <span className="w-6 text-gray-400 mt-0.5">☏</span>
                  <div className="flex-1">
                    <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
                  </div>
                </div>
              )}
              {data.location && (
                <div className="flex items-start">
                  <span className="w-6 text-gray-400 mt-0.5">⌂</span>
                  <div className="flex-1">
                    <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
                  </div>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-start">
                  <span className="w-6 text-gray-400 mt-0.5">in</span>
                  <div className="flex-1 break-all">
                    <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
                  </div>
                </div>
              )}
              {data.github && (
                <div className="flex items-start">
                  <span className="w-6 text-gray-400 mt-0.5">gh</span>
                  <div className="flex-1 break-all">
                    <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {sectionsOrder.filter(s => ['skills', 'certifications', 'languages', 'achievements', 'interests'].includes(s)).map(sectionId => renderSectionContent(sectionId))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout9;
