'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Book, File } from 'lucide-react';

export default function BookUploader({ onUpload, onClose, isDarkMode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = {
    'application/epub+zip': { name: 'EPUB', icon: Book },
    'application/pdf': { name: 'PDF', icon: FileText },
    'text/plain': { name: 'TXT', icon: File },
    'text/html': { name: 'HTML', icon: File },
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setIsUploading(true);
    
    for (const file of files) {
      if (isFileSupported(file)) {
        try {
          const book = await processFile(file);
          onUpload(book);
        } catch (error) {
          console.error('Error processing file:', error);
          alert(`Error processing file ${file.name}: ${error.message}`);
        }
      } else {
        alert(`File format not supported: ${file.name}`);
      }
    }
    
    setIsUploading(false);
  };

  const isFileSupported = (file) => {
    return Object.keys(supportedFormats).includes(file.type) || 
           file.name.toLowerCase().endsWith('.epub') ||
           file.name.toLowerCase().endsWith('.txt') ||
           file.name.toLowerCase().endsWith('.pdf');
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const fileData = e.target.result;
        
        // Create book object
        const book = {
          id: Date.now() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          author: 'Unknown Author',
          format: getFileFormat(file),
          size: file.size,
          addedDate: new Date().toISOString(),
          data: fileData,
          fileName: file.name,
          lastRead: null,
          progress: 0,
          bookmarks: [],
          highlights: [],
          notes: []
        };
        
        resolve(book);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const getFileFormat = (file) => {
    if (file.type === 'application/epub+zip' || file.name.toLowerCase().endsWith('.epub')) {
      return 'EPUB';
    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return 'PDF';
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      return 'TXT';
    } else {
      return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full ${
        isDarkMode ? 'dark' : ''
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add New Book
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Drop files here
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Choose Files'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".epub,.pdf,.txt,.html"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Supported Formats:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(supportedFormats).map(([type, { name, icon: Icon }]) => (
              <div
                key={type}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
