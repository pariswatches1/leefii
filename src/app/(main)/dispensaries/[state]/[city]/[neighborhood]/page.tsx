import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ state: string; city: string; neighborhood: string }>
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
  // Get cities with population >= 50K that have dispensaries
  const cities = await prisma.city.findMany({
    where: { dispensaryCount: { gt: 0 }, population: { gte: 50000 } },
    select: { slug: true, state: { select: { slug: true } }, id: true },
  })

  const params: { state: string; city: string; neighborhood: string }[] = []

  for (const city of cities) {
    // Get distinct zip codes for this city's dispensaries
    const dispensaries = await prisma.dispensary.findMany({
      where: { cityId: city.id, isActive: true },
      select: { zipCode: true },
      distinct: ['zipCode'],
    })

    const zips = Array.from(new Set(dispensaries.map((d) => d.zipCode).filter(Boolean)))
    for (const zip of zips) {
      params.push({ state: city.state.slug, city: city.slug, neighborhood: zip })
    }
  }

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, neighborhood: zipCode } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) return {}
  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) return {}

  const count = await prisma.dispensary.count({ where: { cityId: city.id, zipCode, isActive: true } })
  if (count === 0) return {}

  const title = `Dispensaries Near ${zipCode} in ${city.name}, ${state.abbreviation} — ${count} Stores | Leefii`
  const description = `Find ${count} cannabis dispensaries near zip code ${zipCode} in ${city.name}, ${state.abbreviation}. Compare recreational & medical stores, delivery options, ratings, and hours near you.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}/${zipCode}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}/${zipCode}` },
  }
}

