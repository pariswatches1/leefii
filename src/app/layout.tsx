import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://leefii.com'),
  title: {
    default: 'Leefii - Find Cannabis Dispensaries Near You',
    template: '%s | Leefii',
  },
  description: 'Find licensed cannabis dispensaries near you. Compare hours, locations, and call directly. The fastest way to find dispensaries in your city.',
  keywords: ['dispensary', 'cannabis', 'marijuana', 'weed', 'dispensary near me', 'medical marijuana', 'strains', 'sativa', 'indica', 'hybrid'],
  authors: [{ name: 'Leefii' }],
  creator: 'Leefii',
  publisher: 'Leefii',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://leefii.com',
    siteName: 'Leefii',
    title: 'Leefii - Find Cannabis Dispensaries Near You',
    description: 'Find licensed cannabis dispensaries near you. Compare hours, locations, and call directly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Leefii - Find Dispensaries'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leefii - Find Cannabis Dispensaries Near You',
    description: 'Find licensed cannabis dispensaries near you.',
    images: ['/og-image.png'],
    creator: '@leefii',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://leefii.com'
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
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Header />
        <main className="min-h-[calc(100vh-140px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

// Header Component
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Leefii</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/dispensaries" className="text-gray-600 hover:text-gray-900 font-medium">
              Dispensaries
            </a>
            <a href="/strains" className="text-gray-600 hover:text-gray-900 font-medium">
              Strains
            </a>
            <a href="/deals" className="text-gray-600 hover:text-gray-900 font-medium">
              Deals
            </a>
            <a href="/news" className="text-gray-600 hover:text-gray-900 font-medium">
              News
            </a>
            <a href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">
              Blog
            </a>
            <a href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </a>
          </nav>

          {/* Search */}
          <div className="flex items-center">
            <a
              href="/search"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            
            {/* Mobile menu button */}
            <button className="md:hidden ml-2 p-2 text-gray-500 hover:text-gray-700" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Leefii</span>
            </div>
            <p className="text-gray-600 text-sm">
              Find licensed cannabis dispensaries near you.
            </p>
          </div>

          {/* Popular States */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular States</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dispensaries/california" className="text-gray-600 hover:text-primary-600">California</a></li>
              <li><a href="/dispensaries/florida" className="text-gray-600 hover:text-primary-600">Florida</a></li>
              <li><a href="/dispensaries/colorado" className="text-gray-600 hover:text-primary-600">Colorado</a></li>
              <li><a href="/dispensaries/michigan" className="text-gray-600 hover:text-primary-600">Michigan</a></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dispensaries" className="text-gray-600 hover:text-primary-600">Dispensaries</a></li>
              <li><a href="/strains" className="text-gray-600 hover:text-primary-600">Strains</a></li>
              <li><a href="/deals" className="text-gray-600 hover:text-primary-600">Deals</a></li>
              <li><a href="/news" className="text-gray-600 hover:text-primary-600">News</a></li>
              <li><a href="/blog" className="text-gray-600 hover:text-primary-600">Blog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-600 hover:text-primary-600">About</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-primary-600">Contact</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-primary-600">Privacy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-primary-600">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Leefii. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
