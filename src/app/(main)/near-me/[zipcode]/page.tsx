import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ zipcode: string }>
}

export const revalidate = 86400

// Haversine distance in miles
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function generateStaticParams() {
  // Get distinct zip codes that have active dispensaries
  const dispensaries = await prisma.dispensary.findMany({
    where: { isActive: true },
    select: { zipCode: true },
    distinct: ['zipCode'],
  })

  return dispensaries.map((d) => ({ zipcode: d.zipCode }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zipcode } = await params

  const dispensaries = await prisma.dispensary.findMany({
    where: { zipCode: zipcode, isActive: true },
    select: { city: { select: { name: true } }, state: { select: { abbreviation: true, name: true } } },
    take: 1,
  })

  const count = await prisma.dispensary.count({ where: { zipCode: zipcode, isActive: true } })

  // Get nearby count for the title
  const cityName = dispensaries[0]?.city.name || ''
  const stateAbbr = dispensaries[0]?.state.abbreviation || ''
  const stateName = dispensaries[0]?.state.name || ''
  const locationText = cityName ? `${cityName}, ${stateAbbr}` : zipcode

  const title = count > 0
    ? `Cannabis Dispensaries Near ${zipcode} (${locationText}) — ${count} Stores | Leefii`
    : `Cannabis Dispensaries Near ${zipcode} | Leefii`
  const description = count > 0
    ? `Find ${count} cannabis dispensaries near zip code ${zipcode} in ${locationText}. Compare recreational & medical stores, delivery, ratings, hours, and deals near you.`
    : `Search for cannabis dispensaries near zip code ${zipcode}. Browse ${stateName ? stateName + ' ' : ''}dispensaries on Leefii.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/near-me/${zipcode}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/near-me/${zipcode}` },
  }
}

