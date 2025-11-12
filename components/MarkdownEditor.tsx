'use client';

import { useState, useEffect } from 'react';
import { JournalEntry, COLOR_OPTIONS, COLOR_DISPLAY_NAMES } from '@/lib/types';

interface MarkdownEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
}

export default function MarkdownEditor({ entry, onSave }: MarkdownEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<string | undefined>('blue');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setColor(entry.color || 'blue');
    } else {
      setTitle('');
      setContent('');
      setColor('blue');
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
      color: color as 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'gray' | undefined,
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
  }, [title, content, color]);

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
        <div className="flex items-center justify-between mt-2 mb-3">
          <p className="text-sm text-gray-400">
            {entry?.updatedAt
              ? `Last saved: ${new Date(entry.updatedAt).toLocaleString()}`
              : 'Not saved yet'}
          </p>
          {isSaving && (
            <span className="text-sm text-green-600">Saving...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Color:</span>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => setColor(colorOption)}
                className={`w-6 h-6 rounded-full transition-all ${
                  colorOption === 'red' ? 'bg-red-500' :
                  colorOption === 'blue' ? 'bg-blue-500' :
                  colorOption === 'green' ? 'bg-green-500' :
                  colorOption === 'yellow' ? 'bg-yellow-500' :
                  colorOption === 'purple' ? 'bg-purple-500' :
                  colorOption === 'pink' ? 'bg-pink-500' :
                  'bg-gray-500'
                } ${color === colorOption ? 'ring-2 ring-offset-2 ring-gray-400 scale-125' : 'hover:scale-110'}`}
                title={COLOR_DISPLAY_NAMES[colorOption]}
                aria-label={`Set color to ${COLOR_DISPLAY_NAMES[colorOption]}`}
              />
            ))}
          </div>
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
