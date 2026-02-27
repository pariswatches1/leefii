import { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { prisma } from '@/lib/prisma'
import { DEAL_TYPES, PRODUCT_CATEGORIES } from '@/data/deal-categories'
import ShareButtons from '@/components/ShareButtons'

const NearbyDeals = dynamic(() => import('@/components/NearbyDeals'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  ),
})

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Cannabis Deals & Discounts — Save at Dispensaries Near You | Leefii',
  description:
    'Find the best cannabis deals, dispensary discounts, and daily specials. First-time patient offers, veteran discounts, BOGO deals, and more from dispensaries nationwide.',
  openGraph: {
    title: 'Cannabis Deals & Discounts — Save at Dispensaries Near You | Leefii',
    description:
      'Find the best cannabis deals, dispensary discounts, and daily specials nationwide.',
    url: 'https://leefii.com/deals',
    siteName: 'Leefii',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/deals' },
}

export default async function DealsPage() {
  const now = new Date()

  const [totalDeals, featuredDeals, recentDeals, dealsByState] =
    await Promise.all([
      prisma.deal.count({ where: { isActive: true } }),
      prisma.deal.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.deal.findMany({
        where: {
          isActive: true,
          OR: [
            { endDate: { gte: now } },
            { isOngoing: true },
            { endDate: null },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      prisma.deal.groupBy({
        by: ['stateSlug'],
        where: { isActive: true },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ])

  const topStatesWithCities = await Promise.all(
    dealsByState
      .filter((s) => s.stateSlug)
      .slice(0, 10)
      .map(async (s) => {
        const state = await prisma.state.findUnique({
          where: { slug: s.stateSlug! },
          select: { name: true, slug: true, abbreviation: true },
        })
        const citiesWithDeals = await prisma.deal.groupBy({
          by: ['citySlug'],
          where: { isActive: true, stateSlug: s.stateSlug },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5,
        })
        const cityInfos = await Promise.all(
          citiesWithDeals
            .filter((c) => c.citySlug)
            .map(async (c) => {
              const city = state
                ? await prisma.city.findFirst({
                    where: {
                      slug: c.citySlug!,
                      state: { slug: s.stateSlug! },
                    },
                    select: { name: true, slug: true },
                  })
                : null
              return city
                ? { name: city.name, slug: city.slug, dealCount: c._count.id }
                : null
            })
        )
        return {
          state,
          dealCount: s._count.id,
          cities: cityInfos.filter(Boolean) as {
            name: string
            slug: string
            dealCount: number
          }[],
        }
      })
  )

  const dealTypes = Object.values(DEAL_TYPES)
  const productCategories = Object.values(PRODUCT_CATEGORIES)

  const faqItems = [
    {
      q: 'How do I find cannabis deals near me?',
      a: 'Browse our deals by state and city to find dispensary discounts in your area. You can also filter by deal type such as first-time patient offers, daily specials, or BOGO promotions to find exactly what you are looking for.',
    },
    {
      q: 'What types of dispensary discounts are available?',
      a: 'Dispensaries offer a wide range of discounts including first-time patient deals, veteran and senior discounts, loyalty rewards, daily specials, BOGO offers, happy hour pricing, and bulk purchase savings. Availability varies by dispensary and state.',
    },
    {
      q: 'Are dispensary deals available for delivery orders?',
      a: 'Many dispensaries extend their deals and promotions to delivery orders. Check individual deal details to confirm whether the discount applies to in-store purchases, delivery, or both. Some dispensaries offer delivery-exclusive promotions as well.',
    },
    {
      q: 'How often do dispensary deals change?',
      a: 'Deal frequency varies by dispensary. Many offer daily rotating specials, while others run weekly or monthly promotions. Featured deals on Leefii are updated hourly so you always see the latest offers available near you.',
    },
    {
      q: 'Can I stack multiple dispensary discounts?',
      a: 'Stacking policies differ by dispensary. Most dispensaries allow only one discount per transaction, but some permit combining loyalty points with active promotions. Always check the terms of each deal or ask your budtender for details.',
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://leefii.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Deals',
        item: 'https://leefii.com/deals',
      },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Best Cannabis Deals &amp; Discounts Today
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
            Save money at dispensaries near you with daily specials, first-time
            offers, and exclusive deals
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-green-500/30 border border-green-300/40 text-white px-4 py-2 rounded-full text-sm font-medium">
              {totalDeals.toLocaleString()} Active Deals
            </span>
            <span className="bg-green-500/30 border border-green-300/40 text-white px-4 py-2 rounded-full text-sm font-medium">
              {dealsByState.length} States
            </span>
            <span className="bg-green-500/30 border border-green-300/40 text-white px-4 py-2 rounded-full text-sm font-medium">
              Updated Hourly
            </span>
          </div>
          <div className="mt-6">
            <ShareButtons
              url="https://leefii.com/deals"
              title="Cannabis Deals & Discounts"
              variant="compact"
              dark
            />
          </div>
        </div>
      </section>

      {/* AI Quick Answer Block + Freshness Signal */}
      <section aria-label="Quick Summary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <p className="text-gray-700 text-lg leading-relaxed mb-2">
          Leefii lists {totalDeals.toLocaleString()} active cannabis deals and dispensary discounts across {dealsByState.length} US states. Browse daily specials, first-time patient offers, BOGO deals, veteran discounts, and more from licensed dispensaries nationwide.
        </p>
        <p className="text-sm text-gray-500">Deals updated in real-time. Last checked: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </section>

      {/* Deals Near You — geo-located, client-side */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <NearbyDeals />
      </section>

      {/* Featured Deals */}
      {featuredDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Deals
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  {deal.dispensaryName && (
                    <span className="text-sm text-green-600 font-medium">
                      {deal.dispensaryName}
                    </span>
                  )}
                  {deal.discountType && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {deal.discountType === 'percentage' && deal.discountValue
                        ? `${deal.discountValue}% OFF`
                        : deal.discountType === 'dollar' && deal.discountValue
                          ? `$${deal.discountValue} OFF`
                          : deal.discountType.toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                  {deal.title}
                </h3>
                {deal.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {deal.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {deal.isOngoing ? (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Ongoing
                    </span>
                  ) : deal.endDate ? (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      Expires{' '}
                      {new Date(deal.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  ) : null}
                  {deal.code && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-mono">
                      Code: {deal.code}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Deals</h2>
        {recentDeals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  {deal.dispensaryName && (
                    <span className="text-sm text-green-600 font-medium">
                      {deal.dispensaryName}
                    </span>
                  )}
                  {deal.discountType && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {deal.discountType === 'percentage' && deal.discountValue
                        ? `${deal.discountValue}% OFF`
                        : deal.discountType === 'dollar' && deal.discountValue
                          ? `$${deal.discountValue} OFF`
                          : deal.discountType.toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                  {deal.title}
                </h3>
                {deal.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {deal.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {deal.isOngoing ? (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Ongoing
                    </span>
                  ) : deal.endDate ? (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      Expires{' '}
                      {new Date(deal.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  ) : null}
                  {deal.code && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-mono">
                      Code: {deal.code}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              Deals are on their way! Dispensaries are adding deals daily.
            </p>
          </div>
        )}
      </section>

      {/* Deal Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse Deals by Type
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dealTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/deals/${type.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <span className="text-2xl mb-2 block">{type.icon}</span>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                {type.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2">
                {type.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Deals by Product
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {productCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/deals/${cat.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals by City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Deals by City
        </h2>
        {topStatesWithCities.filter((s) => s.state).length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStatesWithCities
              .filter((s) => s.state)
              .map((s) => (
                <div
                  key={s.state!.slug}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {s.state!.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {s.dealCount} deal{s.dealCount !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/deals/${s.state!.slug}/${city.slug}`}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline"
                      >
                        {city.name} ({city.dealCount})
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Cities coming soon</p>
          </div>
        )}
      </section>

      {/* SEO Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Finding the Best Cannabis Deals Near You
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p>
              Finding the best cannabis deals should not feel like a guessing
              game. Whether you are a first-time patient exploring your options
              or a seasoned consumer looking to stretch your budget, dispensary
              deals and discounts can make a meaningful difference in what you
              bring home. From percentage-off specials on flower and
              concentrates to buy-one-get-one promotions on edibles and
              cartridges, the range of savings available at licensed
              dispensaries continues to grow as the market matures.
            </p>
            <p>
              Leefii aggregates cannabis deals from dispensaries across every
              legal state so you can compare offers in one place. Our index
              covers daily specials, happy hour pricing, first-time visitor
              discounts, veteran and senior programs, loyalty rewards, and
              limited-time promotional events. Each deal is updated regularly
              so you see accurate information before you visit a store or place
              a delivery order.
            </p>
            <p>
              Shopping smart means knowing which types of discounts are
              available at the dispensaries near you. Many shops rotate their
              specials by day of the week, offering reduced prices on flower
              one day and concentrates the next. Others run ongoing programs
              that reward repeat customers with points toward future purchases.
              By comparing deals across multiple dispensaries, you gain the
              ability to plan your purchases around the promotions that matter
              most to you. Browse deals by type, product category, or location
              to find the savings that fit your needs.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-gray-200"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900">
                {item.q}
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
