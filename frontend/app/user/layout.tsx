import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Dashboard - Kab Creative Lab',
  description: 'User panel',
}

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
