'use client';

import { ArrowLeft, Bookmark, Settings } from 'lucide-react';

export default function BookReaderHeader({ book, onClose, onAddBookmark, showSettings, onToggleSettings }) {
  return (
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
          onClick={onAddBookmark}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={onToggleSettings}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
}
