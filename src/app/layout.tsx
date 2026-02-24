import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Providers from '@/components/Providers'
import AgeVerification from '@/components/AgeVerification'
import InstallPrompt from '@/components/InstallPrompt'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://leefii.com'),
  title: {
    default: 'Leefii - Find Cannabis Dispensaries & Strains Near You',
    template: '%s | Leefii'
  },
  description: 'Find licensed cannabis dispensaries near you. Browse 6,891+ dispensaries across 51 states, explore 5,632+ strains, read reviews, and find the best deals.',
  keywords: [
    'cannabis dispensary',
    'marijuana dispensary',
    'weed dispensary near me',
    'cannabis strains',
    'marijuana strains',
    'dispensary finder',
    'cannabis deals',
    'medical marijuana',
    'recreational cannabis',
    'CBD',
    'THC',
    'dispensary directory',
    'cannabis news',
    'weed shop',
    'pot shop near me'
  ],
  authors: [{ name: 'Leefii' }],
  creator: 'Leefii',
  publisher: 'Leefii',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Leefii',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://leefii.com',
    siteName: 'Leefii',
    title: 'Leefii - Find Cannabis Dispensaries & Strains Near You',
    description: 'Find licensed cannabis dispensaries near you. Browse 6,891+ dispensaries across 51 states, explore 5,632+ strains, and find the best deals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Leefii - Cannabis Dispensary Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leefii - Find Cannabis Dispensaries & Strains Near You',
    description: 'Find licensed cannabis dispensaries near you. Browse 6,891+ dispensaries across 51 states and explore 5,632+ strains.',
    images: ['/og-image.png'],
    creator: '@leefii',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'EW1VQnrDf1bvRYo-ddwkuBfvoRJWWs8bDi8w6Ltn9qE',
  },
  alternates: {
    canonical: 'https://leefii.com',
  },
  category: 'cannabis',
}

// JSON-LD Schema for the website
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Leefii',
  description: 'Find licensed cannabis dispensaries near you. Browse dispensaries across 51 states, explore strains, and find the best deals.',
  url: 'https://leefii.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://leefii.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Leefii',
  url: 'https://leefii.com',
  logo: 'https://leefii.com/logo.png',
  description: 'Leefii is a free cannabis dispensary directory covering 6,891+ licensed dispensaries, 5,632+ strains, real-time deals, MMJ doctors, and state cannabis laws across all 51 US states and territories.',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/leefii',
    'https://facebook.com/leefii',
    'https://instagram.com/leefii',
    'https://github.com/leefii'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@leefii.com',
    availableLanguage: 'English'
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States'
  },
  knowsAbout: [
    'Cannabis dispensaries',
    'Cannabis strains',
    'Medical marijuana',
    'Cannabis laws',
    'Cannabis delivery',
    'Cannabis deals'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Leefii" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M344LSL390"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M344LSL390');
          `}
        </Script>
        <Providers>
          <AgeVerification />
          {children}
          <InstallPrompt />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
