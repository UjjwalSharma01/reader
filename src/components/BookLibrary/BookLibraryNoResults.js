'use client';

import { Search } from 'lucide-react';

export default function BookLibraryNoResults() {
  return (
    <div className="text-center py-8">
      <Search className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        No books found
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Try adjusting your search terms.
      </p>
    </div>
  );
}
