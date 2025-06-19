'use client';

import { MoreVertical, Trash2, Calendar, HardDrive } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';

export default function BookCard({ 
  book, 
  onBookSelect, 
  onBookDelete, 
  selectedBook, 
  setSelectedBook,
  getBookIcon,
  formatDate
}) {
  const IconComponent = getBookIcon(book.format);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0 max-w-[200px]">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={book.title}>
                {book.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={book.author}>
                {book.author}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBook(selectedBook === book.id ? null : book.id);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
            {selectedBook === book.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookDelete(book.id);
                    setSelectedBook(null);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Added {formatDate(book.addedDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <HardDrive className="h-3 w-3" />
            <span>{formatFileSize(book.size)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              {book.format}
            </span>
            {book.progress > 0 && (
              <span className="text-blue-600 dark:text-blue-400">
                {Math.round(book.progress)}% read
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onBookSelect(book)}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Open Book
        </button>
      </div>
    </div>
  );
}
