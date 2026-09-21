import React, { useRef, useEffect, useState } from 'react';
import { FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiChevronDown, FiType, FiEdit2, FiDroplet, FiGrid, FiMove, FiImage, FiMinus } from 'react-icons/fi';

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
  const fileInputRef = useRef(null);

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
  const [isDividerDropdownOpen, setIsDividerDropdownOpen] = useState(false);
  const [activeLineColor, setActiveLineColor] = useState('#374151');
  const [activeLineThickness, setActiveLineThickness] = useState('2px');
  const [activeLineStyle, setActiveLineStyle] = useState('solid');
  const [hoveredRows, setHoveredRows] = useState(0);
  const [hoveredCols, setHoveredCols] = useState(0);
  const [activeTablePos, setActiveTablePos] = useState(null);
  const [activeImgPos, setActiveImgPos] = useState(null);
  const [activeLinePos, setActiveLinePos] = useState(null);

  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isFooterActive, setIsFooterActive] = useState(false);

  const [isUnorderedList, setIsUnorderedList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [activeListDropdown, setActiveListDropdown] = useState(null);

  const [dropIndicatorPos, setDropIndicatorPos] = useState(null);

  const savedSelection = useRef(null);
  const resizingRef = useRef(null);
  const draggedTableRef = useRef(null);
  const draggedNodeRef = useRef(null);

  const closeAllDropdowns = () => {
    setIsFontDropdownOpen(false);
    setIsFontSizeDropdownOpen(false);
    setIsFontColorDropdownOpen(false);
    setIsHighlightColorDropdownOpen(false);
    setIsShadingDropdownOpen(false);
    setIsBorderDropdownOpen(false);
    setIsTableDropdownOpen(false);
    setIsDividerDropdownOpen(false);
    setActiveListDropdown(null);
  };

  useEffect(() => {
    const handleGlobalMouseDown = (e) => {
      if (!e.target.closest('[data-dropdown-container]')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleGlobalMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
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
        const imgHTML = `<p style="text-align: center; margin: 16px 0; clear: both;"><img src="${dataUrl}" alt="Uploaded image" style="max-width: 100%; height: auto; border-radius: 4px; display: block; margin: 0 auto; clear: both;" /></p><p><br></p>`;
        document.execCommand('insertHTML', false, imgHTML);
      }
      updateActiveStates();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

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

  const executeNodeDrop = (node) => {
    let activeEditor = isHeaderActive ? headerRef.current : isFooterActive ? footerRef.current : editorRef.current;

    if (node && dropIndicatorPos && activeEditor) {
      const { targetBlock, insertBefore } = dropIndicatorPos;

      if (targetBlock === activeEditor) {
        activeEditor.appendChild(node);
      } else if (targetBlock && targetBlock !== node) {
        if (insertBefore) {
          activeEditor.insertBefore(node, targetBlock);
        } else {
          if (targetBlock.nextSibling) {
            activeEditor.insertBefore(node, targetBlock.nextSibling);
          } else {
            activeEditor.appendChild(node);
          }
        }
      }

      if (node.nodeName === 'IMG') {
        node.style.position = 'static';
        node.style.maxWidth = '100%';
        node.style.shapeOutside = 'margin-box';
        if (!node.style.float || node.style.float === 'none') {
          node.style.display = 'block';
          node.style.margin = '16px auto';
          node.style.clear = 'both';
        }
      }

      if (!node.nextSibling || node.nextSibling.nodeName !== 'P') {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        if (node.nextSibling) {
          activeEditor.insertBefore(p, node.nextSibling);
        } else {
          activeEditor.appendChild(p);
        }
      }

      const newRect = node.getBoundingClientRect();
      if (node.nodeName === 'TABLE') {
        setActiveTablePos({ top: newRect.top, left: newRect.left, table: node });
      } else if (node.nodeName === 'IMG') {
        setActiveImgPos({ top: newRect.top, left: newRect.left, width: newRect.width, height: newRect.height, img: node });
      }
    }

    setDropIndicatorPos(null);
    draggedTableRef.current = null;
    draggedNodeRef.current = null;
  };

  const executeTableDrop = (table) => executeNodeDrop(table);

  const handleCanvasMouseMove = (e) => {
    if (resizingRef.current) return;

    let target = e.target;
    if (target && target.nodeName === 'IMG') {
      const rect = target.getBoundingClientRect();
      setActiveImgPos((prev) => {
        if (prev && prev.isPinned && prev.img === target) {
          return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            img: target,
            isPinned: true
          };
        }
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          img: target,
          isPinned: prev ? prev.isPinned : false
        };
      });
      return;
    } else if (activeImgPos && !activeImgPos.isPinned && !target.closest('.image-control-overlay')) {
      setActiveImgPos(null);
    }

    const dividerEl = (target && target.closest) ? (target.closest('[data-divider]') || target.closest('.editor-divider-v') || target.closest('.editor-divider-h') || (target.nodeName === 'HR' ? target : null)) : null;

    if (dividerEl) {
      const rect = dividerEl.getBoundingClientRect();
      const isVertical = dividerEl.getAttribute('data-divider') === 'vertical' || dividerEl.classList.contains('editor-divider-v') || (rect.height > rect.width && rect.width < 30);
      setActiveLinePos((prev) => {
        if (prev && prev.isPinned) return prev;
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          isVertical: isVertical,
          lineEl: dividerEl,
          isPinned: false
        };
      });
      return;
    } else if (activeLinePos && !activeLinePos.isPinned && !target.closest('.line-control-overlay')) {
      setActiveLinePos(null);
    }

    handleTableMouseMove(e);
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

  const startFreeDragTable = (e, table) => {
    if (!e || !table) return;
    e.preventDefault();
    e.stopPropagation();

    const editorCanvas = editorRef.current?.parentNode || editorRef.current;
    if (!editorCanvas) return;

    const canvasRect = editorCanvas.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    let initialLeft = table.offsetLeft;
    let initialTop = table.offsetTop;

    if (window.getComputedStyle(table).position !== 'absolute') {
      initialLeft = tableRect.left - canvasRect.left;
      initialTop = tableRect.top - canvasRect.top;
      table.style.position = 'absolute';
      table.style.left = `${initialLeft}px`;
      table.style.top = `${initialTop}px`;
      table.style.margin = '0';
      table.style.zIndex = '25';
    }

    const startX = e.clientX;
    const startY = e.clientY;

    const maxLeft = Math.max(0, canvasRect.width - tableRect.width);
    const maxTop = Math.max(0, canvasRect.height - tableRect.height);

    resizingRef.current = { type: 'free-drag-table', node: table };

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const rawLeft = initialLeft + deltaX;
      const rawTop = initialTop + deltaY;

      const clampedLeft = Math.min(Math.max(0, rawLeft), maxLeft);
      const clampedTop = Math.min(Math.max(0, rawTop), maxTop);

      table.style.left = `${clampedLeft}px`;
      table.style.top = `${clampedTop}px`;

      const newRect = table.getBoundingClientRect();
      setActiveTablePos({
        top: newRect.top,
        left: newRect.left,
        table: table
      });
    };

    const handleMouseUp = () => {
      const updatedRect = table.getBoundingClientRect();
      setActiveTablePos({
        top: updatedRect.top,
        left: updatedRect.left,
        table: table
      });

      resizingRef.current = null;
      draggedTableRef.current = null;
      setDropIndicatorPos(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const startFreeDragImg = (e, img) => {
    if (!e || !img) return;
    e.preventDefault();
    e.stopPropagation();

    const editorCanvas = editorRef.current?.parentNode || editorRef.current;
    if (!editorCanvas) return;

    const canvasRect = editorCanvas.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    let initialLeft = img.offsetLeft;
    let initialTop = img.offsetTop;

    if (window.getComputedStyle(img).position !== 'absolute') {
      initialLeft = imgRect.left - canvasRect.left;
      initialTop = imgRect.top - canvasRect.top;
      img.style.position = 'absolute';
      img.style.left = `${initialLeft}px`;
      img.style.top = `${initialTop}px`;
      img.style.margin = '0';
      img.style.zIndex = '25';
    }

    const startX = e.clientX;
    const startY = e.clientY;

    const maxLeft = Math.max(0, canvasRect.width - imgRect.width);
    const maxTop = Math.max(0, canvasRect.height - imgRect.height);

    resizingRef.current = { type: 'free-drag-img', node: img };

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const rawLeft = initialLeft + deltaX;
      const rawTop = initialTop + deltaY;

      const clampedLeft = Math.min(Math.max(0, rawLeft), maxLeft);
      const clampedTop = Math.min(Math.max(0, rawTop), maxTop);

      img.style.left = `${clampedLeft}px`;
      img.style.top = `${clampedTop}px`;

      const newRect = img.getBoundingClientRect();
      setActiveImgPos({
        top: newRect.top,
        left: newRect.left,
        width: newRect.width,
        height: newRect.height,
        img: img,
        isPinned: true
      });
    };

    const handleMouseUp = (upEvent) => {
      const dropX = (upEvent ? upEvent.clientX : startX) - canvasRect.left;

      img.style.position = 'static';
      img.style.maxWidth = '100%';
      img.style.shapeOutside = 'margin-box';

      if (dropX < canvasRect.width * 0.4) {
        img.style.float = 'left';
        img.style.margin = '8px 16px 8px 0';
        img.style.display = 'inline-block';
        img.style.clear = 'none';
      } else if (dropX > canvasRect.width * 0.6) {
        img.style.float = 'right';
        img.style.margin = '8px 0 8px 16px';
        img.style.display = 'inline-block';
        img.style.clear = 'none';
      } else {
        img.style.float = 'none';
        img.style.display = 'block';
        img.style.clear = 'both';
        img.style.margin = '16px auto';
      }

      const updatedRect = img.getBoundingClientRect();
      setActiveImgPos({
        top: updatedRect.top,
        left: updatedRect.left,
        width: updatedRect.width,
        height: updatedRect.height,
        img: img,
        isPinned: true
      });

      resizingRef.current = null;
      draggedNodeRef.current = null;
      setDropIndicatorPos(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleCanvasMouseDown = (e) => {
    let target = e.target;

    const dividerEl = (target && target.closest) ? (target.closest('[data-divider]') || target.closest('.editor-divider-v') || target.closest('.editor-divider-h') || (target.nodeName === 'HR' ? target : null)) : null;

    if (dividerEl) {
      const line = dividerEl;
      const rect = line.getBoundingClientRect();
      const isVertical = line.getAttribute('data-divider') === 'vertical' || line.classList.contains('editor-divider-v') || (rect.height > rect.width && rect.width < 30);

      setActiveLinePos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        isVertical: isVertical,
        lineEl: line,
        isPinned: true
      });

      const container = line.closest('.editor-column-container');

      if (isVertical && container) {
        // Unrestricted vertical line column boundary drag & vertical page repositioning
        const containerRect = container.getBoundingClientRect();
        const leftCol = container.querySelector('.editor-column-left');
        const rightCol = container.querySelector('.editor-column-right');
        const startX = e.clientX;
        const startY = e.clientY;

        resizingRef.current = { type: 'col-drag' };
        let isVerticalRepositioning = false;

        const handleColMouseMove = (moveEvent) => {
          moveEvent.preventDefault();
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;

          // If dragging significantly in Y direction (vertical drag across document page)
          if (Math.abs(deltaY) > 16 && Math.abs(deltaY) > Math.abs(deltaX)) {
            isVerticalRepositioning = true;
            updateDropIndicator(moveEvent.clientX, moveEvent.clientY);
            return;
          }

          if (isVerticalRepositioning) {
            updateDropIndicator(moveEvent.clientX, moveEvent.clientY);
            return;
          }

          // Horizontal dragging: scale column percentage dynamically across the full canvas width (2% to 98%)
          const relativeX = moveEvent.clientX - containerRect.left;
          const pct = Math.min(98, Math.max(2, (relativeX / containerRect.width) * 100));

          if (leftCol && rightCol) {
            leftCol.style.flex = `0 0 ${pct}%`;
            leftCol.style.width = `${pct}%`;
            leftCol.style.maxWidth = `${pct}%`;

            rightCol.style.flex = `0 0 ${100 - pct}%`;
            rightCol.style.width = `${100 - pct}%`;
            rightCol.style.maxWidth = `${100 - pct}%`;
          }

          const updatedRect = line.getBoundingClientRect();
          setActiveLinePos({
            top: updatedRect.top,
            left: updatedRect.left,
            width: updatedRect.width,
            height: updatedRect.height,
            isVertical: true,
            lineEl: line,
            isPinned: true
          });
        };

        const handleColMouseUp = () => {
          if (isVerticalRepositioning) {
            executeNodeDrop(container);
          }
          resizingRef.current = null;
          setDropIndicatorPos(null);
          window.removeEventListener('mousemove', handleColMouseMove);
          window.removeEventListener('mouseup', handleColMouseUp);
        };

        window.addEventListener('mousemove', handleColMouseMove);
        window.addEventListener('mouseup', handleColMouseUp);
      } else {
        const editorCanvas = editorRef.current?.parentNode;
        if (editorCanvas) {
          const editorRect = editorCanvas.getBoundingClientRect();
          const lineRect = line.getBoundingClientRect();
          const startX = e.clientX;
          const startY = e.clientY;

          let initialLeft = line.offsetLeft;
          let initialTop = line.offsetTop;

          if (window.getComputedStyle(line).position !== 'absolute') {
            initialLeft = lineRect.left - editorRect.left;
            initialTop = lineRect.top - editorRect.top;
          }

          let isDraggingLine = false;

          const handleLineMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            if (!isDraggingLine && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
              isDraggingLine = true;
              line.style.position = 'absolute';
              line.style.zIndex = '20';
              line.style.margin = '0';
              resizingRef.current = { type: 'free-drag-line', node: line };
            }

            if (isDraggingLine) {
              moveEvent.preventDefault();
              const newLeft = initialLeft + deltaX;
              const newTop = initialTop + deltaY;

              line.style.left = `${newLeft}px`;
              line.style.top = `${newTop}px`;

              const updatedRect = line.getBoundingClientRect();
              const isVert = line.getAttribute('data-divider') === 'vertical' || line.classList.contains('editor-divider-v') || (updatedRect.height > updatedRect.width && updatedRect.width < 30);
              setActiveLinePos({
                top: updatedRect.top,
                left: updatedRect.left,
                width: updatedRect.width,
                height: updatedRect.height,
                isVertical: isVert,
                lineEl: line,
                isPinned: true
              });
            }
          };

          const handleLineMouseUp = () => {
            const updatedRect = line.getBoundingClientRect();
            const isVert = line.getAttribute('data-divider') === 'vertical' || line.classList.contains('editor-divider-v') || (updatedRect.height > updatedRect.width && updatedRect.width < 30);
            setActiveLinePos({
              top: updatedRect.top,
              left: updatedRect.left,
              width: updatedRect.width,
              height: updatedRect.height,
              isVertical: isVert,
              lineEl: line,
              isPinned: true
            });
            resizingRef.current = null;
            window.removeEventListener('mousemove', handleLineMouseMove);
            window.removeEventListener('mouseup', handleLineMouseUp);
          };

          window.addEventListener('mousemove', handleLineMouseMove);
          window.addEventListener('mouseup', handleLineMouseUp);
        }
      }
    } else if (activeLinePos && !target.closest('.line-control-overlay')) {
      setActiveLinePos(null);
    }

    if (target && target.nodeName === 'IMG') {
      const img = target;
      const rect = img.getBoundingClientRect();
      setActiveImgPos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        img: img,
        isPinned: true
      });

      startFreeDragImg(e, img);
      return;
    } else if (activeImgPos && !target.closest('.image-control-overlay')) {
      setActiveImgPos(null);
    }

    handleTableMouseDown(e);
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

    const handleSelectionOrStateChange = () => {
      updateActiveStates();
    };

    document.addEventListener('selectionchange', handleSelectionOrStateChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionOrStateChange);
    };
  }, [isHeaderActive, isFooterActive]);

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

  const handleCanvasDoubleClick = (e) => {
    let target = e.target;

    if (target && target.nodeName === 'IMG') {
      e.stopPropagation();
      const rect = target.getBoundingClientRect();
      setActiveImgPos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        img: target,
        isPinned: true
      });
      return;
    }

    const dividerEl = (target && target.closest) ? (target.closest('[data-divider]') || target.closest('.editor-divider-v') || target.closest('.editor-divider-h') || (target.nodeName === 'HR' ? target : null)) : null;

    if (dividerEl) {
      e.stopPropagation();
      const rect = dividerEl.getBoundingClientRect();
      const isVertical = dividerEl.getAttribute('data-divider') === 'vertical' || dividerEl.classList.contains('editor-divider-v') || (rect.height > rect.width && rect.width < 30);
      setActiveLinePos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        isVertical: isVertical,
        lineEl: dividerEl,
        isPinned: true
      });
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

    // 2. ENTER KEY: Preserve shading/border behavior and carry active font size to new line/paragraph
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      const currentFontSize = activeFontSize;

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

      // Schedule post-Enter font size continuation if non-default font size is active
      if (currentFontSize && currentFontSize !== 12) {
        setTimeout(() => {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0 && sel.isCollapsed) {
            const range = sel.getRangeAt(0);
            let targetEl = range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer;

            let hasExplicitFontSize = false;
            let curr = targetEl;
            while (curr && curr.nodeType === 1 && curr !== editorRef.current && curr !== headerRef.current && curr !== footerRef.current) {
              if (curr.style && curr.style.fontSize) {
                hasExplicitFontSize = true;
                break;
              }
              curr = curr.parentNode;
            }

            if (!hasExplicitFontSize) {
              const span = document.createElement('span');
              span.style.fontSize = `${currentFontSize}pt`;
              span.innerHTML = '&#8203;';

              range.insertNode(span);
              const newRange = document.createRange();
              newRange.setStart(span.firstChild, 1);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            updateActiveStates();
          }
        }, 0);
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

    let activeEditor = null;
    if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
    else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
    else if (editorRef.current) activeEditor = editorRef.current;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);

      try {
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        let targetEl = node.nodeType === 3 ? node.parentNode : node;

        if (targetEl && targetEl.nodeType === 1) {
          let current = targetEl;
          let detectedPt = null;

          while (current && current !== document.body && current !== document.documentElement) {
            if (current.style && current.style.fontSize) {
              const styleFs = current.style.fontSize;
              if (styleFs.endsWith('pt')) {
                detectedPt = parseInt(styleFs, 10);
                break;
              } else if (styleFs.endsWith('px')) {
                detectedPt = Math.round(parseFloat(styleFs) * 0.75);
                break;
              }
            }
            current = current.parentNode;
          }

          if (!detectedPt && targetEl !== document && targetEl !== document.documentElement) {
            const computedSize = window.getComputedStyle(targetEl).fontSize;
            if (computedSize) {
              detectedPt = Math.round(parseFloat(computedSize) * 0.75);
            }
          }

          if (detectedPt && !isNaN(detectedPt) && detectedPt > 0) {
            setActiveFontSize(detectedPt);
          }
        }
      } catch (e) {
        console.warn('Could not compute active font size safely:', e);
      }

      let node = selection.anchorNode;
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
    }

    let fontName = document.queryCommandValue('fontName');
    if (fontName && typeof fontName === 'string') {
      setActiveFont(fontName.replace(/['"]/g, ''));
    } else {
      setActiveFont('Arial');
    }
  };

  const executeFontSizeCommand = (size) => {
    const selection = window.getSelection();
    if (savedSelection.current && (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).collapsed !== savedSelection.current.collapsed)) {
      try {
        selection.removeAllRanges();
        selection.addRange(savedSelection.current);
      } catch (err) {
        console.warn('Could not restore saved selection:', err);
      }
    }

    let activeEditor = null;
    if (isHeaderActive && headerRef.current) activeEditor = headerRef.current;
    else if (isFooterActive && footerRef.current) activeEditor = footerRef.current;
    else if (editorRef.current) activeEditor = editorRef.current;

    if (activeEditor) {
      activeEditor.focus();
    }

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (range.collapsed) {
        // Insert targeted zero-width space span for dynamic typing without selection
        const span = document.createElement('span');
        span.style.fontSize = `${size}pt`;
        span.innerHTML = '&#8203;';

        range.insertNode(span);

        // Move caret strictly inside the span, after the zero-width space
        const newRange = document.createRange();
        newRange.setStart(span.firstChild, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('fontSize', false, '7');

        const scope = activeEditor || document.body;
        const fontTags = scope.querySelectorAll('font[size="7"], font[style*="font-size"]');
        fontTags.forEach(font => {
          const span = document.createElement('span');
          span.style.fontSize = `${size}pt`;
          while (font.firstChild) {
            span.appendChild(font.firstChild);
          }
          if (font.parentNode) {
            font.parentNode.replaceChild(span, font);
          }
        });

        // Ensure inner styled spans inside the selection inherit the new font size
        const innerSpans = scope.querySelectorAll('span[style*="font-size"]');
        innerSpans.forEach(span => {
          if (selection.containsNode && selection.containsNode(span, true)) {
            span.style.fontSize = `${size}pt`;
          }
        });
      }
    }

    setActiveFontSize(size);
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

  const convertLineToVertical = (line) => {
    const parentContainer = line.closest('.editor-column-container');
    if (!parentContainer) {
      const container = document.createElement('div');
      container.className = 'editor-column-container';
      container.setAttribute('data-divider-container', 'true');
      container.style.cssText = 'display: flex; flex-direction: row; align-items: stretch; width: 100%; margin: 16px 0; min-height: 80px; clear: both;';

      const leftCol = document.createElement('div');
      leftCol.className = 'editor-column-left';
      leftCol.style.cssText = 'flex: 0 0 50%; width: 50%; max-width: 50%; min-width: 0; padding-right: 12px; outline: none; word-break: break-word; overflow-wrap: break-word; text-align: left; box-sizing: border-box;';
      leftCol.innerHTML = '<p><br></p>';

      const vLine = document.createElement('div');
      vLine.className = 'editor-divider-v';
      vLine.setAttribute('data-divider', 'vertical');
      vLine.setAttribute('contenteditable', 'false');
      vLine.style.cssText = 'flex: 0 0 auto; width: 3px; min-height: 80px; background-color: #374151; margin: 0 8px; cursor: col-resize; user-select: none; position: relative; align-self: stretch;';

      const rightCol = document.createElement('div');
      rightCol.className = 'editor-column-right';
      rightCol.style.cssText = 'flex: 0 0 50%; width: 50%; max-width: 50%; min-width: 0; padding-left: 12px; outline: none; word-break: break-word; overflow-wrap: break-word; text-align: left; box-sizing: border-box;';
      rightCol.innerHTML = '<p><br></p>';

      container.appendChild(leftCol);
      container.appendChild(vLine);
      container.appendChild(rightCol);

      if (line.parentNode) {
        line.parentNode.replaceChild(container, line);
      }
      return vLine;
    }
    return line;
  };

  const convertLineToHorizontal = (line) => {
    const parentContainer = line.closest('.editor-column-container');
    const hr = document.createElement('hr');
    hr.className = 'editor-divider-h';
    hr.setAttribute('data-divider', 'horizontal');
    hr.style.cssText = 'border: none; border-top: 3px solid #374151; width: 100%; margin: 16px auto; cursor: pointer; clear: both;';

    if (parentContainer && parentContainer.parentNode) {
      parentContainer.parentNode.replaceChild(hr, parentContainer);
    } else if (line.parentNode) {
      line.parentNode.replaceChild(hr, line);
    }
    return hr;
  };

  const insertDividerLine = (lineType = 'horizontal', options = {}) => {
    const color = options.color || activeLineColor || '#374151';
    const thickness = options.thickness || activeLineThickness || '2px';
    const style = options.style || activeLineStyle || 'solid';

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

      let lineHTML = '';
      if (lineType === 'horizontal') {
        if (style === 'gradient') {
          lineHTML = `<hr class="editor-divider-h" data-divider="horizontal" style="border: none; height: ${thickness === '1px' ? '3px' : thickness}; background: linear-gradient(to right, ${color}, #3b82f6, #ec4899); width: 100%; margin: 16px auto; cursor: pointer; clear: both;" /><p><br></p>`;
        } else if (style === 'double') {
          lineHTML = `<hr class="editor-divider-h" data-divider="horizontal" style="border: none; border-top: 4px double ${color}; width: 100%; margin: 16px auto; cursor: pointer; clear: both;" /><p><br></p>`;
        } else {
          lineHTML = `<hr class="editor-divider-h" data-divider="horizontal" style="border: none; border-top: ${thickness} ${style} ${color}; width: 100%; margin: 16px auto; cursor: pointer; clear: both;" /><p><br></p>`;
        }
      } else if (lineType === 'vertical') {
        const height = options.height || '80px';
        const vWidth = thickness || '3px';
        const vStyle = style === 'dashed'
          ? `border-left: ${vWidth} dashed ${color}; width: 0px;`
          : `background-color: ${color}; width: ${vWidth};`;

        lineHTML = `<div class="editor-column-container" data-divider-container="true" style="display: flex; flex-direction: row; align-items: stretch; width: 100%; margin: 16px 0; min-height: 80px; clear: both;"><div class="editor-column-left" style="flex: 0 0 50%; width: 50%; max-width: 50%; min-width: 0; padding-right: 12px; outline: none; word-break: break-word; overflow-wrap: break-word; text-align: left; box-sizing: border-box;"><p><br></p></div><div class="editor-divider-v" data-divider="vertical" contenteditable="false" style="flex: 0 0 auto; ${vStyle} min-height: ${height}; margin: 0 8px; cursor: col-resize; user-select: none; position: relative; align-self: stretch;"></div><div class="editor-column-right" style="flex: 0 0 50%; width: 50%; max-width: 50%; min-width: 0; padding-left: 12px; outline: none; word-break: break-word; overflow-wrap: break-word; text-align: left; box-sizing: border-box;"><p><br></p></div></div><p><br></p>`;
      }

      document.execCommand('insertHTML', false, lineHTML);
    }

    setIsDividerDropdownOpen(false);
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
        .prose img { max-width: 100%; height: auto; display: block; margin: 16px auto; clear: both; shape-outside: margin-box !important; position: static; }
        .prose img[style*="float: left"] { display: inline-block !important; float: left !important; clear: none !important; margin: 8px 16px 8px 0 !important; shape-outside: margin-box !important; position: static !important; }
        .prose img[style*="float: right"] { display: inline-block !important; float: right !important; clear: none !important; margin: 8px 0 8px 16px !important; shape-outside: margin-box !important; position: static !important; }
        .prose img[style*="display: block"] { display: block !important; float: none !important; clear: both !important; margin: 16px auto !important; shape-outside: margin-box !important; position: static !important; }
        .prose hr, .editor-divider-h, .editor-divider-v, [data-divider] { cursor: pointer !important; transition: outline 0.15s ease-in-out; }
        .prose hr:hover, .editor-divider-h:hover, .editor-divider-v:hover, [data-divider]:hover { outline: 2px dashed #2563eb !important; outline-offset: 3px; cursor: pointer !important; }
        .editor-column-container { display: flex !important; flex-direction: row !important; align-items: stretch !important; width: 100% !important; box-sizing: border-box !important; clear: both !important; margin: 16px 0 !important; }
        .editor-column-left, .editor-column-right { min-width: 0 !important; word-break: break-word !important; overflow-wrap: break-word !important; box-sizing: border-box !important; }
        .editor-column-left p, .editor-column-right p { word-break: break-word !important; overflow-wrap: break-word !important; margin: 4px 0 !important; }
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
          onMouseDown={(e) => {
            const table = activeTablePos?.table;
            if (table) {
              startFreeDragTable(e, table);
            }
          }}
          className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center cursor-move shadow-md print:hidden select-none"
          title="Drag dedicated Move Handle to position table anywhere"
        >
          <FiMove size={14} />
        </div>
      )}

      {/* Floating Image Controls & Resize Overlay */}
      {/* Floating Image Controls & Multi-Corner Resize Overlay */}
      {activeImgPos && (
        <div
          className="image-control-overlay"
          style={{
            position: 'fixed',
            top: `${activeImgPos.top}px`,
            left: `${activeImgPos.left}px`,
            width: `${activeImgPos.width}px`,
            height: `${activeImgPos.height}px`,
            border: '2px dashed #2563EB',
            pointerEvents: 'none',
            zIndex: 60
          }}
        >
          {/* Top-Left Corner Dedicated Move Handle Badge */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-16px',
              zIndex: 85,
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              const img = activeImgPos?.img;
              if (img) {
                startFreeDragImg(e, img);
              }
            }}
            className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-move shadow-lg border-2 border-white text-xs select-none transition-transform hover:scale-110"
            title="Drag dedicated Move Handle to position image anywhere"
          >
            <FiMove size={14} />
          </div>

          {/* Top Floating Image Controls Toolbar */}
          <div
            style={{
              position: 'absolute',
              top: '-36px',
              left: '0px',
              pointerEvents: 'auto'
            }}
            className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-md rounded-md px-2 py-1 z-70 print:hidden text-xs"
          >
            <span className="font-semibold text-gray-500 mr-0.5">Shape:</span>

            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.borderRadius = '0px';
                  img.style.objectFit = 'initial';
                }
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Square Shape"
            >
              Square
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.borderRadius = '16px';
                  img.style.objectFit = 'initial';
                }
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Rounded Rectangle Shape"
            >
              Rounded
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.borderRadius = '50%';
                  img.style.objectFit = 'cover';
                  const side = Math.min(activeImgPos.width, activeImgPos.height);
                  img.style.width = `${side}px`;
                  img.style.height = `${side}px`;
                  const rect = img.getBoundingClientRect();
                  setActiveImgPos({ ...activeImgPos, width: rect.width, height: rect.height });
                }
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Circle Shape"
            >
              Circle
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.borderRadius = '9999px';
                  img.style.objectFit = 'cover';
                }
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Pill / Oval Shape"
            >
              Pill
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.borderRadius = '4px';
                  img.style.objectFit = 'initial';
                }
              }}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Reset Shape"
            >
              Reset
            </button>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>

            <span className="font-semibold text-gray-500 mr-0.5">Wrap:</span>
            <button 
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.position = 'static';
                  img.style.float = 'none';
                  img.style.display = 'block';
                  img.style.clear = 'both';
                  img.style.margin = '16px auto';
                  img.style.shapeOutside = 'margin-box';
                  const rect = img.getBoundingClientRect();
                  setActiveImgPos({ ...activeImgPos, top: rect.top, left: rect.left });
                }
              }} 
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Top and Bottom Break (Block)"
            >
              Top/Bottom
            </button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.position = 'static';
                  img.style.float = 'left';
                  img.style.display = 'inline-block';
                  img.style.clear = 'none';
                  img.style.margin = '8px 16px 8px 0';
                  img.style.shapeOutside = 'margin-box';
                  const rect = img.getBoundingClientRect();
                  setActiveImgPos({ ...activeImgPos, top: rect.top, left: rect.left });
                }
              }} 
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Text Wrap Left"
            >
              Wrap Left
            </button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeImgPos?.img) {
                  const img = activeImgPos.img;
                  img.style.position = 'static';
                  img.style.float = 'right';
                  img.style.display = 'inline-block';
                  img.style.clear = 'none';
                  img.style.margin = '8px 0 8px 16px';
                  img.style.shapeOutside = 'margin-box';
                  const rect = img.getBoundingClientRect();
                  setActiveImgPos({ ...activeImgPos, top: rect.top, left: rect.left });
                }
              }} 
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded border border-gray-200 text-[11px]"
              title="Text Wrap Right"
            >
              Wrap Right
            </button>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>

            {/* Toolbar Drag to Move Handle Button */}
            <div
              onMouseDown={(e) => {
                const img = activeImgPos?.img;
                if (img) {
                  startFreeDragImg(e, img);
                }
              }}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-move shadow flex items-center gap-1 font-medium text-[11px]"
              title="Drag Move Handle to position image anywhere"
            >
              <FiMove size={12} />
              <span>Move</span>
            </div>
          </div>

          {/* Top-Left Corner Resize Handle */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              width: '12px',
              height: '12px',
              backgroundColor: '#2563EB',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'nw-resize',
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const img = activeImgPos.img;
              const startX = e.clientX;
              const startWidth = activeImgPos.width;
              const startHeight = activeImgPos.height;
              const aspectRatio = startWidth / startHeight;

              resizingRef.current = { type: 'img-resize' };

              const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                const deltaX = startX - moveEvent.clientX;
                const newWidth = Math.max(40, startWidth + deltaX);
                const newHeight = Math.round(newWidth / aspectRatio);

                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;

                const newRect = img.getBoundingClientRect();
                setActiveImgPos({
                  top: newRect.top,
                  left: newRect.left,
                  width: newRect.width,
                  height: newRect.height,
                  img: img
                });
              };

              const handleMouseUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag corner to resize image"
          />

          {/* Top-Right Corner Resize Handle */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '12px',
              height: '12px',
              backgroundColor: '#2563EB',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'ne-resize',
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const img = activeImgPos.img;
              const startX = e.clientX;
              const startWidth = activeImgPos.width;
              const startHeight = activeImgPos.height;
              const aspectRatio = startWidth / startHeight;

              resizingRef.current = { type: 'img-resize' };

              const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                const deltaX = moveEvent.clientX - startX;
                const newWidth = Math.max(40, startWidth + deltaX);
                const newHeight = Math.round(newWidth / aspectRatio);

                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;

                const newRect = img.getBoundingClientRect();
                setActiveImgPos({
                  top: newRect.top,
                  left: newRect.left,
                  width: newRect.width,
                  height: newRect.height,
                  img: img
                });
              };

              const handleMouseUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag corner to resize image"
          />

          {/* Bottom-Left Corner Resize Handle */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '-6px',
              width: '12px',
              height: '12px',
              backgroundColor: '#2563EB',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'sw-resize',
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const img = activeImgPos.img;
              const startX = e.clientX;
              const startWidth = activeImgPos.width;
              const startHeight = activeImgPos.height;
              const aspectRatio = startWidth / startHeight;

              resizingRef.current = { type: 'img-resize' };

              const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                const deltaX = startX - moveEvent.clientX;
                const newWidth = Math.max(40, startWidth + deltaX);
                const newHeight = Math.round(newWidth / aspectRatio);

                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;

                const newRect = img.getBoundingClientRect();
                setActiveImgPos({
                  top: newRect.top,
                  left: newRect.left,
                  width: newRect.width,
                  height: newRect.height,
                  img: img
                });
              };

              const handleMouseUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag corner to resize image"
          />

          {/* Bottom-Right Corner Resize Handle */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              width: '12px',
              height: '12px',
              backgroundColor: '#2563EB',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'se-resize',
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const img = activeImgPos.img;
              const startX = e.clientX;
              const startWidth = activeImgPos.width;
              const startHeight = activeImgPos.height;
              const aspectRatio = startWidth / startHeight;

              resizingRef.current = { type: 'img-resize' };

              const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                const deltaX = moveEvent.clientX - startX;
                const newWidth = Math.max(40, startWidth + deltaX);
                const newHeight = Math.round(newWidth / aspectRatio);

                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;

                const newRect = img.getBoundingClientRect();
                setActiveImgPos({
                  top: newRect.top,
                  left: newRect.left,
                  width: newRect.width,
                  height: newRect.height,
                  img: img
                });
              };

              const handleMouseUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag corner to resize image"
          />

          {/* Middle-Right Side Resize Handle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-6px',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '12px',
              backgroundColor: '#2563EB',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'ew-resize',
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const img = activeImgPos.img;
              const startX = e.clientX;
              const startWidth = activeImgPos.width;

              resizingRef.current = { type: 'img-resize' };

              const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                const deltaX = moveEvent.clientX - startX;
                const newWidth = Math.max(40, startWidth + deltaX);
                img.style.width = `${newWidth}px`;

                const newRect = img.getBoundingClientRect();
                setActiveImgPos({
                  top: newRect.top,
                  left: newRect.left,
                  width: newRect.width,
                  height: newRect.height,
                  img: img
                });
              };

              const handleMouseUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag side to resize width"
          />

          {/* Middle-Bottom Side Resize Handle */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              backgroundColor: '#2563EB',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'ns-resize',
              pointerEvents: 'auto'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const img = activeImgPos.img;
              const startY = e.clientY;
              const startHeight = activeImgPos.height;

              resizingRef.current = { type: 'img-resize' };

              const handleMouseMove = (moveEvent) => {
                moveEvent.preventDefault();
                const deltaY = moveEvent.clientY - startY;
                const newHeight = Math.max(30, startHeight + deltaY);
                img.style.height = `${newHeight}px`;

                const newRect = img.getBoundingClientRect();
                setActiveImgPos({
                  top: newRect.top,
                  left: newRect.left,
                  width: newRect.width,
                  height: newRect.height,
                  img: img
                });
              };

              const handleMouseUp = () => {
                resizingRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
            title="Drag side to resize height"
          />
        </div>
      )}

      {/* Floating Line Controls & Resize Overlay */}
      {activeLinePos && (
        <div
          className="line-control-overlay"
          style={{
            position: 'fixed',
            top: `${activeLinePos.top - 4}px`,
            left: `${activeLinePos.left - 4}px`,
            width: `${Math.max(activeLinePos.width + 8, 16)}px`,
            height: `${Math.max(activeLinePos.height + 8, 16)}px`,
            border: '2px dashed #2563EB',
            pointerEvents: 'none',
            zIndex: 60,
            borderRadius: '3px'
          }}
        >
          {/* Floating Line Option Toolbar */}
          <div
            style={{
              position: 'absolute',
              top: '-38px',
              left: '0px',
              pointerEvents: 'auto'
            }}
            className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-lg rounded-md px-2 py-1 z-70 print:hidden text-xs"
          >
            <span className="font-semibold text-gray-600 mr-0.5">
              {activeLinePos.isVertical ? 'Vertical Line' : 'Horizontal Line'}
            </span>

            {/* Orientation Toggle Button (Horiz <-> Vert) */}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeLinePos?.lineEl) {
                  const line = activeLinePos.lineEl;
                  const currentlyVert = activeLinePos.isVertical;

                  if (currentlyVert) {
                    const hr = convertLineToHorizontal(line);
                    const newRect = hr.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: false,
                      lineEl: hr,
                      isPinned: true
                    });
                  } else {
                    const vLine = convertLineToVertical(line);
                    const newRect = vLine.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: true,
                      lineEl: vLine,
                      isPinned: true
                    });
                  }
                }
              }}
              className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded text-[11px] flex items-center gap-1"
              title="Toggle orientation"
            >
              <span>{activeLinePos.isVertical ? '↔ Horizontal' : '↕ Vertical'}</span>
            </button>

            {!activeLinePos.isVertical ? (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Width:</span>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      activeLinePos.lineEl.style.width = '100%';
                      activeLinePos.lineEl.style.margin = '16px 0';
                      const rect = activeLinePos.lineEl.getBoundingClientRect();
                      setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left, width: rect.width });
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  100%
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      activeLinePos.lineEl.style.width = '50%';
                      activeLinePos.lineEl.style.margin = '16px auto';
                      const rect = activeLinePos.lineEl.getBoundingClientRect();
                      setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left, width: rect.width });
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  50%
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      activeLinePos.lineEl.style.width = '25%';
                      activeLinePos.lineEl.style.margin = '16px auto';
                      const rect = activeLinePos.lineEl.getBoundingClientRect();
                      setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left, width: rect.width });
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  25%
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Height:</span>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      activeLinePos.lineEl.style.height = '40px';
                      const rect = activeLinePos.lineEl.getBoundingClientRect();
                      setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left, height: rect.height });
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  Short
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      activeLinePos.lineEl.style.height = '100px';
                      const rect = activeLinePos.lineEl.getBoundingClientRect();
                      setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left, height: rect.height });
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  Medium
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      activeLinePos.lineEl.style.height = '200px';
                      const rect = activeLinePos.lineEl.getBoundingClientRect();
                      setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left, height: rect.height });
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  Tall
                </button>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Split:</span>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      const line = activeLinePos.lineEl;
                      const container = line.closest('.editor-column-container');
                      if (container) {
                        const leftCol = container.querySelector('.editor-column-left');
                        const rightCol = container.querySelector('.editor-column-right');
                        if (leftCol && rightCol) {
                          leftCol.style.flex = '0 0 30%';
                          leftCol.style.maxWidth = '30%';
                          rightCol.style.flex = '0 0 70%';
                          rightCol.style.maxWidth = '70%';
                          const rect = line.getBoundingClientRect();
                          setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left });
                        }
                      }
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  30/70
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      const line = activeLinePos.lineEl;
                      const container = line.closest('.editor-column-container');
                      if (container) {
                        const leftCol = container.querySelector('.editor-column-left');
                        const rightCol = container.querySelector('.editor-column-right');
                        if (leftCol && rightCol) {
                          leftCol.style.flex = '0 0 50%';
                          leftCol.style.maxWidth = '50%';
                          rightCol.style.flex = '0 0 50%';
                          rightCol.style.maxWidth = '50%';
                          const rect = line.getBoundingClientRect();
                          setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left });
                        }
                      }
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  50/50
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (activeLinePos.lineEl) {
                      const line = activeLinePos.lineEl;
                      const container = line.closest('.editor-column-container');
                      if (container) {
                        const leftCol = container.querySelector('.editor-column-left');
                        const rightCol = container.querySelector('.editor-column-right');
                        if (leftCol && rightCol) {
                          leftCol.style.flex = '0 0 70%';
                          leftCol.style.maxWidth = '70%';
                          rightCol.style.flex = '0 0 30%';
                          rightCol.style.maxWidth = '30%';
                          const rect = line.getBoundingClientRect();
                          setActiveLinePos({ ...activeLinePos, top: rect.top, left: rect.left });
                        }
                      }
                    }
                  }}
                  className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                >
                  70/30
                </button>
              </>
            )}

            <span className="text-gray-400">|</span>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                if (activeLinePos.lineEl) {
                  activeLinePos.lineEl.remove();
                  setActiveLinePos(null);
                }
              }}
              className="px-1.5 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium text-[11px]"
              title="Delete Divider Line"
            >
              Delete
            </button>
          </div>

          {/* Resize Handles */}
          {!activeLinePos.isVertical ? (
            <>
              {/* Left Resize Handle for Horizontal Line */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-6px',
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2563EB',
                  border: '2px solid white',
                  borderRadius: '50%',
                  cursor: 'ew-resize',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const line = activeLinePos.lineEl;
                  const startX = e.clientX;
                  const startWidth = line.offsetWidth;

                  resizingRef.current = { type: 'line-resize' };

                  const handleMouseMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    const deltaX = startX - moveEvent.clientX;
                    const newWidth = Math.max(30, startWidth + deltaX);
                    line.style.width = `${newWidth}px`;
                    if (!line.style.margin || line.style.margin.includes('auto')) {
                      line.style.margin = '16px auto';
                    }

                    const newRect = line.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: false,
                      lineEl: line
                    });
                  };

                  const handleMouseUp = () => {
                    resizingRef.current = null;
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag to resize width"
              />

              {/* Right Resize Handle for Horizontal Line */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-6px',
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2563EB',
                  border: '2px solid white',
                  borderRadius: '50%',
                  cursor: 'ew-resize',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const line = activeLinePos.lineEl;
                  const startX = e.clientX;
                  const startWidth = line.offsetWidth;

                  resizingRef.current = { type: 'line-resize' };

                  const handleMouseMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    const deltaX = moveEvent.clientX - startX;
                    const newWidth = Math.max(30, startWidth + deltaX);
                    line.style.width = `${newWidth}px`;
                    if (!line.style.margin || line.style.margin.includes('auto')) {
                      line.style.margin = '16px auto';
                    }

                    const newRect = line.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: false,
                      lineEl: line
                    });
                  };

                  const handleMouseUp = () => {
                    resizingRef.current = null;
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag to resize width"
              />
            </>
          ) : (
            <>
              {/* Top Resize Handle for Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2563EB',
                  border: '2px solid white',
                  borderRadius: '50%',
                  cursor: 'ns-resize',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const line = activeLinePos.lineEl;
                  const startY = e.clientY;
                  const startHeight = line.offsetHeight;

                  resizingRef.current = { type: 'line-resize' };

                  const handleMouseMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    const deltaY = startY - moveEvent.clientY;
                    const newHeight = Math.max(15, startHeight + deltaY);
                    line.style.height = `${newHeight}px`;

                    const newRect = line.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: true,
                      lineEl: line
                    });
                  };

                  const handleMouseUp = () => {
                    resizingRef.current = null;
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag to resize height"
              />

              {/* Bottom Resize Handle for Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2563EB',
                  border: '2px solid white',
                  borderRadius: '50%',
                  cursor: 'ns-resize',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const line = activeLinePos.lineEl;
                  const startY = e.clientY;
                  const startHeight = line.offsetHeight;

                  resizingRef.current = { type: 'line-resize' };

                  const handleMouseMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    const deltaY = moveEvent.clientY - startY;
                    const newHeight = Math.max(15, startHeight + deltaY);
                    line.style.height = `${newHeight}px`;

                    const newRect = line.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: true,
                      lineEl: line
                    });
                  };

                  const handleMouseUp = () => {
                    resizingRef.current = null;
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag to resize height"
              />

              {/* Middle-Left Column Resize Handle for Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-6px',
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2563EB',
                  border: '2px solid white',
                  borderRadius: '2px',
                  cursor: 'col-resize',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const line = activeLinePos.lineEl;
                  const container = line.closest('.editor-column-container');

                  resizingRef.current = { type: 'col-drag' };

                  const handleMouseMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    if (container) {
                      const containerRect = container.getBoundingClientRect();
                      const relativeX = moveEvent.clientX - containerRect.left;
                      const pct = Math.min(98, Math.max(2, (relativeX / containerRect.width) * 100));

                      const leftCol = container.querySelector('.editor-column-left');
                      const rightCol = container.querySelector('.editor-column-right');

                      if (leftCol && rightCol) {
                        leftCol.style.flex = `0 0 ${pct}%`;
                        leftCol.style.width = `${pct}%`;
                        leftCol.style.maxWidth = `${pct}%`;

                        rightCol.style.flex = `0 0 ${100 - pct}%`;
                        rightCol.style.width = `${100 - pct}%`;
                        rightCol.style.maxWidth = `${100 - pct}%`;
                      }
                    }

                    const newRect = line.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: true,
                      lineEl: line,
                      isPinned: true
                    });
                  };

                  const handleMouseUp = () => {
                    resizingRef.current = null;
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag left/right to adjust column widths"
              />

              {/* Middle-Right Column Resize Handle for Vertical Line */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-6px',
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2563EB',
                  border: '2px solid white',
                  borderRadius: '2px',
                  cursor: 'col-resize',
                  pointerEvents: 'auto'
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const line = activeLinePos.lineEl;
                  const container = line.closest('.editor-column-container');

                  resizingRef.current = { type: 'col-drag' };

                  const handleMouseMove = (moveEvent) => {
                    moveEvent.preventDefault();
                    if (container) {
                      const containerRect = container.getBoundingClientRect();
                      const relativeX = moveEvent.clientX - containerRect.left;
                      const pct = Math.min(98, Math.max(2, (relativeX / containerRect.width) * 100));

                      const leftCol = container.querySelector('.editor-column-left');
                      const rightCol = container.querySelector('.editor-column-right');

                      if (leftCol && rightCol) {
                        leftCol.style.flex = `0 0 ${pct}%`;
                        leftCol.style.width = `${pct}%`;
                        leftCol.style.maxWidth = `${pct}%`;

                        rightCol.style.flex = `0 0 ${100 - pct}%`;
                        rightCol.style.width = `${100 - pct}%`;
                        rightCol.style.maxWidth = `${100 - pct}%`;
                      }
                    }

                    const newRect = line.getBoundingClientRect();
                    setActiveLinePos({
                      top: newRect.top,
                      left: newRect.left,
                      width: newRect.width,
                      height: newRect.height,
                      isVertical: true,
                      lineEl: line,
                      isPinned: true
                    });
                  };

                  const handleMouseUp = () => {
                    resizingRef.current = null;
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };

                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title="Drag left/right to adjust column widths"
              />
            </>
          )}
        </div>
      )}
      <div
        className="w-full max-w-4xl bg-white rounded-t-xl shadow-md border border-gray-200 p-2 flex flex-wrap items-center gap-2 sticky top-16 z-40 print:hidden"
      >

        {/* Font Controls */}
        <div className="relative flex items-center border-r border-gray-300 pr-2 mr-2 gap-1">
          {/* Font Family Dropdown */}
          <div className="relative" data-dropdown-container="font-family">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isFontDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsFontDropdownOpen(true);
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
                      closeAllDropdowns();
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
          <div className="relative flex items-center" data-dropdown-container="font-size">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isFontSizeDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsFontSizeDropdownOpen(true);
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
                      closeAllDropdowns();
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
            onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeCommand('bold'); }}
            className={`p-2 rounded transition-colors ${isBold ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Bold"
          >
            <FiBold />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeCommand('italic'); }}
            className={`p-2 rounded transition-colors ${isItalic ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Italic"
          >
            <FiItalic />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeCommand('underline'); }}
            className={`p-2 rounded transition-colors ${isUnderline ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Underline"
          >
            <FiUnderline />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 pr-2">
          {/* Font Color */}
          <div className="relative flex items-center" data-dropdown-container="font-color">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isFontColorDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsFontColorDropdownOpen(true);
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
                        closeAllDropdowns();
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
          <div className="relative flex items-center" data-dropdown-container="highlight-color">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isHighlightColorDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsHighlightColorDropdownOpen(true);
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
                      closeAllDropdowns();
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
                        closeAllDropdowns();
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
          <div className="relative flex items-center" data-dropdown-container="shading-color">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isShadingDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsShadingDropdownOpen(true);
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
                      closeAllDropdowns();
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
                        closeAllDropdowns();
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
          <div className="relative flex items-center ml-1" data-dropdown-container="border">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isBorderDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsBorderDropdownOpen(true);
              }}
              className={`p-1 px-2 rounded flex items-center justify-center gap-1 h-8 bg-gray-50 border border-transparent hover:bg-gray-100 ${activeBorder !== 'none' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              title="Borders"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2.5" y="2.5" width="11" height="11" stroke="#4B5563" strokeDasharray={activeBorder === 'none' ? '2 2' : 'none'} strokeWidth="1.5" />
                {activeBorder === 'bottom' && <path d="M2.5 13.5H13.5" stroke="#1D4ED8" strokeWidth="2.5" />}
                {activeBorder === 'top' && <path d="M2.5 2.5H13.5" stroke="#1D4ED8" strokeWidth="2.5" />}
                {activeBorder === 'left' && <path d="M2.5 2.5V13.5" stroke="#1D4ED8" strokeWidth="2.5" />}
                {activeBorder === 'right' && <path d="M13.5 2.5V13.5" stroke="#1D4ED8" strokeWidth="2.5" />}
                {activeBorder === 'all' && <rect x="2.5" y="2.5" width="11" height="11" stroke="#1D4ED8" strokeWidth="2" />}
              </svg>
              <FiChevronDown size={12} className="text-gray-500" />
            </button>

            {isBorderDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-44 flex flex-col print:hidden">
                <button
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('bottom'); closeAllDropdowns(); }}
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'bottom' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1" />
                    <path d="M2.5 13.5H13.5" stroke="#1F2937" strokeWidth="2" />
                  </svg>
                  Bottom Border
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('top'); closeAllDropdowns(); }}
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'top' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1" />
                    <path d="M2.5 2.5H13.5" stroke="#1F2937" strokeWidth="2" />
                  </svg>
                  Top Border
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('left'); closeAllDropdowns(); }}
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'left' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1" />
                    <path d="M2.5 2.5V13.5" stroke="#1F2937" strokeWidth="2" />
                  </svg>
                  Left Border
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('right'); closeAllDropdowns(); }}
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'right' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1" />
                    <path d="M13.5 2.5V13.5" stroke="#1F2937" strokeWidth="2" />
                  </svg>
                  Right Border
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('all'); closeAllDropdowns(); }}
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'all' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#1F2937" strokeWidth="2" />
                  </svg>
                  Box / All Borders
                </button>
                <div className="my-1 border-t border-gray-200"></div>
                <button
                  onMouseDown={(e) => { e.preventDefault(); executeBorderCommand('none'); closeAllDropdowns(); }}
                  className={`px-3 py-1.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2.5 ${activeBorder === 'none' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="2.5" width="11" height="11" stroke="#9CA3AF" strokeDasharray="2 2" strokeWidth="1" />
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
            onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeCommand('justifyLeft'); }}
            className={`p-2 rounded transition-colors ${isAlignLeft ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Align Left"
          >
            <FiAlignLeft />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeCommand('justifyCenter'); }}
            className={`p-2 rounded transition-colors ${isAlignCenter ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Align Center"
          >
            <FiAlignCenter />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeCommand('justifyRight'); }}
            className={`p-2 rounded transition-colors ${isAlignRight ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Align Right"
          >
            <FiAlignRight />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2 pr-2">
          {/* Bullets Dropdown */}
          <div className="relative flex items-center" data-dropdown-container="bullets-list">
            <button
              onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeListCommand('insertUnorderedList', 'disc'); }}
              className={`p-2 rounded-l transition-colors ${isUnorderedList ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Bullets"
            >
              <FiList />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = activeListDropdown === 'bullets';
                closeAllDropdowns();
                if (!wasOpen) setActiveListDropdown('bullets');
              }}
              className={`p-2 rounded-r transition-colors ${activeListDropdown === 'bullets' ? 'bg-gray-200' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronDown size={14} />
            </button>
            {activeListDropdown === 'bullets' && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-32 flex flex-col print:hidden">
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'disc'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2">Disc</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'circle'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2">Circle</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertUnorderedList', 'square'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2">Square</button>
              </div>
            )}
          </div>

          {/* Numbered Dropdown */}
          <div className="relative flex items-center" data-dropdown-container="numbered-list">
            <button
              onMouseDown={(e) => { e.preventDefault(); closeAllDropdowns(); executeListCommand('insertOrderedList', 'decimal'); }}
              className={`p-2 rounded-l transition-colors ${isOrderedList ? 'bg-blue-100 text-blue-700 shadow-inner' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Numbered List"
            >
              <span className="font-bold text-xs">1.</span>
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = activeListDropdown === 'numbered';
                closeAllDropdowns();
                if (!wasOpen) setActiveListDropdown('numbered');
              }}
              className={`p-2 rounded-r transition-colors ${activeListDropdown === 'numbered' ? 'bg-gray-200' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronDown size={14} />
            </button>
            {activeListDropdown === 'numbered' && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-lg border border-gray-200 rounded py-1 z-50 w-40 flex flex-col print:hidden">
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'decimal'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">1, 2, 3</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'upper-alpha'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">A, B, C</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'lower-alpha'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">a, b, c</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'upper-roman'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">I, II, III</button>
                <button onMouseDown={(e) => { e.preventDefault(); executeListCommand('insertOrderedList', 'lower-roman'); closeAllDropdowns(); }} className="px-4 py-2 text-left text-sm hover:bg-blue-50">i, ii, iii</button>
              </div>
            )}
          </div>
        </div>

        {/* Insert Table Grid Dropdown */}
        <div className="flex items-center border-l border-gray-300 pl-2 pr-2">
          <div className="relative flex items-center" data-dropdown-container="table">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isTableDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) {
                  setIsTableDropdownOpen(true);
                  setHoveredRows(0);
                  setHoveredCols(0);
                }
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
                            closeAllDropdowns();
                          }}
                          className={`w-5 h-5 rounded-sm border cursor-pointer transition-colors p-0 ${isHighlighted
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

        {/* Insert Image Button & Hidden File Input */}
        <div className="flex items-center border-l border-gray-300 pl-2 pr-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              closeAllDropdowns();
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                savedSelection.current = selection.getRangeAt(0);
              }
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className="p-1.5 px-2 rounded flex items-center gap-1 bg-gray-50 border border-transparent hover:bg-gray-100 text-gray-700 text-sm"
            title="Insert Image"
          >
            <FiImage size={16} className="text-gray-700" />
            <span className="text-xs font-medium">Image</span>
          </button>
        </div>

        {/* Insert Divider Line Dropdown (Horizontal & Vertical) */}
        <div className="flex items-center border-l border-gray-300 pl-2 pr-2">
          <div className="relative flex items-center" data-dropdown-container="divider">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                const wasOpen = isDividerDropdownOpen;
                closeAllDropdowns();
                if (!wasOpen) setIsDividerDropdownOpen(true);
              }}
              className={`p-1.5 px-2 rounded flex items-center gap-1 bg-gray-50 border border-transparent hover:bg-gray-100 text-gray-700 text-sm ${isDividerDropdownOpen ? 'bg-blue-100 text-blue-700 shadow-inner' : ''}`}
              title="Insert Divider Line"
            >
              <FiMinus size={16} className="text-gray-700 stroke-[3]" />
              <span className="text-xs font-medium">Divider</span>
              <FiChevronDown size={12} className="text-gray-500" />
            </button>

            {isDividerDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white shadow-xl border border-gray-200 rounded-lg p-3 z-50 w-64 flex flex-col gap-3 print:hidden">
                {/* Header */}
                <div className="text-xs font-semibold text-gray-600 border-b border-gray-100 pb-1 flex justify-between items-center">
                  <span>Insert Divider Line</span>
                </div>

                {/* Horizontal Dividers Section */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Horizontal Lines</div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('horizontal', { style: 'solid', thickness: activeLineThickness, color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="w-full p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs text-gray-700 group"
                    >
                      <span>Solid Line</span>
                      <div className="w-24 h-0 border-t-2 border-gray-700 group-hover:border-blue-600"></div>
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('horizontal', { style: 'dashed', thickness: activeLineThickness, color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="w-full p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs text-gray-700 group"
                    >
                      <span>Dashed Line</span>
                      <div className="w-24 h-0 border-t-2 border-dashed border-gray-700 group-hover:border-blue-600"></div>
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('horizontal', { style: 'dotted', thickness: activeLineThickness, color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="w-full p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs text-gray-700 group"
                    >
                      <span>Dotted Line</span>
                      <div className="w-24 h-0 border-t-2 border-dotted border-gray-700 group-hover:border-blue-600"></div>
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('horizontal', { style: 'double', color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="w-full p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs text-gray-700 group"
                    >
                      <span>Double Line</span>
                      <div className="w-24 h-1 border-t-4 border-double border-gray-700 group-hover:border-blue-600"></div>
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('horizontal', { style: 'gradient', color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="w-full p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs text-gray-700 group"
                    >
                      <span>Gradient Line</span>
                      <div className="w-24 h-1 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    </button>
                  </div>
                </div>

                {/* Vertical Dividers Section */}
                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Vertical Separators</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('vertical', { style: 'solid', height: '32px', thickness: activeLineThickness, color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-center gap-2 text-xs text-gray-700"
                    >
                      <span>Vertical Bar</span>
                      <div className="w-0 h-4 border-l-2 border-gray-700"></div>
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertDividerLine('vertical', { style: 'dashed', height: '32px', thickness: activeLineThickness, color: activeLineColor });
                        closeAllDropdowns();
                      }}
                      className="p-1.5 hover:bg-gray-50 border border-gray-200 rounded flex items-center justify-center gap-2 text-xs text-gray-700"
                    >
                      <span>Vertical Dashed</span>
                      <div className="w-0 h-4 border-l-2 border-dashed border-gray-700"></div>
                    </button>
                  </div>
                </div>

                {/* Options: Color & Thickness */}
                <div className="border-t border-gray-100 pt-2 flex flex-col gap-2">
                  {/* Color Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Line Color:</span>
                    <div className="flex items-center gap-1">
                      {['#000000', '#374151', '#2563eb', '#dc2626', '#16a34a', '#9333ea'].map((c) => (
                        <button
                          key={c}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setActiveLineColor(c);
                          }}
                          className={`w-4 h-4 rounded-full border ${activeLineColor === c ? 'ring-2 ring-blue-500 scale-110' : 'border-gray-300'}`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Thickness Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Thickness:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { label: 'Thin', val: '1px' },
                        { label: 'Med', val: '2px' },
                        { label: 'Thick', val: '4px' },
                      ].map((t) => (
                        <button
                          key={t.val}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setActiveLineThickness(t.val);
                          }}
                          className={`px-2 py-0.5 text-[11px] rounded border ${activeLineThickness === t.val ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Print / Save */}
        <div className="flex-1 flex justify-end">
          <button onClick={() => { closeAllDropdowns(); handlePrint(); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Editor Canvas (A4 Paper look) */}
      <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-2xl mt-4 print:shadow-none print:mt-0 print:border-none focus:outline-none transition-colors duration-300 flex flex-col relative">

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
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onDragOver={(e) => {
            if (draggedTableRef.current || draggedNodeRef.current) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDrop={(e) => {
            if (draggedTableRef.current || draggedNodeRef.current) {
              e.preventDefault();
              executeNodeDrop(draggedTableRef.current || draggedNodeRef.current);
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
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onClick={handleEditorCanvasClick}
          onDoubleClick={(e) => { handleEditorCanvasClick(e); handleCanvasDoubleClick(e); }}
          onDragStart={(e) => {
            if (e.target && (e.target.nodeName === 'IMG' || e.target.nodeName === 'TABLE' || e.target.closest('table'))) {
              e.preventDefault();
            }
          }}
          onDragOver={(e) => {
            if (draggedTableRef.current || draggedNodeRef.current) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDrop={(e) => {
            if (draggedTableRef.current || draggedNodeRef.current) {
              e.preventDefault();
              executeNodeDrop(draggedTableRef.current || draggedNodeRef.current);
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
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onDragOver={(e) => {
            if (draggedTableRef.current || draggedNodeRef.current) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              updateDropIndicator(e.clientX, e.clientY);
            }
          }}
          onDrop={(e) => {
            if (draggedTableRef.current || draggedNodeRef.current) {
              e.preventDefault();
              executeNodeDrop(draggedTableRef.current || draggedNodeRef.current);
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
