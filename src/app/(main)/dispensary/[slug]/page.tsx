import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ShopNowButton from '@/components/ShopNowButton'
import Reviews from '@/components/Reviews'
import TrustBadge from '@/components/TrustBadge'
import ReportInaccuracyButton from '@/components/ReportInaccuracyButton'
import ShareButtons from '@/components/ShareButtons'
import DispensaryMenu from '@/components/dispensary/DispensaryMenu'

type Props = {
  params: { slug: string }
}

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_NAMES: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

function isOpenNow(hours: any[]): { open: boolean; nextChange: string } {
  if (!hours || hours.length === 0) return { open: false, nextChange: '' }

  const now = new Date()
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = days[now.getDay()]
  const currentTime = now.getHours() * 100 + now.getMinutes()

  const todayHours = hours.find(h => h.dayOfWeek === today)
  if (!todayHours || todayHours.isClosed) {
    return { open: false, nextChange: 'Closed today' }
  }

  const openTime = parseInt(todayHours.openTime.replace(':', ''))
  const closeTime = parseInt(todayHours.closeTime.replace(':', ''))

  if (currentTime < openTime) {
    return { open: false, nextChange: `Opens at ${formatTime(todayHours.openTime)}` }
  }

  if (currentTime >= openTime && currentTime <= closeTime) {
    return { open: true, nextChange: `Closes at ${formatTime(todayHours.closeTime)}` }
  }

  return { open: false, nextChange: 'Closed' }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dispensary = await prisma.dispensary.findUnique({
    where: { slug: params.slug },
    include: { city: true, state: true }
  })

  if (!dispensary) {
    return { title: 'Dispensary Not Found' }
  }

  // Count menu products for enriched description
  let productCount = 0
  try {
    productCount = await prisma.menuProduct.count({
      where: { dispensaryId: dispensary.id, isActive: true }
    })
  } catch {
    // Table may not exist yet
  }

  const menuSnippet = productCount > 0
    ? ` Browse ${productCount} products with live prices.`
    : ''

  const title = productCount > 0
    ? `${dispensary.name} - Menu, Prices, Hours & Address | Leefii`
    : `${dispensary.name} - Hours, Address & Phone | Leefii`
  const description = `${dispensary.name} at ${dispensary.address}, ${dispensary.city.name}, ${dispensary.state.abbreviation}. Call ${dispensary.phone}.${menuSnippet} ${dispensary.hasDelivery ? 'Delivery available.' : ''} ${dispensary.licenseType === 'MEDICAL' ? 'Medical marijuana dispensary.' : 'Recreational dispensary.'}`

  return {
    title,
    description,
    keywords: [
      dispensary.name,
      `${dispensary.name} menu`,
      `${dispensary.city.name} dispensary`,
      `${dispensary.state.name} dispensary`,
      dispensary.licenseType === 'MEDICAL' ? 'medical marijuana' : 'recreational cannabis',
      dispensary.hasDelivery ? 'cannabis delivery' : '',
      productCount > 0 ? `${dispensary.name} prices` : '',
    ].filter(Boolean),
    openGraph: {
      title: dispensary.name,
      description: `${dispensary.address}, ${dispensary.city.name}, ${dispensary.state.abbreviation}. Call ${dispensary.phone}.${menuSnippet}`,
      url: `https://leefii.com/dispensary/${dispensary.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: dispensary.name,
      description,
    },
    alternates: {
      canonical: `https://leefii.com/dispensary/${dispensary.slug}`,
    },
  }
}

