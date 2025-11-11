import React, { useEffect } from 'react';

const KeyboardShortcuts = () => {
  useEffect(() => {
    const handler = (e) => {
      // Avoid typing in inputs interfering
      const tag = e.target.tagName.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (isTyping) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (window.togglePlayPause) {
          window.togglePlayPause();
        }
      } else if (e.code === 'ArrowRight') {
        if (window.skipForward) {
          window.skipForward();
        }
      } else if (e.code === 'ArrowLeft') {
        if (window.skipBackward) {
          window.skipBackward();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return null;
};

export default KeyboardShortcuts;