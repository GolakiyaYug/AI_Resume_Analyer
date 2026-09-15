import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 47: Kanban Board Resume
const Layout47 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-blue-600';
  const accentText = theme?.primary || 'text-blue-600';

  const KanbanColumnHeader = ({ title, count }) => (
    <div className="flex justify-between items-center bg-gray-200/60 p-3 rounded-t-xl border-b border-gray-300">
      <h2 className="text-[14px] font-bold text-gray-700 uppercase tracking-wider">{title}</h2>
      {count !== undefined && (
        <span className="bg-gray-300 text-gray-600 text-[11px] font-black px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="col-span-1 md:col-span-12 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-start">
              <div className="text-2xl pt-1 hidden sm:block">📝</div>
              <p className="text-[15px] leading-relaxed text-gray-700 font-medium">
                <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Bio/Summary..." multiline />
              </p>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="bg-gray-100 rounded-xl flex flex-col h-full border border-gray-200">
            <KanbanColumnHeader title="In Progress (Experience)" count={data.experience?.length || 0} />
            <div className="p-3 space-y-3 flex-1">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${accentBg}`}>EXPERIENCE</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                      <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                    <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Task/Role" />
                  </h3>
                  <div className={`text-[13px] font-bold ${accentText} mb-2`}>
                    <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                  </div>
                  <div className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Task details..." multiline />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="bg-gray-100 rounded-xl flex flex-col h-full border border-gray-200">
            <KanbanColumnHeader title="Done (Projects)" count={data.projects?.length || 0} />
            <div className="p-3 space-y-3 flex-1">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">COMPLETED</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-tight mb-1">
                    <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                  </h3>
                  <div className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap mb-3">
                    <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Description..." multiline />
                  </div>
                  {proj.link && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                      🔗 <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="bg-gray-100 rounded-xl flex flex-col border border-gray-200">
            <KanbanColumnHeader title="Backlog (Education)" />
            <div className="p-3 space-y-3">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-[14px] font-bold text-gray-900">
                    <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                  </h3>
                  <div className="text-[13px] text-gray-600 my-1">
                    <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="School" />
                  </div>
                  <div className="text-[11px] font-bold text-gray-400">
                    <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="bg-gray-100 rounded-xl flex flex-col border border-gray-200">
            <KanbanColumnHeader title="Labels (Skills)" />
            <div className="p-4 bg-white m-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, idx) => skill && (
                  <span key={idx} className={`text-[12px] font-bold px-3 py-1 rounded-md text-white ${accentBg} shadow-sm`}>
                    <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                  </span>
                ))}
              </div>
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="bg-gray-100 rounded-xl flex flex-col border border-gray-200">
            <KanbanColumnHeader title="Verified (Certs)" />
            <div className="p-3 space-y-2">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-[13px] font-bold text-gray-800">
                    <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                  </span>
                  {cert.date && (
                    <span className="text-[11px] font-bold text-gray-400 mt-1">
                      <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="bg-gray-100 rounded-xl flex flex-col border border-gray-200">
            <KanbanColumnHeader title="i18n (Languages)" />
            <div className="p-3 space-y-2">
              {data.languages?.map((lang, idx) => (
                <div key={lang.id || idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-[13px] font-bold text-gray-800">
                    <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="bg-gray-100 rounded-xl flex flex-col border border-gray-200">
            <KanbanColumnHeader title="Epics (Achievements)" />
            <div className="p-3 space-y-3">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500">⭐</span>
                    <h3 className="text-[14px] font-bold text-gray-900">
                      <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                    </h3>
                  </div>
                  {ach.desc && (
                    <div className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap ml-6">
                      <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="bg-gray-100 rounded-xl flex flex-col border border-gray-200">
            <KanbanColumnHeader title="Tags (Interests)" />
            <div className="p-3 flex flex-wrap gap-2">
              {data.interests?.map((interest, idx) => interest && (
                <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[12px] font-medium px-3 py-1.5 rounded shadow-sm">
                  <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                </span>
              ))}
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#f4f5f7] min-h-[297mm] p-8 md:p-10 font-sans">
      
      {/* App Header */}
      <header className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className={`w-16 h-16 rounded-xl ${accentBg} text-white flex items-center justify-center text-2xl font-black shadow-md`}>
            {data.name ? data.name.charAt(0) : 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="User Name" />
            </h1>
            <p className="text-[15px] font-bold text-gray-500">
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Role / Assignee" />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-[12px] font-semibold text-gray-600 justify-start md:justify-end w-full md:w-auto">
          {data.email && <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2"><span className="text-gray-400">@</span> <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
          {data.phone && <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2"><span className="text-gray-400">📞</span> <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
          {data.location && <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2"><span className="text-gray-400">📍</span> <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
          {data.linkedin && <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2"><span className="text-blue-500">in</span> <EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></div>}
          {data.github && <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2"><span className="text-gray-800">gh</span> <EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></div>}
        </div>
      </header>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Full width summary if present */}
        {sectionsOrder.includes('summary') && (
          <div className="col-span-1 md:col-span-3">
             {renderSection('summary')}
          </div>
        )}

        {/* Column 1: Backlog / Meta */}
        <div className="flex flex-col gap-6">
          {sectionsOrder.includes('education') && renderSection('education')}
          {sectionsOrder.includes('skills') && renderSection('skills')}
          {sectionsOrder.includes('languages') && renderSection('languages')}
          {sectionsOrder.includes('interests') && renderSection('interests')}
        </div>

        {/* Column 2: In Progress (Experience) */}
        <div className="flex flex-col gap-6">
          {sectionsOrder.includes('experience') && renderSection('experience')}
          {sectionsOrder.includes('certifications') && renderSection('certifications')}
        </div>

        {/* Column 3: Done (Projects, Achievements) */}
        <div className="flex flex-col gap-6">
          {sectionsOrder.includes('projects') && renderSection('projects')}
          {sectionsOrder.includes('achievements') && renderSection('achievements')}
        </div>

      </div>
      
    </div>
  );
};

export default Layout47;
