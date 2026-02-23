import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

type Props = {
  params: Promise<{ state: string }>
}

export async function generateStaticParams() {
  const states = await prisma.state.findMany({ select: { slug: true } })
  return states.map((s) => ({ state: s.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: { _count: { select: { dispensaries: { where: { isActive: true } } } } },
  })
  if (!state) return { title: 'State Not Found' }

  const count = state._count.dispensaries
  const cityCount = await prisma.city.count({ where: { stateId: state.id, dispensaryCount: { gt: 0 } } })
  const title = state.metaTitle || `Cannabis Dispensaries in ${state.name} | ${count} Stores in ${cityCount} Cities | Leefii`
  const description = state.metaDescription || `Find ${count}+ cannabis dispensaries across ${cityCount} cities in ${state.name}. Compare ratings, hours, deals, and delivery options on Leefii.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://leefii.com/dispensaries/${stateSlug}`,
      siteName: 'Leefii',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/dispensaries/${stateSlug}` },
  }
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: {
      cities: {
        where: { dispensaryCount: { gt: 0 } },
        orderBy: { dispensaryCount: 'desc' },
        select: { name: true, slug: true, dispensaryCount: true },
      },
      _count: { select: { dispensaries: { where: { isActive: true } } } },
    },
  })

  if (!state) notFound()

  const topDispensaries = await prisma.dispensary.findMany({
    where: { stateId: state.id, isActive: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 10,
    include: { city: { select: { name: true, slug: true } } },
  })

  const deliveryCount = await prisma.dispensary.count({
    where: { stateId: state.id, isActive: true, hasDelivery: true },
  })

  const doctorsCount = await prisma.doctor.count({
    where: { state: state.abbreviation, isActive: true },
  })

  const totalDispensaries = state._count.dispensaries
  const popularCities = state.cities.slice(0, 8)

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Cannabis Dispensaries in ${state.name}`,
    url: `https://leefii.com/dispensaries/${state.slug}`,
    numberOfItems: totalDispensaries,
    itemListElement: topDispensaries.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: d.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: d.address,
          addressLocality: d.city.name,
          addressRegion: state.abbreviation,
          postalCode: d.zipCode,
        },
        ...(d.rating && d.rating > 0
          ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: d.rating, reviewCount: d.reviewsCount } }
          : {}),
        url: `https://leefii.com/dispensary/${d.slug}`,
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
    ],
  }

  const faqData = [
    {
      q: `Is cannabis legal in ${state.name}?`,
      a: state.isLegal && !state.medicalOnly
        ? `Yes. Both recreational and medical cannabis are legal in ${state.name}. Adults 21+ can purchase from licensed dispensaries.`
        : state.medicalOnly
        ? `Medical cannabis is legal in ${state.name} with a valid MMJ card. Recreational use is not currently legal.`
        : `Cannabis laws in ${state.name} vary. Check current state and local regulations.`,
    },
    {
      q: `How many dispensaries are in ${state.name}?`,
      a: `There are ${totalDispensaries} active cannabis dispensaries in ${state.name} listed on Leefii.`,
    },
    {
      q: `Can you get cannabis delivered in ${state.name}?`,
      a: deliveryCount > 0
        ? `Yes, ${deliveryCount} dispensaries in ${state.name} offer delivery.`
        : `Delivery availability varies by location in ${state.name}.`,
    },
    {
      q: `How do I get a medical marijuana card in ${state.name}?`,
      a: doctorsCount > 0
        ? `Leefii lists ${doctorsCount} MMJ doctors in ${state.name}. Browse doctors, compare reviews, and book consultations.`
        : `Visit our doctors page to find qualified MMJ physicians.`,
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/dispensaries" className="text-gray-500 hover:text-gray-700">Dispensaries</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{state.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cannabis Dispensaries in {state.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {state.description || `Find ${totalDispensaries} licensed cannabis dispensaries in ${state.name}. Browse by city, compare ratings, check hours, and find deals.`}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">{totalDispensaries}</span>
              <span className="text-gray-600">Dispensaries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">{state.cities.length}</span>
              <span className="text-gray-600">Cities</span>
            </div>
            {deliveryCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{deliveryCount}</span>
                <span className="text-gray-600">Deliver</span>
              </div>
            )}
            {doctorsCount > 0 && (
              <Link href={`/doctors?state=${state.abbreviation}`} className="flex items-center space-x-2 hover:opacity-80">
                <span className="text-2xl font-bold text-purple-600">{doctorsCount}</span>
                <span className="text-gray-600">MMJ Doctors</span>
              </Link>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              state.medicalOnly ? 'bg-blue-100 text-blue-800' : state.isLegal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {state.isLegal && !state.medicalOnly ? 'Rec + Med' : state.medicalOnly ? 'Medical Only' : 'Limited'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Top Rated Dispensaries */}
      {topDispensaries.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top-Rated Dispensaries in {state.name}</h2>
            <div className="space-y-3">
              {topDispensaries.map((d) => (
                <Link
                  key={d.slug}
                  href={`/dispensary/${d.slug}`}
                  className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {d.isPremium && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Featured</span>
                      )}
                      <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {d.city.name}, {state.abbreviation}
                      {d.hasDelivery && ' · Delivers'}
                    </p>
                  </div>
                  {d.rating && d.rating > 0 && (
                    <div className="text-right">
                      <span className="text-yellow-500 font-bold">★ {d.rating.toFixed(1)}</span>
                      <p className="text-xs text-gray-400">{d.reviewsCount} reviews</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Cities */}
      {popularCities.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/dispensaries/${state.slug}/${city.slug}`}
                  className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-green-600">{city.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{city.dispensaryCount} dispensaries</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Cities */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Cities in {state.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {state.cities.map((city) => (
              <Link
                key={city.slug}
                href={`/dispensaries/${state.slug}/${city.slug}`}
                className="text-green-600 hover:text-green-800 hover:underline text-sm py-1"
              >
                {city.name} ({city.dispensaryCount})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deliveryCount > 0 && (
              <Link href="/delivery" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
                <span className="text-2xl block mb-1">🚗</span>
                <span className="text-sm font-medium">Delivery in {state.name}</span>
              </Link>
            )}
            <Link href="/deals" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-2xl block mb-1">💰</span>
              <span className="text-sm font-medium">Deals</span>
            </Link>
            <Link href="/strains" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-2xl block mb-1">🌿</span>
              <span className="text-sm font-medium">Browse Strains</span>
            </Link>
            <Link href="/doctors" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-2xl block mb-1">👨‍⚕️</span>
              <span className="text-sm font-medium">Find a Doctor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Cannabis Laws */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cannabis Laws in {state.name}</h2>
          <div className="bg-white rounded-xl p-6 border">
            <p className="text-gray-600">
              {state.lawSummary || (
                state.isLegal && !state.medicalOnly
                  ? `Cannabis is legal for both recreational and medical use in ${state.name}. Adults 21+ can purchase from licensed dispensaries. Medical patients may access higher potency products with a valid MMJ card.`
                  : state.medicalOnly
                  ? `Medical cannabis is legal in ${state.name} with a valid medical marijuana card. Recreational cannabis is not currently legal.`
                  : `Cannabis laws in ${state.name} vary. Check current state and local regulations.`
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">{f.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
