import React from 'react';
import EditableField from '../../../../shared/components/EditableField';

// Template 48: Product Roadmap Resume
const Layout48 = ({ data, theme, sectionsOrder = [], handleInlineEdit, updateArrayItem, updateSimpleArrayItem }) => {
  const accentBg = theme?.bgPrimary || 'bg-teal-500';
  const accentText = theme?.primary || 'text-teal-600';
  const accentBorder = theme?.border || 'border-teal-500';

  const RoadmapPhase = ({ title, icon }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-full ${accentBg} text-white flex items-center justify-center text-lg shadow-md z-10 relative`}>
        {icon}
      </div>
      <h2 className="text-[18px] font-black text-gray-900 tracking-wide uppercase bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200">
        {title}
      </h2>
    </div>
  );

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!data.summary && !handleInlineEdit) return null;
        return (
          <section key="summary" className="mb-12 relative">
            <RoadmapPhase title="V1.0: Vision" icon="🚀" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative pb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p className="text-[16px] leading-relaxed text-gray-700 font-medium">
                  <EditableField value={data.summary} onSave={v => handleInlineEdit('summary', v)} placeholder="Professional summary and vision..." multiline />
                </p>
              </div>
            </div>
          </section>
        );

      case 'experience':
        if (!data.experience?.length && !handleInlineEdit) return null;
        return (
          <section key="experience" className="mb-12 relative">
            <RoadmapPhase title="Core Releases" icon="⚙️" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative space-y-8 pb-6">
              {data.experience?.map((exp, idx) => (
                <article key={exp.id || idx} className="pdf-no-break relative">
                  <div className={`absolute -left-[49px] w-6 h-6 rounded-full bg-white border-4 ${accentBorder} top-1`}></div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2">
                      <div>
                        <h3 className="text-[18px] font-black text-gray-900">
                          <EditableField value={exp.title} onSave={v => updateArrayItem('experience', idx, 'title', v)} placeholder="Role Title" />
                        </h3>
                        <div className={`text-[14px] font-bold ${accentText}`}>
                          <EditableField value={exp.company} onSave={v => updateArrayItem('experience', idx, 'company', v)} placeholder="Company" />
                        </div>
                      </div>
                      <span className="text-[12px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                        <EditableField value={exp.date} onSave={v => updateArrayItem('experience', idx, 'date', v)} placeholder="Release Date" />
                      </span>
                    </div>
                    <div className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={exp.desc} onSave={v => updateArrayItem('experience', idx, 'desc', v)} placeholder="Milestones achieved..." multiline />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!data.projects?.length && !handleInlineEdit) return null;
        return (
          <section key="projects" className="mb-12 relative">
            <RoadmapPhase title="Feature Rollouts" icon="✨" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative space-y-6 pb-6">
              {data.projects?.map((proj, idx) => (
                <article key={proj.id || idx} className="pdf-no-break relative">
                  <div className="absolute -left-[45px] w-4 h-4 rounded-full bg-gray-300 border-2 border-white top-2"></div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[16px] font-bold text-gray-900">
                        <EditableField value={proj.title} onSave={v => updateArrayItem('projects', idx, 'title', v)} placeholder="Project Name" />
                      </h3>
                      {proj.link && (
                        <span className={`text-[12px] font-bold ${accentText} bg-blue-50 px-2 py-1 rounded`}>
                          <EditableField value={proj.link} onSave={v => updateArrayItem('projects', idx, 'link', v)} placeholder="Link" />
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                      <EditableField value={proj.desc} onSave={v => updateArrayItem('projects', idx, 'desc', v)} placeholder="Feature details..." multiline />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!data.education?.length && !handleInlineEdit) return null;
        return (
          <section key="education" className="mb-12 relative">
            <RoadmapPhase title="Foundation" icon="📚" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative space-y-6 pb-6">
              {data.education?.map((edu, idx) => (
                <article key={edu.id || idx} className="pdf-no-break relative">
                  <div className="absolute -left-[45px] w-4 h-4 rounded-full bg-gray-300 border-2 border-white top-2"></div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900">
                        <EditableField value={edu.degree} onSave={v => updateArrayItem('education', idx, 'degree', v)} placeholder="Degree" />
                      </h3>
                      <div className="text-[14px] font-medium text-gray-600">
                        <EditableField value={edu.school} onSave={v => updateArrayItem('education', idx, 'school', v)} placeholder="Institution" />
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-gray-400 mt-2 md:mt-0">
                      <EditableField value={edu.date} onSave={v => updateArrayItem('education', idx, 'date', v)} placeholder="Date" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!data.skills?.length && !handleInlineEdit) return null;
        return (
          <section key="skills" className="mb-12 relative">
            <RoadmapPhase title="Tech Stack" icon="💻" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative pb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-wrap gap-3">
                  {data.skills?.map((skill, idx) => skill && (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-[13px] font-bold px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <EditableField value={skill} onSave={v => updateSimpleArrayItem('skills', idx, v)} placeholder="Skill" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'achievements':
        if (!data.achievements?.length && !handleInlineEdit) return null;
        return (
          <section key="achievements" className="mb-12 relative">
            <RoadmapPhase title="Milestones" icon="🏆" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative space-y-4 pb-6">
              {data.achievements?.map((ach, idx) => (
                <article key={ach.id || idx} className="pdf-no-break relative">
                  <div className="absolute -left-[45px] w-4 h-4 rounded-full bg-yellow-400 border-2 border-white top-1"></div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1">
                      <EditableField value={ach.title} onSave={v => updateArrayItem('achievements', idx, 'title', v)} placeholder="Achievement" />
                    </h3>
                    {ach.desc && (
                      <div className="text-[13px] text-gray-600 whitespace-pre-wrap">
                        <EditableField value={ach.desc} onSave={v => updateArrayItem('achievements', idx, 'desc', v)} placeholder="Description..." multiline />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!data.certifications?.length && !handleInlineEdit) return null;
        return (
          <section key="certifications" className="mb-12 relative">
            <RoadmapPhase title="Certifications" icon="📜" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative space-y-4 pb-6">
              {data.certifications?.map((cert, idx) => (
                <article key={cert.id || idx} className="pdf-no-break relative">
                  <div className="absolute -left-[45px] w-4 h-4 rounded-full bg-gray-300 border-2 border-white top-1"></div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                    <span className="text-[14px] font-bold text-gray-800">
                      <EditableField value={cert.title} onSave={v => updateArrayItem('certifications', idx, 'title', v)} placeholder="Certification" />
                    </span>
                    {cert.date && (
                      <span className="text-[12px] font-bold text-gray-400">
                        <EditableField value={cert.date} onSave={v => updateArrayItem('certifications', idx, 'date', v)} placeholder="Date" />
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (!data.languages?.length && !handleInlineEdit) return null;
        return (
          <section key="languages" className="mb-12 relative">
            <RoadmapPhase title="Localization" icon="🌍" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative pb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.languages?.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-[14px] font-bold text-gray-900">
                      <EditableField value={lang.name} onSave={v => updateArrayItem('languages', idx, 'name', v)} placeholder="Language" />
                    </span>
                    <span className={`text-[12px] font-bold ${accentText}`}>
                      <EditableField value={lang.fluency} onSave={v => updateArrayItem('languages', idx, 'fluency', v)} placeholder="Fluency" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'interests':
        if (!data.interests?.length && !handleInlineEdit) return null;
        return (
          <section key="interests" className="mb-12 relative">
            <RoadmapPhase title="Backlog (Interests)" icon="📌" />
            <div className="ml-5 pl-10 border-l-4 border-dashed border-gray-300 relative pb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-2">
                {data.interests?.map((interest, idx) => interest && (
                  <span key={idx} className="text-[13px] font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded border border-gray-200">
                    <EditableField value={interest} onSave={v => updateSimpleArrayItem('interests', idx, v)} placeholder="Interest" />
                  </span>
                ))}
              </div>
            </div>
          </section>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-[297mm] p-8 md:p-12 font-sans relative overflow-hidden">
      
      {/* Roadmap Header Grid */}
      <header className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 mb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-gray-900 leading-none mb-3">
              <EditableField value={data.name} onSave={v => handleInlineEdit('name', v)} placeholder="Product Owner Name" />
            </h1>
            <p className={`text-xl font-black ${accentText} tracking-wide uppercase`}>
              <EditableField value={data.title} onSave={v => handleInlineEdit('title', v)} placeholder="Product Role" />
            </p>
          </div>
          
          <div className="md:col-span-1 flex flex-col gap-3 text-[13px] font-bold text-gray-500">
            {data.email && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><span className="text-gray-400">@</span> <EditableField value={data.email} onSave={v => handleInlineEdit('email', v)} placeholder="Email" /></div>}
            {data.phone && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><span className="text-gray-400">📞</span> <EditableField value={data.phone} onSave={v => handleInlineEdit('phone', v)} placeholder="Phone" /></div>}
            {data.location && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><span className="text-gray-400">📍</span> <EditableField value={data.location} onSave={v => handleInlineEdit('location', v)} placeholder="Location" /></div>}
            <div className="flex gap-4 pt-2">
              {data.linkedin && <span className="hover:text-gray-900 transition-colors underline"><EditableField value={data.linkedin} onSave={v => handleInlineEdit('linkedin', v)} placeholder="LinkedIn" /></span>}
              {data.github && <span className="hover:text-gray-900 transition-colors underline"><EditableField value={data.github} onSave={v => handleInlineEdit('github', v)} placeholder="GitHub" /></span>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Roadmap Timeline Container */}
      <div className="max-w-4xl mx-auto relative pl-2">
        {/* End of roadmap fade marker */}
        <div className="absolute left-[26px] bottom-0 w-1 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent z-10"></div>
        
        {sectionsOrder.map(id => renderSection(id))}
      </div>
      
    </div>
  );
};

export default Layout48;
