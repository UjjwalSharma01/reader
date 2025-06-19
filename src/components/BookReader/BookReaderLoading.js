'use client';

import { BookOpen } from 'lucide-react';

export default function BookReaderLoading() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-blue-600 animate-pulse mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading book...</p>
      </div>
    </div>
  );
}
