import { JournalEntry } from './types';

const STORAGE_KEY = 'journal-entries';

export const storage = {
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      const entries = localStorage.getItem(STORAGE_KEY);
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

      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  deleteEntry: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const entries = storage.getEntries();
      const filtered = entries.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  },

  getEntry: (id: string): JournalEntry | undefined => {
    const entries = storage.getEntries();
    return entries.find((e) => e.id === id);
  },
};
