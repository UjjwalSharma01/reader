'use client';

import { Book } from 'lucide-react';

export default function BookLibraryEmpty() {
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
