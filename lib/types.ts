export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'gray';
}

export const COLOR_OPTIONS = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray'] as const;

export const COLOR_DISPLAY_NAMES: Record<string, string> = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
  pink: 'Pink',
  gray: 'Gray',
};

export const COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-100 border-l-4 border-red-500 text-red-700',
  blue: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700',
  green: 'bg-green-100 border-l-4 border-green-500 text-green-700',
  yellow: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
  purple: 'bg-purple-100 border-l-4 border-purple-500 text-purple-700',
  pink: 'bg-pink-100 border-l-4 border-pink-500 text-pink-700',
  gray: 'bg-gray-100 border-l-4 border-gray-500 text-gray-700',
};
