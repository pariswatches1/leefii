import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CityDispensaryFilters from './CityDispensaryFilters'

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

  const dispensaryCount = await prisma.dispensary.count({ where: { cityId: city.id, isActive: true } })

  const title = `Cannabis Dispensaries in ${city.name}, ${state.abbreviation} — ${dispensaryCount} Stores | Leefii`
  const description = `Find ${dispensaryCount} cannabis dispensaries in ${city.name}, ${state.abbreviation}. Compare recreational & medical stores, delivery options, ratings, hours, and deals.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}` },
  }
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
    take: 12,
    select: { name: true, slug: true, dispensaryCount: true },
  })

  // Stats
  const recCount = dispensaries.filter((d) => d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH').length
  const medCount = dispensaries.filter((d) => d.licenseType === 'MEDICAL' || d.licenseType === 'BOTH').length
  const deliveryCount = dispensaries.filter((d) => d.hasDelivery).length
  const creditCardCount = dispensaries.filter((d) => d.acceptsCreditCard).length

  // Legal status text
  const legalStatus = state.isLegal && !state.medicalOnly
    ? 'both recreational and medical cannabis are legal'
    : state.medicalOnly
    ? 'medical cannabis is legal with a valid MMJ card'
    : 'cannabis laws vary — check current regulations'

  // Stats: verified count
  const verifiedCount = dispensaries.filter((d) => d.verificationDate !== null).length

  // Serialize dispensaries for client component
  const serializedDispensaries = dispensaries.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    address: d.address,
    phone: d.phone,
    licenseType: d.licenseType,
    hasDelivery: d.hasDelivery,
    hasStorefront: d.hasStorefront,
    hasCurbside: d.hasCurbside,
    acceptsCreditCard: d.acceptsCreditCard,
    rating: d.rating ? Number(d.rating) : null,
    reviewsCount: d.reviewsCount,
    isPremium: d.isPremium,
    verificationDate: d.verificationDate?.toISOString() ?? null,
    verificationStatus: d.verificationStatus,
    verificationMethod: d.verificationMethod,
    isClaimed: d.isClaimed,
    BusinessHours: d.BusinessHours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
  }))

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
      { '@type': 'ListItem', position: 4, name: city.name },
    ],
  }

  const faqData = [
    {
      q: `How many dispensaries are in ${city.name}, ${state.abbreviation}?`,
      a: `There are ${dispensaries.length} licensed cannabis dispensaries in ${city.name}, ${state.abbreviation}. Of these, ${recCount} offer recreational products${medCount > 0 ? ` and ${medCount} serve medical patients` : ''}.`,
    },
    {
      q: `Which dispensaries in ${city.name} offer delivery?`,
      a: deliveryCount > 0
        ? `${deliveryCount} out of ${dispensaries.length} dispensaries in ${city.name} offer cannabis delivery. Filter by "Delivery" above to see all delivery options.`
        : `Currently no dispensaries in ${city.name} list delivery service on Leefii. Check back as more dispensaries add delivery options.`,
    },
    {
      q: `What is the best dispensary in ${city.name}?`,
      a: `The highest-rated dispensary in ${city.name} is ${dispensaries[0].name}${dispensaries[0].rating ? ` with a ${Number(dispensaries[0].rating).toFixed(1)}-star rating` : ''}. Browse all ${dispensaries.length} dispensaries above and compare ratings, hours, and services to find the best fit.`,
    },
    {
      q: `Is cannabis legal in ${city.name}, ${state.name}?`,
      a: state.isLegal && !state.medicalOnly
        ? `Yes, both recreational and medical cannabis are legal in ${state.name}. Adults 21 and older can purchase from any licensed dispensary in ${city.name} with a valid government-issued ID.`
        : state.medicalOnly
        ? `Medical cannabis is legal in ${state.name} with a valid medical marijuana card. Visit our doctors page to find MMJ physicians near ${city.name}.`
        : `Cannabis laws in ${state.name} vary. Check current state and local regulations before visiting a dispensary in ${city.name}.`,
    },
    {
      q: `Do I need a medical card to buy cannabis in ${city.name}?`,
      a: state.isLegal && !state.medicalOnly
        ? `No. ${state.name} allows recreational cannabis purchases for adults 21+. However, medical patients with a valid MMJ card may access higher potency products, larger purchase limits, and potential tax savings.`
        : state.medicalOnly
        ? `Yes. ${state.name} requires a valid medical marijuana card to purchase cannabis products. Consult with a qualified physician to obtain your card.`
        : `Requirements vary in ${state.name}. Check local regulations for the most current information.`,
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
            <span className="text-gray-900 font-medium">{city.name}</span>
          </nav>
        </div>
      </div>

      {/* AI Quick Answer Block */}
      <section aria-label="Quick Summary" className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-700 text-lg max-w-3xl">
            There are {dispensaries.length} licensed cannabis dispensaries in {city.name}, {state.abbreviation}. {deliveryCount > 0 ? `${deliveryCount} offer delivery.` : ''} {creditCardCount > 0 ? `${creditCardCount} accept credit cards.` : ''} Find hours, menus, and reviews for every dispensary in {city.name} on Leefii.
          </p>
        </div>
      </section>

      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cannabis Dispensaries in {city.name}, {state.abbreviation}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">Total Stores</div>
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
            {verifiedCount > 0 && (
              <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
                <div className="text-2xl font-bold">{verifiedCount}</div>
                <div className="text-green-100 text-sm">Verified</div>
              </div>
            )}
          </div>
          <p className="text-sm text-green-200 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Dispensary Listings with Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Dispensaries in {city.name}</h2>
        <CityDispensaryFilters dispensaries={serializedDispensaries} />
      </div>

      {/* Cannabis Guide */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cannabis Guide: Buying in {city.name}, {state.name}</h2>
          <div className="bg-white rounded-xl p-6 border space-y-4 text-gray-600">
            <p>
              {city.name} is home to {dispensaries.length} licensed cannabis dispensaries, making it
              {dispensaries.length >= 20 ? ' one of the most well-served cannabis markets' : dispensaries.length >= 5 ? ' a growing cannabis market' : ' a compact cannabis market'} in {state.name}.
              In {state.name}, {legalStatus}, so
              {state.isLegal && !state.medicalOnly
                ? ' adults 21 and older can walk into any licensed dispensary and purchase cannabis products without a medical card'
                : state.medicalOnly
                ? ' you will need a valid medical marijuana card to purchase cannabis products from a licensed dispensary'
                : ' you should check current local regulations before visiting'}.
            </p>
            <p>
              When visiting a dispensary in {city.name} for the first time, bring a valid government-issued photo ID.
              {state.isLegal && !state.medicalOnly ? ' Medical patients should also bring their MMJ card to access expanded product selections and potential tax benefits.' : ''}
              {' '}Most dispensaries offer a wide range of products including flower, pre-rolls, edibles, concentrates, vape cartridges, tinctures, and topicals.
              Budtenders are trained to help you choose the right product based on your experience level, desired effects, and consumption preferences.
            </p>
            <p>
              To find the best dispensary for your needs, compare ratings and reviews from real customers on Leefii.
              Check store hours before visiting, and look for dispensaries that offer the services you need — whether that is delivery, curbside pickup, or in-store shopping.
              {deliveryCount > 0 ? ` In ${city.name}, ${deliveryCount} dispensaries currently offer delivery service, which is convenient for patients or those who prefer shopping from home.` : ''}
              {' '}Prices and product selection can vary between dispensaries, so it pays to browse menus and compare before making a trip.
            </p>
            <p>
              {state.isLegal && !state.medicalOnly
                ? `As a recreational cannabis state, ${state.name} regulates all cannabis sales through licensed dispensaries. Every product sold has been tested for safety, potency, and contaminants. Look for dispensaries with high ratings and a good selection to ensure the best experience.`
                : state.medicalOnly
                ? `As a medical-only state, ${state.name} requires all patients to have a valid medical marijuana card. If you need help finding a doctor who can certify you, visit the Leefii doctors directory to browse qualified MMJ physicians.`
                : `Cannabis regulations in ${state.name} continue to evolve. Stay informed about local laws and only purchase from licensed dispensaries listed on Leefii.`}
            </p>
          </div>
        </div>
      </section>

      {/* Browse Strains CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Cannabis Strains</h2>
            <p className="text-gray-600 mb-4">
              Explore thousands of strains with detailed effects, THC/CBD levels, and reviews to find the perfect product at your {city.name} dispensary.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/strains/indica" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition">Indica Strains</Link>
              <Link href="/strains/sativa" className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition">Sativa Strains</Link>
              <Link href="/strains/hybrid" className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition">Hybrid Strains</Link>
              <Link href="/strains" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition">All Strains</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nearby Cities with Dispensaries</h2>
            <p className="text-gray-600 mb-6">Browse dispensaries in other {state.name} cities near {city.name}.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {nearbyCities.map((nc) => (
                <Link key={nc.slug} href={`/dispensaries/${state.slug}/${nc.slug}`} className="bg-white rounded-xl p-4 border hover:shadow-md hover:border-green-500 transition">
                  <p className="font-medium text-gray-900">{nc.name}</p>
                  <p className="text-sm text-gray-500">{nc.dispensaryCount} dispensaries</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href={`/dispensaries/${state.slug}`} className="text-green-600 hover:text-green-800 font-medium">
                View all cities in {state.name}
              </Link>
            </div>
          </div>
        </section>
      )}

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
