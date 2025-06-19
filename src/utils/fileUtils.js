// File processing utilities

export const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const getFileFormat = (file) => {
  if (file.type === 'application/epub+zip' || file.name.toLowerCase().endsWith('.epub')) {
    return 'EPUB';
  } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return 'PDF';
  } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
    return 'TXT';
  } else {
    return 'Unknown';
  }
};

export const isFileSupported = (file) => {
  const supportedTypes = [
    'application/epub+zip',
    'application/pdf', 
    'text/plain',
    'text/html'
  ];
  
  const supportedExtensions = ['.epub', '.pdf', '.txt', '.html'];
  
  return supportedTypes.includes(file.type) || 
         supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const processFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const fileData = e.target.result;
      
      // Convert ArrayBuffer to base64 for localStorage compatibility
      const base64Data = arrayBufferToBase64(fileData);
      
      // Create book object
      const book = {
        id: Date.now() + Math.random(),
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        author: 'Unknown Author',
        format: getFileFormat(file),
        size: file.size,
        addedDate: new Date().toISOString(),
        data: base64Data, // Store as base64 string
        fileName: file.name,
        lastRead: null,
        progress: 0,
        bookmarks: [],
        highlights: [],
        notes: []
      };
      
      resolve(book);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};
