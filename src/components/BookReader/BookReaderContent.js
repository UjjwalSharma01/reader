'use client';

import dynamic from 'next/dynamic';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Viewer = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => ({ default: mod.Viewer })),
  { ssr: false }
);
const DefaultLayoutPlugin = dynamic(
  () => import('@react-pdf-viewer/default-layout').then(mod => ({ default: mod.defaultLayoutPlugin })),
  { ssr: false }
);

const EpubReader = dynamic(
  () => import('./EpubReader'),
  { ssr: false }
);

export default function BookReaderContent({ 
  book, 
  pdfUrl, 
  textPages, 
  currentPage, 
  bookContent, 
  epubData,
  readerSettings, 
  contentRef,
  onAddBookmark,
  onPageChange 
}) {
  const renderContent = () => {
    // EPUB Content
    if (book.format === 'EPUB' && epubData) {
      return (
        <EpubReader
          epubData={epubData}
          readerSettings={readerSettings}
          onAddBookmark={onAddBookmark}
          onPageChange={onPageChange}
        />
      );
    }
    
    // PDF Content
    if (book.format === 'PDF' && pdfUrl) {
      const DefaultLayoutPlugin = defaultLayoutPlugin;
      const defaultLayoutPluginInstance = DefaultLayoutPlugin ? DefaultLayoutPlugin() : undefined;
      return (
        <div className="h-[80vh] w-full">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={pdfUrl} plugins={defaultLayoutPluginInstance ? [defaultLayoutPluginInstance] : []} />
          </Worker>
        </div>
      );
    }
    
    if (book.format === 'TXT') {
      const pageContent = textPages[currentPage] || '';
      
      return (
        <div 
          className="prose max-w-none text-justify leading-relaxed"
          style={{
            fontSize: `${readerSettings.fontSize}px`,
            fontFamily: readerSettings.fontFamily,
            lineHeight: readerSettings.lineHeight,
            color: readerSettings.textColor
          }}
        >
          <pre className="whitespace-pre-wrap font-sans">{pageContent}</pre>
        </div>
      );
    }
    
    return (
      <div 
        className="prose max-w-none"
        style={{
          fontSize: `${readerSettings.fontSize}px`,
          fontFamily: readerSettings.fontFamily,
          lineHeight: readerSettings.lineHeight,
          color: readerSettings.textColor
        }}
        dangerouslySetInnerHTML={{ __html: bookContent }}
      />
    );
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div ref={contentRef}>
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
