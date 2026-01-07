import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ state: string; city: string }>
}

// Helper function to check if dispensary is open
function isOpenNow(hours: any[]): boolean {
  if (!hours || hours.length === 0) return false
  
  const now = new Date()
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = days[now.getDay()]
  const currentTime = now.getHours() * 100 + now.getMinutes()
  
  const todayHours = hours.find(h => h.dayOfWeek === today)
  if (!todayHours || todayHours.isClosed) return false
  
  const openTime = parseInt(todayHours.openTime.replace(':', ''))
  const closeTime = parseInt(todayHours.closeTime.replace(':', ''))
  
  return currentTime >= openTime && currentTime <= closeTime
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  const city = await prisma.city.findFirst({
    where: { slug: citySlug, state: { slug: stateSlug } },
    include: { _count: { select: { dispensaries: true } } }
  })

  if (!state || !city) {
    return { title: 'City Not Found' }
  }

  const count = city._count.dispensaries
  return {
    title: `${count} Dispensaries in ${city.name}, ${state.abbreviation} (2025) | Leefii`,
    description: `Find ${count} licensed dispensaries in ${city.name}, ${state.name}. Compare hours, get directions, and call directly. Updated ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}.`,
    openGraph: {
      title: `Dispensaries in ${city.name}, ${state.abbreviation}`,
      description: `Find ${count} licensed dispensaries in ${city.name}.`
    }
  }
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()

  const city = await prisma.city.findFirst({
    where: { slug: citySlug, stateId: state.id }
  })
  if (!city) notFound()

  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true },
    include: { hours: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }]
  })

  // Nearby cities
  const nearbyCities = await prisma.city.findMany({
    where: { stateId: state.id, id: { not: city.id } },
    take: 6,
    orderBy: { dispensaryCount: 'desc' }
  })

  // Count open now
  const openNowCount = dispensaries.filter(d => isOpenNow(d.hours)).length

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/dispensaries" className="text-gray-500 hover:text-gray-700">Dispensaries</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/dispensaries/${state.slug}`} className="text-gray-500 hover:text-gray-700">{state.name}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{city.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dispensaries in {city.name}, {state.abbreviation}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            {city.description || `Find ${dispensaries.length} licensed cannabis dispensaries in ${city.name}, ${state.name}. Compare hours, locations, and contact information.`}
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              📍 {dispensaries.length} Dispensaries
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-green-100 rounded-lg text-sm font-medium text-green-700">
              🟢 {openNowCount} Open Now
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg text-sm font-medium text-blue-700">
              {state.medicalOnly ? '🏥 Medical Only' : '✅ Recreational'}
            </span>
          </div>
        </div>
      </section>

      {/* Dispensary Listings */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dispensaries.length > 0 ? (
            <div className="space-y-4">
              {dispensaries.map((dispensary) => {
                const open = isOpenNow(dispensary.hours)
                return (
                  <div
                    key={dispensary.id}
                    className={`bg-white border rounded-xl p-5 hover:shadow-lg transition-shadow ${
                      dispensary.isPremium ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <Link 
                              href={`/dispensary/${dispensary.slug}`}
                              className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                            >
                              {dispensary.name}
                            </Link>
                            {dispensary.isPremium && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                                Featured
                              </span>
                            )}
                            
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {dispensary.address}, {city.name}, {state.abbreviation} {dispensary.zipCode}
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {dispensary.phone}
                              </div>
                            </div>
                            
                            {/* Features */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {open ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">🟢 Open</span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">🔴 Closed</span>
                              )}
                              {dispensary.hasDelivery && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  🚚 Delivery
                                </span>
                              )}
                              {dispensary.licenseType === 'MEDICAL' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  🏥 Medical
                                </span>
                              )}
                              {(dispensary.licenseType === 'RECREATIONAL' || dispensary.licenseType === 'BOTH') && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  🌿 Recreational
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Rating */}
                          {dispensary.rating > 0 && (
                            <div className="text-right">
                              <div className="inline-flex items-center px-2 py-1 bg-yellow-50 rounded-lg">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1 font-semibold text-gray-900">{dispensary.rating.toFixed(1)}</span>
                              </div>
                              {dispensary.reviewsCount > 0 && (
                                <div className="text-xs text-gray-500 mt-1">{dispensary.reviewsCount} reviews</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 md:flex-col">
                        
                          href={`tel:${dispensary.phone.replace(/[^0-9]/g, '')}`}
                          className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call
                        </a>
                        
                          href={`https://maps.google.com/?q=${dispensary.latitude},${dispensary.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No dispensaries found</h3>
              <p className="text-gray-600">We are adding more dispensaries to {city.name} soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Nearby Cities in {state.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {nearbyCities.map((nearbyCity) => (
                <Link
                  key={nearbyCity.id}
                  href={`/dispensaries/${state.slug}/${nearbyCity.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  {nearbyCity.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}