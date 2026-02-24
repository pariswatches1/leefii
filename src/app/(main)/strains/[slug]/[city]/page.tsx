import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PHOENIX_STRAINS, getPhoenixStrain } from '@/data/phoenix'

export const revalidate = 86400

type Props = {
  params: Promise<{ slug: string; city: string }>
}

// --- Helpers ---

function formatRelativeDate(date: Date | null | undefined): string {
  if (!date) return 'Not yet verified'
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Verified today'
  if (diffDays === 1) return 'Verified yesterday'
  if (diffDays < 7) return `Verified ${diffDays}d ago`
  if (diffDays < 30) return `Verified ${Math.floor(diffDays / 7)}w ago`
  return `Verified ${Math.floor(diffDays / 30)}mo ago`
}

function getVerificationDotColor(date: Date | null | undefined): string {
  if (!date) return 'bg-gray-300'
  const diffDays = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diffDays <= 1) return 'bg-green-500'
  if (diffDays <= 7) return 'bg-yellow-500'
  return 'bg-orange-500'
}

function parseCitySlug(citySlug: string): { city: string; stateAbbr: string } | null {
  const match = citySlug.match(/^(.+)-([a-z]{2})$/)
  if (!match) return null
  return { city: match[1].replace(/-/g, ' '), stateAbbr: match[2] }
}

const STATE_ABBR_TO_NAME: Record<string, string> = {
  az: 'arizona',
  ca: 'california',
  co: 'colorado',
  nv: 'nevada',
  or: 'oregon',
  wa: 'washington',
}

// --- Static Params ---

export async function generateStaticParams() {
  return PHOENIX_STRAINS.map((strain) => ({
    slug: strain.slug,
    city: 'phoenix-az',
  }))
}

