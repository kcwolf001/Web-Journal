'use client';

import { useState } from 'react';
import { Folder, JournalEntry } from '@/lib/types';
import { storage } from '@/lib/storage';
import { ChevronDown, ChevronRight, FolderPlus, Trash2, Edit2, X, Check } from 'lucide-react';

interface FolderPanelProps {
  folders: Folder[];
  entries: JournalEntry[];
  selectedFolderId?: string;
  onSelectFolder: (folderId?: string) => void;
  onFoldersChange: (folders: Folder[]) => void;
  onEntriesChange: (entries: JournalEntry[]) => void;
}

export default function FolderPanel({
  folders,
  entries,
  selectedFolderId,
  onSelectFolder,
  onFoldersChange,
  onEntriesChange,
}: FolderPanelProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      try {
        const newFolder = storage.createFolder(newFolderName);
        onFoldersChange([...folders, newFolder]);
        setNewFolderName('');
        setShowNewFolderInput(false);
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };

  const handleRenameFolder = (folderId: string) => {
    if (editingFolderName.trim()) {
      storage.updateFolder(folderId, editingFolderName);
      const updatedFolders = folders.map((f) =>
        f.id === folderId ? { ...f, name: editingFolderName } : f
      );
      onFoldersChange(updatedFolders);
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (confirm(`Delete folder? Entries in this folder will be moved to root.`)) {
      storage.deleteFolder(folderId);
      const updatedFolders = folders.filter((f) => f.id !== folderId);
      onFoldersChange(updatedFolders);
      const updatedEntries = storage.getEntries();
      onEntriesChange(updatedEntries);
      if (selectedFolderId === folderId) {
        onSelectFolder(undefined);
      }
    }
  };

  const rootEntries = entries.filter((e) => !e.folderId);

  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      {/* Root folder */}
      <button
        onClick={() => onSelectFolder(undefined)}
        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-colors ${
          selectedFolderId === undefined
            ? 'bg-blue-100 text-blue-900'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="text-sm font-medium flex-1">All Entries</span>
        <span className="text-xs text-gray-500">{rootEntries.length}</span>
      </button>

      {/* Folders */}
      <div className="border-t pt-2">
        <div className="flex items-center justify-between px-3 py-2 mb-2">
          <span className="text-xs font-semibold text-gray-600 uppercase">Folders</span>
          <button
            onClick={() => setShowNewFolderInput(!showNewFolderInput)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Create new folder"
          >
            <FolderPlus size={16} />
          </button>
        </div>

        {/* New folder input */}
        {showNewFolderInput && (
          <div className="flex gap-1 px-3 py-2 mb-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
              }}
              placeholder="Folder name..."
              className="flex-1 text-sm px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleCreateFolder}
              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setShowNewFolderInput(false);
                setNewFolderName('');
              }}
              className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Folders list */}
        <div className="space-y-1">
          {folders.map((folder) => {
            const isExpanded = expandedFolders.has(folder.id);
            const folderEntries = entries.filter((e) => e.folderId === folder.id);
            const isEditing = editingFolderId === folder.id;

            return (
              <div key={folder.id}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className={`flex-1 flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition-colors ${
                      selectedFolderId === folder.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleRenameFolder(folder.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <>
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2h4a1 1 0 011 1v11a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" />
                        </svg>
                        <span className="flex-1 truncate">{folder.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{folderEntries.length}</span>
                      </>
                    )}
                  </button>
                  {!isEditing && (
                    <div className="flex gap-1 px-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                          setEditingFolderName(folder.name);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Rename folder"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete folder"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  {isEditing && (
                    <div className="flex gap-1 px-1">
                      <button
                        onClick={() => handleRenameFolder(folder.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingFolderId(null);
                          setEditingFolderName('');
                        }}
                        className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded folder entries */}
                {isExpanded && (
                  <div className="ml-6 space-y-1 mt-1">
                    {folderEntries.length === 0 ? (
                      <p className="text-xs text-gray-400 px-2 py-1">No entries</p>
                    ) : (
                      folderEntries.map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => onSelectFolder(folder.id)}
                          className={`w-full text-left px-2 py-1 rounded text-xs transition-colors truncate ${
                            selectedFolderId === folder.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={entry.title || 'Untitled'}
                        >
                          {entry.title || 'Untitled Entry'}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {folders.length === 0 && !showNewFolderInput && (
          <p className="text-xs text-gray-400 px-3 py-2">No folders yet. Create one to organize your entries.</p>
        )}
      </div>
    </div>
  );
}
