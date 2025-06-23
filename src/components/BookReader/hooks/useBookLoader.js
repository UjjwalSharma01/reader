'use client';

import { useState, useEffect } from 'react';
import { createPdfUrl, cleanupPdfUrl } from '@/utils/pdfUtils';
import { loadTextContent, splitTextIntoPages } from '@/utils/textUtils';
import { loadEpubContent } from '@/utils/epubUtils';
import { bookDB } from '@/utils/indexedDB';

export function useBookLoader(book) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookContent, setBookContent] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [textPages, setTextPages] = useState([]);
  const [epubData, setEpubData] = useState(null);

  // Cleanup PDF URL on component unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        cleanupPdfUrl(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (book) {
      loadBook();
    }
  }, [book]);

  const loadBook = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If book doesn't have data property, try to load it from IndexedDB
      let bookData = book;
      if (!book.data) {
        const fullBookData = await bookDB.getBook(book.id);
        if (fullBookData) {
          bookData = fullBookData;
        } else {
          throw new Error('Book data not found');
        }
      }

      if (bookData.format === 'EPUB') {
        await loadEpubBook(bookData);
      } else if (bookData.format === 'PDF') {
        await loadPdfBook(bookData);
      } else if (bookData.format === 'TXT') {
        await loadTextBook(bookData);
      } else {
        throw new Error('Unsupported book format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpubBook = async (bookData) => {
    try {
      console.log('Loading EPUB book:', bookData.title);
      console.log('Book data type:', typeof bookData.data);
      console.log('Book data instanceof ArrayBuffer:', bookData.data instanceof ArrayBuffer);
      
      if (!bookData.data) {
        throw new Error('No book data found');
      }
      
      const epubContent = await loadEpubContent(bookData.data);
      console.log('EPUB content loaded successfully:', epubContent);
      
      setEpubData(epubContent);
      setBookContent(''); // Clear HTML content for EPUB
      setTotalPages(epubContent.totalPages);
    } catch (error) {
      console.error('EPUB loading error:', error);
      throw new Error('Failed to load EPUB file: ' + error.message);
    }
  };

  const loadPdfBook = async (bookData) => {
    try {
      // Clean up any existing PDF URL
      if (pdfUrl) {
        cleanupPdfUrl(pdfUrl);
      }
      
      // Create PDF URL from ArrayBuffer data
      const url = createPdfUrl(bookData.data);
      setPdfUrl(url);
      setBookContent('');
      setTotalPages(1); // Will be updated by the PDF viewer
      setIsLoading(false);
    } catch (error) {
      console.error('PDF loading error:', error);
      throw new Error('Failed to load PDF file: ' + error.message);
    }
  };

  const loadTextBook = async (bookData) => {
    try {
      // Load text content from ArrayBuffer data
      const textContent = loadTextContent(bookData.data);
      
      // Split text into pages
      const pages = splitTextIntoPages(textContent, 500);
      
      setBookContent(textContent);
      setTextPages(pages);
      setTotalPages(Math.max(1, pages.length));
    } catch (error) {
      console.error('Text loading error:', error);
      throw new Error('Failed to load text file: ' + error.message);
    }
  };

  return {
    isLoading,
    error,
    bookContent,
    totalPages,
    pdfUrl,
    textPages,
    epubData
  };
}
