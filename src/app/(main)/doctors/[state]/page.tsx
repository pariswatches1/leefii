import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DoctorDetailPage from './DoctorDetailPage'
import { getStateLawBySlug } from '@/data/cannabis-laws'

interface Props {
  params: Promise<{ state: string }>
}

export const revalidate = 3600

// ==================== METADATA ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params

  // 1. Check if it's a state slug
  const state = await prisma.state.findUnique({ where: { slug } })
  if (state) {
    const count = await prisma.doctor.count({ where: { state: state.abbreviation, isActive: true } })
    const title = `Medical Marijuana Doctors in ${state.name} | ${count}+ MMJ Doctors | Leefii`
    const description = `Find ${count}+ licensed medical marijuana doctors in ${state.name}. Compare reviews, services, and pricing. Get your MMJ card with telehealth or in-person consultations.`
    return {
      title,
      description,
      openGraph: { title, description, url: `https://leefii.com/doctors/${slug}`, siteName: 'Leefii' },
      twitter: { card: 'summary_large_image', title, description },
      alternates: { canonical: `https://leefii.com/doctors/${slug}` },
    }
  }

  // 2. Check if it's a doctor slug
  const doctor = await prisma.doctor.findUnique({ where: { slug } })
  if (doctor) {
    const locationString = [doctor.city, doctor.state].filter(Boolean).join(', ')
    const title = `${doctor.name}${doctor.businessName ? ` - ${doctor.businessName}` : ''} | MMJ Doctor | Leefii`
    const description = doctor.description
      ? doctor.description.slice(0, 160)
      : `${doctor.name} - Medical marijuana doctor${locationString ? ` in ${locationString}` : ''}. ${doctor.telemedicine ? 'Telehealth available. ' : ''}${doctor.services?.slice(0, 3).join(', ') || 'MMJ evaluations and card renewals.'}`

    return {
      title,
      description,
      keywords: [
        doctor.name,
        doctor.businessName,
        doctor.city ? `${doctor.city} mmj doctor` : '',
        doctor.state ? `${doctor.state} medical marijuana doctor` : '',
        doctor.telemedicine ? 'telehealth mmj' : '',
        'medical marijuana card',
        'mmj doctor',
      ].filter(Boolean) as string[],
      openGraph: {
        title: doctor.name,
        description,
        url: `https://leefii.com/doctors/${doctor.slug}`,
        type: 'website',
      },
      twitter: { card: 'summary', title: doctor.name, description },
      alternates: { canonical: `https://leefii.com/doctors/${doctor.slug}` },
    }
  }

  return {}
}

