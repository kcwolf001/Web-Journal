'use client';

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/lib/types';
import { SocialShareButtons } from './SocialShareButtons';

interface MarkdownEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
}

export default function MarkdownEditor({ entry, onSave }: MarkdownEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [entry]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    setIsSaving(true);
    const now = new Date().toISOString();

    const savedEntry: JournalEntry = {
      id: entry?.id || `entry-${Date.now()}`,
      title: title.trim() || 'Untitled Entry',
      content: content,
      createdAt: entry?.createdAt || now,
      updatedAt: now,
    };

    onSave(savedEntry);
    setTimeout(() => setIsSaving(false), 500);
  };

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title..."
          className="w-full text-3xl font-bold border-none outline-none placeholder-gray-300"
        />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-400">
              {entry?.updatedAt
                ? `Last saved: ${new Date(entry.updatedAt).toLocaleString()}`
                : 'Not saved yet'}
            </p>
            {isSaving && (
              <span className="text-sm text-green-600">Saving...</span>
            )}
          </div>
          {entry && title && (
            <SocialShareButtons title={title} content={content} />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="w-full h-full p-6 text-lg border-none outline-none resize-none placeholder-gray-300 leading-relaxed"
        />
      </div>
    </div>
  );
}
