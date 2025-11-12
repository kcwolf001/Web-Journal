import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WebJournal - Your Personal Journal',
  description: 'A beautiful, simple journaling app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
