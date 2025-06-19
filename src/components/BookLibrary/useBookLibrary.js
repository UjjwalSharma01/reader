'use client';

import { useState } from 'react';

export function useBookLibrary(books) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'author', 'addedDate'
  const [selectedBook, setSelectedBook] = useState(null);

  const getBookIcon = (format) => {
    const { Book, FileText, File } = require('lucide-react');
    switch (format) {
      case 'EPUB':
        return Book;
      case 'PDF':
        return FileText;
      default:
        return File;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'addedDate':
          return new Date(b.addedDate) - new Date(a.addedDate);
        default:
          return 0;
      }
    });

  return {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    selectedBook,
    setSelectedBook,
    filteredBooks,
    getBookIcon,
    formatDate
  };
}
