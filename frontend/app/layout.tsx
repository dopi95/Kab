import type { Metadata } from 'next'
// @ts-ignore
import './globals.css'
import Header from '@/components/Header'
import KeepAliveInit from '@/components/KeepAliveInit'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Kab Creative Lab | Video Production, Branding & AI Content Solutions in Ethiopia',
  description: 'Professional video production, visual branding, and AI-powered content creation services in Addis Ababa, Ethiopia. Expert social media management, photography, and creative solutions for businesses. የቪዲዮ ምርት፣ የምርት ስም እና AI የይዘት መፍትሄዎች በኢትዮጵያ',
  keywords: 'video production Ethiopia, creative agency Addis Ababa, branding Ethiopia, social media management, AI content creation, photography Ethiopia, video editing, content creation, የቪዲዮ ምርት, የምርት ስም, ማህበራዊ ሚዲያ አስተዳደር, ፎቶግራፍ, የይዘት ፈጠራ',
  authors: [{ name: 'Kab Creative Lab' }],
  creator: 'Kab Creative Lab',
  publisher: 'Kab Creative Lab',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['am_ET'],
    url: 'https://kabcreativelab.com',
    siteName: 'Kab Creative Lab',
    title: 'Kab Creative Lab | Professional Video Production & Creative Services Ethiopia',
    description: 'Leading creative agency in Ethiopia offering video production, branding, AI content, and social media management. Transform your brand with professional creative solutions.',
    images: [
      {
        url: 'https://kabcreativelab.com/assets/logo.png',
        width: 1200,
        height: 630,
        alt: 'Kab Creative Lab Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kab Creative Lab | Video Production & Creative Agency Ethiopia',
    description: 'Professional video production, branding, and AI content solutions in Addis Ababa, Ethiopia',
    images: ['https://kabcreativelab.com/assets/logo.png'],
  },
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://kabcreativelab.com',
    languages: {
      'en-US': 'https://kabcreativelab.com',
      'am-ET': 'https://kabcreativelab.com',
    },
  },
  verification: {
    google: 'your-google-verification-code',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#A97E50" />
        <meta name="geo.region" content="ET-AA" />
        <meta name="geo.placename" content="Addis Ababa" />
        <meta name="geo.position" content="9.0320;38.7469" />
        <meta name="ICBM" content="9.0320, 38.7469" />
        <link rel="canonical" href="https://kabcreativelab.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Kab Creative Lab',
              url: 'https://kabcreativelab.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://kabcreativelab.com/assets/logoo.png',
                width: 512,
                height: 512,
              },
              image: 'https://kabcreativelab.com/assets/logoo.png',
              description: 'Professional video production, branding, and creative services in Ethiopia',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Addis Ababa',
                addressCountry: 'ET',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+251-983-101-000',
                contactType: 'Customer Service',
                email: 'kab@kabcreativelab.com',
              },
              sameAs: [
                'https://facebook.com/kabcreativelab',
                'https://instagram.com/kabcreativelab',
                'https://twitter.com/kabcreativelab',
              ],
              areaServed: 'ET',
              serviceType: ['Video Production', 'Branding', 'Social Media Management', 'Photography', 'AI Content Creation'],
            }),
          }}
        />
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
        <KeepAliveInit />
        <Header />
        {children}
      </body>
    </html>
  )
}