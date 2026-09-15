import React, { useRef, useEffect } from 'react';

const EditableField = ({ value, onSave, className, placeholder = 'Type here...', multiline = false }) => {
  const contentEditableRef = useRef(null);

  // Sync external value changes into the contentEditable (only if not currently focused to avoid cursor jumping)
  useEffect(() => {
    if (contentEditableRef.current && document.activeElement !== contentEditableRef.current) {
      contentEditableRef.current.innerText = value || '';
    }
  }, [value]);

  const handleInput = (e) => {
    // Optionally trigger live update on every keystroke
    onSave(e.currentTarget.innerText);
  };

  const handleBlur = (e) => {
    // Ensure final state is saved on blur
    onSave(e.currentTarget.innerText);
  };

  return (
    <span
      ref={contentEditableRef}
      className={`outline-none hover:bg-blue-500/10 focus:bg-blue-500/10 focus:ring-2 focus:ring-blue-400 rounded transition-colors cursor-text whitespace-pre-wrap empty:before:content-[attr(placeholder)] empty:before:text-gray-400 ${className || ''}`}
      style={{
        // Prevent text (especially descenders: g, p, y, j and ascenders: l, h, d) from being
        // visually clipped by parent containers that use overflow:hidden.
        // overflow:visible ensures html2canvas captures the full glyph bounding box.
        overflow: 'visible',
        // Break long URLs (LinkedIn, GitHub, portfolio) so they wrap instead of overflow
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        // Ensure the line box is at least tall enough for a full line of text
        minHeight: '1em',
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
};

export default EditableField;

