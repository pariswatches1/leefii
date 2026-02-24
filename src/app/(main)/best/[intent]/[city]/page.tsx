import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PHOENIX_BEST_FOR, getPhoenixBestFor } from '@/data/phoenix'

type Props = {
  params: Promise<{ intent: string; city: string }>
}

export const revalidate = 86400

// ── Helpers ───────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function verificationDot(status: string): string {
  switch (status) {
    case 'VERIFIED_TODAY':
      return 'bg-green-500'
    case 'VERIFIED_THIS_WEEK':
      return 'bg-green-400'
    case 'VERIFIED_THIS_MONTH':
      return 'bg-yellow-400'
    case 'NEEDS_UPDATE':
      return 'bg-orange-400'
    default:
      return 'bg-gray-300'
  }
}

// ── Static Params ─────────────────────────────────────────────────────

export async function generateStaticParams() {
  return PHOENIX_BEST_FOR.map((entry) => ({
    intent: entry.slug,
    city: 'phoenix-az',
  }))
}

// ── Metadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { intent, city } = await params
  if (city !== 'phoenix-az') return {}

  const data = getPhoenixBestFor(intent)
  if (!data) return {}

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://leefii.com/best/${intent}/${city}`,
      siteName: 'Leefii',
    },
    twitter: { card: 'summary_large_image', title: data.metaTitle, description: data.metaDescription },
    alternates: { canonical: `https://leefii.com/best/${intent}/${city}` },
  }
}

// ── Page ──────────────────────────────────────────────────────────────