// ==================== PAGE ====================
export default async function DoctorsPage({ params }: Props) {
  const { state: slug } = await params

  try {
    // 1. Try state listing first
    const state = await prisma.state.findUnique({ where: { slug } })
    if (state) {
      return <StateDoctorsPage stateSlug={slug} state={state} />
    }

    // 2. Try individual doctor
    const doctor = await prisma.doctor.findUnique({
      where: { slug },
      include: { businessHours: true },
    })

    if (doctor) {
      // Increment view count (non-blocking)
      prisma.doctor.update({ where: { id: doctor.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

      // Find related doctors in same state
      const relatedDoctors = await prisma.doctor.findMany({
        where: {
          state: doctor.state || undefined,
          isActive: true,
          id: { not: doctor.id },
        },
        take: 4,
        orderBy: { rating: 'desc' },
      })

      return <DoctorDetailPage doctor={doctor} relatedDoctors={relatedDoctors} />
    }
  } catch {
    notFound()
  }

  // 3. Neither state nor doctor found
  notFound()
}

// ==================== STATE LISTING COMPONENT ====================
async function StateDoctorsPage({ stateSlug, state }: { stateSlug: string; state: any }) {
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

  // Get cannabis law data for the state
  const stateLaw = getStateLawBySlug(stateSlug)

  // Build city groups: group doctors by city, filter 3+ doctors, look up City slugs
  const cityGroups: Record<string, typeof doctors> = {}
  for (const d of doctors) {
    if (d.city) {
      if (!cityGroups[d.city]) cityGroups[d.city] = []
      cityGroups[d.city].push(d)
    }
  }
  const citiesWithDoctors = Object.entries(cityGroups)
    .filter(([, docs]) => docs.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)

  // Look up City slugs from the database for cities with 3+ doctors
  const cityNames = citiesWithDoctors.map(([name]) => name)
  const cityRecords = cityNames.length > 0
    ? await prisma.city.findMany({
        where: {
          name: { in: cityNames },
          stateId: state.id,
        },
        select: { name: true, slug: true },
      })
    : []
  const citySlugMap: Record<string, string> = {}
  for (const c of cityRecords) {
    citySlugMap[c.name] = c.slug
  }

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
    // Enhanced FAQ items using cannabis law data
    ...(stateLaw && stateLaw.medical.hasProgram
      ? [
          {
            q: `What conditions qualify for medical marijuana in ${state.name}?`,
            a: stateLaw.medical.qualifyingConditions.length > 0
              ? `${state.name} recognizes the following qualifying conditions for a medical marijuana card: ${stateLaw.medical.qualifyingConditions.join(', ')}. Consult with a licensed MMJ doctor to determine if your condition qualifies.`
              : `${state.name} has a medical marijuana program, but qualifying conditions may vary. Consult with a licensed MMJ doctor in ${state.name} for the most up-to-date list of qualifying conditions.`,
          },
          {
            q: `How much does a medical card cost in ${state.name}?`,
            a: `The state registration fee for a medical marijuana card in ${state.name} is ${stateLaw.medical.cardCost}. This is in addition to the doctor consultation fee, which typically ranges from $100 to $300. Some doctors on Leefii may offer competitive pricing -- check individual listings for current rates.`,
          },
        ]
      : [
          {
            q: `What conditions qualify for medical marijuana in ${state.name}?`,
            a: `Qualifying conditions for medical marijuana vary by state. Consult with a licensed MMJ doctor in ${state.name} for the most current information on eligible conditions and requirements.`,
          },
          {
            q: `How much does a medical card cost in ${state.name}?`,
            a: `Medical card costs in ${state.name} include both the doctor consultation fee (typically $100-$300) and any applicable state registration fees. Check with individual doctors on Leefii for current pricing.`,
          },
        ]),
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

        {/* Medical Card Info Section */}
        {stateLaw && stateLaw.medical.hasProgram && (
          <section className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border border-green-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  How to Get a Medical Card in {state.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {state.name} has an active medical marijuana program. Here are the qualifying conditions and costs.
                </p>
              </div>
            </div>

            {/* Card Cost Highlight */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-green-100 inline-flex items-center gap-3">
              <span className="text-green-700 font-semibold text-lg">Card Cost:</span>
              <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full font-bold text-lg">
                {stateLaw.medical.cardCost}
              </span>
            </div>

            {/* Qualifying Conditions Grid */}
            {stateLaw.medical.qualifyingConditions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Qualifying Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {stateLaw.medical.qualifyingConditions.map((condition) => (
                    <span
                      key={condition}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-green-800 border border-green-200 shadow-sm"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reciprocity Note */}
            {stateLaw.medical.reciprocity && (
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Reciprocity:</span> {stateLaw.medical.reciprocity}
              </p>
            )}

            <Link
              href={`/medical-card/${stateSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition shadow-md"
            >
              Full {state.name} Medical Card Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>
        )}

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
                        <span className="text-blue-600 font-medium">Telehealth Available</span>
                      )}
                      {d.services && d.services.slice(0, 3).map((s) => (
                        <span key={s} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    {d.rating && d.rating > 0 ? (
                      <>
                        <span className="text-yellow-500 font-bold text-lg">&#9733; {d.rating.toFixed(1)}</span>
                        <p className="text-xs text-gray-400">{d.reviewsCount} reviews</p>
                      </>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* City Quick Links */}
        {citiesWithDoctors.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Find Doctors by City in {state.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {citiesWithDoctors.map(([cityName, docs]) => {
                const citySlug = citySlugMap[cityName]
                if (!citySlug) return null
                return (
                  <Link
                    key={cityName}
                    href={`/doctors/${stateSlug}/${citySlug}`}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition">
                      {cityName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {docs.length} doctor{docs.length !== 1 ? 's' : ''}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Related Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href={`/dispensaries/${state.slug}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
              <span className="text-xl block mb-1">&#127978;</span>
              <span className="text-sm font-medium text-gray-900">Dispensaries in {state.name}</span>
            </Link>
            <Link href="/deals" className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
              <span className="text-xl block mb-1">&#128176;</span>
              <span className="text-sm font-medium text-gray-900">Deals & Discounts</span>
            </Link>
            <Link href="/strains" className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100">
              <span className="text-xl block mb-1">&#127807;</span>
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
