import React, { useRef, useEffect, useState } from 'react';
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiChevronDown, FiType, FiEdit2, FiDroplet, FiGrid, FiMove } from 'react-icons/fi';

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
  const [activeBorder, setActiveBorder] = useState('none');
  const [isBorderDropdownOpen, setIsBorderDropdownOpen] = useState(false);
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);
  const [hoveredRows, setHoveredRows] = useState(0);
  const [hoveredCols, setHoveredCols] = useState(0);
  const [activeTablePos, setActiveTablePos] = useState(null);

  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isFooterActive, setIsFooterActive] = useState(false);
  
  const [isUnorderedList, setIsUnorderedList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [activeListDropdown, setActiveListDropdown] = useState(null);
  
  const [dropIndicatorPos, setDropIndicatorPos] = useState(null);

  const savedSelection = useRef(null);
  const resizingRef = useRef(null);
  const draggedTableRef = useRef(null);

  const updateDropIndicator = (clientX, clientY) => {
    let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;
    if (!activeEditor) return;

    if (!clientX && !clientY) return;

    const editorRect = activeEditor.getBoundingClientRect();
    if (clientY < editorRect.top - 60 || clientY > editorRect.bottom + 60) {
      setDropIndicatorPos(null);
      return;
    }

    const children = Array.from(activeEditor.children).filter(child => child.nodeType === 1 && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
    if (children.length === 0) {
      setDropIndicatorPos({
        top: editorRect.top + 20,
        left: editorRect.left + 48,
        width: editorRect.width - 96,
        targetBlock: activeEditor,
        insertBefore: false
      });
      return;
    }

    let closestChild = null;
    let minDistance = Infinity;
    let insertBefore = true;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const rect = child.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const distance = Math.abs(clientY - midY);

      if (distance < minDistance) {
        minDistance = distance;
        closestChild = child;
        insertBefore = clientY < midY;
      }
    }

    if (closestChild) {
      const blockRect = closestChild.getBoundingClientRect();
      const indicatorY = insertBefore ? blockRect.top - 2 : blockRect.bottom - 2;

      setDropIndicatorPos({
        top: indicatorY,
        left: blockRect.left,
        width: blockRect.width,
        targetBlock: closestChild,
        insertBefore: insertBefore
      });
    }
  };

  const executeTableDrop = (table) => {
    let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;

    if (table && dropIndicatorPos && activeEditor) {
      const { targetBlock, insertBefore } = dropIndicatorPos;

      if (targetBlock === activeEditor) {
        activeEditor.appendChild(table);
      } else if (targetBlock && targetBlock !== table) {
        if (insertBefore) {
          activeEditor.insertBefore(table, targetBlock);
        } else {
          if (targetBlock.nextSibling) {
            activeEditor.insertBefore(table, targetBlock.nextSibling);
          } else {
            activeEditor.appendChild(table);
          }
        }
      }

      if (!table.nextSibling || table.nextSibling.nodeName !== 'P') {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        if (table.nextSibling) {
          activeEditor.insertBefore(p, table.nextSibling);
        } else {
          activeEditor.appendChild(p);
        }
      }

      const newRect = table.getBoundingClientRect();
      setActiveTablePos({ top: newRect.top, left: newRect.left, table: table });
    }

    setDropIndicatorPos(null);
    draggedTableRef.current = null;
  };

  const handleTableMouseMove = (e) => {
    if (resizingRef.current) return;

    let target = e.target;
    const isInsideTable = target && (target.closest('table') !== null);

    if (!isInsideTable) {
      if (activeTablePos) setActiveTablePos(null);
      return;
    }

    const table = target.closest('table');
    if (table) {
      const tableRect = table.getBoundingClientRect();
      setActiveTablePos({ top: tableRect.top, left: tableRect.left, table: table });

      if (target.nodeName === 'TD' || target.nodeName === 'TH') {
        const rect = target.getBoundingClientRect();
        const isTopLeftCorner = (e.clientX - tableRect.left) <= 16 && (e.clientX - tableRect.left) >= -8 && (e.clientY - tableRect.top) <= 16 && (e.clientY - tableRect.top) >= -8;
        const isBottomRightCorner = (tableRect.right - e.clientX) <= 12 && (tableRect.right - e.clientX) >= -4 && (tableRect.bottom - e.clientY) <= 12 && (tableRect.bottom - e.clientY) >= -4;
        const isRightEdge = (rect.right - e.clientX) <= 6 && (rect.right - e.clientX) >= -2;
        const isBottomEdge = (rect.bottom - e.clientY) <= 6 && (rect.bottom - e.clientY) >= -2;

        if (isTopLeftCorner) {
          target.style.cursor = 'move';
        } else if (isBottomRightCorner) {
          target.style.cursor = 'se-resize';
        } else if (isRightEdge) {
          target.style.cursor = 'col-resize';
        } else if (isBottomEdge) {
          target.style.cursor = 'row-resize';
        } else {
          target.style.cursor = 'text';
        }
      }
    }
  };

  const handleTableMouseDown = (e) => {
    let target = e.target;
    while (target && target !== editorRef.current && target !== headerRef.current && target !== footerRef.current && target.nodeName !== 'TD' && target.nodeName !== 'TH' && target.nodeName !== 'TABLE') {
      target = target.parentNode;
    }

    if (!target || target === editorRef.current || target === headerRef.current || target === footerRef.current) return;

    if (target.nodeName === 'TD' || target.nodeName === 'TH') {
      const rect = target.getBoundingClientRect();
      const table = target.closest('table');
      const tableRect = table ? table.getBoundingClientRect() : rect;

      const isBottomRightCorner = (tableRect.right - e.clientX) <= 12 && (tableRect.right - e.clientX) >= -4 && (tableRect.bottom - e.clientY) <= 12 && (tableRect.bottom - e.clientY) >= -4;
      const isRightEdge = (rect.right - e.clientX) <= 6 && (rect.right - e.clientX) >= -2;
      const isBottomEdge = (rect.bottom - e.clientY) <= 6 && (rect.bottom - e.clientY) >= -2;

      if (isBottomRightCorner || isRightEdge || isBottomEdge) {
        e.preventDefault();
        e.stopPropagation();

        if (table) {
          table.style.tableLayout = 'fixed';
        }

        const row = target.parentNode;
        const colIndex = Array.from(row.children).indexOf(target);
        const nextCell = row.children[colIndex + 1] || null;

        const startWidth1 = target.offsetWidth;
        const startWidth2 = nextCell ? nextCell.offsetWidth : 0;
        const startHeight = row.offsetHeight;
        const startTableWidth = table ? table.offsetWidth : 0;
        const startTableHeight = table ? table.offsetHeight : 0;

        resizingRef.current = {
          type: isBottomRightCorner ? 'scale' : isRightEdge ? 'col' : 'row',
          startX: e.clientX,
          startY: e.clientY,
          cell: target,
          nextCell: nextCell,
          colIndex: colIndex,
          row: row,
          table: table,
          startWidth1: startWidth1,
          startWidth2: startWidth2,
          startHeight: startHeight,
          startTableWidth: startTableWidth,
          startTableHeight: startTableHeight
        };

        const handleWindowMouseMove = (moveEvent) => {
          if (!resizingRef.current) return;
          moveEvent.preventDefault();

          const { type, startX, startY, colIndex, nextCell, row, table, startWidth1, startWidth2, startHeight, startTableWidth, startTableHeight } = resizingRef.current;

          if (type === 'move') {
            updateDropIndicator(moveEvent.clientX, moveEvent.clientY);
          } else if (type === 'scale') {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            const newTableWidth = Math.max(100, startTableWidth + deltaX);
            const newTableHeight = Math.max(40, startTableHeight + deltaY);

            if (table) {
              table.style.width = `${newTableWidth}px`;
              table.style.height = `${newTableHeight}px`;
            }
          } else if (type === 'col') {
            const deltaX = moveEvent.clientX - startX;

            if (nextCell) {
              const newWidth1 = Math.max(25, startWidth1 + deltaX);
              const newWidth2 = Math.max(25, startWidth2 - deltaX);

              if (table) {
                Array.from(table.rows).forEach(r => {
                  if (r.children[colIndex]) {
                    r.children[colIndex].style.width = `${newWidth1}px`;
                    r.children[colIndex].style.minWidth = `${newWidth1}px`;
                  }
                  if (r.children[colIndex + 1]) {
                    r.children[colIndex + 1].style.width = `${newWidth2}px`;
                    r.children[colIndex + 1].style.minWidth = `${newWidth2}px`;
                  }
                });
              }
            } else {
              const newWidth = Math.max(25, startWidth1 + deltaX);
              if (table) {
                table.style.width = `${Math.max(100, startTableWidth + deltaX)}px`;
                Array.from(table.rows).forEach(r => {
                  if (r.children[colIndex]) {
                    r.children[colIndex].style.width = `${newWidth}px`;
                    r.children[colIndex].style.minWidth = `${newWidth}px`;
                  }
                });
              }
            }
          } else if (type === 'row') {
            const deltaY = moveEvent.clientY - startY;
            const newHeight = Math.max(20, startHeight + deltaY);

            row.style.height = `${newHeight}px`;
            Array.from(row.children).forEach(child => {
              child.style.height = `${newHeight}px`;
            });
          }
        };

        const handleWindowMouseUp = () => {
          if (resizingRef.current && resizingRef.current.type === 'move') {
            executeTableDrop(resizingRef.current.table);
          }
          resizingRef.current = null;
          window.removeEventListener('mousemove', handleWindowMouseMove);
          window.removeEventListener('mouseup', handleWindowMouseUp);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
      }
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    updateActiveStates();
  }, []);

  const handleEditorCanvasClick = (e) => {
    let activeEditor = editorRef.current;
    if (!activeEditor) return;

    if (e.target === activeEditor) {
      const children = Array.from(activeEditor.children);
      const lastChild = children[children.length - 1];

      if (lastChild) {
        const hasShadingOrBorder = lastChild.style.backgroundColor || 
                                   lastChild.style.border || 
                                   lastChild.style.borderTop || 
                                   lastChild.style.borderBottom || 
                                   lastChild.style.borderLeft || 
                                   lastChild.style.borderRight;

        const rect = lastChild.getBoundingClientRect();
        if (e.clientY > rect.bottom - 5 || hasShadingOrBorder) {
          let targetP = null;
          if (!hasShadingOrBorder && lastChild.textContent.trim() === '') {
            targetP = lastChild;
          } else {
            targetP = document.createElement('p');
            targetP.innerHTML = '<br>';
            activeEditor.appendChild(targetP);
          }

          const selection = window.getSelection();
          const range = document.createRange();
          range.setStart(targetP, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          updateActiveStates();
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    // 1. ESCAPE KEY: Immediately break out of a shaded or bordered box into a new clean paragraph below
    if (e.key === 'Escape') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      let node = range.startContainer;
      let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;
      
      let blockNode = node;
      while (blockNode && blockNode !== activeEditor && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockNode.nodeName)) {
        blockNode = blockNode.parentNode;
      }

      if (blockNode && blockNode !== activeEditor) {
        e.preventDefault();
        const cleanP = document.createElement('p');
        cleanP.innerHTML = '<br>';
        
        if (blockNode.nextSibling) {
          blockNode.parentNode.insertBefore(cleanP, blockNode.nextSibling);
        } else {
          blockNode.parentNode.appendChild(cleanP);
        }

        const newRange = document.createRange();
        newRange.setStart(cleanP, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        updateActiveStates();
        return;
      }
    }

    // 2. ENTER KEY: If on an empty line inside a shaded/bordered box (e.g. user pressed Enter twice), clear box styles from this line
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.isCollapsed && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;

        let blockNode = node;
        while (blockNode && blockNode !== activeEditor && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(blockNode.nodeName)) {
          blockNode = blockNode.parentNode;
        }

        if (blockNode && blockNode !== activeEditor) {
          const hasShadingOrBorder = blockNode.style.backgroundColor || 
                                     blockNode.style.border || 
                                     blockNode.style.borderTop || 
                                     blockNode.style.borderBottom || 
                                     blockNode.style.borderLeft || 
                                     blockNode.style.borderRight;

          if (hasShadingOrBorder) {
            const rawText = blockNode.textContent.replace(/[\u200B\u00A0\s]/g, '');
            if (rawText === '') {
              e.preventDefault();
              blockNode.removeAttribute('style');
              blockNode.innerHTML = '<br>';

              const newRange = document.createRange();
              newRange.setStart(blockNode, 0);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
              updateActiveStates();
              return;
            }
          }
        }
      }
    }

    // 3. TAB KEY: Navigate across table cells
    if (e.key === 'Tab') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.getRangeAt(0).startContainer;
        let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;

        let cellNode = node;
        while (cellNode && cellNode !== activeEditor && !['TD', 'TH'].includes(cellNode.nodeName)) {
          cellNode = cellNode.parentNode;
        }

        if (cellNode && cellNode !== activeEditor) {
          e.preventDefault();
          const tr = cellNode.parentNode;

          if (e.shiftKey) {
            let prevCell = cellNode.previousElementSibling;
            if (!prevCell && tr.previousElementSibling) {
              prevCell = tr.previousElementSibling.lastElementChild;
            }
            if (prevCell) {
              const range = document.createRange();
              range.setStart(prevCell, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          } else {
            let nextCell = cellNode.nextElementSibling;
            if (!nextCell && tr.nextElementSibling) {
              nextCell = tr.nextElementSibling.firstElementChild;
            } else if (!nextCell && !tr.nextElementSibling) {
              // Add a new row to table if on last cell of last row!
              const colsCount = tr.children.length;
              const newTr = document.createElement('tr');
              for (let c = 0; c < colsCount; c++) {
                const newTd = document.createElement('td');
                newTd.style.border = '1.5px solid #000000';
                newTd.style.padding = '8px 12px';
                newTd.style.minHeight = '28px';
                newTd.style.verticalAlign = 'top';
                newTd.innerHTML = '<br>';
                newTr.appendChild(newTd);
              }
              tr.parentNode.appendChild(newTr);
              nextCell = newTr.firstElementChild;
            }
            if (nextCell) {
              const range = document.createRange();
              range.setStart(nextCell, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
          updateActiveStates();
          return;
        }
      }
    }

    if (e.key === ' ' || e.code === 'Space') {
      const selection = window.getSelection();
      if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      let container = range.startContainer;
      let offset = range.startOffset;

      if (container.nodeType === 3 && offset === container.nodeValue.length) {
        let currentNode = container;
        let styledParent = null;

        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'TABLE', 'TR'];

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
        
        const b = blockNode.style.border;
        const bt = blockNode.style.borderTop;
        const bb = blockNode.style.borderBottom;
        const bl = blockNode.style.borderLeft;
        const br = blockNode.style.borderRight;

        if (b && b !== 'none') setActiveBorder('all');
        else if (bb && bb !== 'none') setActiveBorder('bottom');
        else if (bt && bt !== 'none') setActiveBorder('top');
        else if (bl && bl !== 'none') setActiveBorder('left');
        else if (br && br !== 'none') setActiveBorder('right');
        else setActiveBorder('none');
      } else {
        setActiveShadingColor('transparent');
        setActiveBorder('none');
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

  const executeBorderCommand = (borderType) => {
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

      let blocksToBorder = new Set();
      const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'];

      if (commonAncestor === activeEditor || commonAncestor.nodeName === 'UL' || commonAncestor.nodeName === 'OL') {
        Array.from(commonAncestor.children).forEach(child => {
          if (selection.containsNode(child, true)) {
            if (blockTags.includes(child.nodeName)) {
              blocksToBorder.add(child);
            }
          }
        });
      } else {
        let blockNode = commonAncestor;
        while (blockNode && blockNode !== activeEditor && !blockTags.includes(blockNode.nodeName)) {
          blockNode = blockNode.parentNode;
        }
        if (blockNode && blockNode !== activeEditor) {
          blocksToBorder.add(blockNode);
        }
      }

      if (blocksToBorder.size === 0) {
        document.execCommand('formatBlock', false, 'DIV');
        
        const newRange = window.getSelection().getRangeAt(0);
        let newAncestor = newRange.commonAncestorContainer;
        if (newAncestor.nodeType === 3) newAncestor = newAncestor.parentNode;
        
        if (newAncestor === activeEditor) {
           Array.from(activeEditor.children).forEach(child => {
             if (window.getSelection().containsNode(child, true) && blockTags.includes(child.nodeName)) {
               blocksToBorder.add(child);
             }
           });
        } else {
          let newBlockNode = newAncestor;
          while (newBlockNode && newBlockNode !== activeEditor && !blockTags.includes(newBlockNode.nodeName)) {
            newBlockNode = newBlockNode.parentNode;
          }
          if (newBlockNode && newBlockNode !== activeEditor) {
            blocksToBorder.add(newBlockNode);
          }
        }
      }

      blocksToBorder.forEach(block => {
        block.style.border = 'none';
        block.style.borderTop = 'none';
        block.style.borderBottom = 'none';
        block.style.borderLeft = 'none';
        block.style.borderRight = 'none';

        if (borderType === 'bottom') {
          block.style.borderBottom = '2px solid #1f2937';
          if (!block.style.paddingBottom) block.style.paddingBottom = '3px';
        } else if (borderType === 'top') {
          block.style.borderTop = '2px solid #1f2937';
          if (!block.style.paddingTop) block.style.paddingTop = '3px';
        } else if (borderType === 'left') {
          block.style.borderLeft = '3px solid #1f2937';
          if (!block.style.paddingLeft) block.style.paddingLeft = '8px';
        } else if (borderType === 'right') {
          block.style.borderRight = '3px solid #1f2937';
          if (!block.style.paddingRight) block.style.paddingRight = '8px';
        } else if (borderType === 'all') {
          block.style.border = '1.5px solid #1f2937';
          if (!block.style.padding) block.style.padding = '4px 8px';
        } else if (borderType === 'none') {
          block.style.border = 'none';
        }
      });
    }

    updateActiveStates();
    setIsBorderDropdownOpen(false);
    if (activeEditor) activeEditor.focus();
  };

  const insertTable = (rows, cols) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
    
    let activeEditor = null;
    if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
    else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
    else if (editorRef.current) activeEditor = editorRef.current;

    if (activeEditor) {
      activeEditor.focus();
      
      let rowsHTML = '';
      for (let r = 0; r < rows; r++) {
        let colsHTML = '';
        for (let c = 0; c < cols; c++) {
          colsHTML += `<td style="border: 1.5px solid #000000; padding: 8px 12px; min-height: 28px; vertical-align: top;"><br></td>`;
        }
        rowsHTML += `<tr>${colsHTML}</tr>`;
      }
      
      const tableHTML = `<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1.5px solid #000000; table-layout: fixed;"><tbody>${rowsHTML}</tbody></table><p><br></p>`;

      document.execCommand('insertHTML', false, tableHTML);
    }

    setIsTableDropdownOpen(false);
    updateActiveStates();
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
      <style>{`
        .prose table { border: 1.5px solid #000000 !important; border-collapse: collapse !important; }
        .prose td, .prose th { border: 1.5px solid #000000 !important; }
      `}</style>
      
      {/* Glowing Blue Drop Indicator Line (Word-style Insertion Bar) */}
      {dropIndicatorPos && (
        <div 
          style={{ 
            position: 'fixed', 
            top: `${dropIndicatorPos.top}px`, 
            left: `${dropIndicatorPos.left}px`, 
            width: `${dropIndicatorPos.width}px`, 
            height: '3px', 
            backgroundColor: '#2563EB', 
            borderRadius: '2px', 
            zIndex: 100, 
            pointerEvents: 'none',
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.8)'
          }} 
          className="transition-all duration-75 ease-out print:hidden"
        />
      )}

      {/* Floating Table Move Handle Button */}
      {activeTablePos && (
        <div 
          style={{ 
            position: 'fixed', 
            top: `${activeTablePos.top - 12}px`, 
            left: `${activeTablePos.left - 12}px`,
            zIndex: 60
          }}
          draggable={true}
          onDragStart={(e) => {
            const table = activeTablePos?.table;
            if (!table) return;
            draggedTableRef.current = table;
            e.dataTransfer.setData('text/plain', 'table-drag');
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDrag={(e) => {
            if (e.clientX && e.clientY) {
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDragEnd={() => {
            if (draggedTableRef.current) {
              executeTableDrop(draggedTableRef.current);
            } else {
              setDropIndicatorPos(null);
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();

            const handleBtn = e.currentTarget;
            const table = activeTablePos.table;
            let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;

            resizingRef.current = {
              type: 'move',
              table: table,
              handleBtn: handleBtn,
              activeEditor: activeEditor
            };

            const handleWindowMouseMove = (moveEvent) => {
              if (!resizingRef.current || resizingRef.current.type !== 'move') return;
              updateDropIndicator(moveEvent.clientX, moveEvent.clientY);
            };

            const handleWindowMouseUp = () => {
              if (resizingRef.current && resizingRef.current.type === 'move') {
                executeTableDrop(resizingRef.current.table);
              }
              resizingRef.current = null;
              window.removeEventListener('mousemove', handleWindowMouseMove);
              window.removeEventListener('mouseup', handleWindowMouseUp);
            };

            window.addEventListener('mousemove', handleWindowMouseMove);
            window.addEventListener('mouseup', handleWindowMouseUp);
          }}
          className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center cursor-move shadow-md print:hidden select-none"
          title="Drag to move table"
        >
          <FiMove size={14} />
        </div>
      )}
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
            setIsBorderDropdownOpen(false);
            setIsTableDropdownOpen(false);
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
                setIsBorderDropdownOpen(false);
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

          {/* Paragraph Borders */}
          <div className="relative flex items-center ml-1">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsBorderDropdownOpen(!isBorderDropdownOpen); 
                setIsShadingDropdownOpen(false); 
                setIsHighlightColorDropdownOpen(false); 
                setIsFontColorDropdownOpen(false);
                setIsFontDropdownOpen(false);
                setIsFontSizeDropdownOpen(false);
                setActiveListDropdown(null);
              }} 
              className={`p-1 px-2 rounded flex items-center justify-center gap-1 h-8 bg-gray-50 border border-transparent hover:bg-gray-100 ${activeBorder !== 'none' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              title="Borders"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2.5" y="2.5" width="11" height="11" stroke="#4B5563" strokeDasharray={activeBorder === 'none' ? '2 2' : 'none'} strokeWidth="1.5"/>
                {activeBorder === 'bottom' && <path d="M2.5 13.5H13.5" stroke="#1D4ED8" strokeWidth="2.5"/>}
                {activeBorder === 'top' && <path d="M2.5 2.5H13.5" stroke="#1D4ED8" strokeWidth="2.5"/>}
                {activeBorder === 'left' && <path d="M2.5 2.5V13.5" stroke="#1D4ED8" strokeWidth="2.5"/>}
                {activeBorder === 'right' && <path d="M13.5 2.5V13.5" stroke="#1D4ED8" strokeWidth="2.5"/>}
                {activeBorder === 'all' && <rect x="2.5" y="2.5" width="11" height="11" stroke="#1D4ED8" strokeWidth="2"/>}
              </svg>
              <FiChevronDown size={12} className="text-gray-500" />
            </button>

            {isBorderDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-44 flex flex-col print:hidden">
                <button 
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('bottom'); }} 
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'bottom' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1"/>
                    <path d="M2.5 13.5H13.5" stroke="#1F2937" strokeWidth="2"/>
                  </svg>
                  Bottom Border
                </button>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('top'); }} 
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'top' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1"/>
                    <path d="M2.5 2.5H13.5" stroke="#1F2937" strokeWidth="2"/>
                  </svg>
                  Top Border
                </button>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('left'); }} 
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'left' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1"/>
                    <path d="M2.5 2.5V13.5" stroke="#1F2937" strokeWidth="2"/>
                  </svg>
                  Left Border
                </button>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('right'); }} 
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'right' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1"/>
                    <path d="M13.5 2.5V13.5" stroke="#1F2937" strokeWidth="2"/>
                  </svg>
                  Right Border
                </button>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('all'); }} 
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'all' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#1F2937" strokeWidth="2"/>
                  </svg>
                  Box / All Borders
                </button>
                <div className="my-1 border-t border-gray-200"></div>
                <button 
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('none'); }} 
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'none' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1"/>
                  </svg>
                  No Border
                </button>
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

        {/* Insert Table Grid Dropdown */}
        <div className="flex items-center border-l border-gray-300 pl-2 pr-2">
          <div className="relative flex items-center">
            <button 
              onMouseDown={(e) => { 
                e.preventDefault(); 
                setIsTableDropdownOpen(!isTableDropdownOpen); 
                setIsBorderDropdownOpen(false); 
                setIsShadingDropdownOpen(false); 
                setIsHighlightColorDropdownOpen(false); 
                setIsFontColorDropdownOpen(false);
                setIsFontDropdownOpen(false);
                setIsFontSizeDropdownOpen(false);
                setActiveListDropdown(null);
                setHoveredRows(0);
                setHoveredCols(0);
              }} 
              className={`p-1.5 px-2 rounded flex items-center gap-1 bg-gray-50 border border-transparent hover:bg-gray-100 text-gray-700 text-sm ${isTableDropdownOpen ? 'bg-blue-100 text-blue-700 shadow-inner' : ''}`}
              title="Insert Table"
            >
              <FiGrid size={16} className="text-gray-700" />
              <span className="text-xs font-medium">Table</span>
              <FiChevronDown size={12} className="text-gray-500" />
            </button>

            {isTableDropdownOpen && (
              <div 
                className="absolute top-full mt-1 left-0 bg-white shadow-xl border border-gray-200 rounded-lg p-3 z-50 w-56 flex flex-col gap-2 print:hidden"
                onMouseLeave={() => { setHoveredRows(0); setHoveredCols(0); }}
              >
                <div className="text-xs font-semibold text-gray-600 border-b border-gray-100 pb-1 flex justify-between items-center">
                  <span>Insert Table</span>
                  <span className="text-blue-600 font-mono">
                    {hoveredRows > 0 && hoveredCols > 0 ? `${hoveredRows} x ${hoveredCols}` : 'Select Grid'}
                  </span>
                </div>
                
                {/* 8x8 Grid */}
                <div className="grid grid-cols-8 gap-1 p-1 bg-gray-50 border border-gray-200 rounded">
                  {Array.from({ length: 8 }).map((_, rIdx) => (
                    Array.from({ length: 8 }).map((_, cIdx) => {
                      const rowNum = rIdx + 1;
                      const colNum = cIdx + 1;
                      const isHighlighted = rowNum <= hoveredRows && colNum <= hoveredCols;

                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          type="button"
                          onMouseEnter={() => {
                            setHoveredRows(rowNum);
                            setHoveredCols(colNum);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            insertTable(rowNum, colNum);
                          }}
                          className={`w-5 h-5 rounded-sm border cursor-pointer transition-colors p-0 ${
                            isHighlighted 
                              ? 'bg-blue-500 border-blue-600' 
                              : 'bg-white border-gray-300 hover:border-blue-400'
                          }`}
                          title={`${rowNum} x ${colNum}`}
                        />
                      );
                    })
                  ))}
                </div>
                <div className="text-[11px] text-gray-400 text-center">
                  Click to insert grid
                </div>
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
          onMouseMove={handleTableMouseMove}
          onMouseDown={handleTableMouseDown}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onDragOver={(e) => {
            if (draggedTableRef.current) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDrop={(e) => {
            if (draggedTableRef.current) {
              e.preventDefault();
              executeTableDrop(draggedTableRef.current);
            }
          }}
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
          onMouseMove={handleTableMouseMove}
          onMouseDown={handleTableMouseDown}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onClick={handleEditorCanvasClick}
          onDoubleClick={handleEditorCanvasClick}
          onDragOver={(e) => {
            if (draggedTableRef.current) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDrop={(e) => {
            if (draggedTableRef.current) {
              e.preventDefault();
              executeTableDrop(draggedTableRef.current);
            }
          }}
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
          onMouseMove={handleTableMouseMove}
          onMouseDown={handleTableMouseDown}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onDragOver={(e) => {
            if (draggedTableRef.current) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDrop={(e) => {
            if (draggedTableRef.current) {
              e.preventDefault();
              executeTableDrop(draggedTableRef.current);
            }
          }}
          className={`w-full max-w-full break-words [word-break:break-word] min-h-[100px] px-12 pb-12 pt-4 outline-none text-gray-500 text-sm transition-all ${isFooterActive ? 'border-t-2 border-dashed border-gray-300 bg-gray-50 ring-2 ring-blue-100' : 'cursor-default hover:bg-gray-50/50 print:border-none print:bg-transparent'}`}
          title="Triple-click to edit Footer"
        >
        </div>

      </div>
    </div>
  );
};

export default CustomEditorPage;