export default async function DispensaryPage({ params }: Props) {
  let dispensary
  try {
    dispensary = await prisma.dispensary.findUnique({
      where: { slug: params.slug },
      include: {
        city: true,
        state: true,
        BusinessHours: { orderBy: { dayOfWeek: 'asc' } }
      }
    })
  } catch {
    notFound()
  }

  if (!dispensary) {
    notFound()
  }

  // Sort hours by day
  const sortedHours = [...dispensary.BusinessHours].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  )

  // Get open status
  const { open, nextChange } = isOpenNow(dispensary.BusinessHours)

  // Fetch menu products for this dispensary
  let menuProducts: {
    id: string
    name: string
    brand: string | null
    category: string
    subcategory: string | null
    price: number
    originalPrice: number | null
    weight: string | null
    thcContent: string | null
    cbdContent: string | null
    strainType: string | null
    strain: string | null
    imageUrl: string | null
    isOnSale: boolean
    lastScrapedAt: Date
  }[] = []
  try {
    menuProducts = await prisma.menuProduct.findMany({
      where: { dispensaryId: dispensary.id, isActive: true },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        subcategory: true,
        price: true,
        originalPrice: true,
        weight: true,
        thcContent: true,
        cbdContent: true,
        strainType: true,
        strain: true,
        imageUrl: true,
        isOnSale: true,
        lastScrapedAt: true,
      },
    })
  } catch {
    // MenuProduct table may not exist yet
  }

  // Compute the most recent scrape time
  const latestScrapeAt = menuProducts.length > 0
    ? menuProducts.reduce((latest, p) =>
        p.lastScrapedAt > latest ? p.lastScrapedAt : latest,
        menuProducts[0].lastScrapedAt
      )
    : null

  // Compute menu price stats
  const menuPrices = menuProducts.map((p) => p.price)
  const lowestPrice = menuPrices.length > 0 ? Math.min(...menuPrices) : null
  const highestPrice = menuPrices.length > 0 ? Math.max(...menuPrices) : null

  // Related dispensaries in same city
  const relatedDispensaries = await prisma.dispensary.findMany({
    where: {
      cityId: dispensary.cityId,
      isActive: true,
      id: { not: dispensary.id }
    },
    take: 4,
    orderBy: { rating: 'desc' }
  })

  // JSON-LD Schema for LocalBusiness (upgraded from MedicalBusiness)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    additionalType: 'https://schema.org/Store',
    name: dispensary.name,
    description: dispensary.description,
    url: `https://leefii.com/dispensary/${dispensary.slug}`,
    telephone: dispensary.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: dispensary.address,
      addressLocality: dispensary.city.name,
      addressRegion: dispensary.state.abbreviation,
      postalCode: dispensary.zipCode,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: dispensary.latitude,
      longitude: dispensary.longitude
    },
    openingHoursSpecification: sortedHours.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek.charAt(0) + h.dayOfWeek.slice(1).toLowerCase(),
      opens: h.openTime,
      closes: h.closeTime
    })),
    ...(dispensary.rating && dispensary.reviewsCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: dispensary.rating,
        reviewCount: dispensary.reviewsCount,
        bestRating: 5,
        worstRating: 1
      }
    } : {})
  }

  // Add hasMenu with product offers if we have menu data
  if (menuProducts.length > 0) {
    jsonLd.hasMenu = {
      '@type': 'Menu',
      name: `${dispensary.name} Menu`,
      url: `https://leefii.com/dispensary/${dispensary.slug}#menu`,
      hasMenuSection: Array.from(
        menuProducts.reduce((cats, p) => {
          if (!cats.has(p.category)) cats.set(p.category, [])
          cats.get(p.category)!.push(p)
          return cats
        }, new Map<string, typeof menuProducts>())
      ).map(([category, items]) => ({
        '@type': 'MenuSection',
        name: category.charAt(0).toUpperCase() + category.slice(1),
        hasMenuItem: items.slice(0, 5).map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        })),
      })),
    }

    // Add priceRange for LocalBusiness
    if (lowestPrice !== null && highestPrice !== null) {
      jsonLd.priceRange = `$${lowestPrice.toFixed(0)} - $${highestPrice.toFixed(0)}`
    }
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://leefii.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dispensary.state.name,
        item: `https://leefii.com/dispensaries/${dispensary.state.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: dispensary.city.name,
        item: `https://leefii.com/dispensaries/${dispensary.state.slug}/${dispensary.city.slug}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: dispensary.name,
        item: `https://leefii.com/dispensary/${dispensary.slug}`
      }
    ]
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href={`/dispensaries/${dispensary.state.slug}`} className="text-gray-500 hover:text-gray-700">
                {dispensary.state.name}
              </Link>
              <span className="text-gray-400">/</span>
              <Link href={`/dispensaries/${dispensary.state.slug}/${dispensary.city.slug}`} className="text-gray-500 hover:text-gray-700">
                {dispensary.city.name}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{dispensary.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {dispensary.name}
                    </h1>
                    {dispensary.chainName && (
                      <p className="text-gray-600">Part of {dispensary.chainName}</p>
                    )}
                  </div>
                  {dispensary.rating != null && dispensary.rating > 0 && (
                    <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-yellow-500 text-xl mr-1">★</span>
                      <span className="text-xl font-bold text-gray-900">{dispensary.rating.toFixed(1)}</span>
                      {dispensary.reviewsCount != null && dispensary.reviewsCount > 0 && (
                        <span className="text-sm text-gray-500 ml-2">({dispensary.reviewsCount} reviews)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Trust Badge */}
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <TrustBadge
                    verificationDate={dispensary.verificationDate?.toISOString() ?? null}
                    verificationMethod={dispensary.verificationMethod}
                    verificationStatus={dispensary.verificationStatus}
                    verifiedBy={dispensary.verifiedBy}
                    isClaimed={dispensary.isClaimed}
                    claimedDate={dispensary.claimedDate?.toISOString() ?? null}
                    menuAccuracyScore={dispensary.menuAccuracyScore}
                    inaccuracyReportsCount={dispensary.inaccuracyReportsCount}
                    lastReportedInaccuracy={dispensary.lastReportedInaccuracy?.toISOString() ?? null}
                    communityConfirmations={dispensary.communityConfirmations}
                    size="full"
                  />
                  {dispensary.isClaimed && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Claimed by owner
                    </span>
                  )}
                  {dispensary.verificationDate && (
                    <span className="text-xs text-gray-500">
                      Menu last verified: {dispensary.verificationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {dispensary.verificationDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} via {dispensary.verificationMethod?.replace(/_/g, ' ').toLowerCase() ?? 'unknown'}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-3 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {open ? 'Open Now' : 'Closed'}
                  </span>
                  {nextChange && (
                    <span className="text-gray-600 text-sm">{nextChange}</span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${dispensary.licenseType === 'MEDICAL' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {dispensary.licenseType === 'MEDICAL' ? 'Medical' : dispensary.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical & Recreational'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {dispensary.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed">{dispensary.description}</p>
                </div>
              )}

              {/* Menu & Prices Section */}
              {menuProducts.length > 0 && (
                <div className="mb-8" id="menu">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <DispensaryMenu
                      products={menuProducts.map((p) => ({
                        ...p,
                        lastScrapedAt: p.lastScrapedAt.toISOString(),
                      }))}
                      dispensaryName={dispensary.name}
                      dispensarySlug={dispensary.slug}
                      lastScrapedAt={latestScrapeAt ? latestScrapeAt.toISOString() : null}
                    />
                  </div>
                </div>
              )}

              {/* Hours */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Hours of Operation</h2>
                  <ReportInaccuracyButton
                    dispensaryId={dispensary.id}
                    dispensaryName={dispensary.name}
                    variant="inline"
                    preselectedCategory="WRONG_HOURS"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  {sortedHours.length > 0 ? (
                    <div className="space-y-2">
                      {sortedHours.map((h) => {
                        const isToday = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase() === h.dayOfWeek
                        return (
                          <div
                            key={h.dayOfWeek}
                            className={`flex justify-between py-2 ${isToday ? 'font-semibold text-green-600' : 'text-gray-600'}`}
                          >
                            <span>{DAY_NAMES[h.dayOfWeek]}{isToday && ' (Today)'}</span>
                            <span>
                              {h.isClosed ? 'Closed' : `${formatTime(h.openTime)} - ${formatTime(h.closeTime)}`}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Hours not available. Please call for hours.</p>
                  )}
                </div>
              </div>

              {/* Verification History */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification History</h2>
                <div className="bg-gray-50 rounded-xl p-5">
                  {dispensary.verificationDate ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Verified via {dispensary.verificationMethod?.replace(/_/g, ' ').toLowerCase() ?? 'unknown method'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dispensary.verificationDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {dispensary.verificationDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            {dispensary.verifiedBy && ` by ${dispensary.verifiedBy}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No verification history yet. We&apos;re working on verifying all dispensaries.</p>
                  )}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  <a
                    href={`https://maps.google.com/?q=${dispensary.latitude},${dispensary.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mb-8">
                <Reviews
                  entityType="dispensary"
                  entityId={dispensary.id}
                  entityName={dispensary.name}
                />
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                {/* Contact Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 mb-1">Address</div>
                      <ReportInaccuracyButton
                        dispensaryId={dispensary.id}
                        dispensaryName={dispensary.name}
                        variant="inline"
                        preselectedCategory="WRONG_ADDRESS"
                      />
                    </div>
                    <div className="font-medium text-gray-900">
                      {dispensary.address}
                      {dispensary.address2 && <>, {dispensary.address2}</>}
                      <br />
                      {dispensary.city.name}, {dispensary.state.abbreviation} {dispensary.zipCode}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <ReportInaccuracyButton
                        dispensaryId={dispensary.id}
                        dispensaryName={dispensary.name}
                        variant="inline"
                        preselectedCategory="WRONG_PHONE"
                      />
                    </div>
                    <a href={`tel:${dispensary.phone?.replace(/[^0-9]/g, '')}`} className="font-medium text-green-600 hover:text-green-700">
                      {dispensary.phone}
                    </a>
                  </div>
                  {dispensary.website && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Website</div>
                      <a
                        href={dispensary.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-green-600 hover:text-green-700"
                      >
                        Visit Website →
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href={`tel:${dispensary.phone?.replace(/[^0-9]/g, '')}`}
                    className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Now
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${dispensary.latitude},${dispensary.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                  </a>
                  {dispensary.website && (
                    <ShopNowButton
                      dispensaryId={dispensary.id}
                      destinationUrl={dispensary.website}
                      buttonText="Visit Website"
                      variant="outline"
                      fullWidth
                      className="justify-center"
                    />
                  )}
                </div>

                {/* Features List */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-3">Features</div>
                  <div className="space-y-2">
                    {dispensary.hasDelivery && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Delivery Available
                      </div>
                    )}
                    {dispensary.hasStorefront && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Storefront
                      </div>
                    )}
                    {dispensary.hasCurbside && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Curbside Pickup
                      </div>
                    )}
                    {dispensary.acceptsCreditCard && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Accepts Credit Cards
                      </div>
                    )}
                    {dispensary.hasATM && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> ATM On-site
                      </div>
                    )}
                    {dispensary.isWheelchairAccessible && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5 h-5 mr-2 text-green-500">✓</span> Wheelchair Accessible
                      </div>
                    )}
                  </div>
                </div>

                {/* Menu summary in sidebar */}
                {menuProducts.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-3">Menu</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Products</span>
                        <span className="font-medium text-gray-900">{menuProducts.length}</span>
                      </div>
                      {lowestPrice !== null && (
                        <div className="flex justify-between text-gray-600">
                          <span>Starting at</span>
                          <span className="font-medium text-green-600">${lowestPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {menuProducts.filter((p) => p.isOnSale).length > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>On sale</span>
                          <span className="font-medium text-red-500">{menuProducts.filter((p) => p.isOnSale).length} items</span>
                        </div>
                      )}
                    </div>
                    <a
                      href="#menu"
                      className="mt-3 block text-center text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      View Full Menu ↓
                    </a>
                  </div>
                )}

                {/* Share */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ShareButtons
                    url={`https://leefii.com/dispensary/${dispensary.slug}`}
                    title={dispensary.name}
                    variant="inline"
                    heading="Share This Dispensary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Related Dispensaries */}
          {relatedDispensaries.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Other Dispensaries in {dispensary.city.name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedDispensaries.map((related) => (
                  <Link
                    key={related.id}
                    href={`/dispensary/${related.slug}`}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
                  >
                    <div className="font-semibold text-gray-900 hover:text-green-600 mb-1">
                      {related.name}
                    </div>
                    <div className="text-sm text-gray-500">{related.address}</div>
                    {related.rating != null && related.rating > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-700">{related.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Report Button */}
        <ReportInaccuracyButton
          dispensaryId={dispensary.id}
          dispensaryName={dispensary.name}
          variant="floating"
        />
      </div>
    </>
  )
}
