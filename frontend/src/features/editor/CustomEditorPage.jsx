import React, { useRef, useEffect, useState } from 'react';
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiChevronDown, FiType, FiEdit2, FiDroplet } from 'react-icons/fi';

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
  '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79'
];

const FONTS = [
  'Arial',
  'Times New Roman',
  'Calibri',
  'Georgia',
  'Courier New',
  'Verdana'
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const CustomEditorPage = () => {
  const editorRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  
  const [activeFont, setActiveFont] = useState('Arial');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  
  const [activeFontSize, setActiveFontSize] = useState(12);
  const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState(false);

  const [isAlignLeft, setIsAlignLeft] = useState(true);
  const [isAlignCenter, setIsAlignCenter] = useState(false);
  const [isAlignRight, setIsAlignRight] = useState(false);

  const [activeFontColor, setActiveFontColor] = useState('#000000');
  const [isFontColorDropdownOpen, setIsFontColorDropdownOpen] = useState(false);
  const [activeHighlightColor, setActiveHighlightColor] = useState('transparent');
  const [isHighlightColorDropdownOpen, setIsHighlightColorDropdownOpen] = useState(false);
  const [activeShadingColor, setActiveShadingColor] = useState('transparent');
  const [isShadingDropdownOpen, setIsShadingDropdownOpen] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      const selection = window.getSelection();
      if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      let container = range.startContainer;
      let offset = range.startOffset;

      if (container.nodeType === 3 && offset === container.nodeValue.length) {
        let currentNode = container;
        let styledParent = null;

        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH'];

        // Traverse up to find the highest active inline formatting span/font tag
        while (currentNode && currentNode !== editorRef.current && currentNode !== headerRef.current && currentNode !== footerRef.current) {
          if (currentNode.nodeType === 1) {
            // Immediately stop at structural block containers so block background (line shading) is not treated as an inline span
            if (blockTags.includes(currentNode.nodeName)) {
              break;
            }
            const hasColor = currentNode.style && (currentNode.style.color || currentNode.style.backgroundColor);
            const isFontTag = currentNode.nodeName === 'FONT';
            if (hasColor || isFontTag) {
              styledParent = currentNode;
            }
          }
          currentNode = currentNode.parentNode;
        }

        if (styledParent) {
          // Check if we are truly at the absolute end of the styled parent boundary
          let isAtVeryEnd = true;
          let checkNode = container;
          while (checkNode && checkNode !== styledParent) {
            if (checkNode.nextSibling) {
              isAtVeryEnd = false;
              break;
            }
            checkNode = checkNode.parentNode;
          }

          if (isAtVeryEnd) {
            e.preventDefault();
            
            // Save core text styles before breaking out
            const wasBold = document.queryCommandState('bold');
            const wasItalic = document.queryCommandState('italic');
            const wasUnderline = document.queryCommandState('underline');
            
            // Insert a clean unstyled text node OUTSIDE the colored span
            const cleanNode = document.createTextNode('\u00A0'); // non-breaking space ensures stability
            
            if (styledParent.nextSibling) {
              styledParent.parentNode.insertBefore(cleanNode, styledParent.nextSibling);
            } else {
              styledParent.parentNode.appendChild(cleanNode);
            }
            
            // Forcefully move caret to the clean node
            range.setStart(cleanNode, 1);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Restore structural formatting if they were stripped
            if (wasBold && !document.queryCommandState('bold')) document.execCommand('bold', false, null);
            if (wasItalic && !document.queryCommandState('italic')) document.execCommand('italic', false, null);
            if (wasUnderline && !document.queryCommandState('underline')) document.execCommand('underline', false, null);
            
            // Ensure next typed text inherits default colors perfectly
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('foreColor', false, '#000000');
            document.execCommand('backColor', false, 'transparent');
            document.execCommand('hiliteColor', false, 'transparent');
            
            setActiveFontColor('#000000');
            setActiveHighlightColor('transparent');
          }
        }
      }
    }
  };

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
    
    let foreColor = document.queryCommandValue('foreColor');
    if (foreColor) setActiveFontColor(foreColor);
    
    let backColor = document.queryCommandValue('backColor') || document.queryCommandValue('hiliteColor');
    if (backColor) setActiveHighlightColor(backColor);
    
    let node = window.getSelection().anchorNode;
    let activeEditor = null;
    if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
    else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
    else if (editorRef.current) activeEditor = editorRef.current;

    if (node && activeEditor) {
      let blockNode = node;
      while (blockNode && blockNode !== activeEditor && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockNode.nodeName)) {
        blockNode = blockNode.parentNode;
      }
      if (blockNode && blockNode !== activeEditor) {
        setActiveShadingColor(blockNode.style.backgroundColor || 'transparent');
      } else {
        setActiveShadingColor('transparent');
      }
    }
    
    let fontName = document.queryCommandValue('fontName');
    if (fontName && typeof fontName === 'string') {
      setActiveFont(fontName.replace(/['"]/g, ''));
    } else {
      setActiveFont('Arial');
    }
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
      
      try {
        const parentNode = selection.getRangeAt(0).startContainer.parentNode;
        // Safely verify it's an element node and not the document root before calling getComputedStyle
        if (parentNode && parentNode.nodeType === 1 && parentNode !== document && parentNode !== document.documentElement) {
          const computedSize = window.getComputedStyle(parentNode).fontSize;
          if (computedSize) {
            const ptVal = Math.round(parseFloat(computedSize) * 0.75);
            if (!isNaN(ptVal)) {
              setActiveFontSize(ptVal);
            }
          }
        }
      } catch (e) {
        console.warn('Could not compute active font size safely:', e);
      }
    }
  };

  const executeFontSizeCommand = (size) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    
    let activeEditor = null;
    if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
    else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
    else if (editorRef.current) activeEditor = editorRef.current;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        // Insert targeted zero-width space span for dynamic typing without selection
        const span = document.createElement('span');
        span.style.fontSize = `${size}pt`;
        span.innerHTML = '&#8203;';
        
        range.insertNode(span);
        
        // Move caret strictly inside the span, after the zero-width space
        range.setStart(span.firstChild, 1);
        range.setEnd(span.firstChild, 1);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        document.execCommand("fontSize", false, "7");
        if (activeEditor) {
          const fonts = activeEditor.querySelectorAll('font[size="7"]');
          fonts.forEach(font => {
            font.removeAttribute('size');
            font.style.fontSize = `${size}pt`;
          });
        }
      }
    }

    updateActiveStates();
    setIsFontSizeDropdownOpen(false);

    if (activeEditor) activeEditor.focus();
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

  const executeShadingCommand = (color) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    
    let activeEditor = null;
    if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
    else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
    else if (editorRef.current) activeEditor = editorRef.current;

    if (activeEditor && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let commonAncestor = range.commonAncestorContainer;
      if (commonAncestor.nodeType === 3) commonAncestor = commonAncestor.parentNode;

      let blocksToShade = new Set();
      const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'];

      if (commonAncestor === activeEditor || commonAncestor.nodeName === 'UL' || commonAncestor.nodeName === 'OL') {
        Array.from(commonAncestor.children).forEach(child => {
          if (selection.containsNode(child, true)) {
            // Strictly target block elements to avoid destroying inline <span> highlights
            if (blockTags.includes(child.nodeName)) {
              blocksToShade.add(child);
            }
          }
        });
      } else {
        let blockNode = commonAncestor;
        while (blockNode && blockNode !== activeEditor && !blockTags.includes(blockNode.nodeName)) {
          blockNode = blockNode.parentNode;
        }
        if (blockNode && blockNode !== activeEditor) {
          blocksToShade.add(blockNode);
        }
      }

      // If no blocks were found (naked text/spans directly in editor), safely wrap them first
      if (blocksToShade.size === 0) {
        document.execCommand('formatBlock', false, 'DIV');
        
        // Re-evaluate to find the newly created block
        const newRange = window.getSelection().getRangeAt(0);
        let newAncestor = newRange.commonAncestorContainer;
        if (newAncestor.nodeType === 3) newAncestor = newAncestor.parentNode;
        
        if (newAncestor === activeEditor) {
           Array.from(activeEditor.children).forEach(child => {
             if (window.getSelection().containsNode(child, true) && blockTags.includes(child.nodeName)) {
               blocksToShade.add(child);
             }
           });
        } else {
          let newBlockNode = newAncestor;
          while (newBlockNode && newBlockNode !== activeEditor && !blockTags.includes(newBlockNode.nodeName)) {
            newBlockNode = newBlockNode.parentNode;
          }
          if (newBlockNode && newBlockNode !== activeEditor) {
            blocksToShade.add(newBlockNode);
          }
        }
      }

      // Apply shading securely to the structural block only, preserving all inner span highlights perfectly on top
      blocksToShade.forEach(block => {
        block.style.backgroundColor = color === 'transparent' ? '' : color;
      });
    }

    updateActiveStates();
    setIsShadingDropdownOpen(false);
    if (activeEditor) activeEditor.focus();
  };

  const executeCommand = (command, value = null) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    
    document.execCommand('styleWithCSS', false, true);
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
            setIsFontSizeDropdownOpen(false);
            setIsFontColorDropdownOpen(false);
            setIsHighlightColorDropdownOpen(false);
            setIsShadingDropdownOpen(false);
          }
        }}
      >
        
        {/* Font Controls */}
        <div className="relative flex items-center border-r border-gray-300 pr-2 mr-2 gap-1">
          {/* Font Family Dropdown */}
          <div className="relative">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsFontDropdownOpen(!isFontDropdownOpen); 
                setIsFontSizeDropdownOpen(false);
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

          {/* Font Size Dropdown */}
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsFontSizeDropdownOpen(!isFontSizeDropdownOpen); 
                setIsFontDropdownOpen(false);
                setActiveListDropdown(null);
              }} 
              className="p-1 px-2 rounded flex items-center justify-between w-16 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-sm"
              title="Font Size"
            >
              <span>{activeFontSize}</span>
              <FiChevronDown size={14} className="ml-1 text-gray-500" />
            </button>
            {isFontSizeDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-16 max-h-64 overflow-y-auto print:hidden">
                {FONT_SIZES.map(size => (
                  <button 
                    key={size}
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      executeFontSizeCommand(size);
                    }} 
                    className={`w-full text-center px-2 py-1 text-sm hover:bg-blue-50 ${activeFontSize === size ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
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

        {/* Colors */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 pr-2">
          {/* Font Color */}
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsFontColorDropdownOpen(!isFontColorDropdownOpen); 
                setIsHighlightColorDropdownOpen(false);
                setIsShadingDropdownOpen(false);
                setIsFontDropdownOpen(false);
                setIsFontSizeDropdownOpen(false);
                setActiveListDropdown(null);
              }} 
              className="p-1 px-2 rounded flex flex-col items-center justify-center w-10 h-8 bg-gray-50 border border-transparent hover:bg-gray-100"
              title="Text Color"
            >
              <FiType size={14} className="text-gray-700" />
              <div className="w-4 h-1 mt-0.5" style={{ backgroundColor: activeFontColor }}></div>
            </button>
            {isFontColorDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded p-2 z-50 w-56 print:hidden">
                <div className="grid grid-cols-10 gap-1">
                  {COLORS.map(color => (
                    <button 
                      key={color}
                      onMouseDown={(e) => { 
                        e.preventDefault(); 
                        executeCommand('foreColor', color);
                        setIsFontColorDropdownOpen(false);
                      }} 
                      className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsHighlightColorDropdownOpen(!isHighlightColorDropdownOpen); 
                setIsFontColorDropdownOpen(false);
                setIsShadingDropdownOpen(false);
                setIsFontDropdownOpen(false);
                setIsFontSizeDropdownOpen(false);
                setActiveListDropdown(null);
              }} 
              className="p-1 px-2 rounded flex flex-col items-center justify-center w-10 h-8 bg-gray-50 border border-transparent hover:bg-gray-100"
              title="Text Highlight Color"
            >
              <FiEdit2 size={14} className="text-gray-700" />
              <div className="w-4 h-1 mt-0.5 border border-gray-200" style={{ backgroundColor: activeHighlightColor === 'transparent' || activeHighlightColor === 'rgba(0, 0, 0, 0)' ? '#ffffff' : activeHighlightColor }}></div>
            </button>
            {isHighlightColorDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded p-2 z-50 w-56 print:hidden">
                <div className="grid grid-cols-10 gap-1">
                  <button 
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      executeCommand('backColor', 'transparent'); 
                      executeCommand('hiliteColor', 'transparent'); 
                      setIsHighlightColorDropdownOpen(false);
                    }} 
                    className="col-span-10 text-xs text-center border border-gray-300 rounded mb-1 py-0.5 hover:bg-gray-100"
                  >
                    No Color
                  </button>
                  {COLORS.map(color => (
                    <button 
                      key={color}
                      onMouseDown={(e) => { 
                        e.preventDefault(); 
                        executeCommand('hiliteColor', color); 
                        executeCommand('backColor', color);
                        setIsHighlightColorDropdownOpen(false);
                      }} 
                      className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Paragraph Shading */}
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsShadingDropdownOpen(!isShadingDropdownOpen); 
                setIsHighlightColorDropdownOpen(false); 
                setIsFontColorDropdownOpen(false);
                setIsFontDropdownOpen(false);
                setIsFontSizeDropdownOpen(false);
                setActiveListDropdown(null);
              }} 
              className="p-1 px-2 rounded flex flex-col items-center justify-center w-10 h-8 bg-gray-50 border border-transparent hover:bg-gray-100"
              title="Paragraph Shading"
            >
              <FiDroplet size={14} className="text-gray-700" />
              <div className="w-4 h-1 mt-0.5 border border-gray-200" style={{ backgroundColor: activeShadingColor === 'transparent' || activeShadingColor === 'rgba(0, 0, 0, 0)' ? '#ffffff' : activeShadingColor }}></div>
            </button>
            {isShadingDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded p-2 z-50 w-56 print:hidden">
                <div className="grid grid-cols-10 gap-1">
                  <button 
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      executeShadingCommand('transparent'); 
                    }} 
                    className="col-span-10 text-xs text-center border border-gray-300 rounded mb-1 py-0.5 hover:bg-gray-100"
                  >
                    No Color
                  </button>
                  {COLORS.map(color => (
                    <button 
                      key={color}
                      onMouseDown={(e) => { 
                        e.preventDefault(); 
                        executeShadingCommand(color);
                      }} 
                      className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
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
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
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
