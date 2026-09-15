import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TemplateSelector from '../components/TemplateSelector';
import ResumeEditor from '../components/ResumeEditor';
import ResumePreview from '../components/ResumePreview';
import { getTemplateById } from '../components/templates';
import { realisticDummyData, defaultSectionsOrder } from '../../../shared/utils/dummyData';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../shared/utils/api';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get('resume'); // ?resume=<id> to load existing

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    name: '', title: '', email: '', phone: '', location: '', summary: '', photo: '',
    linkedin: '', github: '', portfolio: '',
    experience: [], education: [], skills: [],
    projects: [], certifications: [], languages: [],
    achievements: [], interests: []
  });
  const [sectionsOrder, setSectionsOrder] = useState([]);

  // Save state
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  // ── Load existing resume from URL param ──────────────────────────────────
  useEffect(() => {
    if (!resumeIdParam) return;
    const loadResume = async () => {
      try {
        const res = await api.get(`/api/resume/${resumeIdParam}`);
        const r = res.data;
        setSavedResumeId(r.id);
        setResumeTitle(r.title);
        const resolvedTemplate = getTemplateById(r.template_id);
        setSelectedTemplate(resolvedTemplate);
        
        // Handle content and sectionsOrder
        if (r.content) {
          const content = typeof r.content === 'string' ? JSON.parse(r.content) : r.content;
          setResumeData(content);
          if (content.sectionsOrder && Array.isArray(content.sectionsOrder) && content.sectionsOrder.length > 0) {
            setSectionsOrder(content.sectionsOrder);
          } else {
            setSectionsOrder([...defaultSectionsOrder]);
          }
        }
        showToast(`📂 Loaded "${r.title}"`, 'success');
      } catch (err) {
        console.error('Failed to load resume:', err);
        showToast('❌ Failed to load resume', 'error');
      }
    };
    loadResume();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeIdParam]);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setResumeData(JSON.parse(JSON.stringify(realisticDummyData)));
    setSectionsOrder([...defaultSectionsOrder]);
  };

  // ── Save / Update resume ─────────────────────────────────────────────────
  const handleSave = async (title) => {
    if (!title?.trim()) return;
    setSaveStatus('saving');
    try {
      const payload = {
        title: title.trim(),
        template_id: selectedTemplate?.id || selectedTemplate?.name || 'layout1-blue',
        content: {
          ...resumeData,
          sectionsOrder
        },
      };

      if (savedResumeId) {
        await api.put(`/api/resume/${savedResumeId}`, payload);
        showToast('✅ Resume updated!', 'success');
      } else {
        const res = await api.post('/api/resume/', payload);
        setSavedResumeId(res.data.resume?.id);
        setResumeTitle(title.trim());
        showToast('✅ Resume saved!', 'success');
      }
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
      const msg = err.response?.data?.message || 'Failed to save resume';
      showToast(`❌ ${msg}`, 'error');
    }
  };

  const openSaveModal = () => {
    if (!resumeTitle) setResumeTitle(`${user?.name || 'My'}'s Resume`);
    setShowSaveModal(true);
  };

  // ── Array state handlers ─────────────────────────────────────────────────
  const handleInput = (e, field) => setResumeData({ ...resumeData, [field]: e.target.value });
  const handleInlineEdit = (field, value) => setResumeData({ ...resumeData, [field]: value });
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setResumeData({ ...resumeData, photo: URL.createObjectURL(file) });
  };
  const addArrayItem = (field, defaultItem) => setResumeData({ ...resumeData, [field]: [...resumeData[field], defaultItem] });
  const updateArrayItem = (field, index, key, value) => {
    const newArr = [...resumeData[field]];
    newArr[index] = { ...newArr[index], [key]: value };
    setResumeData({ ...resumeData, [field]: newArr });
  };
  const deleteArrayItem = (field, index) => {
    const newArr = [...resumeData[field]];
    newArr.splice(index, 1);
    setResumeData({ ...resumeData, [field]: newArr });
  };
  const updateSimpleArrayItem = (field, index, value) => {
    const newArr = [...resumeData[field]];
    newArr[index] = value;
    setResumeData({ ...resumeData, [field]: newArr });
  };

  // ── Section reorder ──────────────────────────────────────────────────────
  const addSection = (sectionId) => { if (!sectionsOrder.includes(sectionId)) setSectionsOrder([...sectionsOrder, sectionId]); };
  const removeSection = (sectionId) => setSectionsOrder(sectionsOrder.filter(id => id !== sectionId));
  const moveSection = (index, direction) => {
    const newOrder = [...sectionsOrder];
    if (direction === 'up' && index > 0) [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    else if (direction === 'down' && index < newOrder.length - 1) [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setSectionsOrder(newOrder);
  };

  // ── Template selector ───────────────────────────────────────────────────
  if (!selectedTemplate) return <TemplateSelector onSelect={handleSelectTemplate} />;

  // ── Save Title Modal ─────────────────────────────────────────────────────
  const SaveModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {savedResumeId ? '💾 Update Resume' : '💾 Save Resume'}
        </h3>
        <p className="text-gray-500 text-sm mb-5">Give your resume a name so you can find it later</p>
        <input
          autoFocus
          type="text"
          value={resumeTitle}
          onChange={(e) => setResumeTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { setShowSaveModal(false); handleSave(resumeTitle); } }}
          placeholder="e.g. Software Engineer Resume"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowSaveModal(false)}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { setShowSaveModal(false); handleSave(resumeTitle); }}
            disabled={!resumeTitle.trim() || saveStatus === 'saving'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Toast notification */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-[200] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium text-white transition-all animate-[fadeIn_0.2s_ease] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Save modal */}
      {showSaveModal && <SaveModal />}

      <div className="flex h-[calc(100vh-80px)] -mt-2 w-full overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] h-full border-r border-gray-200 flex flex-col">
          {/* Save bar */}
          <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="text-xs text-gray-400 truncate">
              {savedResumeId ? `Editing: ${resumeTitle}` : 'Unsaved resume'}
            </div>
            <button
              id="save-resume-btn"
              onClick={openSaveModal}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-60 flex-shrink-0"
            >
              {saveStatus === 'saving' ? (
                <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : (
                <>💾 {savedResumeId ? 'Update' : 'Save'}</>
              )}
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <ResumeEditor
              resumeData={resumeData}
              setResumeData={setResumeData}
              handleInput={handleInput}
              handlePhotoUpload={handlePhotoUpload}
              addArrayItem={addArrayItem}
              updateArrayItem={updateArrayItem}
              deleteArrayItem={deleteArrayItem}
              updateSimpleArrayItem={updateSimpleArrayItem}
              sectionsOrder={sectionsOrder}
              addSection={addSection}
              removeSection={removeSection}
              moveSection={moveSection}
            />
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="hidden md:flex md:w-[55%] lg:w-[60%] xl:w-[65%] h-full">
          <ResumePreview
            resumeData={resumeData}
            template={selectedTemplate}
            onChangeTemplate={() => setSelectedTemplate(null)}
            handleInlineEdit={handleInlineEdit}
            sectionsOrder={sectionsOrder}
            updateArrayItem={updateArrayItem}
            updateSimpleArrayItem={updateSimpleArrayItem}
          />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;
