import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ state: string; city: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) return {}
  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) return {}

  const title = city.metaTitle || `Dispensaries in ${city.name}, ${state.abbreviation} | ${city.dispensaryCount} Dispensaries | Leefii`
  const description = city.metaDescription || `Find ${city.dispensaryCount} cannabis dispensaries in ${city.name}, ${state.abbreviation}. Compare ratings, hours, deals, and delivery options.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}` },
  }
}

function isCurrentlyOpen(businessHours: any[]): { open: boolean; closeTime?: string } {
  if (!businessHours || businessHours.length === 0) return { open: false }
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const now = new Date()
  const todayName = days[now.getDay()]
  const currentTime = now.toTimeString().slice(0, 5)
  const todayHours = businessHours.find((h) => h.dayOfWeek === todayName)
  if (!todayHours || todayHours.isClosed) return { open: false }
  const isOpen = currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
  return { open: isOpen, closeTime: todayHours.closeTime }
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params

  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()

  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) notFound()

  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
    include: { BusinessHours: true },
  })

  if (dispensaries.length === 0) notFound()

  const nearbyCities = await prisma.city.findMany({
    where: { stateId: state.id, dispensaryCount: { gt: 0 }, NOT: { id: city.id } },
    orderBy: { dispensaryCount: 'desc' },
    take: 8,
    select: { name: true, slug: true, dispensaryCount: true },
  })

  const deliveryCount = dispensaries.filter((d) => d.hasDelivery).length

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Cannabis Dispensaries in ${city.name}, ${state.abbreviation}`,
    numberOfItems: dispensaries.length,
    itemListElement: dispensaries.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: d.name,
        address: { '@type': 'PostalAddress', streetAddress: d.address, addressLocality: city.name, addressRegion: state.abbreviation, postalCode: d.zipCode },
        geo: d.latitude && d.longitude ? { '@type': 'GeoCoordinates', latitude: d.latitude, longitude: d.longitude } : undefined,
        telephone: d.phone || undefined,
        url: `https://leefii.com/dispensary/${d.slug}`,
        ...(d.rating && d.rating > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: d.rating, reviewCount: d.reviewsCount } } : {}),
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
      { '@type': 'ListItem', position: 4, name: city.name },
    ],
  }

  const faqData = [
    { q: `How many dispensaries are in ${city.name}?`, a: `There are ${dispensaries.length} active cannabis dispensaries in ${city.name}, ${state.abbreviation}.` },
    { q: `Which dispensaries in ${city.name} deliver?`, a: deliveryCount > 0 ? `${deliveryCount} dispensaries in ${city.name} offer delivery.` : `Currently no dispensaries in ${city.name} list delivery on Leefii.` },
    { q: `What are the best dispensaries in ${city.name}?`, a: `The top-rated dispensary is ${dispensaries[0].name}${dispensaries[0].rating ? ` with a ${dispensaries[0].rating.toFixed(1)} rating` : ''}.` },
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
            <span className="text-gray-900 font-medium">{city.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Dispensaries in {city.name}, {state.abbreviation}</h1>
          <p className="text-green-100 text-lg mb-6">
            Find {dispensaries.length} licensed cannabis dispensaries in {city.name}, {state.name}.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">Dispensaries</div>
            </div>
            {deliveryCount > 0 && (
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{deliveryCount}</div>
                <div className="text-green-100 text-sm">Deliver</div>
              </div>
            )}
          </div>
          <p className="text-sm text-green-200 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Dispensary Listings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {dispensaries.map((dispensary) => {
            const status = isCurrentlyOpen(dispensary.BusinessHours)
            return (
              <Link key={dispensary.id} href={`/dispensary/${dispensary.slug}`} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition block">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {dispensary.isPremium && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Featured</span>
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">{dispensary.name}</h2>
                      {status.open ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Open · Closes {status.closeTime}</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">Closed</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{dispensary.address}</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                      <span className="text-gray-500">
                        {dispensary.licenseType === 'BOTH' ? 'Rec & Med' : dispensary.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                      </span>
                      {dispensary.hasDelivery && <span className="text-blue-600 font-medium">🚗 Delivers</span>}
                      {dispensary.acceptsCreditCard && <span className="text-gray-500">💳 Cards</span>}
                      {dispensary.hasCurbside && <span className="text-gray-500">🅿️ Curbside</span>}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {dispensary.rating && dispensary.rating > 0 ? (
                      <>
                        <span className="text-yellow-500 font-bold text-lg">★ {dispensary.rating.toFixed(1)}</span>
                        <p className="text-xs text-gray-400">{dispensary.reviewsCount} reviews</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {nearbyCities.map((nc) => (
                <Link key={nc.slug} href={`/dispensaries/${state.slug}/${nc.slug}`} className="bg-white rounded-xl p-4 text-center border hover:shadow-md transition">
                  <p className="font-medium text-gray-900">{nc.name}</p>
                  <p className="text-sm text-gray-500">{nc.dispensaryCount} dispensaries</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
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
