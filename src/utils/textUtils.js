// Text reader utilities
import { base64ToArrayBuffer } from './fileUtils';

export const loadTextContent = (data) => {
  try {
    // Handle both ArrayBuffer and base64 data
    if (data instanceof ArrayBuffer) {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(data);
    } else if (typeof data === 'string') {
      // Convert base64 back to ArrayBuffer first
      const arrayBuffer = base64ToArrayBuffer(data);
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(arrayBuffer);
    } else {
      throw new Error('Unsupported data format');
    }
  } catch (error) {
    console.error('Error loading text content:', error);
    throw new Error('Failed to load text content');
  }
};

export const splitTextIntoPages = (textContent, wordsPerPage = 500) => {
  const words = textContent.split(/\s+/);
  const pages = [];
  
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);
    pages.push(pageWords.join(' '));
  }
  
  return pages;
};