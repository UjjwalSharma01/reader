'use client';

import { BookOpen } from 'lucide-react';

export default function BookReaderError({ error, onClose }) {
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
