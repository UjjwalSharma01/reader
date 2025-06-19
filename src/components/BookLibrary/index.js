'use client';

import { useBookLibrary } from './useBookLibrary';
import BookLibraryHeader from './BookLibraryHeader';
import BookCard from './BookCard';
import BookListItem from './BookListItem';
import BookLibraryEmpty from './BookLibraryEmpty';
import BookLibraryNoResults from './BookLibraryNoResults';
import BookLibraryStats from './BookLibraryStats';
import { bookDB } from '@/utils/indexedDB';

export default function BookLibrary({ books, onBookSelect, onBookDelete, isDarkMode }) {
  const {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    selectedBook,
    setSelectedBook,
    filteredBooks,
    getBookIcon,
    formatDate
  } = useBookLibrary(books);

  const handleBookSelect = async (book) => {
    try {
      // Get the full book data from IndexedDB
      const fullBookData = await bookDB.getBook(book.id);
      if (fullBookData) {
        onBookSelect(fullBookData);
      } else {
        // Fallback to the metadata if not found in IndexedDB
        onBookSelect(book);
      }
    } catch (error) {
      console.error('Error loading book:', error);
      // Fallback to the metadata
      onBookSelect(book);
    }
  };

  const handleBookDelete = async (bookId) => {
    try {
      // Delete from IndexedDB
      await bookDB.deleteBook(bookId);
      // Delete from localStorage via parent component
      onBookDelete(bookId);
    } catch (error) {
      console.error('Error deleting book:', error);
      // Still delete from localStorage even if IndexedDB deletion fails
      onBookDelete(bookId);
    }
  };

  if (books.length === 0) {
    return <BookLibraryEmpty />;
  }

  return (
    <div className="space-y-6">
      <BookLibraryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {filteredBooks.length === 0 ? (
        <BookLibraryNoResults />
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredBooks.map((book) => (
            viewMode === 'grid' ? (
              <BookCard 
                key={book.id} 
                book={book}
                onBookSelect={handleBookSelect}
                onBookDelete={handleBookDelete}
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                getBookIcon={getBookIcon}
                formatDate={formatDate}
              />
            ) : (
              <BookListItem 
                key={book.id} 
                book={book}
                onBookSelect={handleBookSelect}
                onBookDelete={handleBookDelete}
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                getBookIcon={getBookIcon}
                formatDate={formatDate}
              />
            )
          ))}
        </div>
      )}
      
      <BookLibraryStats 
        filteredCount={filteredBooks.length}
        totalCount={books.length}
      />
    </div>
  );
}
