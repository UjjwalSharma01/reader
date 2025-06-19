'use client';

import { useState } from 'react';

export function useNavigation(totalPages) {
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(0);
  };

  return {
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    resetPage
  };
}