export default async function ZipCodePage({ params }: Props) {
  const { zipcode } = await params

  // Validate zip code format
  if (!/^\d{5}$/.test(zipcode)) notFound()

  // Dispensaries in this exact zip code
  const exactDispensaries = await prisma.dispensary.findMany({
    where: { zipCode: zipcode, isActive: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
    include: {
      city: { select: { name: true, slug: true } },
      state: { select: { name: true, slug: true, abbreviation: true, isLegal: true, medicalOnly: true } },
      BusinessHours: true,
    },
  })

  // If no dispensaries in this exact zip, find nearby
  let centerLat = 0
  let centerLng = 0
  let nearbyDispensaries: (typeof exactDispensaries[0] & { distance: number })[] = []

  if (exactDispensaries.length > 0) {
    centerLat = exactDispensaries.reduce((sum, d) => sum + d.latitude, 0) / exactDispensaries.length
    centerLng = exactDispensaries.reduce((sum, d) => sum + d.longitude, 0) / exactDispensaries.length
  }

  // Always find nearby dispensaries (in other zip codes within 10 miles)
  if (centerLat !== 0 && centerLng !== 0) {
    // Rough lat/lng bounding box for 10 miles
    const latDelta = 10 / 69 // ~1 degree latitude = 69 miles
    const lngDelta = 10 / (69 * Math.cos((centerLat * Math.PI) / 180))

    const allNearby = await prisma.dispensary.findMany({
      where: {
        isActive: true,
        NOT: { zipCode: zipcode },
        latitude: { gte: centerLat - latDelta, lte: centerLat + latDelta },
        longitude: { gte: centerLng - lngDelta, lte: centerLng + lngDelta },
      },
      include: {
        city: { select: { name: true, slug: true } },
        state: { select: { name: true, slug: true, abbreviation: true, isLegal: true, medicalOnly: true } },
        BusinessHours: true,
      },
    })

    nearbyDispensaries = allNearby
      .map((d) => ({ ...d, distance: haversineDistance(centerLat, centerLng, d.latitude, d.longitude) }))
      .filter((d) => d.distance <= 10)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20)
  }

  if (exactDispensaries.length === 0 && nearbyDispensaries.length === 0) notFound()

  const allDispensaries = [...exactDispensaries, ...nearbyDispensaries]
  const primaryCity = exactDispensaries[0]?.city || nearbyDispensaries[0]?.city
  const primaryState = exactDispensaries[0]?.state || nearbyDispensaries[0]?.state
  const locationText = primaryCity ? `${primaryCity.name}, ${primaryState.abbreviation}` : zipcode

  // Stats
  const totalCount = allDispensaries.length
  const recCount = allDispensaries.filter((d) => d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH').length
  const medCount = allDispensaries.filter((d) => d.licenseType === 'MEDICAL' || d.licenseType === 'BOTH').length
  const deliveryCount = allDispensaries.filter((d) => d.hasDelivery).length

  // Nearby zip codes
  const nearbyZips = Array.from(new Set(nearbyDispensaries.map((d) => d.zipCode))).slice(0, 8)

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Cannabis Dispensaries Near ${zipcode}`,
    numberOfItems: totalCount,
    itemListElement: allDispensaries.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: d.name,
        address: { '@type': 'PostalAddress', streetAddress: d.address, addressLocality: d.city.name, addressRegion: d.state.abbreviation, postalCode: d.zipCode },
        geo: { '@type': 'GeoCoordinates', latitude: d.latitude, longitude: d.longitude },
        telephone: d.phone || undefined,
        url: `https://leefii.com/dispensary/${d.slug}`,
        ...(d.rating && Number(d.rating) > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(d.rating), reviewCount: d.reviewsCount } } : {}),
      },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Near Me', item: 'https://leefii.com/near-me' },
      { '@type': 'ListItem', position: 3, name: zipcode },
    ],
  }

  const faqData = [
    {
      q: `How many dispensaries are near zip code ${zipcode}?`,
      a: `There ${exactDispensaries.length === 1 ? 'is' : 'are'} ${exactDispensaries.length} dispensar${exactDispensaries.length === 1 ? 'y' : 'ies'} in the ${zipcode} zip code${nearbyDispensaries.length > 0 ? `, plus ${nearbyDispensaries.length} more within 10 miles` : ''}. Browse all options with ratings, hours, and services on Leefii.`,
    },
    {
      q: `What types of dispensaries are near ${zipcode}?`,
      a: `Near ${zipcode} you can find ${recCount > 0 ? `${recCount} recreational` : ''}${recCount > 0 && medCount > 0 ? ' and ' : ''}${medCount > 0 ? `${medCount} medical` : ''} dispensar${totalCount === 1 ? 'y' : 'ies'}.${deliveryCount > 0 ? ` ${deliveryCount} offer delivery service.` : ''}`,
    },
    {
      q: `Do I need a medical card for dispensaries near ${zipcode}?`,
      a: primaryState?.isLegal && !primaryState?.medicalOnly
        ? `No. ${primaryState.name} allows recreational cannabis purchases for adults 21+. Just bring a valid government-issued photo ID. Medical patients may access additional benefits with an MMJ card.`
        : primaryState?.medicalOnly
        ? `Yes. ${primaryState.name} requires a valid medical marijuana card to purchase cannabis. Visit our doctors page to find MMJ physicians near you.`
        : `Requirements vary by state. Check local regulations in your area before visiting a dispensary.`,
    },
    {
      q: `Which dispensary near ${zipcode} has the best ratings?`,
      a: allDispensaries.length > 0 && allDispensaries[0].rating
        ? `The highest-rated dispensary near ${zipcode} is ${allDispensaries[0].name} with a ${Number(allDispensaries[0].rating).toFixed(1)}-star rating from ${allDispensaries[0].reviewsCount} reviews. Compare all ${totalCount} dispensaries above to find the best fit for your needs.`
        : `Browse all ${totalCount} dispensaries near ${zipcode} above and compare their ratings, reviews, and services.`,
    },
    {
      q: `Can I get cannabis delivered near ${zipcode}?`,
      a: deliveryCount > 0
        ? `Yes! ${deliveryCount} dispensar${deliveryCount === 1 ? 'y' : 'ies'} near ${zipcode} offer cannabis delivery. Look for the "Delivery" badge on dispensary listings above.`
        : `Currently no dispensaries near ${zipcode} list delivery on Leefii. Check neighboring areas or visit a storefront dispensary nearby.`,
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/near-me" className="text-gray-500 hover:text-gray-700">Near Me</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{zipcode}</span>
          </nav>
        </div>
      </div>

      {/* Quick Answer */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-700 text-lg max-w-3xl">
            {exactDispensaries.length > 0 ? (
              <>
                There {exactDispensaries.length === 1 ? 'is' : 'are'} <strong>{exactDispensaries.length} licensed dispensar{exactDispensaries.length === 1 ? 'y' : 'ies'}</strong> in zip code {zipcode} ({locationText}).
                {nearbyDispensaries.length > 0 && ` Plus ${nearbyDispensaries.length} more within 10 miles.`}
              </>
            ) : (
              <>
                No dispensaries are located directly in {zipcode}, but we found <strong>{nearbyDispensaries.length} dispensar{nearbyDispensaries.length === 1 ? 'y' : 'ies'}</strong> within 10 miles near {locationText}.
              </>
            )}
            {' '}Compare ratings, services, and hours below.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Cannabis Dispensaries Near {zipcode}</h1>
          <p className="text-green-100 text-lg">{locationText} area</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-green-100 text-sm">Total Nearby</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{recCount}</div>
              <div className="text-green-100 text-sm">Recreational</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{medCount}</div>
              <div className="text-green-100 text-sm">Medical</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{deliveryCount}</div>
              <div className="text-green-100 text-sm">Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exact Zip Dispensaries */}
      {exactDispensaries.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dispensaries in {zipcode}</h2>
          <div className="grid gap-4">
            {exactDispensaries.map((d) => (
              <Link key={d.id} href={`/dispensary/${d.slug}`} className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-500 transition block">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {d.isPremium && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>}
                      <h3 className="font-bold text-lg text-gray-900">{d.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{d.address}, {d.city.name}, {d.state.abbreviation} {d.zipCode}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {d.licenseType === 'BOTH' ? 'Rec & Med' : d.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                      </span>
                      {d.hasDelivery && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Delivery</span>}
                      {d.hasStorefront && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">Storefront</span>}
                      {d.hasCurbside && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">Curbside</span>}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {d.rating && Number(d.rating) > 0 ? (
                      <div>
                        <div className="text-lg font-bold text-green-700">{Number(d.rating).toFixed(1)} ★</div>
                        <div className="text-xs text-gray-500">{d.reviewsCount} reviews</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No ratings yet</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Dispensaries */}
      {nearbyDispensaries.length > 0 && (
        <section className={exactDispensaries.length > 0 ? 'py-12 bg-gray-50' : 'max-w-7xl mx-auto px-4 py-8'}>
          <div className={exactDispensaries.length > 0 ? 'max-w-7xl mx-auto px-4' : ''}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {exactDispensaries.length > 0 ? 'More Dispensaries Within 10 Miles' : `Dispensaries Near ${zipcode}`}
            </h2>
            <p className="text-gray-600 mb-6">
              {exactDispensaries.length > 0
                ? `${nearbyDispensaries.length} additional dispensaries found near ${zipcode}.`
                : `${nearbyDispensaries.length} dispensaries found within 10 miles of ${zipcode}.`}
            </p>
            <div className="grid gap-3">
              {nearbyDispensaries.map((d) => (
                <Link key={d.id} href={`/dispensary/${d.slug}`} className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-green-500 transition flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <p className="text-sm text-gray-500">{d.address} · {d.city.name}, {d.state.abbreviation} {d.zipCode}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {d.licenseType === 'BOTH' ? 'Rec & Med' : d.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                      </span>
                      {d.hasDelivery && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Delivery</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-700">{d.distance.toFixed(1)} mi</div>
                    {d.rating && Number(d.rating) > 0 && <div className="text-sm text-gray-500">{Number(d.rating).toFixed(1)} ★</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guide */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cannabis Shopping Guide for {zipcode}</h2>
          <div className="bg-white rounded-xl p-6 border space-y-4 text-gray-600">
            <p>
              {primaryCity && primaryState ? (
                <>
                  The {zipcode} zip code is located in {primaryCity.name}, {primaryState.name}.
                  {primaryState.isLegal && !primaryState.medicalOnly
                    ? ` ${primaryState.name} has legalized recreational cannabis, meaning adults 21 and older can purchase from any licensed dispensary with a valid photo ID. No medical card is required for recreational purchases.`
                    : primaryState.medicalOnly
                    ? ` ${primaryState.name} has legalized medical cannabis only. You will need a valid medical marijuana card to purchase from dispensaries in this area. Visit our doctors page to find qualifying physicians.`
                    : ` Cannabis regulations in ${primaryState.name} continue to evolve. Check current state and local laws before visiting a dispensary.`}
                </>
              ) : (
                <>Search for cannabis dispensaries near zip code {zipcode}. Check local regulations before visiting.</>
              )}
            </p>
            <p>
              When visiting a dispensary near {zipcode} for the first time, bring your government-issued photo ID and arrive during business hours listed on the dispensary page.
              Most stores carry flower, pre-rolls, edibles, vape cartridges, concentrates, tinctures, and topicals. Budtenders can recommend products based on your experience level and desired effects.
              {deliveryCount > 0 && ` If you prefer shopping from home, ${deliveryCount} dispensaries in this area offer delivery service.`}
            </p>
          </div>
        </div>
      </section>

      {/* Nearby Zip Codes + City Link */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {nearbyZips.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nearby Zip Codes</h2>
                <div className="grid grid-cols-2 gap-3">
                  {nearbyZips.map((zip) => (
                    <Link key={zip} href={`/near-me/${zip}`} className="bg-white rounded-xl border p-3 hover:shadow-md hover:border-green-500 transition text-center">
                      <p className="font-medium text-gray-900">{zip}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {primaryCity && primaryState && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by City</h2>
                <div className="space-y-3">
                  <Link href={`/dispensaries/${primaryState.slug}/${primaryCity.slug}`} className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-green-500 transition block">
                    <p className="font-medium text-gray-900">All Dispensaries in {primaryCity.name}</p>
                    <p className="text-sm text-gray-500">View every dispensary in {primaryCity.name}, {primaryState.abbreviation}</p>
                  </Link>
                  <Link href={`/dispensaries/${primaryState.slug}`} className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-green-500 transition block">
                    <p className="font-medium text-gray-900">All Dispensaries in {primaryState.name}</p>
                    <p className="text-sm text-gray-500">Browse all {primaryState.name} cities</p>
                  </Link>
                  <Link href="/near-me" className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-green-500 transition block">
                    <p className="font-medium text-gray-900">Search Another Zip Code</p>
                    <p className="text-sm text-gray-500">Find dispensaries anywhere in the US</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl border">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">{f.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
