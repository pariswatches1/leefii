import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ state: string; city: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) return {}
  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) return {}

  const title = `Cannabis Delivery in ${city.name}, ${state.abbreviation} | Leefii`
  const description = `Find dispensaries that deliver cannabis in ${city.name}, ${state.abbreviation}. Compare delivery options, ratings, and hours.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/delivery/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/delivery/${stateSlug}/${citySlug}` },
  }
}

export default async function DeliveryCityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()
  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) notFound()

  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true, hasDelivery: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
    include: { BusinessHours: true },
  })

  if (dispensaries.length === 0) notFound()

  const totalInCity = await prisma.dispensary.count({ where: { cityId: city.id, isActive: true } })

  const nearbyCities = await prisma.city.findMany({
    where: {
      stateId: state.id,
      NOT: { id: city.id },
      dispensaries: { some: { isActive: true, hasDelivery: true } },
    },
    take: 6,
    select: {
      name: true,
      slug: true,
      _count: { select: { dispensaries: { where: { isActive: true, hasDelivery: true } } } },
    },
  })

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = days[new Date().getDay()]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Delivery', item: 'https://leefii.com/delivery' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://leefii.com/dispensaries/${state.slug}` },
      { '@type': 'ListItem', position: 4, name: `${city.name} Delivery` },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/delivery" className="hover:text-green-600">Delivery</Link>
          <span className="mx-2">/</span>
          <Link href={`/dispensaries/${state.slug}`} className="hover:text-green-600">{state.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{city.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Cannabis Delivery in {city.name}, {state.abbreviation}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {dispensaries.length} Deliver{dispensaries.length === 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {totalInCity} Total in {city.name}
          </span>
        </div>

        <p className="text-gray-600 text-lg mb-8 max-w-3xl">
          {dispensaries.length} licensed cannabis {dispensaries.length === 1 ? 'dispensary delivers' : 'dispensaries deliver'} in {city.name}, {state.abbreviation}.
          Compare ratings, check delivery hours, and find the best option near you. Must be 21+ with valid ID.
        </p>

        {/* Delivery Dispensaries */}
        <section className="mb-12">
          <div className="space-y-3">
            {dispensaries.map((d) => {
              const todayHours = d.BusinessHours.find((bh) => bh.dayOfWeek === today)
              const isOpen = todayHours && !todayHours.isClosed

              return (
                <Link
                  key={d.slug}
                  href={`/dispensary/${d.slug}`}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {d.isPremium && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Featured</span>
                        )}
                        <h3 className="font-semibold text-gray-900 text-lg">{d.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{d.address}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="text-blue-600 font-medium">🚗 Delivers</span>
                        {isOpen ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Open · Closes {todayHours?.closeTime}</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Closed</span>
                        )}
                        {d.hasStorefront && <span className="text-gray-500">Also has storefront</span>}
                        {d.hasCurbside && <span className="text-gray-500">🅿️ Curbside</span>}
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      {d.rating && d.rating > 0 ? (
                        <>
                          <span className="text-yellow-500 font-bold text-lg">★ {d.rating.toFixed(1)}</span>
                          <p className="text-xs text-gray-400">{d.reviewsCount} reviews</p>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Browse All + Nearby */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">All Dispensaries in {city.name}</h2>
            <Link
              href={`/dispensaries/${state.slug}/${city.slug}`}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              View All {totalInCity} Dispensaries
            </Link>
          </div>
          {nearbyCities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Nearby Delivery</h2>
              <div className="space-y-2">
                {nearbyCities.map((nc) => (
                  <Link
                    key={nc.slug}
                    href={`/delivery/${state.slug}/${nc.slug}`}
                    className="block text-green-600 hover:text-green-800 hover:underline text-sm"
                  >
                    {nc.name} Delivery ({nc._count.dispensaries})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                How many dispensaries deliver in {city.name}?
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                Currently {dispensaries.length} dispensaries offer delivery in {city.name}, {state.abbreviation} as listed on Leefii.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                Do I need a medical card for delivery in {city.name}?
              </summary>
              <p className="px-4 pb-4 text-gray-600">
                {state.isLegal && !state.medicalOnly
                  ? `${state.name} allows recreational cannabis. Adults 21+ can order delivery from recreational dispensaries without a medical card.`
                  : state.medicalOnly
                  ? `${state.name} currently only allows medical cannabis. You'll need a valid MMJ card to order delivery.`
                  : `Check individual dispensary requirements and local ${state.name} regulations.`}
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
