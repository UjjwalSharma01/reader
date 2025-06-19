// Text reader utilities
import { base64ToArrayBuffer } from './fileUtils';

export const loadTextContent = (base64Data) => {
  try {
    // Convert base64 back to ArrayBuffer
    const arrayBuffer = base64ToArrayBuffer(base64Data);
    // Decode as text
    const decoder = new TextDecoder();
    return decoder.decode(arrayBuffer);
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
