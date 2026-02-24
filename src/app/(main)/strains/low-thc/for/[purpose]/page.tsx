import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getCrossRefsByCategory, getCrossRef, type CrossRefData } from '@/data/strain-purposes'

const CATEGORY = 'low-thc'

export const revalidate = 86400

interface Props {
  params: Promise<{ purpose: string }>
}

export async function generateStaticParams(): Promise<{ purpose: string }[]> {
  const crossRefs = getCrossRefsByCategory(CATEGORY)
  return crossRefs.map((cr) => ({ purpose: cr.purpose }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { purpose } = await params
  const data = getCrossRef(CATEGORY, purpose)
  if (!data) return {}

  const title = `${data.title} (2025 Guide) | Leefii`
  const description = data.description
  const url = `https://leefii.com/strains/${CATEGORY}/for/${purpose}`

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: url },
  }
}

async function queryStrains(data: CrossRefData) {
  const baseWhere = {
    OR: [
      { effects: { hasSome: data.effectsOrConditions } },
      { conditions: { hasSome: data.effectsOrConditions } },
    ],
    isActive: true,
  }

  if (data.queryType === 'type') {
    return prisma.strain.findMany({
      where: { type: data.typeFilter as any, ...baseWhere },
      orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
      take: 20,
      select: {
        slug: true, name: true, type: true, thcMin: true, thcMax: true,
        cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
        effects: true, conditions: true, description: true,
      },
    })
  }

  if (data.queryType === 'cbd-range') {
    return prisma.strain.findMany({
      where: { cbdMax: { gte: data.cbdMin }, ...baseWhere },
      orderBy: [{ cbdMax: 'desc' }, { rating: 'desc' }],
      take: 20,
      select: {
        slug: true, name: true, type: true, thcMin: true, thcMax: true,
        cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
        effects: true, conditions: true, description: true,
      },
    })
  }

  // thc-range
  return prisma.strain.findMany({
    where: { thcMax: { lte: data.thcMax }, ...baseWhere },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 20,
    select: {
      slug: true, name: true, type: true, thcMin: true, thcMax: true,
      cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
      effects: true, conditions: true, description: true,
    },
  })
}

function getTypeColor(type: string) {
  switch (type) {
    case 'INDICA': return 'bg-purple-100 text-purple-800'
    case 'SATIVA': return 'bg-orange-100 text-orange-800'
    case 'HYBRID': return 'bg-blue-100 text-blue-800'
    default: return 'bg-green-100 text-green-800'
  }
}

function getCategoryUrl(category: string) {
  if (category === 'indica') return '/strains/indica'
  if (category === 'sativa') return '/strains/sativa'
  if (category === 'hybrid') return '/strains/hybrid'
  if (category === 'high-cbd') return '/strains/high-cbd'
  if (category === 'low-thc') return '/strains/low-thc'
  return '/strains'
}

const isConditionRelated = (data: CrossRefData) => {
  const medicalTerms = ['Pain', 'Anxiety', 'Insomnia', 'Depression', 'Nausea', 'PTSD', 'Migraines', 'Inflammation', 'Arthritis', 'Muscle Spasms', 'Cramps', 'ADHD', 'Appetite Loss', 'Fatigue', 'Chronic Pain']
  return data.effectsOrConditions.some((e) => medicalTerms.includes(e))
}

