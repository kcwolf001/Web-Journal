'use client';

import { useState } from 'react';
import { JournalEntry, Folder } from '@/lib/types';
import FolderPanel from './FolderPanel';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  selectedEntry: JournalEntry | null;
  selectedFolderId?: string;
  onSelectEntry: (entry: JournalEntry | null) => void;
  onSelectFolder: (folderId?: string) => void;
  onDeleteEntry: (id: string) => void;
  onFoldersChange: (folders: Folder[]) => void;
  onEntriesChange: (entries: JournalEntry[]) => void;
}

export default function Sidebar({
  entries,
  folders,
  selectedEntry,
  selectedFolderId,
  onSelectEntry,
  onSelectFolder,
  onDeleteEntry,
  onFoldersChange,
  onEntriesChange,
}: SidebarProps) {
  const [showFolderPanel, setShowFolderPanel] = useState(true);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  // Filter entries based on selected folder
  const filteredEntries =
    selectedFolderId === undefined
      ? entries.filter((e) => !e.folderId)
      : entries.filter((e) => e.folderId === selectedFolderId);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">WebJournal</h1>
        <button
          onClick={() => onSelectEntry(null)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New Entry
        </button>
      </div>

      {/* Folder Panel Toggle */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => setShowFolderPanel(!showFolderPanel)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>Navigation</span>
          {showFolderPanel ? (
            <ChevronDown size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Folder Panel */}
      {showFolderPanel && (
        <div className="flex-shrink-0 border-b border-gray-200 max-h-48 overflow-auto">
          <FolderPanel
            folders={folders}
            entries={entries}
            selectedFolderId={selectedFolderId}
            onSelectFolder={(folderId) => {
              onSelectFolder(folderId);
              onSelectEntry(null);
            }}
            onFoldersChange={onFoldersChange}
            onEntriesChange={onEntriesChange}
          />
        </div>
      )}

      {/* Entries List */}
      <div className="flex-1 overflow-auto">
        {filteredEntries.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p>No entries in this folder.</p>
            {selectedFolderId === undefined && (
              <p className="mt-2 text-sm">Start writing your first journal entry!</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedEntry?.id === entry.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
                onClick={() => onSelectEntry(entry)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 truncate flex-1">
                    {entry.title || 'Untitled Entry'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this entry?')) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {entry.content || 'No content'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(entry.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
