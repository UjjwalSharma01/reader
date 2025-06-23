'use client';

import { useState, useRef } from 'react';
import { useBookLoader } from './hooks/useBookLoader';
import { useBookSettings } from './hooks/useBookSettings';
import { useBookmarks } from './hooks/useBookmarks';
import { useNavigation } from './hooks/useNavigation';

export function useBookReader(book) {
  const [showSettings, setShowSettings] = useState(false);
  const contentRef = useRef(null);

  // Use specialized hooks for different concerns
  const {
    isLoading,
    error,
    bookContent,
    totalPages,
    pdfUrl,
    textPages,
    epubData
  } = useBookLoader(book);

  const {
    readerSettings,
    saveReaderSettings
  } = useBookSettings();

  const {
    bookmarks,
    addBookmark
  } = useBookmarks(book?.id);

  const {
    currentPage,
    goToPage,
    nextPage,
    prevPage
  } = useNavigation(totalPages);

  return {
    // State
    currentPage,
    totalPages,
    bookContent,
    showSettings,
    readerSettings,
    bookmarks,
    isLoading,
    error,
    pdfUrl,
    textPages,
    epubData,
    contentRef,
    
    // Actions
    setShowSettings,
    saveReaderSettings,
    addBookmark: () => addBookmark(currentPage),
    goToPage,
    nextPage,
    prevPage
  };
}
