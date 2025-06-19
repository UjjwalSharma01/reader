'use client';

import { MoreVertical, Trash2 } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';

export default function BookListItem({ 
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 flex items-center space-x-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        
        <div className="flex-1 min-w-0 max-w-md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {book.author} • {book.format} • {formatFileSize(book.size)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Added {formatDate(book.addedDate)}
          </p>
        </div>
        
        {book.progress > 0 && (
          <div className="text-right">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {Math.round(book.progress)}%
            </p>
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
              <div 
                className="h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onBookSelect(book)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
          >
            Open
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBook(selectedBook === book.id ? null : book.id);
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        
        {selectedBook === book.id && (
          <div className="absolute right-4 mt-8 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
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
  );
}
