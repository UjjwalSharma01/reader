'use client';

import dynamic from 'next/dynamic';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Viewer = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Viewer),
  { ssr: false }
);
const defaultLayoutPlugin = dynamic(
  () => import('@react-pdf-viewer/default-layout').then(mod => mod.defaultLayoutPlugin),
  { ssr: false }
);

export default function BookReaderContent({ book, pdfUrl, textPages, currentPage, bookContent, readerSettings, contentRef }) {
  const renderContent = () => {
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
