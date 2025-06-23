'use client';

import { useBookReader } from './useBookReader';
import BookReaderHeader from './BookReaderHeader';
import BookReaderContent from './BookReaderContent';
import BookReaderSettings from './BookReaderSettings';
import BookReaderFooter from './BookReaderFooter';
import BookReaderLoading from './BookReaderLoading';
import BookReaderError from './BookReaderError';

export default function BookReader({ book, onClose, isDarkMode }) {
  const {
    currentPage,
    totalPages,
    bookContent,
    showSettings,
    readerSettings,
    bookmarks,
    isLoading,
    error,
    pdfUrl,
    textPages,
    epubData,
    contentRef,
    setShowSettings,
    saveReaderSettings,
    addBookmark,
    goToPage,
    nextPage,
    prevPage
  } = useBookReader(book);

  if (isLoading) {
    return <BookReaderLoading />;
  }

  if (error) {
    return <BookReaderError error={error} onClose={onClose} />;
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900"
      style={{ backgroundColor: readerSettings.backgroundColor }}
    >
      <BookReaderHeader
        book={book}
        onClose={onClose}
        onAddBookmark={addBookmark}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <BookReaderContent
          book={book}
          pdfUrl={pdfUrl}
          textPages={textPages}
          currentPage={currentPage}
          bookContent={bookContent}
          epubData={epubData}
          readerSettings={readerSettings}
          contentRef={contentRef}
          onAddBookmark={addBookmark}
          onPageChange={(location) => {
            // Handle EPUB page changes if needed
          }}
        />

        {showSettings && (
          <BookReaderSettings
            readerSettings={readerSettings}
            bookmarks={bookmarks}
            onSaveSettings={saveReaderSettings}
            onGoToPage={goToPage}
          />
        )}
      </div>

      <BookReaderFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={prevPage}
        onNextPage={nextPage}
      />
    </div>
  );
}
