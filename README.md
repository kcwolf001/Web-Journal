# WebJournal

A beautiful, clean, and simple journaling app built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Markdown Editor**: Write your journal entries in a clean, distraction-free editor
- **Auto-save**: Your entries are automatically saved as you type
- **Local Storage**: All data is stored locally in your browser
- **Beautiful UI**: Clean, modern design with Tailwind CSS
- **Entry Management**: Create, edit, and delete journal entries
- **Sidebar Navigation**: Easy access to all your journal entries

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Styling
- **Local Storage** - Data persistence

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
WebJournal/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/
│   ├── MarkdownEditor.tsx  # Editor component
│   └── Sidebar.tsx         # Sidebar component
├── lib/
│   ├── types.ts         # TypeScript types
│   └── storage.ts       # Local storage utilities
└── ...config files
```

## Usage

1. Click "New Entry" to create a new journal entry
2. Start typing in the editor - your work is auto-saved
3. Click on any entry in the sidebar to view/edit it
4. Delete entries by clicking the trash icon

## Notes

- All data is stored in your browser's local storage
- Entries are sorted by last updated date
- Auto-save triggers 2 seconds after you stop typing
