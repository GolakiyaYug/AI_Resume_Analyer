import React from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from './templates';
import { realisticDummyData, defaultSectionsOrder } from '../../../shared/utils/dummyData';

const TemplateSelector = ({ onSelect }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-20 left-4 sm:left-8 z-50 inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Choose Your Resume Template
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Select from our professional templates to get started. You can always change it later without losing your data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {templates.map((template) => {
            const TemplateComponent = template.component;
            return (
              <div 
                key={template.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-200 flex flex-col"
              >
                {/* Thumbnail Representation using actual scaled-down component */}
                <div className="h-72 w-full bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 origin-top-left bg-white w-[210mm] min-h-[297mm]" style={{ transform: 'scale(0.355)' }}>
                    <TemplateComponent data={realisticDummyData} theme={template.theme} sectionsOrder={defaultSectionsOrder} />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <button 
                      onClick={() => onSelect(template)}
                      className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4 flex-grow flex flex-col justify-between border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    {template.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 capitalize">{template.theme.id} Theme</span>
                    <div className={`w-4 h-4 rounded-full ${template.theme.bgPrimary} shadow-sm border border-gray-200`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;

