import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

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
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Leefii</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/dispensaries" className="text-gray-600 hover:text-green-600 transition">
                  Dispensaries
                </Link>
                <Link href="/strains" className="text-gray-600 hover:text-green-600 transition">
                  Strains
                </Link>
                <Link href="/deals" className="text-gray-600 hover:text-green-600 transition">
                  Deals
                </Link>
                <Link href="/news" className="text-gray-600 hover:text-green-600 transition">
                  News
                </Link>
                <Link href="/blog" className="text-gray-600 hover:text-green-600 transition">
                  Blog
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition">
                  About
                </Link>
              </div>

              {/* Search Icon */}
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-green-600 transition" aria-label="Search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Company */}
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                </ul>
              </div>

              {/* Explore */}
              <div>
                <h3 className="text-white font-semibold mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/dispensaries" className="hover:text-white transition">Dispensaries</Link></li>
                  <li><Link href="/strains" className="hover:text-white transition">Strains</Link></li>
                  <li><Link href="/deals" className="hover:text-white transition">Deals</Link></li>
                  <li><Link href="/news" className="hover:text-white transition">News</Link></li>
                </ul>
              </div>

              {/* Popular States */}
              <div>
                <h3 className="text-white font-semibold mb-4">Popular States</h3>
                <ul className="space-y-2">
                  <li><Link href="/dispensaries/california" className="hover:text-white transition">California</Link></li>
                  <li><Link href="/dispensaries/colorado" className="hover:text-white transition">Colorado</Link></li>
                  <li><Link href="/dispensaries/florida" className="hover:text-white transition">Florida</Link></li>
                  <li><Link href="/dispensaries/michigan" className="hover:text-white transition">Michigan</Link></li>
                </ul>
              </div>

              {/* Popular Cities */}
              <div>
                <h3 className="text-white font-semibold mb-4">Popular Cities</h3>
                <ul className="space-y-2">
                  <li><Link href="/dispensaries/california/los-angeles" className="hover:text-white transition">Los Angeles</Link></li>
                  <li><Link href="/dispensaries/colorado/denver" className="hover:text-white transition">Denver</Link></li>
                  <li><Link href="/dispensaries/california/san-francisco" className="hover:text-white transition">San Francisco</Link></li>
                  <li><Link href="/dispensaries/arizona/phoenix" className="hover:text-white transition">Phoenix</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-white font-bold">Leefii</span>
              </div>
              <p className="text-sm text-center md:text-right">
                © {new Date().getFullYear()} Leefii. All rights reserved.<br />
                <span className="text-xs">Must be 21+ to use this site. Please consume responsibly.</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
