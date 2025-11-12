'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import { JournalEntry } from '@/lib/types';
import { storage } from '@/lib/storage';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedEntries = storage.getEntries();
    setEntries(loadedEntries);
  }, []);

  const handleSaveEntry = (entry: JournalEntry) => {
    storage.saveEntry(entry);
    const updatedEntries = storage.getEntries();
    setEntries(updatedEntries);
    setSelectedEntry(entry);
  };

  const handleDeleteEntry = (id: string) => {
    storage.deleteEntry(id);
    const updatedEntries = storage.getEntries();
    setEntries(updatedEntries);
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const handleSelectEntry = (entry: JournalEntry | null) => {
    setSelectedEntry(entry);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        entries={entries}
        selectedEntry={selectedEntry}
        onSelectEntry={handleSelectEntry}
        onDeleteEntry={handleDeleteEntry}
      />
      <main className="flex-1 overflow-hidden">
        {selectedEntry || entries.length === 0 ? (
          <MarkdownEditor entry={selectedEntry} onSave={handleSaveEntry} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Welcome to WebJournal
              </h2>
              <p className="text-gray-500">
                Select an entry from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