export default async function NeighborhoodPage({ params }: Props) {
  const { state: stateSlug, city: citySlug, neighborhood: zipCode } = await params

  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()

  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) notFound()

  // Get dispensaries in this zip code
  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, zipCode, isActive: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
    include: { BusinessHours: true },
  })

  if (dispensaries.length === 0) notFound()

  // Find nearby dispensaries in other zip codes (within 5 miles)
  const centerLat = dispensaries.reduce((sum, d) => sum + d.latitude, 0) / dispensaries.length
  const centerLng = dispensaries.reduce((sum, d) => sum + d.longitude, 0) / dispensaries.length

  const allCityDispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true, NOT: { zipCode } },
    select: { id: true, name: true, slug: true, address: true, zipCode: true, latitude: true, longitude: true, rating: true, reviewsCount: true, licenseType: true, hasDelivery: true },
  })

  const nearbyDispensaries = allCityDispensaries
    .map((d) => ({ ...d, distance: haversineDistance(centerLat, centerLng, d.latitude, d.longitude) }))
    .filter((d) => d.distance <= 5)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10)

  // Other zip codes in this city
  const otherZips = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true, NOT: { zipCode } },
    select: { zipCode: true },
    distinct: ['zipCode'],
  })
  const uniqueOtherZips = Array.from(new Set(otherZips.map((d) => d.zipCode).filter(Boolean))).slice(0, 12)

  // Stats
  const recCount = dispensaries.filter((d) => d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH').length
  const medCount = dispensaries.filter((d) => d.licenseType === 'MEDICAL' || d.licenseType === 'BOTH').length
  const deliveryCount = dispensaries.filter((d) => d.hasDelivery).length
  const avgRating = dispensaries.filter((d) => d.rating && Number(d.rating) > 0).reduce((sum, d) => sum + Number(d.rating), 0) / (dispensaries.filter((d) => d.rating && Number(d.rating) > 0).length || 1)

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Cannabis Dispensaries Near ${zipCode} in ${city.name}, ${state.abbreviation}`,
    numberOfItems: dispensaries.length,
    itemListElement: dispensaries.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: d.name,
        address: { '@type': 'PostalAddress', streetAddress: d.address, addressLocality: city.name, addressRegion: state.abbreviation, postalCode: d.zipCode },
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
      { '@type': 'ListItem', position: 2, name: 'Dispensaries', item: 'https://leefii.com/dispensaries' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://leefii.com/dispensaries/${state.slug}` },
      { '@type': 'ListItem', position: 4, name: city.name, item: `https://leefii.com/dispensaries/${state.slug}/${city.slug}` },
      { '@type': 'ListItem', position: 5, name: zipCode },
    ],
  }

  const faqData = [
    {
      q: `How many dispensaries are near ${zipCode} in ${city.name}?`,
      a: `There are ${dispensaries.length} licensed cannabis dispensaries in the ${zipCode} zip code area of ${city.name}, ${state.abbreviation}. ${nearbyDispensaries.length > 0 ? `Plus ${nearbyDispensaries.length} more dispensaries within 5 miles.` : ''} Browse all options above with ratings, hours, and services.`,
    },
    {
      q: `What is the best dispensary near ${zipCode}?`,
      a: `The highest-rated dispensary near ${zipCode} is ${dispensaries[0].name}${dispensaries[0].rating ? ` with a ${Number(dispensaries[0].rating).toFixed(1)}-star rating` : ''}. Compare all ${dispensaries.length} dispensaries in this area by rating, reviews, delivery options, and medical vs recreational availability.`,
    },
    {
      q: `Do any dispensaries near ${zipCode} offer delivery?`,
      a: deliveryCount > 0
        ? `Yes, ${deliveryCount} out of ${dispensaries.length} dispensaries in the ${zipCode} area offer cannabis delivery. This is a convenient option if you prefer not to visit a physical store.`
        : `Currently no dispensaries in the ${zipCode} area list delivery service on Leefii. You may find delivery options in nearby zip codes. Check back as more dispensaries add this service.`,
    },
    {
      q: `Are there recreational dispensaries near ${zipCode}?`,
      a: recCount > 0
        ? `Yes, ${recCount} dispensaries near ${zipCode} offer recreational cannabis for adults 21 and older. No medical card is needed — just bring a valid government-issued photo ID.`
        : `Dispensaries near ${zipCode} currently serve medical patients only. You will need a valid medical marijuana card to make purchases. Visit our doctors page to find physicians who can help.`,
    },
    {
      q: `What is the average dispensary rating near ${zipCode}?`,
      a: `Dispensaries in the ${zipCode} zip code have an average rating of ${avgRating.toFixed(1)} out of 5 stars. We recommend comparing individual reviews and ratings above to find the best dispensary for your needs.`,
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
            <Link href="/dispensaries" className="text-gray-500 hover:text-gray-700">Dispensaries</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/dispensaries/${state.slug}`} className="text-gray-500 hover:text-gray-700">{state.name}</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/dispensaries/${state.slug}/${city.slug}`} className="text-gray-500 hover:text-gray-700">{city.name}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{zipCode}</span>
          </nav>
        </div>
      </div>

      {/* Quick Answer Block */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-700 text-lg max-w-3xl">
            There {dispensaries.length === 1 ? 'is' : 'are'} <strong>{dispensaries.length} licensed cannabis dispensar{dispensaries.length === 1 ? 'y' : 'ies'}</strong> near zip code {zipCode} in {city.name}, {state.abbreviation}.
            {recCount > 0 && ` ${recCount} offer recreational products.`}
            {medCount > 0 && ` ${medCount} serve medical patients.`}
            {deliveryCount > 0 && ` ${deliveryCount} provide delivery.`}
            {' '}Compare ratings, hours, and services below.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dispensaries Near {zipCode} in {city.name}, {state.abbreviation}</h1>
          <p className="text-green-100 text-lg">Find cannabis dispensaries in and around the {zipCode} zip code area</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">In {zipCode}</div>
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

      {/* Dispensary Listings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Dispensaries in {zipCode}</h2>
        <div className="grid gap-4">
          {dispensaries.map((d) => (
            <Link key={d.id} href={`/dispensary/${d.slug}`} className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-500 transition block">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {d.isPremium && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>}
                    <h3 className="font-bold text-lg text-gray-900">{d.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{d.address}, {city.name}, {state.abbreviation} {d.zipCode}</p>
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

      {/* Nearby Dispensaries (other zip codes) */}
      {nearbyDispensaries.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nearby Dispensaries Within 5 Miles</h2>
            <p className="text-gray-600 mb-6">More dispensaries near {zipCode} in other areas of {city.name}.</p>
            <div className="grid gap-3">
              {nearbyDispensaries.map((d) => (
                <Link key={d.id} href={`/dispensary/${d.slug}`} className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-green-500 transition flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <p className="text-sm text-gray-500">{d.address} · {d.zipCode}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {d.licenseType === 'BOTH' ? 'Rec & Med' : d.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                      </span>
                      {d.hasDelivery && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Delivery</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-700">{d.distance.toFixed(1)} mi</div>
                    {d.rating && Number(d.rating) > 0 && <div className="text-sm text-gray-500">{Number(d.rating).toFixed(1)} ★</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local Guide */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispensary Guide for {zipCode}, {city.name}</h2>
          <div className="bg-white rounded-xl p-6 border space-y-4 text-gray-600">
            <p>
              The {zipCode} zip code in {city.name}, {state.abbreviation} is home to {dispensaries.length} licensed cannabis
              dispensar{dispensaries.length === 1 ? 'y' : 'ies'}.
              {state.isLegal && !state.medicalOnly
                ? ` As a legal recreational state, adults 21 and older can visit any licensed dispensary in the ${zipCode} area without a medical card. Just bring a valid government-issued photo ID.`
                : state.medicalOnly
                ? ` ${state.name} is a medical-only cannabis state, so you will need a valid medical marijuana card to purchase cannabis from dispensaries in the ${zipCode} area.`
                : ` Be sure to check current ${state.name} cannabis regulations before visiting a dispensary in the ${zipCode} area.`}
            </p>
            <p>
              When shopping for cannabis near {zipCode}, compare dispensary ratings, product selection, and services on Leefii.
              {deliveryCount > 0 ? ` ${deliveryCount} dispensaries in this area offer delivery, making it easy to shop from home.` : ''}
              {' '}Most dispensaries carry a full range of products including flower, edibles, concentrates, vape cartridges, tinctures, and topicals.
              First-time visitors should ask their budtender for personalized product recommendations based on desired effects and experience level.
            </p>
            <p>
              {nearbyDispensaries.length > 0
                ? `If you don't find what you're looking for in the ${zipCode} area, there are ${nearbyDispensaries.length} additional dispensaries within 5 miles. Expand your search to all of ${city.name} to see every option available.`
                : `Browse all dispensaries in ${city.name} for more options, or check nearby cities for additional choices.`}
              {' '}Prices, product availability, and daily deals can vary between dispensaries, so it pays to compare before making a trip.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Other Zip Codes */}
      {uniqueOtherZips.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Other Zip Codes in {city.name}</h2>
            <p className="text-gray-600 mb-6">Browse dispensaries by zip code in {city.name}, {state.abbreviation}.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {uniqueOtherZips.map((zip) => (
                <Link key={zip} href={`/dispensaries/${state.slug}/${city.slug}/${zip}`} className="bg-white rounded-xl p-4 border hover:shadow-md hover:border-green-500 transition text-center">
                  <p className="font-medium text-gray-900">{zip}</p>
                  <p className="text-sm text-gray-500">{city.name}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href={`/dispensaries/${state.slug}/${city.slug}`} className="text-green-600 hover:text-green-800 font-medium">
                View all dispensaries in {city.name} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Cross-links */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find More Near You</h2>
            <p className="text-gray-600 mb-4">Explore dispensaries, strains, and cannabis services in {city.name}.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/dispensaries/${state.slug}/${city.slug}`} className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition">
                All {city.name} Dispensaries
              </Link>
              <Link href={`/near-me/${zipCode}`} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                Near Me: {zipCode}
              </Link>
              <Link href="/strains" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition">
                Browse Strains
              </Link>
              <Link href={`/dispensaries/${state.slug}`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                All {state.name} Cities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
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
