'use client';

import { useState, useEffect } from 'react';

export function useBookmarks(bookId) {
  const [bookmarks, setBookmarks] = useState([]);

  const loadBookmarks = () => {
    if (!bookId) return;
    const saved = localStorage.getItem(`bookmarks-${bookId}`);
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

  const addBookmark = (currentPage) => {
    const newBookmark = {
      id: Date.now(),
      page: currentPage,
      timestamp: new Date().toISOString(),
      note: `Page ${currentPage + 1}`
    };
    
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(updatedBookmarks));
  };

  const removeBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks-${bookId}`, JSON.stringify(updatedBookmarks));
  };

  useEffect(() => {
    loadBookmarks();
  }, [bookId]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark
  };
}
