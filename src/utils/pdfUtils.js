// PDF reader utilities
import { base64ToArrayBuffer } from './fileUtils';

export const createPdfUrl = (data) => {
  try {
    // Handle both ArrayBuffer and base64 data
    let arrayBuffer;
    if (data instanceof ArrayBuffer) {
      arrayBuffer = data;
    } else if (typeof data === 'string') {
      // Convert base64 back to ArrayBuffer
      arrayBuffer = base64ToArrayBuffer(data);
    } else {
      throw new Error('Unsupported data format');
    }
    
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
