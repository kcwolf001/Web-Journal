export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  folderId?: string; // Optional folder ID, null/undefined means root level
  createdAt: string;
  updatedAt: string;
}
