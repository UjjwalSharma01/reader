'use client';

import { useState } from 'react';
import { 
  Book, 
  FileText, 
  File, 
  MoreVertical, 
  Trash2, 
  Calendar,
  HardDrive,
  Search,
  Grid3X3,
  List as ListIcon
} from 'lucide-react';

export default function BookLibrary({ books, onBookSelect, onBookDelete, isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'author', 'addedDate'
  const [selectedBook, setSelectedBook] = useState(null);

  const getBookIcon = (format) => {
    switch (format) {
      case 'EPUB':
        return Book;
      case 'PDF':
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const BookCard = ({ book }) => {
    const IconComponent = getBookIcon(book.format);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
  };

  const BookListItem = ({ book }) => {
    const IconComponent = getBookIcon(book.format);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {book.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
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
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <Book className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No books in your library
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Start building your digital library by adding your first book.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="addedDate">Sort by Date Added</option>
          </select>
          
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-8">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No books found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredBooks.map((book) => (
            viewMode === 'grid' ? (
              <BookCard key={book.id} book={book} />
            ) : (
              <BookListItem key={book.id} book={book} />
            )
          ))}
        </div>
      )}
      
      {/* Stats */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
}
