import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  params: Promise<{ state: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) return {}

  const count = await prisma.doctor.count({ where: { state: state.abbreviation, isActive: true } })

  const title = `Medical Marijuana Doctors in ${state.name} | ${count}+ MMJ Doctors | Leefii`
  const description = `Find ${count}+ licensed medical marijuana doctors in ${state.name}. Compare reviews, services, and pricing. Get your MMJ card with telehealth or in-person consultations.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/doctors/${stateSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/doctors/${stateSlug}` },
  }
}

export default async function DoctorsStatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()

  const doctors = await prisma.doctor.findMany({
    where: { state: state.abbreviation, isActive: true },
    orderBy: [
      { subscriptionTier: 'desc' },
      { rating: 'desc' },
      { reviewsCount: 'desc' },
    ],
    include: {
      businessHours: true,
    },
  })

  if (doctors.length === 0) notFound()

  const telemedicineCount = doctors.filter((d) => d.telemedicine).length

  const tierColors: Record<string, string> = {
    PREMIUM: 'bg-purple-100 text-purple-800',
    BASIC: 'bg-blue-100 text-blue-800',
    FREE: 'bg-gray-100 text-gray-600',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Doctors', item: 'https://leefii.com/doctors' },
      { '@type': 'ListItem', position: 3, name: state.name },
    ],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Medical Marijuana Doctors in ${state.name}`,
    numberOfItems: doctors.length,
    itemListElement: doctors.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Physician',
        name: d.name,
        ...(d.businessName ? { alternateName: d.businessName } : {}),
        address: {
          '@type': 'PostalAddress',
          addressLocality: d.city || undefined,
          addressRegion: state.abbreviation,
        },
        telephone: d.phone || undefined,
        url: `https://leefii.com/doctors/${d.slug}`,
        ...(d.rating && d.rating > 0
          ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: d.rating, reviewCount: d.reviewsCount } }
          : {}),
      },
    })),
  }

  const faqData = [
    {
      q: `How many medical marijuana doctors are in ${state.name}?`,
      a: `Leefii lists ${doctors.length} active medical marijuana doctors in ${state.name}.${telemedicineCount > 0 ? ` ${telemedicineCount} offer telehealth consultations.` : ''}`,
    },
    {
      q: `How much does an MMJ card cost in ${state.name}?`,
      a: `Consultation fees vary by doctor, typically ranging from $100 to $300 for the initial evaluation. State application fees are separate and vary.`,
    },
    {
      q: `Can I get an MMJ card via telehealth in ${state.name}?`,
      a: telemedicineCount > 0
        ? `Yes, ${telemedicineCount} doctors in ${state.name} on Leefii offer telehealth consultations. You can get evaluated from the comfort of your home.`
        : `Telehealth availability varies. Check individual doctor listings for current options.`,
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
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/doctors" className="hover:text-green-600">Doctors</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{state.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Medical Marijuana Doctors in {state.name}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {doctors.length} Doctors
          </span>
          {telemedicineCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {telemedicineCount} Telehealth
            </span>
          )}
        </div>

        <p className="text-gray-600 text-lg mb-8 max-w-3xl">
          Find licensed medical marijuana doctors in {state.name}. Compare reviews, services, and pricing.
          {telemedicineCount > 0
            ? ` ${telemedicineCount} doctors offer telehealth consultations -- get evaluated from home.`
            : ''}
        </p>

        {/* Doctor Listings */}
        <section className="mb-12">
          <div className="space-y-3">
            {doctors.map((d) => (
              <Link
                key={d.slug}
                href={`/doctors/${d.slug}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {d.subscriptionTier !== 'FREE' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[d.subscriptionTier]}`}>
                          {d.subscriptionTier === 'PREMIUM' ? 'Featured' : 'Verified'}
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 text-lg">{d.name}</h3>
                    </div>
                    {d.businessName && (
                      <p className="text-sm text-gray-500 mt-0.5">{d.businessName}</p>
                    )}
                    {d.city && (
                      <p className="text-sm text-gray-500 mt-1">{d.city}, {state.abbreviation}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      {d.telemedicine && (
                        <span className="text-blue-600 font-medium">📹 Telehealth Available</span>
                      )}
                      {d.services && d.services.slice(0, 3).map((s) => (
                        <span key={s} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
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
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href={`/dispensaries/${state.slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
              <span className="text-xl block mb-1">🏪</span>
              <span className="text-sm font-medium text-gray-900">Dispensaries in {state.name}</span>
            </Link>
            <Link href="/deals" className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
              <span className="text-xl block mb-1">💰</span>
              <span className="text-sm font-medium text-gray-900">Deals & Discounts</span>
            </Link>
            <Link href="/strains" className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
              <span className="text-xl block mb-1">🌿</span>
              <span className="text-sm font-medium text-gray-900">Browse Strains</span>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">{f.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
