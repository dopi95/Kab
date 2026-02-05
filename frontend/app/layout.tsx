import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kab Creative Lab',
  description: 'Creative solutions and innovative designs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}