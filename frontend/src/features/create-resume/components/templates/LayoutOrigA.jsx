import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Original Layout2 (preserved for Templates 6-10): Dark Left Panel — Dark sidebar (photo + name + contact + skills), white right for main content
const LayoutOrigA = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const sidebarSections = ['skills', 'languages', 'interests', 'certifications'];
  const mainSections = ['summary', 'experience', 'education', 'projects', 'achievements'];

  const sidebar = sectionsOrder.filter(s => sidebarSections.includes(s));
  const main = sectionsOrder.filter(s => mainSections.includes(s));

  const renderSidebarSection = (sectionId) => {
    switch (sectionId) {
      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <div key="skills" className="mt-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/60 mb-3">Skills</h2>
            <div className="flex flex-col gap-1.5">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0"></div>
                  <span className="text-sm text-white/90 font-medium">
                    <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <div key="languages" className="mt-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/60 mb-3">Languages</h2>
            <div className="space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between text-sm">
                  <span className="font-semibold text-white/90">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-white/50 text-xs">
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mt-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/60 mb-3">Certifications</h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <span className="font-semibold text-sm text-white/90 block">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-xs text-white/50">
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
          <div key="interests" className="mt-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/60 mb-3">Interests</h2>
            <div className="text-sm text-white/80 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-white/30 mx-1.5">·</span>}
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
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-3">Profile</h2>
            <div className="text-sm leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Write your professional summary..." multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">Experience</h2>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mt-0.5">
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                  </p>
                  <div className="text-sm text-gray-700 mt-1.5 whitespace-pre-wrap leading-relaxed">
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
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">Education</h2>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <p className="text-sm text-gray-600 font-semibold">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">Projects</h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-sm text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className="text-xs text-blue-700 font-medium">
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
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">Achievements</h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
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

  const sidebarBg = theme?.headerBg || 'bg-slate-800';

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans flex">
      {/* Dark Left Sidebar */}
      <div className={`w-[32%] ${sidebarBg} text-white flex flex-col p-8 shrink-0`}>
        {data.photo && (
          <div className="flex justify-center mb-5">
            <img src={data.photo} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white/20 object-cover" />
          </div>
        )}

        <h1 className="text-2xl font-black uppercase tracking-wider text-white text-center leading-tight">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <p className="text-xs font-light tracking-[0.2em] text-white/70 text-center uppercase mt-1.5">
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </p>

        <div className="mt-5 pt-5 border-t border-white/20 space-y-1.5 text-xs text-white/75">
          {data.email && <div><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></div>}
          {data.phone && <div><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></div>}
          {data.location && <div><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></div>}
          {data.linkedin && <div className="break-words"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></div>}
          {data.github && <div className="break-words"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></div>}
          {data.portfolio && <div className="break-words"><EditableField value={data.portfolio} onSave={(val) => handleInlineEdit('portfolio', val)} placeholder="Portfolio" /></div>}
        </div>

        {sidebar.map(sectionId => renderSidebarSection(sectionId))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-white">
        {main.map(sectionId => renderMainSection(sectionId))}
      </div>
    </div>
  );
};

export default LayoutOrigA;
