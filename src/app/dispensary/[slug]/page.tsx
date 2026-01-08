import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

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

  return {
    title: `${dispensary.name} - Hours, Address & Phone | Leefii`,
    description: `${dispensary.name} at ${dispensary.address}, ${dispensary.city.name}, ${dispensary.state.abbreviation}. Call ${dispensary.phone}. ${dispensary.hasDelivery ? 'Delivery available.' : ''} ${dispensary.licenseType === 'MEDICAL' ? 'Medical marijuana dispensary.' : 'Recreational dispensary.'}`,
    openGraph: {
      title: dispensary.name,
      description: `${dispensary.address}, ${dispensary.city.name}, ${dispensary.state.abbreviation}. Call ${dispensary.phone}.`
    }
  }
}

export default async function DispensaryPage({ params }: Props) {
  const dispensary = await prisma.dispensary.findUnique({
    where: { slug: params.slug },
    include: {
      city: true,
      state: true,
      BusinessHours: { orderBy: { dayOfWeek: 'asc' } }
    }
  })

  if (!dispensary) {
    notFound()
  }

  // Sort hours by day
  const sortedHours = [...dispensary.BusinessHours].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  )

  // Get open status
  const { open, nextChange } = isOpenNow(dispensary.BusinessHours)

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

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
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
    }))
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

                {/* Status Badge */}
                <div className="mt-4 flex items-center space-x-4">
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

              {/* Hours */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours of Operation</h2>
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
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                {/* Contact Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="font-medium text-gray-900">
                      {dispensary.address}
                      {dispensary.address2 && <>, {dispensary.address2}</>}
                      <br />
                      {dispensary.city.name}, {dispensary.state.abbreviation} {dispensary.zipCode}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Phone</div>
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
                    <a
                      href={dispensary.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Visit Website
                    </a>
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
      </div>
    </>
  )
}
