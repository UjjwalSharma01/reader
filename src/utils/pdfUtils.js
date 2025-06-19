// PDF reader utilities
import { base64ToArrayBuffer } from './fileUtils';

export const createPdfUrl = (base64Data) => {
  try {
    // Convert base64 back to ArrayBuffer
    const arrayBuffer = base64ToArrayBuffer(base64Data);
    // Create blob from ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    // Create object URL
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating PDF URL:', error);
    throw new Error('Failed to create PDF URL');
  }
};

export const cleanupPdfUrl = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};
