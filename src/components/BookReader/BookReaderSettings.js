'use client';

import { Plus, Minus } from 'lucide-react';

export default function BookReaderSettings({ readerSettings, bookmarks, onSaveSettings, onGoToPage }) {
  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Reading Settings
      </h3>
      
      {/* Font Size */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Size
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSaveSettings({
              ...readerSettings,
              fontSize: Math.max(12, readerSettings.fontSize - 2)
            })}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
            {readerSettings.fontSize}px
          </span>
          <button
            onClick={() => onSaveSettings({
              ...readerSettings,
              fontSize: Math.min(24, readerSettings.fontSize + 2)
            })}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Font Family */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Family
        </label>
        <select
          value={readerSettings.fontFamily}
          onChange={(e) => onSaveSettings({
            ...readerSettings,
            fontFamily: e.target.value
          })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 text-sm"
        >
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
        </select>
      </div>

      {/* Bookmarks */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Bookmarks ({bookmarks.length})
        </h4>
        <div className="space-y-2 max-h-40 overflow-auto">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => onGoToPage(bookmark.page)}
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {bookmark.note}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {new Date(bookmark.timestamp).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
