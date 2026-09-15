import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Original Layout3 (preserved for Templates 11-15): Executive Right Sidebar — Name top-left, colored right sidebar for contact/skills
const LayoutOrigB = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-indigo-800';
  const accentText = theme?.primary || 'text-indigo-800';
  const accentBorder = theme?.border || 'border-indigo-800';

  const sidebarSections = ['skills', 'languages', 'certifications', 'interests'];
  const mainSections = ['summary', 'experience', 'education', 'projects', 'achievements'];
  const sidebar = sectionsOrder.filter(s => sidebarSections.includes(s));
  const main = sectionsOrder.filter(s => mainSections.includes(s));

  const renderSidebarSection = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mt-7">
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3 pb-2 border-b border-white/25">Skills</h2>
            <div className="flex flex-col gap-2">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-sm text-white/85 font-medium">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </span>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mt-7">
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3 pb-2 border-b border-white/25">Languages</h2>
            <div className="space-y-2.5">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-white/90">
                      <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                    </span>
                    <span className="text-white/55 text-xs">
                      <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Level" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mt-7">
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3 pb-2 border-b border-white/25">Certifications</h2>
            <div className="space-y-2.5 text-sm">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <span className="font-semibold text-white/90 block">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-xs text-white/55">
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
          <div key="interests" className="mt-7">
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3 pb-2 border-b border-white/25">Interests</h2>
            <div className="text-sm text-white/80 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-white/30 mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderMainSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-7">
            <h2 className={`text-xs font-black uppercase tracking-widest ${accentText} mb-3`}>About Me</h2>
            <div className="text-sm leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Professional summary..." multiline />
            </div>
          </section>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <h2 className={`text-xs font-black uppercase tracking-widest ${accentText} mb-4`}>Work Experience</h2>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx} className={`pl-4 border-l-2 ${accentBorder}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-3 bg-gray-100 px-2 py-0.5 rounded">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${accentText} mt-0.5`}>
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                  </p>
                  <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">
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
            <h2 className={`text-xs font-black uppercase tracking-widest ${accentText} mb-4`}>Education</h2>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className={`pl-4 border-l-2 ${accentBorder}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-3 bg-gray-100 px-2 py-0.5 rounded">
                      <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${accentText}`}>
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <h2 className={`text-xs font-black uppercase tracking-widest ${accentText} mb-4`}>Projects</h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className={`pl-4 border-l-2 ${accentBorder}`}>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-sm text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className={`text-xs ${accentText} font-medium`}>
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </span>}
                  </div>
                  <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
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
            <h2 className={`text-xs font-black uppercase tracking-widest ${accentText} mb-4`}>Achievements</h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx} className={`pl-4 border-l-2 ${accentBorder}`}>
                  <h3 className="font-bold text-sm text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </h3>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
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
    <div className="w-full bg-white min-h-[297mm] font-sans flex">
      {/* Left Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header — name top-left, no background */}
        <header className="px-10 pt-10 pb-6">
          {data.photo && (
            <img src={data.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-gray-200" />
          )}
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
            <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
          </h1>
          <p className={`text-base font-semibold ${accentText} mt-1.5 tracking-wider uppercase`}>
            <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
            {data.email && <span><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>}
            {data.phone && <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>}
            {data.location && <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>}
            {data.linkedin && <span className="break-all"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>}
          </div>
          <div className={`h-0.5 ${accentBg} mt-6`}></div>
        </header>
        <div className="px-10 pb-10 flex-1">
          {main.map(sectionId => renderMainSection(sectionId))}
        </div>
      </div>

      {/* Right Sidebar — colored */}
      <div className={`w-[30%] ${accentBg} text-white p-8 flex flex-col shrink-0`}>
        {sidebar.map(sectionId => renderSidebarSection(sectionId))}
      </div>
    </div>
  );
};

export default LayoutOrigB;
