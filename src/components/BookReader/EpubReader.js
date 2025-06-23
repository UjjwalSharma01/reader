'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Safe content renderer component
function ContentRenderer({ content }) {
  const [safeContent, setSafeContent] = useState('');
  const [renderAsText, setRenderAsText] = useState(false);

  useEffect(() => {
    try {
      // Try to validate the HTML first
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      // Check for parser errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        console.warn('HTML parsing failed, rendering as text');
        setRenderAsText(true);
        // Extract text content only and format it nicely
        const textContent = content.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
        const formattedText = textContent
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n\n');
        setSafeContent(formattedText);
      } else {
        setRenderAsText(false);
        setSafeContent(content);
      }
    } catch (error) {
      console.warn('Content validation failed, rendering as text:', error);
      setRenderAsText(true);
      const textContent = content.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
      const formattedText = textContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n');
      setSafeContent(formattedText);
    }
  }, [content]);

  if (renderAsText) {
    return (
      <div className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100">
        <div 
          className="whitespace-pre-wrap leading-relaxed"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            lineHeight: '1.8',
            textAlign: 'justify'
          }}
        >
          {safeContent}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100 dark:prose-invert"
      style={{
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        lineHeight: '1.8'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: safeContent }}
        className="epub-content [&>*]:!text-inherit [&>p]:mb-4 [&>p]:text-justify [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:dark:border-gray-600 [&>blockquote]:pl-4 [&>blockquote]:my-6 [&>blockquote]:italic [&>ul]:my-4 [&>ul]:pl-8 [&>ol]:my-4 [&>ol]:pl-8 [&>li]:mb-2 [&>em]:italic [&>strong]:font-bold"
      />
    </div>
  );
}

