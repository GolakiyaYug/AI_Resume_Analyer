import React, { useRef, useEffect, useState } from 'react';
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiChevronDown } from 'react-icons/fi';

const FONTS = [
  'Arial',
  'Times New Roman',
  'Calibri',
  'Georgia',
  'Courier New',
  'Verdana'
];

const CustomEditorPage = () => {
  const editorRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  
  const [activeFont, setActiveFont] = useState('Arial');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  const [isAlignLeft, setIsAlignLeft] = useState(true);
  const [isAlignCenter, setIsAlignCenter] = useState(false);
  const [isAlignRight, setIsAlignRight] = useState(false);

  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isFooterActive, setIsFooterActive] = useState(false);
  
  const [isUnorderedList, setIsUnorderedList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [activeListDropdown, setActiveListDropdown] = useState(null);
  
  const savedSelection = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    updateActiveStates();
  }, []);

  const updateActiveStates = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
    
    const alignCenter = document.queryCommandState('justifyCenter');
    const alignRight = document.queryCommandState('justifyRight');
    const alignFull = document.queryCommandState('justifyFull');
    const alignLeft = document.queryCommandState('justifyLeft') || (!alignCenter && !alignRight && !alignFull);

    setIsAlignCenter(alignCenter);
    setIsAlignRight(alignRight);
    setIsAlignLeft(alignLeft);
    
    setIsUnorderedList(document.queryCommandState('insertUnorderedList'));
    setIsOrderedList(document.queryCommandState('insertOrderedList'));
    
    let fontName = document.queryCommandValue('fontName');
    if (fontName) {
      setActiveFont(fontName.replace(/['"]/g, ''));
    } else {
      setActiveFont('Arial');
    }
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
    }
  };

  const executeListCommand = (command, listStyleType) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    
    document.execCommand(command, false, null);
    
    if (listStyleType) {
      let activeEditor = null;
      if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
      else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
      else if (editorRef.current) activeEditor = editorRef.current;

      if (activeEditor) {
        let node = window.getSelection().anchorNode;
        while (node && node !== activeEditor && node.nodeName !== 'UL' && node.nodeName !== 'OL') {
          node = node.parentNode;
        }
        if (node && (node.nodeName === 'UL' || node.nodeName === 'OL')) {
          node.style.listStyleType = listStyleType;
        }
      }
    }

    updateActiveStates();
    setActiveListDropdown(null);

    if (isHeaderActive && headerRef.current) headerRef.current.focus();
    else if (isFooterActive && footerRef.current) footerRef.current.focus();
    else if (editorRef.current) editorRef.current.focus();
  };

  const executeCommand = (command, value = null) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    
    document.execCommand(command, false, value);
    updateActiveStates();

    if (isHeaderActive && headerRef.current) {
      headerRef.current.focus();
    } else if (isFooterActive && footerRef.current) {
      footerRef.current.focus();
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handlePrint = () => {
    setIsHeaderActive(false);
    setIsFooterActive(false);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center">
      <div 
        className="w-full max-w-4xl bg-white rounded-t-xl shadow-md border border-gray-200 p-2 flex flex-wrap items-center gap-2 sticky top-16 z-40 print:hidden"
        onMouseDown={(e) => {
          if (!e.target.closest('button')) {
            e.preventDefault();
            setActiveListDropdown(null);
            setIsFontDropdownOpen(false);
          }
        }}
      >
        
        {/* Font Family Dropdown */}
        <div className="relative flex items-center border-r border-gray-300 pr-2 mr-2">
          <button 
            onMouseDown={(e) => { 
              e.preventDefault(); 
              setIsFontDropdownOpen(!isFontDropdownOpen); 
              setActiveListDropdown(null);
            }} 
            className="p-1 px-2 rounded flex items-center justify-between w-32 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-sm"
            title="Font Family"
          >
            <span className="truncate" style={{ fontFamily: activeFont }}>{activeFont || 'Font'}</span>
            <FiChevronDown size={14} className="ml-1 text-gray-500" />
          </button>
          {isFontDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-48 max-h-64 overflow-y-auto print:hidden">
              {FONTS.map(font => (
                <button 
                  key={font}
                  onMouseDown={(e) => { 
                    e.preventDefault(); 
                    executeCommand('fontName', font);
                    setIsFontDropdownOpen(false);
                  }} 
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${activeFont === font ? 'bg-blue-100 text-blue-700' : ''}`}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Styles (B, I, U only) */}
        <div className="flex items-center gap-1 pr-2">
          <button 
            onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }} 
            className={`p-2 rounded transition-colors ${isBold ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
            title="Bold"
          >
            <FiBold />
          </button>
          <button 
            onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }} 
            className={`p-2 rounded transition-colors ${isItalic ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
            title="Italic"
          >
            <FiItalic />
          </button>
          <button 
            onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }} 
            className={`p-2 rounded transition-colors ${isUnderline ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
            title="Underline"
          >
            <FiUnderline />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 pr-2">
          <button 
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyLeft'); }} 
            className={`p-2 rounded transition-colors ${isAlignLeft ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
            title="Align Left"
          >
            <FiAlignLeft />
          </button>
          <button 
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyCenter'); }} 
            className={`p-2 rounded transition-colors ${isAlignCenter ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
            title="Align Center"
          >
            <FiAlignCenter />
          </button>
          <button 
            onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyRight'); }} 
            className={`p-2 rounded transition-colors ${isAlignRight ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
            title="Align Right"
          >
            <FiAlignRight />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 pr-2">
          {/* Bullets Dropdown */}
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'disc'); }} 
              className={`p-2 rounded-l transition-colors ${isUnorderedList ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
              title="Bullets"
            >
              <FiList />
            </button>
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setActiveListDropdown(activeListDropdown === 'bullets' ? null : 'bullets'); 
              }} 
              className={`p-2 rounded-r transition-colors ${activeListDropdown === 'bullets' ? 'bg-gray-200' : 'text-gray-700 hover:bg-gray-100'}`} 
            >
              <FiChevronDown size={14} />
            </button>
            {activeListDropdown === 'bullets' && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-32 flex flex-col print:hidden">
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'disc'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2">Disc</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'circle'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2">Circle</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'square'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2">Square</button>
              </div>
            )}
          </div>

          {/* Numbered Dropdown */}
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'decimal'); }} 
              className={`p-2 rounded-l transition-colors ${isOrderedList ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`} 
              title="Numbered List"
            >
              <span className="font-bold text-xs">1.</span>
            </button>
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setActiveListDropdown(activeListDropdown === 'numbered' ? null : 'numbered'); 
              }} 
              className={`p-2 rounded-r transition-colors ${activeListDropdown === 'numbered' ? 'bg-gray-200' : 'text-gray-700 hover:bg-gray-100'}`} 
            >
              <FiChevronDown size={14} />
            </button>
            {activeListDropdown === 'numbered' && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-40 flex flex-col print:hidden">
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'decimal'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">1, 2, 3</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'upper-alpha'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">A, B, C</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'lower-alpha'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">a, b, c</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'upper-roman'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">I, II, III</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'lower-roman'); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">i, ii, iii</button>
              </div>
            )}
          </div>
        </div>

        {/* Print / Save */}
        <div className="flex-1 flex justify-end">
          <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Editor Canvas (A4 Paper look) */}
      <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-2xl mt-4 print:shadow-none print:mt-0 print:border-none focus:outline-none transition-colors duration-300 flex flex-col">
        
        {/* Header Margin */}
        <div 
          ref={headerRef}
          contentEditable={isHeaderActive}
          suppressContentEditableWarning
          onClick={(e) => {
            if (e.detail === 3 && !isHeaderActive) {
              setIsHeaderActive(true);
              setTimeout(() => headerRef.current?.focus(), 0);
            }
          }}
          onBlur={() => setIsHeaderActive(false)}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          className={`w-full max-w-full break-words [word-break:break-word] min-h-[100px] px-12 pt-12 pb-4 outline-none text-gray-500 text-sm transition-all ${isHeaderActive ? 'border-b-2 border-dashed border-gray-300 bg-gray-50 ring-2 ring-blue-100' : 'cursor-default hover:bg-gray-50/50 print:border-none print:bg-transparent'}`}
          title="Triple-click to edit Header"
        >
        </div>

        {/* Main Body */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          className="w-full flex-1 px-12 py-4 outline-none prose max-w-none text-gray-800 text-left font-normal"
        >
          <p><br /></p>
        </div>

        {/* Footer Margin */}
        <div 
          ref={footerRef}
          contentEditable={isFooterActive}
          suppressContentEditableWarning
          onClick={(e) => {
            if (e.detail === 3 && !isFooterActive) {
              setIsFooterActive(true);
              setTimeout(() => footerRef.current?.focus(), 0);
            }
          }}
          onBlur={() => setIsFooterActive(false)}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          className={`w-full max-w-full break-words [word-break:break-word] min-h-[100px] px-12 pb-12 pt-4 outline-none text-gray-500 text-sm transition-all ${isFooterActive ? 'border-t-2 border-dashed border-gray-300 bg-gray-50 ring-2 ring-blue-100' : 'cursor-default hover:bg-gray-50/50 print:border-none print:bg-transparent'}`}
          title="Triple-click to edit Footer"
        >
        </div>

      </div>
    </div>
  );
};

export default CustomEditorPage;
