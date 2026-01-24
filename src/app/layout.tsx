import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Providers from '@/components/Providers'
import AgeVerification from '@/components/AgeVerification'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://leefii.com'),
  title: {
    default: 'Leefii - Find Cannabis Dispensaries & Strains Near You',
    template: '%s | Leefii'
  },
  description: 'Find licensed cannabis dispensaries near you. Browse 2,897+ dispensaries across 50 states, explore 5,000+ strains, read reviews, and find the best deals.',
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
    description: 'Find licensed cannabis dispensaries near you. Browse 2,897+ dispensaries across 50 states, explore 5,000+ strains, and find the best deals.',
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
    description: 'Find licensed cannabis dispensaries near you. Browse 2,897+ dispensaries across 50 states and explore 5,000+ strains.',
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
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
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
  description: 'Find licensed cannabis dispensaries near you. Browse dispensaries across 50 states, explore strains, and find the best deals.',
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
  description: 'Cannabis dispensary directory helping you find licensed dispensaries and strains.',
  sameAs: [
    'https://twitter.com/leefii',
    'https://facebook.com/leefii',
    'https://instagram.com/leefii'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@leefii.com'
  }
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        
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
        </Providers>
      </body>
    </html>
  )
}