export default function EpubReader({ epubData, onNavigate, currentLocation }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (!epubData || !epubData.book) return;

    const loadEpubContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading EPUB chapters...');
        const book = epubData.book;
        const spine = book.spine;
        
        if (!spine || !spine.spineItems) {
          throw new Error('No spine items found in EPUB');
        }

        console.log('Found', spine.spineItems.length, 'chapters');
        
        // Load all chapters
        const chapterPromises = spine.spineItems.map(async (item, index) => {
          try {
            const section = book.section(item.href);
            const content = await section.load(book.load.bind(book));
            
            console.log(`Loading chapter ${index + 1}, content type:`, typeof content);
            
            let htmlContent = '';
            
            // Handle different content types
            if (typeof content === 'string') {
              htmlContent = content;
            } else if (content instanceof Document) {
              htmlContent = content.documentElement.outerHTML;
            } else if (content && content.outerHTML) {
              htmlContent = content.outerHTML;
            } else if (content && content.innerHTML) {
              htmlContent = content.innerHTML;
            } else {
              throw new Error('Unsupported content format');
            }
            
            // Ensure we have valid HTML
            if (!htmlContent || typeof htmlContent !== 'string') {
              throw new Error('No valid HTML content found');
            }
            
            // Parse and clean the HTML content
            let cleanedHTML = '';
            try {
              const parser = new DOMParser();
              const doc = parser.parseFromString(htmlContent, 'application/xhtml+xml');
              
              // Check for parsing errors
              const parserError = doc.querySelector('parsererror');
              if (parserError) {
                console.warn(`Parser error in chapter ${index + 1}, trying as HTML...`);
                // Try parsing as regular HTML instead
                const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
                const bodyContent = htmlDoc.querySelector('body') || htmlDoc.documentElement;
                cleanedHTML = bodyContent ? bodyContent.innerHTML : htmlContent;
              } else {
                const bodyContent = doc.querySelector('body') || doc.documentElement;
                if (bodyContent) {
                  cleanedHTML = bodyContent.innerHTML;
                } else {
                  cleanedHTML = htmlContent;
                }
              }
              
              // Clean up the HTML
              cleanedHTML = cleanedHTML
                .replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<style[^>]*>.*?<\/style>/gi, '')
                .replace(/style="[^"]*"/gi, '')
                .replace(/class="[^"]*"/gi, '')
                .replace(/xmlns[^=]*="[^"]*"/gi, '')
                .replace(/color:\s*[^;]*;?/gi, '') // Remove color styles
                .replace(/background[^;]*;?/gi, '') // Remove background styles
                .replace(/font-family[^;]*;?/gi, '') // Remove font-family styles
                .trim();
              
              // Ensure proper paragraph formatting
              if (cleanedHTML && !cleanedHTML.includes('<p>') && !cleanedHTML.includes('<h')) {
                // If no paragraphs, split by double line breaks
                const paragraphs = cleanedHTML.split(/\n\s*\n/).filter(p => p.trim().length > 0);
                cleanedHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n');
              }
              
              // If still no content, use the raw content
              if (!cleanedHTML) {
                cleanedHTML = htmlContent.replace(/<[^>]*>/g, ''); // Strip all tags as fallback
              }
              
            } catch (parseError) {
              console.warn(`Failed to parse chapter ${index + 1} as XML/HTML:`, parseError);
              // Use raw content with basic cleaning
              cleanedHTML = htmlContent
                .replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<style[^>]*>.*?<\/style>/gi, '')
                .replace(/style="[^"]*"/gi, '')
                .replace(/class="[^"]*"/gi, '');
            }
            
            return {
              index,
              title: `Chapter ${index + 1}`,
              content: cleanedHTML || '<p>Chapter content could not be loaded properly.</p>',
              href: item.href
            };
            
          } catch (err) {
            console.error(`Error loading chapter ${index + 1}:`, err);
            return {
              index,
              title: `Chapter ${index + 1}`,
              content: `<p>Error loading chapter content: ${err.message}</p>`,
              href: item.href
            };
          }
        });

        const loadedChapters = await Promise.all(chapterPromises);
        const validChapters = loadedChapters.filter(chapter => chapter !== null);
        
        console.log('Loaded chapters:', validChapters.length);
        console.log('First chapter preview:', validChapters[0]?.content?.substring(0, 200));
        
        setChapters(validChapters);
        
        if (validChapters.length > 0) {
          setCurrentChapter(0);
          setChapterContent(validChapters[0].content);
        } else {
          throw new Error('No valid chapters could be loaded');
        }
        
        setIsLoading(false);
        console.log('EPUB content loaded successfully');
        
      } catch (err) {
        console.error('Error loading EPUB content:', err);
        setError(err.message || 'Failed to load EPUB content');
        setIsLoading(false);
      }
    };

    loadEpubContent();
  }, [epubData]);

  const navigateChapter = (direction) => {
    if (direction === 'next' && currentChapter < chapters.length - 1) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      setChapterContent(chapters[nextChapter].content);
      if (onNavigate) {
        onNavigate({ chapter: nextChapter, href: chapters[nextChapter].href });
      }
    } else if (direction === 'prev' && currentChapter > 0) {
      const prevChapter = currentChapter - 1;
      setCurrentChapter(prevChapter);
      setChapterContent(chapters[prevChapter].content);
      if (onNavigate) {
        onNavigate({ chapter: prevChapter, href: chapters[prevChapter].href });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading EPUB content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading EPUB
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chapter Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => navigateChapter('prev')}
          disabled={currentChapter === 0}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Chapter {currentChapter + 1} of {chapters.length}
          </p>
          {chapters[currentChapter] && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {chapters[currentChapter].title}
            </p>
          )}
        </div>
        
        <button
          onClick={() => navigateChapter('next')}
          disabled={currentChapter === chapters.length - 1}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Chapter Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-white dark:bg-gray-900">
        {chapterContent ? (
          <div className="max-w-4xl mx-auto">
            <ContentRenderer content={chapterContent} />
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No content available for this chapter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
