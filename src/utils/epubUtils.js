// EPUB reader utilities using epub.js

export const loadEpubContent = async (data) => {
  try {
    console.log('Loading EPUB content, data type:', typeof data);
    console.log('Data instanceof ArrayBuffer:', data instanceof ArrayBuffer);
    
    // Dynamic import of epub.js to avoid SSR issues
    const ePub = (await import('epubjs')).default;
    
    // Handle both ArrayBuffer and base64 data
    let arrayBuffer;
    if (data instanceof ArrayBuffer) {
      arrayBuffer = data;
      console.log('Using ArrayBuffer directly, size:', arrayBuffer.byteLength);
    } else if (typeof data === 'string') {
      console.log('Converting base64 to ArrayBuffer, length:', data.length);
      // Convert base64 to ArrayBuffer
      const binaryString = atob(data);
      arrayBuffer = new ArrayBuffer(binaryString.length);
      const bytes = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log('Converted to ArrayBuffer, size:', arrayBuffer.byteLength);
    } else {
      throw new Error('Unsupported data format');
    }

    console.log('Creating EPUB book instance...');
    // Create EPUB book instance
    const book = ePub(arrayBuffer);
    
    console.log('Waiting for book to be ready...');
    // Wait for the book to be fully loaded and parsed
    await book.ready;
    
    console.log('Book ready, checking package...');
    // Ensure the book has been opened properly
    if (!book.package) {
      throw new Error('Failed to parse EPUB file - invalid format');
    }
    
    console.log('Book package found, loading metadata...');
    const metadata = await book.loaded.metadata;
    const spine = await book.loaded.spine;
    
    // Get table of contents
    const toc = await book.loaded.navigation;
    
    return {
      book,
      metadata: {
        title: metadata.title || 'Unknown Title',
        author: metadata.creator || 'Unknown Author',
        description: metadata.description || '',
        publisher: metadata.publisher || '',
        language: metadata.language || 'en',
        rights: metadata.rights || '',
        identifier: metadata.identifier || ''
      },
      spine,
      toc: toc.toc || [],
      totalPages: spine.length
    };
  } catch (error) {
    console.error('Error loading EPUB content:', error);
    throw new Error('Failed to load EPUB content: ' + error.message);
  }
};

// Simplified EPUB content extraction
export const extractEpubChapters = async (book) => {
  try {
    console.log('Extracting EPUB chapters...');
    
    if (!book || !book.spine) {
      throw new Error('Invalid book or spine not available');
    }

    const chapters = [];
    const spine = book.spine;
    
    console.log('Found', spine.spineItems.length, 'spine items');
    
    for (let i = 0; i < spine.spineItems.length; i++) {
      const item = spine.spineItems[i];
      try {
        const section = book.section(item.href);
        const content = await section.load(book.load.bind(book));
        
        // Parse the content
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'application/xhtml+xml');
        
        // Extract readable content
        const body = doc.querySelector('body');
        if (body) {
          // Clean up the HTML
          const cleanContent = body.innerHTML
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<style[^>]*>.*?<\/style>/gi, '')
            .replace(/style="[^"]*"/gi, '')
            .replace(/class="[^"]*"/gi, '');
          
          chapters.push({
            index: i,
            href: item.href,
            title: `Chapter ${i + 1}`,
            content: cleanContent
          });
        }
      } catch (err) {
        console.error(`Error loading chapter ${i}:`, err);
        // Add placeholder for failed chapters
        chapters.push({
          index: i,
          href: item.href,
          title: `Chapter ${i + 1}`,
          content: '<p>Failed to load chapter content</p>'
        });
      }
    }
    
    console.log('Successfully extracted', chapters.length, 'chapters');
    return chapters;
  } catch (error) {
    console.error('Error extracting EPUB chapters:', error);
    throw new Error('Failed to extract EPUB chapters');
  }
};
