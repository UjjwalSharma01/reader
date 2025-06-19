'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Settings, 
  Bookmark,
  Type,
  Palette,
  Sun,
  Moon,
  Plus,
  Minus,
  List,
  Search
} from 'lucide-react';

export default function BookReader({ book, onClose, isDarkMode }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookContent, setBookContent] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 1.6,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    theme: 'light'
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (book) {
      loadBook();
      loadBookmarks();
      loadReaderSettings();
    }
  }, [book]);

  const loadBook = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (book.format === 'EPUB') {
        await loadEpubBook();
      } else if (book.format === 'PDF') {
        await loadPdfBook();
      } else if (book.format === 'TXT') {
        await loadTextBook();
      } else {
        throw new Error('Unsupported book format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpubBook = async () => {
    try {
      // For now, we'll show a placeholder until we implement full EPUB support
      setBookContent(`
        <div class="epub-content">
          <h1>${book.title}</h1>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Format:</strong> ${book.format}</p>
          <div class="book-placeholder">
            <p>EPUB reader functionality is being implemented.</p>
            <p>This is a placeholder for the book content.</p>
            <p>The book file "${book.fileName}" has been successfully loaded.</p>
            <p>Full EPUB rendering will be available in the next update.</p>
          </div>
        </div>
      `);
      setTotalPages(1);
    } catch (error) {
      throw new Error('Failed to load EPUB file');
    }
  };

  const loadPdfBook = async () => {
    try {
      // PDF loading placeholder
      setBookContent(`
        <div class="pdf-content">
          <h1>${book.title}</h1>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Format:</strong> ${book.format}</p>
          <div class="book-placeholder">
            <p>PDF reader functionality is being implemented.</p>
            <p>This is a placeholder for the PDF content.</p>
            <p>The PDF file "${book.fileName}" has been successfully loaded.</p>
            <p>Full PDF rendering will be available in the next update.</p>
          </div>
        </div>
      `);
      setTotalPages(1);
    } catch (error) {
      throw new Error('Failed to load PDF file');
    }
  };

  const loadTextBook = async () => {
    try {
      const decoder = new TextDecoder();
      const textContent = decoder.decode(book.data);
      
      // Split text into pages (approximately 1000 characters per page)
      const wordsPerPage = 500;
      const words = textContent.split(/\s+/);
      const pages = [];
      
      for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageWords = words.slice(i, i + wordsPerPage);
        pages.push(pageWords.join(' '));
      }
      
      setBookContent(textContent);
      setTotalPages(Math.max(1, pages.length));
    } catch (error) {
      throw new Error('Failed to load text file');
    }
  };

  const loadBookmarks = () => {
    const saved = localStorage.getItem(`bookmarks-${book.id}`);
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

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

  const addBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      page: currentPage,
      timestamp: new Date().toISOString(),
      note: `Page ${currentPage + 1}`
    };
    
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks-${book.id}`, JSON.stringify(updatedBookmarks));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContent = () => {
    if (book.format === 'TXT') {
      const wordsPerPage = 500;
      const words = bookContent.split(/\s+/);
      const startIndex = currentPage * wordsPerPage;
      const endIndex = startIndex + wordsPerPage;
      const pageContent = words.slice(startIndex, endIndex).join(' ');
      
      return (
        <div 
          className="prose max-w-none text-justify leading-relaxed"
          style={{
            fontSize: `${readerSettings.fontSize}px`,
            fontFamily: readerSettings.fontFamily,
            lineHeight: readerSettings.lineHeight,
            color: readerSettings.textColor
          }}
        >
          <pre className="whitespace-pre-wrap font-sans">{pageContent}</pre>
        </div>
      );
    }
    
    return (
      <div 
        className="prose max-w-none"
        style={{
          fontSize: `${readerSettings.fontSize}px`,
          fontFamily: readerSettings.fontFamily,
          lineHeight: readerSettings.lineHeight,
          color: readerSettings.textColor
        }}
        dangerouslySetInnerHTML={{ __html: bookContent }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-blue-600 animate-pulse mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BookOpen className="mx-auto h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Book
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: readerSettings.backgroundColor }}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {book.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {book.author}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={addBookmark}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div ref={contentRef}>
              {renderContent()}
            </div>
          </div>
        </main>

        {/* Settings Sidebar */}
        {showSettings && (
          <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Reading Settings
            </h3>
            
            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => saveReaderSettings({
                    ...readerSettings,
                    fontSize: Math.max(12, readerSettings.fontSize - 2)
                  })}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
                  {readerSettings.fontSize}px
                </span>
                <button
                  onClick={() => saveReaderSettings({
                    ...readerSettings,
                    fontSize: Math.min(24, readerSettings.fontSize + 2)
                  })}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <select
                value={readerSettings.fontFamily}
                onChange={(e) => saveReaderSettings({
                  ...readerSettings,
                  fontFamily: e.target.value
                })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 text-sm"
              >
                <option value="Inter">Inter</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>

            {/* Bookmarks */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Bookmarks ({bookmarks.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-auto">
                {bookmarks.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    onClick={() => goToPage(bookmark.page)}
                    className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {bookmark.note}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(bookmark.timestamp).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
