import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 17: Magazine Style Resume
const Layout17 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentText = theme?.primary || 'text-red-700';
  const borderCol = theme?.border || 'border-red-700';
  
  const leftColSections = ['summary', 'experience', 'projects'];
  const rightColSections = ['education', 'skills', 'certifications', 'languages', 'achievements', 'interests'];

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <div key="summary" className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4 border-b-2 border-black pb-2">
              <span className={accentText}>The</span> Overview
            </h2>
            <div className="text-[15px] font-serif leading-relaxed text-gray-900 first-letter:text-5xl first-letter:font-black first-letter:mr-1 first-letter:float-left">
              <EditableField value={data.summary} onSave={(val) => handleInlineEdit('summary', val)} placeholder="Editorial summary..." multiline />
            </div>
          </div>
        );
      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <div key="experience" className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 border-b-2 border-black pb-2">
              <span className={accentText}>Career</span> History
            </h2>
            <div className="space-y-8">
              {data.experience?.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="font-black text-2xl text-gray-900 uppercase tracking-tight font-sans">
                      <EditableField value={exp.company} onSave={(val) => updateArrayItem('experience', idx, 'company', val)} placeholder="Company" />
                    </h3>
                    <div className="text-[13px] font-bold uppercase tracking-wider text-gray-400 mt-1 md:mt-0">
                      <EditableField value={exp.date} onSave={(val) => updateArrayItem('experience', idx, 'date', val)} placeholder="Date" />
                    </div>
                  </div>
                  <div className={`text-[15px] italic font-serif ${accentText} mb-3`}>
                    <EditableField value={exp.title} onSave={(val) => updateArrayItem('experience', idx, 'title', val)} placeholder="Role" />
                    {exp.location && (
                      <span className="text-gray-500 not-italic font-sans text-xs uppercase tracking-wider ml-3">
                        <EditableField value={exp.location} onSave={(val) => updateArrayItem('experience', idx, 'location', val)} placeholder="Location" />
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] font-serif text-gray-700 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={exp.desc} onSave={(val) => updateArrayItem('experience', idx, 'desc', val)} placeholder="Description" multiline />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <div key="projects" className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 border-b-2 border-black pb-2">
              <span className={accentText}>Featured</span> Projects
            </h2>
            <div className="space-y-6">
              {data.projects?.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <h3 className="font-bold text-lg text-gray-900 font-sans uppercase tracking-tight mb-1">
                    <EditableField value={proj.title} onSave={(val) => updateArrayItem('projects', idx, 'title', val)} placeholder="Project Name" />
                  </h3>
                  {proj.link && (
                    <div className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      <EditableField value={proj.link} onSave={(val) => updateArrayItem('projects', idx, 'link', val)} placeholder="Link" />
                    </div>
                  )}
                  <div className="text-[14px] font-serif text-gray-700 whitespace-pre-wrap leading-relaxed">
                    <EditableField value={proj.desc} onSave={(val) => updateArrayItem('projects', idx, 'desc', val)} placeholder="Description" multiline />
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
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${accentText} mb-4`}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education?.map((edu, idx) => (
                <div key={edu.id || idx} className="pl-4 border-l-4 border-black">
                  <h3 className="font-bold text-[15px] text-gray-900 font-sans uppercase tracking-tight">
                    <EditableField value={edu.degree} onSave={(val) => updateArrayItem('education', idx, 'degree', val)} placeholder="Degree" />
                  </h3>
                  <div className="text-[14px] italic font-serif text-gray-600 mb-1">
                    <EditableField value={edu.school} onSave={(val) => updateArrayItem('education', idx, 'school', val)} placeholder="School" />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
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
          <div key="skills" className="mb-8">
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${accentText} mb-4`}>
              Skills
            </h2>
            <div className="flex flex-col gap-2 font-sans">
              {data.skills?.map((skill, idx) => skill && (
                <div key={idx} className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">
                  <EditableField value={skill} onSave={(val) => updateSimpleArrayItem('skills', idx, val)} placeholder="Skill" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <div key="certifications" className="mb-8 bg-gray-100 p-5 rounded">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 border-b border-gray-300 pb-2">
              Certifications
            </h2>
            <div className="space-y-3">
              {data.certifications?.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <div className="font-bold text-[13px] text-gray-900 font-sans uppercase">
                    <EditableField value={cert.title} onSave={(val) => updateArrayItem('certifications', idx, 'title', val)} placeholder="Certification" />
                  </div>
                  {cert.date && (
                    <div className="text-[11px] font-bold text-gray-400 mt-1">
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
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${accentText} mb-4`}>
              Languages
            </h2>
            <div className="space-y-2 font-sans">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-end border-b border-gray-200 pb-1">
                  <span className="font-bold text-[14px] text-gray-900 uppercase tracking-tight">
                    <EditableField value={lang.name} onSave={(val) => updateArrayItem('languages', idx, 'name', val)} placeholder="Language" />
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
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
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${accentText} mb-4`}>
              Awards
            </h2>
            <div className="space-y-4">
              {data.achievements?.map((ach, idx) => (
                <div key={ach.id || idx}>
                  <div className="font-bold text-[14px] text-gray-900 uppercase tracking-tight mb-1">
                    <EditableField value={ach.title} onSave={(val) => updateArrayItem('achievements', idx, 'title', val)} placeholder="Award" />
                  </div>
                  {ach.desc && (
                    <div className="text-[13px] font-serif text-gray-600 leading-snug italic">
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
            <h2 className={`text-2xl font-black uppercase tracking-tighter ${accentText} mb-4`}>
              Interests
            </h2>
            <div className="text-[13px] font-serif text-gray-700 leading-relaxed">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx}>
                  <EditableField value={interest} onSave={(val) => updateSimpleArrayItem('interests', idx, val)} placeholder="Interest" />
                  {idx < data.interests.length - 1 && <span className="mx-2 font-bold text-gray-300">/</span>}
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const left = sectionsOrder.filter(s => leftColSections.includes(s));
  const right = sectionsOrder.filter(s => rightColSections.includes(s));
  const other = sectionsOrder.filter(s => !leftColSections.includes(s) && !rightColSections.includes(s));

  return (
    <div className="w-full bg-[#f9f9f7] min-h-[297mm] font-sans p-10">
      
      {/* Magazine Masthead Header */}
      <header className="mb-12 border-b-[8px] border-black pb-8 text-center relative">
        <div className={`absolute top-0 left-0 text-[10px] font-bold uppercase tracking-[0.4em] ${accentText}`}>Vol. 1</div>
        <div className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Exclusive</div>
        
        <h1 className="text-7xl font-black uppercase tracking-tighter text-black mb-4 leading-none mt-6" style={{ transform: 'scaleY(1.1)' }}>
          <EditableField value={data.name} onSave={(val) => handleInlineEdit('name', val)} placeholder="Your Name" />
        </h1>
        <div className="text-2xl font-serif italic text-gray-600 tracking-wide">
          <EditableField value={data.title} onSave={(val) => handleInlineEdit('title', val)} placeholder="Professional Title" />
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-800">
          {data.location && (
            <span className="flex items-center">
              <span className={accentText}>LOC: </span>&nbsp;
              <EditableField value={data.location} onSave={(val) => handleInlineEdit('location', val)} placeholder="Location" />
            </span>
          )}
          {data.email && (
            <span className="flex items-center">
              <span className={accentText}>EML: </span>&nbsp;
              <EditableField value={data.email} onSave={(val) => handleInlineEdit('email', val)} placeholder="Email" />
            </span>
          )}
          {data.phone && (
            <span className="flex items-center">
              <span className={accentText}>TEL: </span>&nbsp;
              <EditableField value={data.phone} onSave={(val) => handleInlineEdit('phone', val)} placeholder="Phone" />
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center">
              <span className={accentText}>LNK: </span>&nbsp;
              <EditableField value={data.linkedin} onSave={(val) => handleInlineEdit('linkedin', val)} placeholder="LinkedIn" />
            </span>
          )}
          {data.github && (
            <span className="flex items-center">
              <span className={accentText}>GIT: </span>&nbsp;
              <EditableField value={data.github} onSave={(val) => handleInlineEdit('github', val)} placeholder="GitHub" />
            </span>
          )}
        </div>
      </header>

      {/* Asymmetric Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left wider column for narrative content */}
        <div className="w-full md:w-[60%]">
          {left.map(sectionId => renderSectionContent(sectionId))}
          {other.map(sectionId => renderSectionContent(sectionId))}
        </div>
        
        {/* Right narrower column for snappy lists */}
        <div className="w-full md:w-[40%]">
          {right.map(sectionId => renderSectionContent(sectionId))}
        </div>
      </div>
    </div>
  );
};

export default Layout17;
