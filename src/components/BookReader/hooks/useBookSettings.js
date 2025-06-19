'use client';

import { useState, useEffect } from 'react';

export function useBookSettings() {
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 1.6,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    theme: 'light'
  });

  const loadReaderSettings = () => {
    const saved = localStorage.getItem('reader-settings');
    if (saved) {
      setReaderSettings(JSON.parse(saved));
    }
  };

  const saveReaderSettings = (settings) => {
    setReaderSettings(settings);
    localStorage.setItem('reader-settings', JSON.stringify(settings));
  };

  useEffect(() => {
    loadReaderSettings();
  }, []);

  return {
    readerSettings,
    saveReaderSettings
  };
}
