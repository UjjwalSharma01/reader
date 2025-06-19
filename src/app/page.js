'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Library, 
  Search, 
  Settings, 
  Moon, 
  Sun,
  Plus,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';
import BookUploader from '@/components/BookUploader';
import BookLibrary from '@/components/BookLibrary';
import BookReader from '@/components/BookReader';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const [activeTab, setActiveTab] = useState('library');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);
  const [books, setBooks] = useLocalStorage('books', () => []);
  const [currentBook, setCurrentBook] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleBookUpload = (newBook) => {
    setBooks(prev => [...prev, newBook]);
    setShowUploader(false);
  };

  const handleBookSelect = (book) => {
    setCurrentBook(book);
    setIsReading(true);
  };

  const handleCloseReader = () => {
    setIsReading(false);
    setCurrentBook(null);
  };

  if (isReading && currentBook) {
    return (
      <BookReader 
        book={currentBook} 
        onClose={handleCloseReader}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                BookVault
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploader(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Book</span>
              </button>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'library', label: 'Library', icon: Library },
              { id: 'search', label: 'Search', icon: Search },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'library' && (
          <BookLibrary 
            books={books}
            onBookSelect={handleBookSelect}
            onBookDelete={(bookId) => setBooks(prev => prev.filter(b => b.id !== bookId))}
            isDarkMode={isDarkMode}
          />
        )}
        
        {activeTab === 'search' && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Search Feature
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Search through your book collection (Coming Soon)
            </p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Settings
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Customize your reading experience (Coming Soon)
            </p>
          </div>
        )}
      </main>

      {/* Book Uploader Modal */}
      {showUploader && (
        <BookUploader 
          onUpload={handleBookUpload}
          onClose={() => setShowUploader(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
