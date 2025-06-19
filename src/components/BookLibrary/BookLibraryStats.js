'use client';

export default function BookLibraryStats({ filteredCount, totalCount }) {
  return (
    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
      Showing {filteredCount} of {totalCount} books
    </div>
  );
}
