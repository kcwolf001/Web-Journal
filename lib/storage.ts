import { JournalEntry, Folder } from './types';

const ENTRIES_STORAGE_KEY = 'journal-entries';
const FOLDERS_STORAGE_KEY = 'journal-folders';

export const storage = {
  // ===== ENTRY OPERATIONS =====
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      const entries = localStorage.getItem(ENTRIES_STORAGE_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveEntry: (entry: JournalEntry): void => {
    if (typeof window === 'undefined') return;
    try {
      const entries = storage.getEntries();
      const existingIndex = entries.findIndex((e) => e.id === entry.id);

      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.unshift(entry);
      }

      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  deleteEntry: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const entries = storage.getEntries();
      const filtered = entries.filter((e) => e.id !== id);
      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  },

  getEntry: (id: string): JournalEntry | undefined => {
    const entries = storage.getEntries();
    return entries.find((e) => e.id === id);
  },

  getEntriesByFolder: (folderId?: string): JournalEntry[] => {
    const entries = storage.getEntries();
    return entries.filter((e) => e.folderId === folderId);
  },

  // ===== FOLDER OPERATIONS =====
  getFolders: (): Folder[] => {
    if (typeof window === 'undefined') return [];
    try {
      const folders = localStorage.getItem(FOLDERS_STORAGE_KEY);
      return folders ? JSON.parse(folders) : [];
    } catch (error) {
      console.error('Error reading folders from localStorage:', error);
      return [];
    }
  },

  createFolder: (name: string): Folder => {
    if (typeof window === 'undefined') throw new Error('Cannot create folder on server');

    const now = new Date().toISOString();
    const folder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const folders = storage.getFolders();
      folders.unshift(folder);
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }

    return folder;
  },

  updateFolder: (folderId: string, name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const folders = storage.getFolders();
      const folder = folders.find((f) => f.id === folderId);

      if (folder) {
        folder.name = name;
        folder.updatedAt = new Date().toISOString();
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  },

  deleteFolder: (folderId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const folders = storage.getFolders();
      const filtered = folders.filter((f) => f.id !== folderId);
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));

      // Move all entries from this folder to root level
      const entries = storage.getEntries();
      const movedEntries = entries.map((e) => {
        if (e.folderId === folderId) {
          return { ...e, folderId: undefined };
        }
        return e;
      });
      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(movedEntries));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  },

  getFolder: (folderId: string): Folder | undefined => {
    const folders = storage.getFolders();
    return folders.find((f) => f.id === folderId);
  },
};