export default async function CrossRefPurposePage({ params }: Props) {
  const { purpose } = await params
  const data = getCrossRef(CATEGORY, purpose)
  if (!data) notFound()

  const strains = await queryStrains(data)
  if (strains.length === 0) notFound()

  const otherCrossRefs = getCrossRefsByCategory(CATEGORY).filter((cr) => cr.purpose !== purpose)

  // Type breakdown stats
  const typeBreakdown = strains.reduce(
    (acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const avgRating = strains.filter((s) => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) / (strains.filter((s) => s.rating > 0).length || 1)
  const avgThc = strains.filter((s) => s.thcMax).reduce((sum, s) => sum + (s.thcMax || 0), 0) / (strains.filter((s) => s.thcMax).length || 1)

  const categoryUrl = getCategoryUrl(CATEGORY)

  const faqQuestions = [
    {
      q: `What ${data.categoryName.toLowerCase()} strains are best for ${data.purposeName.toLowerCase()}?`,
      a: `The best ${data.categoryName.toLowerCase()} strains for ${data.purposeName.toLowerCase()} include our top-rated options listed above, selected based on user reviews, effects profiles, and cannabinoid content. Look for strains with effects like ${data.effectsOrConditions.slice(0, 3).join(', ')} for the best results.`,
    },
    {
      q: `Why choose ${data.categoryName.toLowerCase()} for ${data.purposeName.toLowerCase()}?`,
      a: `${data.categoryName} strains are particularly suited for ${data.purposeName.toLowerCase()} because of their unique cannabinoid and terpene profiles. ${data.description}`,
    },
    {
      q: `How much ${data.categoryName.toLowerCase()} should I use for ${data.purposeName.toLowerCase()}?`,
      a: `Start with a low dose and increase gradually. For ${data.purposeName.toLowerCase()}, most users find that a moderate amount works well. The average THC content in our recommended strains is ${avgThc.toFixed(1)}%. Beginners should start with strains on the lower end of the THC range and wait to assess effects before consuming more.`,
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: data.categoryName, item: `https://leefii.com${categoryUrl}` },
      { '@type': 'ListItem', position: 4, name: `For ${data.purposeName}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <Link href={categoryUrl} className="hover:text-green-600">{data.categoryName}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">For {data.purposeName}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 mb-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{data.title}</h1>
          <p className="text-lg text-green-50 max-w-3xl">{data.description}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {strains.length} Strains
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              Avg Rating: {avgRating.toFixed(1)} / 5
            </span>
            {avgThc > 0 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                Avg THC: {avgThc.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Top Strains */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top {strains.length} {data.categoryName} Strains for {data.purposeName}
          </h2>
          <div className="grid gap-3">
            {strains.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/strains/${s.slug}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-400">#{idx + 1}</span>
                      <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(s.type)}`}>
                        {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      {s.thcMax != null && s.thcMax > 0 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          THC: {s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%
                        </span>
                      )}
                      {s.cbdMax != null && s.cbdMax > 0 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          CBD: {s.cbdMin && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-${s.cbdMax}` : s.cbdMax}%
                        </span>
                      )}
                      {s.effects?.slice(0, 4).map((e) => (
                        <span key={e} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{e}</span>
                      ))}
                    </div>
                  </div>
                  {s.rating != null && s.rating > 0 && (
                    <div className="text-right ml-4 flex-shrink-0">
                      <span className="text-yellow-500 font-bold text-lg">{s.rating.toFixed(1)}</span>
                      {s.reviewsCount > 0 && <p className="text-xs text-gray-400">{s.reviewsCount} reviews</p>}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Type Breakdown Stats */}
        {Object.keys(typeBreakdown).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Strain Type Breakdown</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(typeBreakdown).map(([type, count]) => (
                  <div key={type} className="text-center">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mb-2 ${getTypeColor(type)}`}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </span>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">strains</p>
                  </div>
                ))}
                <div className="text-center">
                  <span className="inline-block text-xs px-3 py-1 rounded-full font-medium mb-2 bg-yellow-100 text-yellow-800">
                    Avg Rating
                  </span>
                  <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">out of 5</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Cross-Refs for Same Category */}
        {otherCrossRefs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              More {data.categoryName} Strain Guides
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {otherCrossRefs.map((cr) => (
                <Link
                  key={cr.purpose}
                  href={`/strains/${cr.category}/for/${cr.purpose}`}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <p className="font-medium text-gray-900 text-sm">{cr.categoryName} for {cr.purposeName}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqQuestions.map((faq) => (
              <details key={faq.q} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">{faq.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Medical Disclaimer */}
        {isConditionRelated(data) && (
          <section className="mb-12">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-semibold text-amber-800 mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-amber-700">
                The information on this page is for educational purposes only and is not intended as medical advice.
                Cannabis may not be suitable for everyone. Always consult with a qualified healthcare professional
                before using cannabis for any medical condition. Cannabis is not FDA-approved for the treatment of any
                medical condition. Individual results may vary. Do not use cannabis if you are pregnant or nursing.
                Keep out of reach of children.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