// --- Metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, city: citySlug } = await params
  const phoenixStrain = getPhoenixStrain(slug)
  if (!phoenixStrain) return { title: 'Strain Not Found | Leefii' }

  const parsed = parseCitySlug(citySlug)
  if (!parsed) return { title: 'Not Found | Leefii' }

  const cityName = parsed.city.charAt(0).toUpperCase() + parsed.city.slice(1)
  const stateAbbr = parsed.stateAbbr.toUpperCase()

  const title = `Where to Find ${phoenixStrain.name} in ${cityName} — Verified In Stock | Leefii`
  const description = `Find ${phoenixStrain.name} at verified dispensaries in ${cityName}, ${stateAbbr}. ${phoenixStrain.tagline}. Compare prices, check stock, and read reviews on Leefii.`

  return {
    title,
    description,
    keywords: [
      `${phoenixStrain.name} ${cityName}`,
      `${phoenixStrain.name} dispensary ${cityName}`,
      `where to buy ${phoenixStrain.name} ${cityName}`,
      `${phoenixStrain.name} strain`,
      `${cityName} dispensaries`,
      `cannabis ${cityName} ${stateAbbr}`,
    ],
    openGraph: {
      title,
      description,
      url: `https://leefii.com/strains/${slug}/${citySlug}`,
      type: 'article',
      siteName: 'Leefii',
      images: [
        {
          url: 'https://leefii.com/og-image.png',
          width: 1200,
          height: 630,
          alt: `${phoenixStrain.name} in ${cityName}`,
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/${slug}/${citySlug}` },
  }
}

// --- Page ---

export default async function StrainCityPage({ params }: Props) {
  const { slug, city: citySlug } = await params

  const phoenixStrain = getPhoenixStrain(slug)
  if (!phoenixStrain) notFound()

  const parsed = parseCitySlug(citySlug)
  if (!parsed) notFound()

  const stateName = STATE_ABBR_TO_NAME[parsed.stateAbbr]
  if (!stateName) notFound()

  // Fetch strain from DB
  const strain = await prisma.strain.findUnique({ where: { slug } })
  if (!strain) notFound()

  // Fetch state + city + dispensaries
  const state = await prisma.state.findFirst({
    where: { slug: stateName },
  })
  if (!state) notFound()

  const city = await prisma.city.findFirst({
    where: {
      stateId: state.id,
      slug: parsed.city.replace(/\s+/g, '-'),
    },
  })
  if (!city) notFound()

  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
  })

  const cityName = city.name
  const stateAbbr = state.abbreviation
  const typeLower = strain.type.charAt(0) + strain.type.slice(1).toLowerCase()
  const thcText = strain.thcMax ? `${strain.thcMin || 0}\u2013${strain.thcMax}%` : 'N/A'
  const topEffects = strain.effects?.slice(0, 3) || []
  const topFlavors = strain.flavors?.slice(0, 3) || []
  const otherStrains = PHOENIX_STRAINS.filter((s) => s.slug !== slug)

  // FAQ data
  const faqs = [
    {
      question: `Where can I buy ${strain.name} in ${cityName}?`,
      answer: `There are ${dispensaries.length} verified dispensaries in ${cityName}, ${stateAbbr} where ${strain.name} may be available. Use Leefii to check real-time availability, compare prices, and find the closest dispensary to you.`,
    },
    {
      question: `Is ${strain.name} an indica, sativa, or hybrid?`,
      answer: `${strain.name} is a ${typeLower.toLowerCase()} strain. ${strain.type === 'INDICA' ? 'Indica strains are typically known for relaxing, body-focused effects.' : strain.type === 'SATIVA' ? 'Sativa strains are known for uplifting, cerebral effects.' : 'Hybrid strains combine characteristics of both indica and sativa for a balanced experience.'}${strain.thcMax ? ` It typically contains ${thcText} THC.` : ''}`,
    },
    {
      question: `What are the effects of ${strain.name}?`,
      answer: topEffects.length > 0
        ? `${strain.name} is known for its ${topEffects.join(', ').toLowerCase()} effects. Individual experiences may vary based on tolerance, dosage, and consumption method.`
        : `Effects of ${strain.name} vary by individual. Visit a verified ${cityName} dispensary and ask a budtender for personalized recommendations.`,
    },
    {
      question: `Do ${cityName} dispensaries deliver ${strain.name}?`,
      answer: `Some dispensaries in ${cityName} offer delivery service. Cannabis delivery is legal in Arizona for adults 21+. Use Leefii's delivery filter to find dispensaries that deliver to your address.`,
    },
  ]

  // --- JSON-LD Schemas ---

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      {
        '@type': 'ListItem',
        position: 3,
        name: strain.name,
        item: `https://leefii.com/strains/${strain.slug}`,
      },
      { '@type': 'ListItem', position: 4, name: cityName },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${strain.name} Cannabis Strain`,
    description: `${strain.name} is a ${typeLower.toLowerCase()} cannabis strain available at dispensaries in ${cityName}, ${stateAbbr}.${topEffects.length > 0 ? ` Known for ${topEffects.join(', ').toLowerCase()} effects.` : ''}`,
    url: `https://leefii.com/strains/${slug}/${citySlug}`,
    image: 'https://leefii.com/og-image.png',
    category: `${strain.type} Cannabis Strain`,
    ...(strain.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: strain.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: strain.reviewsCount || 1,
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/strains" className="text-gray-500 hover:text-gray-700">
                Strains
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href={`/strains/${strain.slug}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {strain.name}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{cityName}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                {strain.type}
              </span>
              {strain.rating > 0 && (
                <span className="inline-flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-yellow-300">&#9733;</span>
                  {strain.rating.toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {strain.name} in {cityName}, {stateAbbr}
            </h1>
            <p className="text-green-100 text-lg mb-6 max-w-3xl">
              {phoenixStrain.tagline}. Find verified dispensaries carrying {strain.name} in{' '}
              {cityName}.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{dispensaries.length}</div>
                <div className="text-green-100 text-sm">Dispensaries</div>
              </div>
              {strain.thcMax && (
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">
                    {strain.thcMin || 0}&ndash;{strain.thcMax}%
                  </div>
                  <div className="text-green-100 text-sm">THC Range</div>
                </div>
              )}
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{typeLower}</div>
                <div className="text-green-100 text-sm">Type</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Banner */}
        <div className="bg-green-50 border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-green-800 text-center font-medium">
              Unlike other directories, Leefii verifies every listing. Each dispensary
              below has been confirmed as active and licensed in {cityName}.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Strain Profile Card */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {strain.name} Strain Profile
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Type
                    </div>
                    <div className="font-bold text-gray-900">{typeLower}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      THC
                    </div>
                    <div className="font-bold text-gray-900">{thcText}</div>
                  </div>
                  {strain.cbdMax && strain.cbdMax > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        CBD
                      </div>
                      <div className="font-bold text-gray-900">
                        {strain.cbdMin || 0}&ndash;{strain.cbdMax}%
                      </div>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Reviews
                    </div>
                    <div className="font-bold text-gray-900">
                      {strain.reviewsCount || 0}
                    </div>
                  </div>
                </div>

                {topEffects.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Effects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {strain.effects.map((effect) => (
                        <span
                          key={effect}
                          className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {topFlavors.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Flavors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {strain.flavors.map((flavor) => (
                        <span
                          key={flavor}
                          className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {strain.description && (
                  <p className="text-gray-600 leading-relaxed mt-4">
                    {strain.description}
                  </p>
                )}

                <div className="mt-4">
                  <Link
                    href={`/strains/${strain.slug}`}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View full {strain.name} strain profile &rarr;
                  </Link>
                </div>
              </section>

              {/* Dispensary List */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {cityName} Dispensaries That May Carry {strain.name}
                </h2>
                <p className="text-gray-500 mb-6">
                  {dispensaries.length} verified dispensaries in {cityName}, {stateAbbr}.
                  Call ahead to confirm {strain.name} is currently in stock.
                </p>

                {dispensaries.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">
                      No dispensaries found in {cityName}. Check back soon as we are
                      constantly adding new listings.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dispensaries.map((dispensary, index) => (
                      <Link
                        key={dispensary.id}
                        href={`/dispensary/${dispensary.slug}`}
                        className={`block bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition ${
                          index % 2 === 1 ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {dispensary.name}
                              </h3>
                              {dispensary.isPremium && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                  Featured
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-500 mb-2">
                              {dispensary.address}, {cityName}, {stateAbbr}{' '}
                              {dispensary.zipCode}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* License Type Badge */}
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  dispensary.licenseType === 'BOTH'
                                    ? 'bg-green-100 text-green-700'
                                    : dispensary.licenseType === 'RECREATIONAL'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {dispensary.licenseType === 'BOTH'
                                  ? 'Med + Rec'
                                  : dispensary.licenseType === 'RECREATIONAL'
                                    ? 'Recreational'
                                    : 'Medical'}
                              </span>

                              {/* Delivery Badge */}
                              {dispensary.hasDelivery && (
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                  Delivery
                                </span>
                              )}

                              {/* Verification Status */}
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <span
                                  className={`w-2 h-2 rounded-full ${getVerificationDotColor(dispensary.verificationDate)}`}
                                />
                                {formatRelativeDate(dispensary.verificationDate)}
                              </span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex-shrink-0 text-right">
                            {dispensary.rating && dispensary.rating > 0 ? (
                              <div>
                                <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                  <span className="text-yellow-500">&#9733;</span>
                                  {dispensary.rating.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {dispensary.reviewsCount} reviews
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No reviews</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* FAQ Section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="border border-gray-100 rounded-lg">
                      <summary className="p-4 font-semibold cursor-pointer hover:text-green-700 text-gray-900">
                        {faq.question}
                      </summary>
                      <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA Card */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">
                  Find {strain.name} Near You
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  Browse all {cityName} dispensaries or view the full {strain.name} strain
                  profile for detailed information.
                </p>
                <div className="space-y-2">
                  <Link
                    href={`/dispensaries/${state.slug}/${city.slug}`}
                    className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    All {cityName} Dispensaries
                  </Link>
                  <Link
                    href={`/strains/${strain.slug}`}
                    className="block w-full bg-white text-green-700 text-center py-3 rounded-lg font-medium border border-green-200 hover:bg-green-50 transition"
                  >
                    Full {strain.name} Profile
                  </Link>
                </div>
              </div>

              {/* Other Strains in City */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Popular Strains in {cityName}
                </h3>
                <div className="space-y-2">
                  {otherStrains.slice(0, 10).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/strains/${s.slug}/${citySlug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition group"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        {s.name}
                      </span>
                      <span className="text-gray-400 text-xs">&rarr;</span>
                    </Link>
                  ))}
                </div>
                {otherStrains.length > 10 && (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    + {otherStrains.length - 10} more strains
                  </p>
                )}
              </div>

              {/* Best For Pages Cross-links */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Best Cannabis For...
                </h3>
                <div className="space-y-2">
                  {[
                    { slug: 'sleep', label: 'Sleep' },
                    { slug: 'anxiety', label: 'Anxiety Relief' },
                    { slug: 'pain', label: 'Pain Relief' },
                    { slug: 'energy', label: 'Energy' },
                    { slug: 'relaxation', label: 'Relaxation' },
                    { slug: 'first-time', label: 'First-Timers' },
                  ].map((item) => (
                    <Link
                      key={item.slug}
                      href={`/phoenix/best-for/${item.slug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition group"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        Best for {item.label}
                      </span>
                      <span className="text-gray-400 text-xs">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Why Trust Leefii?
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>
                      Every dispensary is manually verified for accuracy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>
                      Free listings mean you see all options, not just advertisers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>
                      Real-time verification badges show when info was last confirmed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>
                      Community-driven accuracy reporting keeps data current
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
