'use client';

import { useState, useEffect } from 'react';
import { createPdfUrl, cleanupPdfUrl } from '@/utils/pdfUtils';
import { loadTextContent, splitTextIntoPages } from '@/utils/textUtils';

export function useBookLoader(book) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookContent, setBookContent] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [textPages, setTextPages] = useState([]);

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
      if (book.format === 'EPUB') {
        await loadEpubBook();
      } else if (book.format === 'PDF') {
        await loadPdfBook();
      } else if (book.format === 'TXT') {
        await loadTextBook();
      } else {
        throw new Error('Unsupported book format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpubBook = async () => {
    try {
      // For now, we'll show a placeholder until we implement full EPUB support
      setBookContent(`
        <div class="epub-content">
          <h1>${book.title}</h1>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Format:</strong> ${book.format}</p>
          <div class="book-placeholder">
            <p>EPUB reader functionality is being implemented.</p>
            <p>This is a placeholder for the book content.</p>
            <p>The book file "${book.fileName}" has been successfully loaded.</p>
            <p>Full EPUB rendering will be available in the next update.</p>
          </div>
        </div>
      `);
      setTotalPages(1);
    } catch (error) {
      throw new Error('Failed to load EPUB file');
    }
  };

  const loadPdfBook = async () => {
    try {
      // Clean up any existing PDF URL
      if (pdfUrl) {
        cleanupPdfUrl(pdfUrl);
      }
      
      // Create PDF URL from base64 data
      const url = createPdfUrl(book.data);
      setPdfUrl(url);
      setBookContent('');
      setTotalPages(1); // Will be updated by the PDF viewer
      setIsLoading(false);
    } catch (error) {
      console.error('PDF loading error:', error);
      throw new Error('Failed to load PDF file: ' + error.message);
    }
  };

  const loadTextBook = async () => {
    try {
      // Load text content from base64 data
      const textContent = loadTextContent(book.data);
      
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
    textPages
  };
}