export default async function BestForIntentPage({ params }: Props) {
  const { intent, city } = await params
  if (city !== 'phoenix-az') notFound()

  const data = getPhoenixBestFor(intent)
  if (!data) notFound()

  // ── Fetch strains ──────────────────────────────────────────────────
  const hasStrainFilters = data.strainEffects.length > 0 || data.strainConditions.length > 0 || data.strainTypes.length > 0

  const strains = hasStrainFilters
    ? await prisma.strain.findMany({
        where: {
          isActive: true,
          ...(data.strainEffects.length > 0 ? { effects: { hasSome: data.strainEffects } } : {}),
          ...(data.strainConditions.length > 0 ? { conditions: { hasSome: data.strainConditions } } : {}),
          ...(data.strainTypes.length > 0 ? { type: { in: data.strainTypes as any[] } } : {}),
        },
        orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
        take: 10,
        select: {
          slug: true,
          name: true,
          type: true,
          thcMin: true,
          thcMax: true,
          rating: true,
          reviewsCount: true,
          effects: true,
        },
      })
    : await prisma.strain.findMany({
        where: { isActive: true },
        orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
        take: 10,
        select: {
          slug: true,
          name: true,
          type: true,
          thcMin: true,
          thcMax: true,
          rating: true,
          reviewsCount: true,
          effects: true,
        },
      })

  // ── Fetch dispensaries ─────────────────────────────────────────────
  const state = await prisma.state.findUnique({ where: { slug: 'arizona' } })
  if (!state) notFound()

  const phoenixCity = await prisma.city.findFirst({ where: { slug: 'phoenix', stateId: state.id } })
  if (!phoenixCity) notFound()

  const dispensaries = await prisma.dispensary.findMany({
    where: { cityId: phoenixCity.id, isActive: true },
    orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      rating: true,
      reviewsCount: true,
      licenseType: true,
      hasDelivery: true,
      verificationDate: true,
      verificationStatus: true,
    },
  })

  // ── Other "Best For" pages for cross-links ─────────────────────────
  const otherIntents = PHOENIX_BEST_FOR.filter((b) => b.slug !== intent)

  // ── Strain type badge color ────────────────────────────────────────
  function typeBadge(type: string) {
    switch (type) {
      case 'SATIVA':
        return 'bg-orange-100 text-orange-800'
      case 'INDICA':
        return 'bg-purple-100 text-purple-800'
      case 'HYBRID':
        return 'bg-green-100 text-green-800'
      case 'CBD':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // ── JSON-LD Schemas ────────────────────────────────────────────────
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Best For', item: 'https://leefii.com/best' },
      { '@type': 'ListItem', position: 3, name: `${data.name} in Phoenix` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.title,
    numberOfItems: strains.length + dispensaries.length,
    itemListElement: [
      ...strains.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Product', name: s.name, url: `https://leefii.com/strains/${s.slug}/phoenix-az` },
      })),
      ...dispensaries.map((d, i) => ({
        '@type': 'ListItem',
        position: strains.length + i + 1,
        item: {
          '@type': 'LocalBusiness',
          name: d.name,
          address: { '@type': 'PostalAddress', streetAddress: d.address, addressLocality: 'Phoenix', addressRegion: 'AZ' },
          url: `https://leefii.com/dispensary/${d.slug}`,
          ...(d.rating && d.rating > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: d.rating, reviewCount: d.reviewsCount } } : {}),
        },
      })),
    ],
  }

  // ── Whether to skip strains section (deals / delivery) ────────────
  const showStrains = intent !== 'deals' && intent !== 'delivery' && strains.length > 0

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* ── Breadcrumbs ──────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/best" className="text-gray-500 hover:text-gray-700">Best For</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{data.name} in Phoenix</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{data.title}</h1>
          <p className="text-green-100 text-lg max-w-3xl">{data.heroSubtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {showStrains && (
              <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
                <div className="text-2xl font-bold">{strains.length}</div>
                <div className="text-green-100 text-sm">Recommended Strains</div>
              </div>
            )}
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">Verified Dispensaries</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">Phoenix</div>
              <div className="text-green-100 text-sm">Arizona Metro</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust Banner ─────────────────────────────────────────────── */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-green-800">
          <span className="font-medium">&#10003; Every dispensary verified for accuracy</span>
          <span className="text-green-600">|</span>
          <span>Unlike other directories, Leefii manually verifies menus</span>
        </div>
      </div>

      {/* ── Recommended Strains ──────────────────────────────────────── */}
      {showStrains && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Recommended Strains for {data.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Top-rated {data.strainTypes.length > 0 ? data.strainTypes.map((t) => t.toLowerCase()).join(' & ') + ' ' : ''}strains recommended for {data.name.toLowerCase()} by Phoenix cannabis consumers.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {strains.map((strain) => (
                <Link
                  key={strain.slug}
                  href={`/strains/${strain.slug}/phoenix-az`}
                  className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-500 transition block"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">{strain.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge(strain.type)}`}>
                          {strain.type}
                        </span>
                      </div>
                      {(strain.thcMin || strain.thcMax) && (
                        <p className="text-sm text-gray-500 mb-2">
                          THC: {strain.thcMin ?? '?'}% &ndash; {strain.thcMax ?? '?'}%
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {strain.effects.slice(0, 4).map((effect) => (
                          <span key={effect} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      {strain.rating > 0 ? (
                        <div>
                          <div className="text-lg font-bold text-green-700">{strain.rating.toFixed(1)} &#9733;</div>
                          <div className="text-xs text-gray-500">{strain.reviewsCount} reviews</div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">No ratings yet</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Recommended Dispensaries ──────────────────────────────────── */}
      <section className={`py-12 ${showStrains ? 'bg-gray-50' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {intent === 'first-time'
              ? 'Best Dispensaries for First-Timers in Phoenix'
              : intent === 'delivery'
                ? 'Best Cannabis Delivery Dispensaries in Phoenix'
                : intent === 'deals'
                  ? 'Top Phoenix Dispensaries with Deals'
                  : `Recommended Phoenix Dispensaries for ${data.name}`}
          </h2>
          <p className="text-gray-600 mb-6">
            Verified dispensaries in Phoenix, AZ. Every listing is manually checked for accuracy.
          </p>
          <div className="grid gap-4">
            {dispensaries.map((d) => (
              <Link
                key={d.id}
                href={`/dispensary/${d.slug}`}
                className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-500 transition block"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{d.name}</h3>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${verificationDot(d.verificationStatus)}`} title={`Status: ${d.verificationStatus.replace(/_/g, ' ').toLowerCase()}`} />
                    </div>
                    <p className="text-gray-500 text-sm">{d.address}, Phoenix, AZ</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {d.licenseType === 'BOTH' ? 'Rec & Med' : d.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                      </span>
                      {d.hasDelivery && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          Delivery
                        </span>
                      )}
                      {d.verificationDate && (
                        <span className="text-xs text-gray-400">
                          Verified {timeAgo(d.verificationDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {d.rating && d.rating > 0 ? (
                      <div>
                        <div className="text-lg font-bold text-green-700">{d.rating.toFixed(1)} &#9733;</div>
                        <div className="text-xs text-gray-500">{d.reviewsCount} reviews</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No ratings yet</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guide Content ────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Guide: {data.title}
          </h2>
          <div className="bg-white rounded-xl border p-6 md:p-8">
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              {data.guideContent.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 italic">
                Unlike other directories, Leefii manually verifies menus and dispensary information so you never visit a closed store or find outdated product listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cross-links ──────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More in Phoenix</h2>

          {/* Other "Best For" pages */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">More &ldquo;Best For&rdquo; Guides</h3>
            <div className="flex flex-wrap gap-2">
              {otherIntents.map((other) => (
                <Link
                  key={other.slug}
                  href={`/best/${other.slug}/phoenix-az`}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition"
                >
                  Best for {other.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular strain pages */}
          {showStrains && strains.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">Popular Strains in Phoenix</h3>
              <div className="flex flex-wrap gap-2">
                {strains.slice(0, 6).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/strains/${s.slug}/phoenix-az`}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Directory links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Phoenix Dispensary Directory</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dispensaries/arizona/phoenix"
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                All Phoenix Dispensaries
              </Link>
              <Link
                href="/dispensaries/arizona"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition"
              >
                Arizona Dispensaries
              </Link>
              <Link
                href="/strains"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition"
              >
                All Strains
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Footer CTA ─────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trust Matters When Choosing Cannabis
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Unlike other directories, Leefii manually verifies menus and information for every Phoenix dispensary.
              When you see a green verification badge, you know the listing is accurate.
            </p>
            <Link
              href="/dispensaries/arizona/phoenix"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Browse All Phoenix Dispensaries
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
