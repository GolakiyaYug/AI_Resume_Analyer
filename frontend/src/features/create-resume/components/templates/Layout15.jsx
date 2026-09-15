import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 15: Visual Profile
const Layout15 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-indigo-600';
  const accentText = theme?.primary || 'text-indigo-600';
  const textMuted = 'text-gray-500';

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">
              About Me
            </h2>
            <div className="text-[14px] leading-relaxed text-gray-700 italic">
              "<EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="A brief summary about yourself..." multiline />"
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 border-b border-gray-200 pb-2">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-start">
                  <div className="text-[13px] font-bold text-gray-400 mt-1">
                    <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-gray-900 mb-0.5">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <div className={`text-[13px] font-semibold ${accentText} mb-2`}>
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                      {exp.location && (
                        <span className="text-gray-500 font-normal ml-2">
                          <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                      <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                    </div>
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
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 border-b border-gray-200 pb-2">
              Education
            </h2>
            <div className="space-y-5">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-start">
                  <div className="text-[13px] font-bold text-gray-400 mt-1">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] text-gray-900 mb-0.5">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <div className="text-[13px] text-gray-700 font-medium">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 border-b border-gray-200 pb-2">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-[14px] text-gray-900 mb-1">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                  </h3>
                  {proj.link && (
                    <div className={`text-[12px] font-medium ${accentText} mb-2 truncate`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-[13px] text-gray-600 whitespace-pre-wrap leading-relaxed">
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
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className={`text-[13px] font-medium text-gray-800 bg-white border border-gray-200 shadow-sm px-3 py-1 rounded-full`}>
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
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <div className="font-bold text-[13px] text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-[12px] text-gray-500 font-medium mt-0.5">
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
          <div key="languages" className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">
              Languages
            </h2>
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-baseline text-[13px]">
                  <strong className="font-bold text-gray-800">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </strong>
                  <span className={`text-[12px] font-bold ${accentText} uppercase`}>
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
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">
              Achievements
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="font-bold text-[13px] text-gray-900 mb-0.5">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </div>
                  {ach.desc && (
                    <div className="text-[12px] text-gray-600 leading-relaxed">
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
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-[13px] text-gray-600 bg-gray-50 px-3 py-1 rounded">
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

  const leftSections = ['summary', 'skills', 'certifications', 'languages', 'interests', 'achievements'];
  const rightSections = ['experience', 'education', 'projects'];
  
  const left = sectionsOrder.filter(s => leftSections.includes(s));
  const right = sectionsOrder.filter(s => rightSections.includes(s));
  const other = sectionsOrder.filter(s => !leftSections.includes(s) && !rightSections.includes(s));

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">
      <div className="flex flex-col md:flex-row min-h-[297mm]">
        {/* Left visually distinct profile column */}
        <div className={`w-full md:w-1/3 ${accentBg} text-white p-8 md:p-10 flex flex-col items-center text-center`}>
          {data.photo ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 shadow-xl">
              <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6 shadow-lg text-white/50 text-3xl font-black">
              {data.name ? data.name.charAt(0) : '?'}
            </div>
          )}
          
          <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">
            <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
          </h1>
          <div className="text-[14px] font-medium text-white/80 tracking-widest uppercase mb-10">
            <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
          </div>

          <div className="w-full text-left space-y-4 text-[13px] text-white/90 font-medium mb-12">
            {data.email && (
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Email</span>
                <span className="break-all"><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>
              </div>
            )}
            {data.phone && (
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Phone</span>
                <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>
              </div>
            )}
            {data.location && (
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Location</span>
                <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>
              </div>
            )}
            {data.linkedin && (
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">LinkedIn</span>
                <span className="break-all"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>
              </div>
            )}
            {data.github && (
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">GitHub</span>
                <span className="break-all"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>
              </div>
            )}
          </div>
          
          <div className="w-full text-left">
            {/* Using a modified renderer context for the left column so it uses white text */}
            {/* But wait, re-rendering with white text inside renderSectionContent would require passing a color flag. 
                Instead of rewriting renderSectionContent to support two themes at once, 
                let's just put all sections on the right, or we can use CSS to invert them if they go here. 
                Let's simplify and put the standard sections on the right, and maybe only summary on left if we had custom logic, 
                but actually the user expects their order to be respected. 
                I will put all sections on the right side for this template to maintain component simplicity, 
                and just keep the left side as the "Strong personal-profile presentation". */}
          </div>
        </div>

        {/* Right content column */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <div className="max-w-xl">
            {sectionsOrder.map(sectionId => renderSectionContent(sectionId))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout15;
