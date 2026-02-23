import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getStateLawBySlug } from '@/data/cannabis-laws'

interface Props {
  params: Promise<{ state: string; city: string }>
}

export const revalidate = 86400

// ==================== STATIC PARAMS ====================
export async function generateStaticParams() {
  const states = await prisma.state.findMany({
    select: { slug: true, abbreviation: true, id: true },
  })

  const params: { state: string; city: string }[] = []

  for (const st of states) {
    const doctors = await prisma.doctor.findMany({
      where: { state: st.abbreviation, isActive: true, city: { not: null } },
      select: { city: true },
    })

    const cityCount: Record<string, number> = {}
    for (const d of doctors) {
      if (d.city) {
        const key = d.city.toLowerCase()
        cityCount[key] = (cityCount[key] || 0) + 1
      }
    }

    const qualifiedCities = Object.keys(cityCount).filter((c) => cityCount[c] >= 3)

    if (qualifiedCities.length > 0) {
      const cities = await prisma.city.findMany({
        where: { stateId: st.id },
        select: { slug: true, name: true },
      })

      const cityNameToSlug = new Map(cities.map((c) => [c.name.toLowerCase(), c.slug]))

      for (const cityKey of qualifiedCities) {
        const slug = cityNameToSlug.get(cityKey)
        if (slug) {
          params.push({ state: st.slug, city: slug })
        }
      }
    }
  }

  return params
}

// ==================== HELPERS ====================
async function getStateAndCity(stateSlug: string, citySlug: string) {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    select: { id: true, name: true, slug: true, abbreviation: true },
  })
  if (!state) return null

  const city = await prisma.city.findFirst({
    where: { slug: citySlug, stateId: state.id },
    select: { id: true, name: true, slug: true },
  })
  if (!city) return null

  return { state, city }
}

// ==================== METADATA ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const data = await getStateAndCity(stateSlug, citySlug)
  if (!data) return {}

  const { state, city } = data
  const title = `MMJ Doctors in ${city.name}, ${state.abbreviation} — Medical Marijuana Card | Leefii`
  const description = `Find licensed medical marijuana doctors in ${city.name}, ${state.name}. Compare MMJ doctors, read reviews, and book telehealth or in-person evaluations to get your medical card.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/doctors/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/doctors/${stateSlug}/${citySlug}` },
  }
}

