import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Kab Creative Lab',
  description: 'Creative solutions and innovative designs',
  icons: {
    icon: '/assets/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const darkMode = localStorage.getItem('darkMode') === 'true';
              if (darkMode) {
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
      </head>
      <body className="antialiased bg-white dark:bg-[#171817] transition-colors duration-300">
        <Header />
        {children}
      </body>
    </html>
  )
}