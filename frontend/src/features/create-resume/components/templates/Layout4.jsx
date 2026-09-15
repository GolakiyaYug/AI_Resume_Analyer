import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 4: ATS-Friendly Resume
// Single column, no sidebar, clean professional structure
// Large section headings, simple scannable layout, ATS optimized
const Layout4 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-gray-900';
  const accentBg = theme?.bgPrimary || 'bg-gray-900';
  const accentBorder = theme?.border || 'border-gray-900';

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-7">
            <h2 className={`text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-3`}>
              Summary
            </h2>
            <div className="text-[12px] leading-relaxed text-gray-700">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Write your professional summary..." multiline />
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">
              Work Experience
            </h2>
            <div className="space-y-5">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-[14px] text-gray-900 leading-tight">
                      <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Job Title" />
                    </h3>
                    <span className="text-[11px] text-gray-500 font-semibold whitespace-nowrap mt-0.5 shrink-0">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-gray-600 mt-0.5">
                    <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company Name" />
                  </p>
                  <div className="text-[12px] text-gray-700 mt-1.5 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Job Description" multiline />
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
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">
              Education
            </h2>
            <div className="space-y-3">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                    </h3>
                    <p className="text-[12px] text-gray-600 font-semibold mt-0.5">
                      <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School/University" />
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-500 font-semibold whitespace-nowrap mt-0.5 shrink-0">
                    <EditableField value={edu.date} onSave={(val) => updateArrayItem('education', idx, 'date', val)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-3">
              Skills
            </h2>
            {/* Skills displayed in a clean, ATS-friendly way — comma-separated groups */}
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {data.skills?.map((skill, idx) => skill && (
                <span key={idx} className="text-[12px] text-gray-700 font-medium">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                  {idx < data.skills.length - 1 && <span className="text-gray-400 ml-0.5">,</span>}
                </span>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-bold text-[13px] text-gray-900">
                      <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Title" />
                    </h3>
                    {proj.link && <span className="text-[11px] text-gray-500 font-medium">
                      | <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </span>}
                  </div>
                  <div className="text-[12px] text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Project Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-3">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx} className="flex justify-between items-start gap-4">
                  <span className="font-semibold text-[12px] text-gray-900">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </span>
                  {cert.date && <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap shrink-0">
                    <EditableField value={cert.date} onSave={(val) => updateArrayItem('certifications', idx, 'date', val)} placeholder="Date" />
                  </span>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-4">
              Achievements
            </h2>
            <div className="space-y-3">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <h3 className="font-bold text-[13px] text-gray-900">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Achievement" />
                  </h3>
                  <div className="text-[12px] text-gray-700 mt-0.5 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={ach.desc} onSave={(val) => updateArrayItem('achievements', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-1">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex items-center gap-2 text-[12px]">
                  <span className="font-semibold text-gray-900">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-600">
                    <EditableField value={lang.fluency} onSave={(val) => updateArrayItem('languages', idx, 'fluency', val)} placeholder="Level" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-7">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 border-b-2 border-gray-900 pb-1.5 mb-3">
              Interests
            </h2>
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="text-[12px] text-gray-700">
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="text-gray-400 ml-0.5">,</span>}
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-white min-h-[297mm] font-sans">
      {/* ATS-Friendly Header — clean, no graphics, just text */}
      <header className="px-14 pt-12 pb-7 border-b-2 border-gray-900">
        {/* Name — large and dominant */}
        <h1 className="text-[32px] font-black text-gray-900 tracking-tight leading-none mb-2">
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Full Name" />
        </h1>
        {/* Title on its own line */}
        <p className="text-[14px] font-semibold text-gray-600 uppercase tracking-[0.18em] mb-4">
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </p>
        {/* Profile photo (optional, small and right-aligned) */}
        {data.photo && (
          <div className="absolute top-8 right-14">
            <img src={data.photo} alt="Profile" className="w-20 h-20 rounded object-cover border border-gray-200" />
          </div>
        )}
        {/* Contact in a single clean row */}
        <div className="flex flex-wrap gap-x-6 gap-y-0.5 text-[11px] text-gray-600">
          {data.email && <span><EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" /></span>}
          {data.phone && <span><EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" /></span>}
          {data.location && <span><EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" /></span>}
          {data.linkedin && <span className="break-all"><EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" /></span>}
          {data.github && <span className="break-all"><EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" /></span>}
          {data.portfolio && <span className="break-all"><EditableField value={data.portfolio} onSave={(val) => handleInlineEdit('portfolio', val)} placeholder="Portfolio" /></span>}
        </div>
      </header>

      {/* Single-column body */}
      <div className="px-14 pt-7 pb-10 relative">
        {sectionsOrder.map(sectionId => renderSection(sectionId))}
      </div>
    </div>
  );
};

export default Layout4;
