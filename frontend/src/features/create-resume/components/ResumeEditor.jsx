import React, { useState } from 'react';

const availableSectionsList = [
  { id: 'summary', label: 'Professional Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'interests', label: 'Interests' }
];

const Editor = ({
  resumeData,
  setResumeData,
  handleInput,
  handlePhotoUpload,
  addArrayItem,
  updateArrayItem,
  deleteArrayItem,
  updateSimpleArrayItem,
  sectionsOrder = [],
  addSection,
  removeSection,
  moveSection
}) => {
  const [expandedSection, setExpandedSection] = useState('personal');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const unaddedSections = availableSectionsList.filter(s => !sectionsOrder.includes(s.id));

  const renderSectionEditor = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return (
          <div className="p-4 bg-white border-t">
            <textarea className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 resize-none" value={resumeData.summary || ''} onChange={(e) => handleInput(e, 'summary')} placeholder="Write a brief professional summary..."></textarea>
          </div>
        );

      case 'experience':
        return (
          <div className="p-4 bg-white border-t space-y-4">
            {resumeData.experience?.map((exp, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group shadow-sm">
                <button onClick={() => deleteArrayItem('experience', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm z-10">✕</button>
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={exp.title} onChange={(e) => updateArrayItem('experience', idx, 'title', e.target.value)} placeholder="Job Title" />
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={exp.company} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} placeholder="Company" />
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={exp.date} onChange={(e) => updateArrayItem('experience', idx, 'date', e.target.value)} placeholder="Date (e.g. Oct 2021 - Present)" />
                <textarea className="w-full p-2 border border-gray-300 rounded-md h-20 focus:ring-2 focus:ring-blue-500 text-sm resize-none" value={exp.desc} onChange={(e) => updateArrayItem('experience', idx, 'desc', e.target.value)} placeholder="Description"></textarea>
              </div>
            ))}
            <button onClick={() => addArrayItem('experience', { title: '', company: '', date: '', desc: '' })} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Experience
            </button>
          </div>
        );

      case 'education':
        return (
          <div className="p-4 bg-white border-t space-y-4">
            {resumeData.education?.map((edu, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative shadow-sm">
                <button onClick={() => deleteArrayItem('education', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm z-10">✕</button>
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={edu.degree} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} placeholder="Degree/Course" />
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={edu.school} onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} placeholder="School/University" />
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={edu.date} onChange={(e) => updateArrayItem('education', idx, 'date', e.target.value)} placeholder="Date" />
              </div>
            ))}
            <button onClick={() => addArrayItem('education', { degree: '', school: '', date: '' })} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Education
            </button>
          </div>
        );

      case 'skills':
        return (
          <div className="p-4 bg-white border-t space-y-3">
            <div className="flex flex-wrap gap-2">
              {resumeData.skills?.map((skill, idx) => (
                <div key={idx} className="flex items-center bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <input type="text" className="p-1.5 px-3 bg-transparent text-sm w-32 outline-none focus:bg-white" value={skill} onChange={(e) => updateSimpleArrayItem('skills', idx, e.target.value)} placeholder="Skill" />
                  <button onClick={() => deleteArrayItem('skills', idx)} className="px-2 py-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 transition">✕</button>
                </div>
              ))}
            </div>
            <button onClick={() => setResumeData({...resumeData, skills: [...(resumeData.skills || []), '']})} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Skill
            </button>
          </div>
        );

      case 'projects':
        return (
          <div className="p-4 bg-white border-t space-y-4">
            {resumeData.projects?.map((proj, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative shadow-sm">
                <button onClick={() => deleteArrayItem('projects', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm z-10">✕</button>
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={proj.title} onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)} placeholder="Project Title" />
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={proj.link} onChange={(e) => updateArrayItem('projects', idx, 'link', e.target.value)} placeholder="Link (Optional)" />
                <textarea className="w-full p-2 border border-gray-300 rounded-md h-20 focus:ring-2 focus:ring-blue-500 text-sm resize-none" value={proj.desc} onChange={(e) => updateArrayItem('projects', idx, 'desc', e.target.value)} placeholder="Description"></textarea>
              </div>
            ))}
            <button onClick={() => addArrayItem('projects', { title: '', link: '', desc: '' })} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Project
            </button>
          </div>
        );

      case 'certifications':
        return (
          <div className="p-4 bg-white border-t space-y-4">
            {resumeData.certifications?.map((cert, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative shadow-sm">
                <button onClick={() => deleteArrayItem('certifications', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm z-10">✕</button>
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={cert.title} onChange={(e) => updateArrayItem('certifications', idx, 'title', e.target.value)} placeholder="Certification Name" />
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={cert.date} onChange={(e) => updateArrayItem('certifications', idx, 'date', e.target.value)} placeholder="Date/Issuer" />
              </div>
            ))}
            <button onClick={() => addArrayItem('certifications', { title: '', date: '' })} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Certification
            </button>
          </div>
        );

      case 'languages':
        return (
          <div className="p-4 bg-white border-t space-y-4">
            {resumeData.languages?.map((lang, idx) => (
              <div key={idx} className="flex space-x-2 items-center bg-gray-50 p-2 border border-gray-200 rounded-lg">
                <input type="text" className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-bold" placeholder="Language" value={lang.name} onChange={(e) => updateArrayItem('languages', idx, 'name', e.target.value)} />
                <input type="text" className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Fluency" value={lang.fluency} onChange={(e) => updateArrayItem('languages', idx, 'fluency', e.target.value)} />
                <button onClick={() => deleteArrayItem('languages', idx)} className="text-red-500 hover:bg-red-100 rounded-md p-2 transition">✕</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('languages', { name: '', fluency: '' })} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Language
            </button>
          </div>
        );

      case 'achievements':
        return (
          <div className="p-4 bg-white border-t space-y-4">
            {resumeData.achievements?.map((ach, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative shadow-sm">
                <button onClick={() => deleteArrayItem('achievements', idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm z-10">✕</button>
                <input type="text" className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={ach.title} onChange={(e) => updateArrayItem('achievements', idx, 'title', e.target.value)} placeholder="Achievement Title" />
                <textarea className="w-full p-2 border border-gray-300 rounded-md h-16 focus:ring-2 focus:ring-blue-500 text-sm resize-none" value={ach.desc} onChange={(e) => updateArrayItem('achievements', idx, 'desc', e.target.value)} placeholder="Description"></textarea>
              </div>
            ))}
            <button onClick={() => addArrayItem('achievements', { title: '', desc: '' })} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Achievement
            </button>
          </div>
        );

      case 'interests':
        return (
          <div className="p-4 bg-white border-t space-y-3">
             <div className="flex flex-wrap gap-2">
              {resumeData.interests?.map((interest, idx) => (
                <div key={idx} className="flex items-center bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <input type="text" className="p-1.5 px-3 bg-transparent text-sm w-32 outline-none focus:bg-white" value={interest} onChange={(e) => updateSimpleArrayItem('interests', idx, e.target.value)} placeholder="Interest" />
                  <button onClick={() => deleteArrayItem('interests', idx)} className="px-2 py-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 transition">✕</button>
                </div>
              ))}
            </div>
            <button onClick={() => setResumeData({...resumeData, interests: [...(resumeData.interests || []), '']})} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-sm transition">
              + Add Interest
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden border-r border-gray-200">
      
      {/* Editor Header */}
      <div className="p-4 bg-white border-b shadow-sm shrink-0 flex justify-between items-center z-10">
        <h2 className="text-lg font-extrabold text-gray-800">Resume Content</h2>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 space-y-3">
        
        {/* Personal Details (Always visible at top) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button 
            className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
            onClick={() => toggleSection('personal')}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">👤</span>
              <span className="font-bold text-gray-700">Personal Details</span>
            </div>
            <span className="text-gray-400">{expandedSection === 'personal' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'personal' && (
            <div className="p-4 bg-white border-t space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.name || ''} onChange={(e) => handleInput(e, 'name')} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Professional Title</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.title || ''} onChange={(e) => handleInput(e, 'title')} placeholder="e.g. Software Engineer" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                  <input type="email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.email || ''} onChange={(e) => handleInput(e, 'email')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone</label>
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.phone || ''} onChange={(e) => handleInput(e, 'phone')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Location</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.location || ''} onChange={(e) => handleInput(e, 'location')} placeholder="e.g. New York, NY" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Links</label>
                <div className="space-y-2">
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.linkedin || ''} onChange={(e) => handleInput(e, 'linkedin')} placeholder="LinkedIn URL" />
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.github || ''} onChange={(e) => handleInput(e, 'github')} placeholder="GitHub URL" />
                  <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm" value={resumeData.portfolio || ''} onChange={(e) => handleInput(e, 'portfolio')} placeholder="Portfolio URL" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Profile Photo</label>
                <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handlePhotoUpload} />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Sections */}
        {sectionsOrder.map((sectionId, index) => {
          const sectionDef = availableSectionsList.find(s => s.id === sectionId);
          if (!sectionDef) return null;

          return (
            <div key={sectionId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="flex items-center p-2 hover:bg-gray-50 transition pr-4">
                {/* Drag Handle / Reorder */}
                <div className="flex flex-col mr-2">
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">▲</button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === sectionsOrder.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">▼</button>
                </div>
                
                <button 
                  className="flex-1 flex items-center justify-between py-2 text-left"
                  onClick={() => toggleSection(sectionId)}
                >
                  <span className="font-bold text-gray-700">{sectionDef.label}</span>
                  <span className="text-gray-400">{expandedSection === sectionId ? '▲' : '▼'}</span>
                </button>

                {/* Delete Section */}
                <button 
                  onClick={() => removeSection(sectionId)} 
                  className="ml-3 text-red-400 hover:text-red-600 transition"
                  title="Remove Section"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

              {expandedSection === sectionId && renderSectionEditor(sectionId)}
            </div>
          );
        })}

        {/* Add Section Button Area */}
        <div className="pt-4 relative">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-full py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 font-bold transition flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Add Section
          </button>
          
          {showAddMenu && unaddedSections.length > 0 && (
            <div className="absolute bottom-16 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
              <div className="p-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">Available Sections</div>
              {unaddedSections.map(section => (
                <button 
                  key={section.id} 
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 font-medium border-b border-gray-100 last:border-0"
                  onClick={() => {
                    addSection(section.id);
                    setShowAddMenu(false);
                    setExpandedSection(section.id);
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>
          )}
          
          {showAddMenu && unaddedSections.length === 0 && (
            <div className="absolute bottom-16 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-4 text-center text-gray-500 text-sm">
              All sections added!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Editor;
