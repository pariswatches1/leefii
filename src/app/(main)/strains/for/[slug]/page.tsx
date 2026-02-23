import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  getForPageData,
  getAllForPageSlugs,
  CONDITIONS,
  ACTIVITIES,
  type ConditionData,
  type ActivityData,
} from '@/data/strain-purposes'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllForPageSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = getForPageData(slug)
  if (!result) return {}

  const { type, data } = result
  const title = `Best Cannabis Strains for ${data.name} 2026 | Leefii`
  const description =
    type === 'condition'
      ? `Discover the best cannabis strains for ${data.name.toLowerCase()}. Compare THC/CBD levels, read reviews, and find the right strain for your needs.`
      : `Find the best cannabis strains for ${data.name.toLowerCase()}. Browse top-rated strains with the right effects for your activity.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://leefii.com/strains/for/${slug}`,
      siteName: 'Leefii',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/strains/for/${slug}` },
  }
}

export default async function ForPage({ params }: Props) {
  const { slug } = await params
  const result = getForPageData(slug)
  if (!result) notFound()

  const { type, data } = result
  const isCondition = type === 'condition'
  const conditionData = isCondition ? (data as ConditionData) : null
  const activityData = !isCondition ? (data as ActivityData) : null

  // Query strains based on type
  const strains = isCondition
    ? await prisma.strain.findMany({
        where: { conditions: { has: conditionData!.searchTerm }, isActive: true },
        orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
        take: 20,
        select: {
          slug: true,
          name: true,
          type: true,
          thcMin: true,
          thcMax: true,
          cbdMin: true,
          cbdMax: true,
          rating: true,
          reviewsCount: true,
          effects: true,
          description: true,
        },
      })
    : await prisma.strain.findMany({
        where: { effects: { hasSome: activityData!.matchEffects }, isActive: true },
        orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
        take: 20,
        select: {
          slug: true,
          name: true,
          type: true,
          thcMin: true,
          thcMax: true,
          cbdMin: true,
          cbdMax: true,
          rating: true,
          reviewsCount: true,
          effects: true,
          description: true,
        },
      })

  const typeBreakdown = {
    indica: strains.filter((s) => s.type === 'INDICA').length,
    sativa: strains.filter((s) => s.type === 'SATIVA').length,
    hybrid: strains.filter((s) => s.type === 'HYBRID').length,
  }

  // Cross-links: other conditions and activities
  const otherConditions = Object.values(CONDITIONS)
    .filter((c) => c.slug !== slug)
    .slice(0, 6)
  const otherActivities = Object.values(ACTIVITIES)
    .filter((a) => a.slug !== slug)
    .slice(0, 6)

  // FAQ generation
  const nameLower = data.name.toLowerCase()
  const faqItems = isCondition
    ? [
        {
          q: `What strains help with ${nameLower}?`,
          a:
            strains.length > 0
              ? `There are many cannabis strains that may help with ${nameLower}. Top-rated options on Leefii include ${strains.slice(0, 3).map((s) => s.name).join(', ')}. Individual results vary, so consider starting with a low dose.`
              : `While we are still building our database for ${nameLower}, many users find indica-dominant and balanced hybrid strains helpful. Check back soon for specific recommendations.`,
        },
        {
          q: `Is indica or sativa better for ${nameLower}?`,
          a:
            strains.length > 0
              ? `Among strains for ${nameLower} on Leefii: ${typeBreakdown.indica} are Indica, ${typeBreakdown.sativa} are Sativa, and ${typeBreakdown.hybrid} are Hybrid. ${typeBreakdown.indica >= typeBreakdown.sativa ? 'Indica strains are more commonly associated with this condition, but the best choice depends on your individual needs.' : 'Both indica and sativa strains can be effective. Your response may vary based on individual body chemistry.'}`
              : `Both indica and sativa strains can potentially help with ${nameLower}. The best choice depends on your specific symptoms and individual body chemistry.`,
        },
        {
          q: `What THC level is best for ${nameLower}?`,
          a: conditionData?.thcCbdGuidance
            ? conditionData.thcCbdGuidance
            : `The optimal THC level for ${nameLower} varies by individual. Many patients find that moderate THC levels (15-20%) combined with some CBD provide the best balance of symptom relief and tolerability.`,
        },
        {
          q: `Can CBD help with ${nameLower}?`,
          a: `CBD has shown promise for many conditions including ${nameLower}. High-CBD strains and balanced THC:CBD ratios are popular choices, especially for those sensitive to THC. Research is ongoing, but many users report positive results with CBD-rich cannabis products.`,
        },
        {
          q: `Should I consult a doctor about cannabis for ${nameLower}?`,
          a: `Yes, always consult a healthcare professional before using cannabis for ${nameLower} or any medical condition. A doctor can help you understand potential interactions with existing medications, recommend appropriate dosing, and ensure cannabis is a suitable option for your specific situation.`,
        },
      ]
    : [
        {
          q: `What strains are best for ${nameLower}?`,
          a:
            strains.length > 0
              ? `The best strains for ${nameLower} typically produce effects like ${activityData!.matchEffects.join(', ').toLowerCase()}. Top picks on Leefii include ${strains.slice(0, 3).map((s) => s.name).join(', ')}.`
              : `Strains that promote effects like ${activityData!.matchEffects.join(', ').toLowerCase()} tend to work best for ${nameLower}. Check back soon for specific strain recommendations.`,
        },
        {
          q: `Is indica or sativa better for ${nameLower}?`,
          a:
            strains.length > 0
              ? `Among strains for ${nameLower} on Leefii: ${typeBreakdown.indica} are Indica, ${typeBreakdown.sativa} are Sativa, and ${typeBreakdown.hybrid} are Hybrid. ${typeBreakdown.sativa >= typeBreakdown.indica ? 'Sativa-dominant strains tend to be more popular for this activity due to their energizing effects.' : 'The best type depends on the specific experience you want.'}`
              : `For ${nameLower}, sativa and hybrid strains are often preferred for their uplifting and energizing effects, but the best choice depends on your personal preferences.`,
        },
        {
          q: `How much should I use for ${nameLower}?`,
          a: `Start low and go slow. For ${nameLower}, many users find that a small dose provides the best enhancement without impairing coordination or focus. Microdosing (2-5mg THC) is a popular approach for activity-based consumption. Wait at least 15-30 minutes before consuming more.`,
        },
        {
          q: `What effects help with ${nameLower}?`,
          a: `The most beneficial effects for ${nameLower} include ${activityData!.matchEffects.join(', ')}. Look for strains that prominently feature these effects in their profiles. Terpene profiles also play an important role in shaping the experience.`,
        },
        {
          q: `Can beginners use cannabis for ${nameLower}?`,
          a: `Yes, beginners can enjoy cannabis for ${nameLower}, but should start with low-THC strains or balanced THC:CBD options. Begin with a very small dose, choose a comfortable setting, and avoid high-THC concentrates. A positive first experience sets the foundation for future sessions.`,
        },
      ]

  // JSON-LD structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `For ${data.name}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/strains" className="hover:text-white">
              Strains
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">For {data.name}</span>
          </nav>

          <div className="text-center">
            <span className="text-6xl mb-4 block">{data.icon}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Best Cannabis Strains for {data.name}
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-6">{data.description}</p>

            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                {strains.length} Strains
              </span>
              {typeBreakdown.indica > 0 && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                  {typeBreakdown.indica} Indica
                </span>
              )}
              {typeBreakdown.sativa > 0 && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                  {typeBreakdown.sativa} Sativa
                </span>
              )}
              {typeBreakdown.hybrid > 0 && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                  {typeBreakdown.hybrid} Hybrid
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro Section */}
        {isCondition && conditionData && (
          <section className="mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cannabis for {conditionData.name}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {conditionData.intro}
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-xl flex-shrink-0">&#9888;</span>
                <p className="text-yellow-800 text-sm">
                  <strong>Medical Disclaimer:</strong> This is not medical advice. Consult a
                  healthcare professional before using cannabis for any medical condition.
                </p>
              </div>
            </div>
          </section>
        )}

        {!isCondition && activityData && (
          <section className="mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cannabis for {activityData.name}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {activityData.intro}
              </div>
            </div>
          </section>
        )}

        {/* THC/CBD Guidance (Conditions only) */}
        {isCondition && conditionData && conditionData.thcCbdGuidance && (
          <section className="mb-10">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-2">
                THC/CBD Guidance for {conditionData.name}
              </h2>
              <p className="text-green-800">{conditionData.thcCbdGuidance}</p>
            </div>
          </section>
        )}

        {/* Strain Listings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top Strains for {data.name}
          </h2>
          {strains.length > 0 ? (
            <div className="space-y-3">
              {strains.map((s, i) => (
                <Link
                  key={s.slug}
                  href={`/strains/${s.slug}`}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-400 font-mono">#{i + 1}</span>
                        <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            s.type === 'INDICA'
                              ? 'bg-purple-100 text-purple-800'
                              : s.type === 'SATIVA'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                        </span>
                      </div>
                      {s.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{s.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        {s.thcMax != null && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            THC: {s.thcMin != null && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%
                          </span>
                        )}
                        {s.cbdMax != null && s.cbdMax > 0 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            CBD: {s.cbdMin != null && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-${s.cbdMax}` : s.cbdMax}%
                          </span>
                        )}
                        {s.effects?.slice(0, 3).map((e) => (
                          <span
                            key={e}
                            className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                    {s.rating != null && s.rating > 0 && (
                      <div className="text-right ml-4 flex-shrink-0">
                        <span className="text-yellow-500 font-bold text-lg">
                          &#9733; {s.rating.toFixed(1)}
                        </span>
                        <p className="text-xs text-gray-400">{s.reviewsCount} reviews</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-lg">
                No strains found for {data.name} yet. Check back soon as we continue to expand our
                database.
              </p>
            </div>
          )}
        </section>

        {/* Type Breakdown */}
        {strains.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Strain Type Breakdown for {data.name}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-3xl font-bold text-purple-700">{typeBreakdown.indica}</div>
                <div className="text-sm text-gray-600 mt-1">Indica</div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${strains.length > 0 ? (typeBreakdown.indica / strains.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-3xl font-bold text-orange-600">{typeBreakdown.sativa}</div>
                <div className="text-sm text-gray-600 mt-1">Sativa</div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: `${strains.length > 0 ? (typeBreakdown.sativa / strains.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="text-3xl font-bold text-blue-600">{typeBreakdown.hybrid}</div>
                <div className="text-sm text-gray-600 mt-1">Hybrid</div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${strains.length > 0 ? (typeBreakdown.hybrid / strains.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Doctors Link (Conditions only) */}
        {isCondition && (
          <section className="mb-12">
            <Link
              href="/doctors"
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">&#127973;</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Need a Medical Cannabis Card?
                  </h3>
                  <p className="text-gray-600">
                    Find cannabis-friendly doctors near you who can help you get a medical marijuana
                    card for {data.name.toLowerCase()}.
                  </p>
                </div>
                <span className="ml-auto text-green-600 font-semibold text-sm flex-shrink-0">
                  Find Doctors &rarr;
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Cross-Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Browse Other {isCondition ? 'Conditions' : 'Activities'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {(isCondition ? otherConditions : otherActivities).map((item) => (
              <Link
                key={item.slug}
                href={`/strains/for/${item.slug}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <span className="text-2xl block mb-1">{item.icon}</span>
                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isCondition ? 'Strains by Activity' : 'Strains by Condition'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(isCondition ? otherActivities.slice(0, 6) : otherConditions.slice(0, 6)).map(
              (item) => (
                <Link
                  key={item.slug}
                  href={`/strains/for/${item.slug}`}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <span className="text-2xl block mb-1">{item.icon}</span>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                </Link>
              )
            )}
          </div>
        </section>

        {/* Related Effects */}
        {!isCondition && activityData && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Effects</h2>
            <div className="flex flex-wrap gap-2">
              {activityData.matchEffects.map((effect) => (
                <Link
                  key={effect}
                  href={`/strains/effects/${effect.toLowerCase()}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition"
                >
                  {effect}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 group"
              >
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700 flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
                    &#9660;
                  </span>
                </summary>
                <p className="px-4 pb-4 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
