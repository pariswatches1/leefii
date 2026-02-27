import { Metadata } from 'next'
import Link from 'next/link'
import ShopClient from './ShopClient'

export const metadata: Metadata = {
  title: 'Shop Cannabis — Find the Cheapest Prices Near You | Leefii',
  description:
    'Compare cannabis prices from dispensaries near you. Find the cheapest flower, edibles, concentrates, vapes, and pre-rolls with real-time pricing data.',
  openGraph: {
    title: 'Shop Cannabis — Find the Cheapest Prices Near You | Leefii',
    description:
      'Compare cannabis prices from dispensaries near you. Find the cheapest flower, edibles, concentrates, vapes, and pre-rolls.',
    url: 'https://leefii.com/shop',
    siteName: 'Leefii',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Cannabis — Find the Cheapest Prices Near You | Leefii',
    description:
      'Compare cannabis prices from dispensaries near you. Find the cheapest flower, edibles, concentrates, vapes, and pre-rolls.',
  },
  alternates: {
    canonical: 'https://leefii.com/shop',
  },
}

export default function ShopPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://leefii.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://leefii.com/shop',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-green-100">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-1">/</span>
              </li>
              <li className="text-white font-medium">Shop</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Find the Cheapest Cannabis Near You
          </h1>
          <p className="text-green-100 text-lg max-w-2xl">
            Compare real-time prices from dispensaries in your area. We show you every product
            sorted by price so you always get the best deal.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              <span>Compare prices across dispensaries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span>Sorted cheapest first</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>Find deals near you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <ShopClient />
    </div>
  )
}