// ==================== PAGE ====================
export default async function DoctorCityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const data = await getStateAndCity(stateSlug, citySlug)
  if (!data) notFound()

  const { state, city } = data

  const doctors = await prisma.doctor.findMany({
    where: {
      state: state.abbreviation,
      city: { equals: city.name, mode: 'insensitive' },
      isActive: true,
    },
    orderBy: [
      { isFeatured: 'desc' },
      { subscriptionTier: 'desc' },
      { rating: 'desc' },
    ],
  })

  if (doctors.length === 0) notFound()

  const telehealthCount = doctors.filter((d) => d.telemedicine).length
  const verifiedCount = doctors.filter((d) => d.isVerified).length

  const stateLaw = getStateLawBySlug(stateSlug)
  const cardCost = stateLaw?.medical?.cardCost ?? 'Varies by state'
  const conditions = stateLaw?.medical?.qualifyingConditions ?? []

  const tierLabel: Record<string, string> = { PREMIUM: 'Premium', BASIC: 'Basic', FREE: '' }
  const tierColor: Record<string, string> = {
    PREMIUM: 'bg-amber-100 text-amber-800',
    BASIC: 'bg-gray-100 text-gray-700',
    FREE: '',
  }

  const faqData = [
    {
      q: `How many MMJ doctors are in ${city.name}, ${state.name}?`,
      a: `Leefii lists ${doctors.length} active medical marijuana doctors in ${city.name}, ${state.name}. Browse their profiles to compare services, reviews, and availability.`,
    },
    {
      q: `Do ${city.name} doctors offer telehealth evaluations?`,
      a: telehealthCount > 0
        ? `Yes, ${telehealthCount} of the ${doctors.length} MMJ doctors in ${city.name} offer telehealth evaluations. You can complete your medical marijuana consultation from home via video call.`
        : `Telehealth availability varies. Check individual doctor profiles in ${city.name} for the most current scheduling options.`,
    },
    {
      q: `How much does a medical card cost in ${state.name}?`,
      a: `The state registration fee in ${state.name} is ${cardCost}. Doctor consultation fees are separate and typically range from $100 to $300 for an initial evaluation.`,
    },
    {
      q: `What conditions qualify for medical marijuana in ${state.name}?`,
      a: conditions.length > 0
        ? `Qualifying conditions in ${state.name} include ${conditions.slice(0, 6).join(', ')}${conditions.length > 6 ? ', and more' : ''}. A licensed MMJ doctor can evaluate whether you qualify.`
        : `Qualifying conditions vary by state. Consult a licensed MMJ doctor in ${city.name} to determine your eligibility.`,
    },
    {
      q: `Can I walk in without an appointment?`,
      a: (() => {
        const walkInCount = doctors.filter((d) => d.walkInsWelcome).length
        return walkInCount > 0
          ? `Yes, ${walkInCount} doctor${walkInCount > 1 ? 's' : ''} in ${city.name} accept walk-in patients. However, scheduling an appointment is recommended to minimize wait times.`
          : `Most doctors in ${city.name} prefer appointments. Check individual listings for walk-in availability or book an appointment online.`
      })(),
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Doctors', item: 'https://leefii.com/doctors' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://leefii.com/doctors/${stateSlug}` },
      { '@type': 'ListItem', position: 4, name: city.name },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Medical Marijuana Doctors in ${city.name}, ${state.abbreviation}`,
    numberOfItems: doctors.length,
    itemListElement: doctors.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalBusiness',
        name: d.name,
        ...(d.businessName ? { alternateName: d.businessName } : {}),
        url: `https://leefii.com/doctors/${d.slug}`,
        telephone: d.phone || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: d.address || undefined,
          addressLocality: city.name,
          addressRegion: state.abbreviation,
          postalCode: d.zipCode || undefined,
        },
        ...(d.rating > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: d.rating,
                reviewCount: d.reviewsCount,
              },
            }
          : {}),
      },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/doctors" className="hover:text-white">Doctors</Link>
            <span className="mx-2">/</span>
            <Link href={`/doctors/${stateSlug}`} className="hover:text-white">{state.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{city.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Medical Marijuana Doctors in {city.name}, {state.name}
          </h1>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
              {doctors.length} Doctor{doctors.length !== 1 ? 's' : ''}
            </span>
            {telehealthCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                {telehealthCount} Telehealth
              </span>
            )}
            {verifiedCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                {verifiedCount} Verified
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Doctor Listings */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All MMJ Doctors in {city.name}
          </h2>
          <div className="space-y-4">
            {doctors.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {d.subscriptionTier !== 'FREE' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColor[d.subscriptionTier]}`}>
                          {tierLabel[d.subscriptionTier]}
                        </span>
                      )}
                      {d.isVerified && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                      {d.telemedicine && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                          Telehealth
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/doctors/${d.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-green-600 transition"
                    >
                      {d.name}
                    </Link>

                    {d.businessName && (
                      <p className="text-sm text-gray-500 mt-0.5">{d.businessName}</p>
                    )}

                    {d.address && (
                      <p className="text-sm text-gray-600 mt-1">{d.address}</p>
                    )}

                    {d.phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Phone:</span> {d.phone}
                      </p>
                    )}

                    {d.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {d.services.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                        {d.services.length > 4 && (
                          <span className="text-xs text-gray-400">+{d.services.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right md:text-right">
                    {d.rating > 0 ? (
                      <div>
                        <span className="text-yellow-500 font-bold text-xl">
                          {'★'.repeat(Math.round(d.rating))}{'☆'.repeat(5 - Math.round(d.rating))}
                        </span>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{d.rating.toFixed(1)}</p>
                        <p className="text-xs text-gray-400">{d.reviewsCount} review{d.reviewsCount !== 1 ? 's' : ''}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No reviews yet</p>
                    )}
                    <Link
                      href={`/doctors/${d.slug}`}
                      className="inline-block mt-3 text-sm font-medium text-green-600 hover:text-green-700 transition"
                    >
                      View Profile &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Get Your Medical Card */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Get Your Medical Card in {city.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose a Doctor</h3>
              <p className="text-sm text-gray-600">
                Browse the {doctors.length} MMJ doctors in {city.name} above. Compare ratings, services, and whether they offer telehealth visits.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Evaluated</h3>
              <p className="text-sm text-gray-600">
                Schedule an appointment for an in-person or telehealth consultation. The doctor will assess your qualifying condition and medical history.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Receive Your Card</h3>
              <p className="text-sm text-gray-600">
                If approved, the doctor provides a recommendation. Submit your application to {state.name} and receive your medical marijuana card.
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href={`/doctors/${stateSlug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                View All Doctors in {state.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Browse every MMJ doctor across {state.name}.
              </p>
            </Link>
            <Link
              href={`/medical-card/${stateSlug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                Medical Card Guide for {state.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Step-by-step guide to getting your MMJ card in {state.name}.
              </p>
            </Link>
            <Link
              href={`/dispensaries/${stateSlug}/${citySlug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                Dispensaries in {city.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Find dispensaries near you in {city.name}, {state.abbreviation}.
              </p>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 group">
                <summary className="p-5 font-semibold text-gray-900 cursor-pointer hover:text-green-600 transition flex items-center justify-between">
                  <span>{f.q}</span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
