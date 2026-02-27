import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getDealPageBySlug, getAllDealPageSlugs } from '@/data/deal-categories'

type Props = {
  params: Promise<{ slug: string[] }>
}

export const revalidate = 3600

// ---------- Helpers ----------
function isZipCode(segment: string): boolean {
  return /^\d{5}$/.test(segment)
}

const CATEGORY_NAMES: Record<string, string> = {
  flower: 'Flower',
  edibles: 'Edibles',
  'pre-rolls': 'Pre-Rolls',
  concentrates: 'Concentrates',
  vapes: 'Vapes',
  tinctures: 'Tinctures',
  topicals: 'Topicals',
}

function formatCategoryName(slug: string): string {
  return CATEGORY_NAMES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
}

const CATEGORY_EMOJIS: Record<string, string> = {
  flower: '🌿',
  edibles: '🍪',
  vapes: '💨',
  concentrates: '💎',
  'pre-rolls': '🚬',
  tinctures: '💧',
  topicals: '🧴',
}

// ---------- Static params ----------
export async function generateStaticParams() {
  const dealPageSlugs = getAllDealPageSlugs().map((s) => ({ slug: [s] }))

  const cityDeals = await prisma.deal.findMany({
    where: { isActive: true },
    select: { stateSlug: true, citySlug: true },
    distinct: ['stateSlug', 'citySlug'],
  })

  const cityParams = cityDeals
    .filter((d) => d.stateSlug && d.citySlug)
    .map((d) => ({ slug: [d.stateSlug!, d.citySlug!] }))

  // ZIP + category combinations from MenuProduct data
  let zipCategoryParams: { slug: string[] }[] = []
  try {
    const zipsWithProducts = await prisma.dispensary.findMany({
      where: { isActive: true, menuProducts: { some: { isActive: true } } },
      select: { zipCode: true },
      distinct: ['zipCode'],
      take: 200,
    })

    const categories = await prisma.menuProduct.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: true,
    })

    zipCategoryParams = zipsWithProducts.flatMap((d) =>
      categories.map((cat) => ({ slug: [d.zipCode, cat.category] }))
    )
  } catch {
    // MenuProduct table might be empty or not migrated yet
  }

  return [...dealPageSlugs, ...cityParams, ...zipCategoryParams]
}

// ---------- Metadata ----------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: slugArr } = await params

  if (slugArr.length === 1) {
    const pageData = getDealPageBySlug(slugArr[0])
    if (!pageData) return { title: 'Not Found | Leefii' }
    const { data } = pageData
    const title = `${data.name} — Cannabis Dispensary Discounts | Leefii`
    const description = data.description
    return {
      title,
      description,
      openGraph: { title, description, url: `https://leefii.com/deals/${slugArr[0]}`, siteName: 'Leefii' },
      twitter: { card: 'summary_large_image', title, description },
      alternates: { canonical: `https://leefii.com/deals/${slugArr[0]}` },
    }
  }

  if (slugArr.length === 2) {
    // ZIP + category pattern: /deals/32819/flower
    if (isZipCode(slugArr[0])) {
      const [zip, categorySlug] = slugArr
      const categoryName = formatCategoryName(categorySlug)
      const dispensary = await prisma.dispensary.findFirst({
        where: { zipCode: zip, isActive: true },
        select: { city: { select: { name: true } }, state: { select: { abbreviation: true } } },
      })
      const locationLabel = dispensary ? `${dispensary.city.name}, ${dispensary.state.abbreviation}` : `ZIP ${zip}`
      const title = `Cheapest ${categoryName} Near ${zip} (${locationLabel}) — Compare Prices | Leefii`
      const description = `Compare ${categoryName.toLowerCase()} prices from dispensaries near ${zip}. Find the cheapest ${categoryName.toLowerCase()} at dispensaries in ${locationLabel}.`
      const productCount = await prisma.menuProduct.count({
        where: { dispensary: { zipCode: zip }, isActive: true, category: categorySlug },
      }).catch(() => 0)
      return {
        title,
        description,
        ...(productCount === 0 ? { robots: { index: false, follow: true } } : {}),
        openGraph: { title, description, url: `https://leefii.com/deals/${zip}/${categorySlug}`, siteName: 'Leefii' },
        twitter: { card: 'summary_large_image', title, description },
        alternates: { canonical: `https://leefii.com/deals/${zip}/${categorySlug}` },
      }
    }

    // State + city pattern: /deals/florida/orlando (existing)
    const [stateSlug, citySlug] = slugArr
    const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
    if (!state) return { title: 'Not Found | Leefii' }
    const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
    if (!city) return { title: 'Not Found | Leefii' }
    const title = `Cannabis Deals in ${city.name}, ${state.abbreviation} — Dispensary Discounts Today | Leefii`
    const description = `Find the best cannabis deals and dispensary discounts in ${city.name}, ${state.abbreviation}. Daily specials, first-time patient offers, veteran discounts, and more.`
    return {
      title,
      description,
      openGraph: { title, description, url: `https://leefii.com/deals/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
      twitter: { card: 'summary_large_image', title, description },
      alternates: { canonical: `https://leefii.com/deals/${stateSlug}/${citySlug}` },
    }
  }

  if (slugArr.length === 3) {
    // State + city + ZIP pattern: /deals/florida/orlando/32819
    if (!isZipCode(slugArr[0]) && isZipCode(slugArr[2])) {
      const [stateSlug, citySlug, zip] = slugArr
      const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
      if (!state) return { title: 'Not Found | Leefii' }
      const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
      if (!city) return { title: 'Not Found | Leefii' }
      const title = `Cheapest Dispensary Deals Near ${zip} in ${city.name}, ${state.abbreviation} — Updated Today | Leefii`
      const description = `Compare cannabis prices from dispensaries near ${zip} in ${city.name}, ${state.abbreviation}. Find the cheapest flower, edibles, vapes, and more.`
      const productCount = await prisma.menuProduct.count({
        where: { dispensary: { zipCode: zip }, isActive: true },
      }).catch(() => 0)
      return {
        title,
        description,
        ...(productCount === 0 ? { robots: { index: false, follow: true } } : {}),
        openGraph: { title, description, url: `https://leefii.com/deals/${stateSlug}/${citySlug}/${zip}`, siteName: 'Leefii' },
        twitter: { card: 'summary_large_image', title, description },
        alternates: { canonical: `https://leefii.com/deals/${stateSlug}/${citySlug}/${zip}` },
      }
    }

    // ZIP + category + product pattern: /deals/32819/flower/blue-dream
    if (isZipCode(slugArr[0])) {
      const [zip, categorySlug, productSlug] = slugArr
      const categoryName = formatCategoryName(categorySlug)
      const productName = productSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const dispensary = await prisma.dispensary.findFirst({
        where: { zipCode: zip, isActive: true },
        select: { city: { select: { name: true } }, state: { select: { abbreviation: true } } },
      })
      const locationLabel = dispensary ? `${dispensary.city.name}, ${dispensary.state.abbreviation}` : `ZIP ${zip}`
      const title = `${productName} Deals Near ${zip} — Compare ${categoryName} Prices | Leefii`
      const description = `Find the cheapest ${productName} near ${zip} (${locationLabel}). Compare prices across dispensaries for ${categoryName.toLowerCase()}.`
      return {
        title,
        description,
        openGraph: { title, description, url: `https://leefii.com/deals/${zip}/${categorySlug}/${productSlug}`, siteName: 'Leefii' },
        twitter: { card: 'summary_large_image', title, description },
        alternates: { canonical: `https://leefii.com/deals/${zip}/${categorySlug}/${productSlug}` },
      }
    }
  }

  return { title: 'Not Found | Leefii' }
}

// ---------- Helpers ----------

function formatDiscount(discountValue: number | null, discountType: string | null): string | null {
  if (!discountValue) return null
  if (discountType === 'percent') return `${discountValue}% OFF`
  if (discountType === 'dollar') return `$${discountValue} OFF`
  if (discountType === 'bogo') return 'BOGO'
  return `${discountValue}% OFF`
}

function formatExpiry(endDate: Date | null, isOngoing: boolean): { label: string; style: string } {
  if (isOngoing || !endDate) return { label: 'Ongoing', style: 'bg-green-100 text-green-700' }
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (daysLeft < 0) return { label: 'Expired', style: 'bg-gray-100 text-gray-500' }
  if (daysLeft <= 2) return { label: `Expires in ${daysLeft}d`, style: 'bg-amber-100 text-amber-700' }
  return { label: `Expires ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, style: 'bg-green-100 text-green-700' }
}

function DealCard({ deal }: { deal: DealRow }) {
  const discount = formatDiscount(deal.discountValue, deal.discountType)
  const expiry = formatExpiry(deal.endDate, deal.isOngoing)
  const href = deal.dispensarySlug ? `/dispensary/${deal.dispensarySlug}` : '/dispensaries'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition relative flex flex-col">
      {discount && (
        <span className="absolute -top-3 right-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-sm">
          {discount}
        </span>
      )}

      {deal.dispensaryName && (
        <Link href={href} className="text-sm font-medium text-green-600 hover:text-green-700 mb-1">
          {deal.dispensaryName}
        </Link>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">{deal.title}</h3>

      {deal.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{deal.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3 mt-auto">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${expiry.style}`}>
          {expiry.label}
        </span>
        {deal.code && (
          <span className="text-xs px-2.5 py-1 rounded bg-gray-100 border border-dashed border-gray-300 font-mono text-gray-700">
            {deal.code}
          </span>
        )}
        {deal.stateSlug && deal.citySlug && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            {deal.citySlug.replace(/-/g, ' ')}, {deal.stateSlug.toUpperCase().slice(0, 2)}
          </span>
        )}
      </div>

      {deal.minPurchase && deal.minPurchase > 0 && (
        <p className="text-xs text-gray-500 mb-2">Min. purchase: ${deal.minPurchase}</p>
      )}

      <Link
        href={href}
        className="inline-flex items-center justify-center w-full mt-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
      >
        View Deal
      </Link>
    </div>
  )
}

type DealRow = {
  id: string
  title: string
  slug: string
  description: string | null
  discountType: string | null
  discountValue: number | null
  code: string | null
  dispensaryName: string | null
  dispensarySlug: string | null
  stateSlug: string | null
  citySlug: string | null
  endDate: Date | null
  isOngoing: boolean
  isFeatured: boolean
  minPurchase: number | null
}

// ---------- Main page component ----------
export default async function DealsCatchAllPage({ params }: Props) {
  const { slug: slugArr } = await params

  if (slugArr.length === 1) {
    return renderDealTypePage(slugArr[0])
  }

  if (slugArr.length === 2) {
    if (isZipCode(slugArr[0])) {
      return renderZipCategoryPage(slugArr[0], slugArr[1])
    }
    return renderCityDealPage(slugArr[0], slugArr[1])
  }

  if (slugArr.length === 3) {
    if (isZipCode(slugArr[0])) {
      return renderZipCategoryProductPage(slugArr[0], slugArr[1], slugArr[2])
    }
    if (isZipCode(slugArr[2])) {
      return renderStateCityZipPage(slugArr[0], slugArr[1], slugArr[2])
    }
  }

  notFound()
}

// ================================================================
// DEAL TYPE / PRODUCT CATEGORY PAGE (1-segment)
// ================================================================
async function renderDealTypePage(slug: string) {
  const pageData = getDealPageBySlug(slug)
  if (!pageData) notFound()
  const { type, data } = pageData

  const now = new Date()

  // Build search conditions from searchTerms
  const searchConditions = data.searchTerms.flatMap((term) => [
    { title: { contains: term, mode: 'insensitive' as const } },
    { description: { contains: term, mode: 'insensitive' as const } },
  ])

  const whereClause: Record<string, unknown> = {
    isActive: true,
    OR: searchConditions,
  }

  // For daily-deals, only show current deals
  if (slug === 'daily-deals') {
    whereClause.AND = [
      { OR: [{ endDate: { gte: now } }, { isOngoing: true }] },
    ]
  }

  const deals = await prisma.deal.findMany({
    where: whereClause as any,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 50,
    select: {
      id: true, title: true, slug: true, description: true,
      discountType: true, discountValue: true, code: true,
      dispensaryName: true, dispensarySlug: true,
      stateSlug: true, citySlug: true,
      endDate: true, isOngoing: true, isFeatured: true, minPurchase: true,
    },
  })

  const allSlugs = getAllDealPageSlugs()
  const crossLinks = allSlugs.filter((s) => s !== slug).map((s) => {
    const p = getDealPageBySlug(s)
    return p ? { slug: s, name: p.data.name, icon: p.data.icon, type: p.type } : null
  }).filter(Boolean) as { slug: string; name: string; icon: string; type: string }[]

  const dealTypeCrossLinks = crossLinks.filter((c) => c.type === 'deal-type')
  const productCrossLinks = crossLinks.filter((c) => c.type === 'product')

  // JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: 'https://leefii.com/deals' },
      { '@type': 'ListItem', position: 3, name: data.name },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.slice(0, 5).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const itemListLd = deals.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.name,
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.title,
      url: d.dispensarySlug
        ? `https://leefii.com/dispensary/${d.dispensarySlug}`
        : 'https://leefii.com/deals',
    })),
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/deals" className="hover:text-white">Deals</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{data.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{data.icon}</span>
            <h1 className="text-3xl md:text-5xl font-bold">{data.name}</h1>
          </div>
          <p className="text-xl text-green-50 max-w-3xl">{data.description}</p>

          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {deals.length} Deals Found
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {type === 'deal-type' ? 'Deal Type' : 'Product Category'}
            </span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {data.name}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.intro}</p>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {deals.length > 0 ? `${deals.length} ${data.name}` : data.name}
          </h2>

          {deals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="text-5xl block mb-4">&#128269;</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {data.name.toLowerCase()} found yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Check back soon &mdash; dispensaries add new deals daily! In the meantime, browse all
                available deals.
              </p>
              <Link
                href="/deals"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Browse All Deals
              </Link>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {data.faqs.slice(0, 5).map((faq, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 group">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700 list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">&#9660;</span>
                </summary>
                <p className="px-4 pb-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-links: Deal Types */}
        {dealTypeCrossLinks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Deal Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {dealTypeCrossLinks.map((c) => (
                <Link
                  key={c.slug}
                  href={`/deals/${c.slug}`}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <span className="text-2xl block mb-1">{c.icon}</span>
                  <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cross-links: Product Categories */}
        {productCrossLinks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deals by Product</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {productCrossLinks.map((c) => (
                <Link
                  key={c.slug}
                  href={`/deals/${c.slug}`}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <span className="text-2xl block mb-1">{c.icon}</span>
                  <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ================================================================
// CITY DEAL PAGE (2-segment: /deals/[state]/[city])
// ================================================================
async function renderCityDealPage(stateSlug: string, citySlug: string) {
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()

  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) notFound()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1)

  const deals = await prisma.deal.findMany({
    where: {
      isActive: true,
      stateSlug,
      citySlug,
      OR: [
        { endDate: { gte: now } },
        { isOngoing: true },
        { endDate: null },
      ],
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true, title: true, slug: true, description: true,
      discountType: true, discountValue: true, code: true,
      dispensaryName: true, dispensarySlug: true,
      stateSlug: true, citySlug: true,
      endDate: true, isOngoing: true, isFeatured: true, minPurchase: true,
    },
  })

  const dispensaryCount = city.dispensaryCount

  // Separate today's deals from ongoing
  const todaysDeals = deals.filter(
    (d) => d.endDate && d.endDate >= todayStart && d.endDate <= todayEnd
  )
  const ongoingDeals = deals.filter(
    (d) => !d.endDate || d.isOngoing || d.endDate > todayEnd || d.endDate < todayStart
  )

  // Discount type badges for filter display
  const discountTypes = Array.from(
    new Set(deals.map((d) => d.discountType).filter(Boolean))
  ) as string[]

  // Other cities with deals in same state
  const otherCityDeals = await prisma.deal.findMany({
    where: {
      isActive: true,
      stateSlug,
      NOT: { citySlug },
      OR: [{ endDate: { gte: now } }, { isOngoing: true }, { endDate: null }],
    },
    select: { citySlug: true },
    distinct: ['citySlug'],
  })

  const otherCitySlugs = otherCityDeals
    .map((d) => d.citySlug)
    .filter(Boolean) as string[]

  const otherCities = otherCitySlugs.length > 0
    ? await prisma.city.findMany({
        where: { slug: { in: otherCitySlugs }, stateId: state.id },
        select: { name: true, slug: true },
        take: 12,
      })
    : []

  // FAQ data
  const faqItems = [
    {
      q: `Where can I find cannabis deals in ${city.name}?`,
      a: `Leefii tracks ${deals.length} active cannabis deals from dispensaries in ${city.name}, ${state.abbreviation}. Browse this page for the latest discounts, daily specials, and promotional offers. Deals are updated regularly as dispensaries post new promotions.`,
    },
    {
      q: `Do ${city.name} dispensaries have first-time discounts?`,
      a: `Many dispensaries in ${city.name} offer first-time patient or customer discounts ranging from 10% to 25% off your first purchase. Check individual dispensary pages on Leefii for specific first-time offers, as they vary by location.`,
    },
    {
      q: `What days have the best deals in ${city.name}?`,
      a: `Cannabis deals in ${city.name} vary by day and dispensary. Many dispensaries run daily specials — common promotions include Munchie Monday edible deals, Terpy Tuesday concentrate discounts, and Weekend BOGO offers. Check this page regularly for the latest deals.`,
    },
    {
      q: `How often do ${city.name} dispensary deals change?`,
      a: `Dispensary deals in ${city.name} change frequently. Daily specials rotate every day, while weekly and monthly promotions update on their own schedule. Leefii refreshes deal listings regularly so you always see the most current offers.`,
    },
    {
      q: `Can I find delivery deals in ${city.name}?`,
      a: `Yes, some dispensaries in ${city.name} offer exclusive delivery deals and promotions. Look for delivery-specific discounts on this page, or visit individual dispensary pages to see if they offer delivery with special pricing.`,
    },
  ]

  // JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: 'https://leefii.com/deals' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://leefii.com/dispensaries/${stateSlug}` },
      { '@type': 'ListItem', position: 4, name: `${city.name} Deals` },
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

  const itemListLd = deals.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Cannabis Deals in ${city.name}, ${state.abbreviation}`,
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 20).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.title,
      url: d.dispensarySlug
        ? `https://leefii.com/dispensary/${d.dispensarySlug}`
        : `https://leefii.com/deals/${stateSlug}/${citySlug}`,
    })),
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/deals" className="hover:text-white">Deals</Link>
            <span className="mx-2">/</span>
            <Link href={`/dispensaries/${stateSlug}`} className="hover:text-white">{state.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{city.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Cannabis Deals &amp; Discounts in {city.name}, {state.abbreviation}
          </h1>
          <p className="text-xl text-green-50 max-w-3xl">
            Find the best dispensary deals, daily specials, and promotional discounts in {city.name}.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {deals.length} Active Deals
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              {dispensaryCount} Dispensaries
            </span>
            {todaysDeals.length > 0 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-400/30 text-white">
                {todaysDeals.length} Today Only
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Discount type filter badges (visual) */}
        {discountTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-600 text-white">
              All ({deals.length})
            </span>
            {discountTypes.map((dt) => (
              <span
                key={dt}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
              >
                {dt === 'percent' ? '% Off' : dt === 'dollar' ? '$ Off' : dt === 'bogo' ? 'BOGO' : dt}
                {' '}({deals.filter((d) => d.discountType === dt).length})
              </span>
            ))}
          </div>
        )}

        {/* Today's Deals */}
        {todaysDeals.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Today&apos;s Deals in {city.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaysDeals.map((deal) => (
                <div key={deal.id} className="relative">
                  <div className="absolute inset-0 rounded-xl border-2 border-amber-400 pointer-events-none" />
                  <DealCard deal={deal} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Active Deals */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {todaysDeals.length > 0 ? 'All Active Deals' : `Cannabis Deals in ${city.name}`}
          </h2>

          {ongoingDeals.length > 0 || (todaysDeals.length === 0 && deals.length > 0) ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(todaysDeals.length > 0 ? ongoingDeals : deals).map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <span className="text-5xl block mb-4">&#128269;</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No deals in {city.name} yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Check back soon &mdash; dispensaries add new deals daily! Browse dispensaries in {city.name} to find stores near you.
              </p>
              <Link
                href={`/dispensaries/${stateSlug}/${citySlug}`}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Browse {city.name} Dispensaries
              </Link>
            </div>
          ) : null}
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 group">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700 list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">&#9660;</span>
                </summary>
                <p className="px-4 pb-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* State dispensary link */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse {state.name} Dispensaries
            </h2>
            <p className="text-gray-600 mb-4">
              Explore all cannabis dispensaries in {state.name}, compare ratings, hours, and services.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/dispensaries/${stateSlug}/${citySlug}`}
                className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition"
              >
                {city.name} Dispensaries
              </Link>
              <Link
                href={`/dispensaries/${stateSlug}`}
                className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-full text-sm font-medium hover:bg-green-50 transition"
              >
                All {state.name} Dispensaries
              </Link>
            </div>
          </div>
        </section>

        {/* Other City Deals */}
        {otherCities.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Deals in Other {state.name} Cities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/deals/${stateSlug}/${c.slug}`}
                  className="bg-white rounded-xl p-4 border hover:shadow-md hover:border-green-500 transition"
                >
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-sm text-green-600">View deals</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ================================================================
// STATE + CITY + ZIP PAGE (3-segment: /deals/[state]/[city]/[zip])
// ================================================================
async function renderStateCityZipPage(stateSlug: string, citySlug: string, zip: string) {
  if (!isZipCode(zip)) notFound()

  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) notFound()
  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) notFound()

  const products = await prisma.menuProduct.findMany({
    where: { dispensary: { zipCode: zip }, isActive: true },
    include: {
      dispensary: {
        select: { name: true, slug: true, rating: true, city: { select: { name: true } }, state: { select: { abbreviation: true } } },
      },
    },
    orderBy: { price: 'asc' },
    take: 50,
  })

  const mostRecent = products.length > 0
    ? products.reduce((latest, p) => (p.lastScrapedAt > latest ? p.lastScrapedAt : latest), products[0].lastScrapedAt)
    : null
  const hoursAgo = mostRecent ? Math.round((Date.now() - mostRecent.getTime()) / (1000 * 60 * 60)) : null
  const freshnessText = hoursAgo !== null ? (hoursAgo < 1 ? 'less than an hour ago' : `${hoursAgo} hours ago`) : null

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const nearbyZips = await prisma.dispensary.findMany({
    where: { cityId: city.id, isActive: true, NOT: { zipCode: zip } },
    select: { zipCode: true },
    distinct: ['zipCode'],
    take: 8,
  })

  const prices = products.map((p) => p.price).filter((p) => p > 0)
  const cheapest = prices.length > 0 ? Math.min(...prices) : null
  const average = prices.length > 0 ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100 : null

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: 'https://leefii.com/deals' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://leefii.com/dispensaries/${stateSlug}` },
      { '@type': 'ListItem', position: 4, name: `${city.name} Deals`, item: `https://leefii.com/deals/${stateSlug}/${citySlug}` },
      { '@type': 'ListItem', position: 5, name: `ZIP ${zip}` },
    ],
  }

  const itemListLd = products.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `Cheapest Cannabis Near ${zip}`, numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Product', name: p.name, ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
        offers: { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: p.dispensary.name } } },
    })),
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span>
            <Link href="/deals" className="hover:text-white">Deals</Link><span className="mx-2">/</span>
            <Link href={`/dispensaries/${stateSlug}`} className="hover:text-white">{state.name}</Link><span className="mx-2">/</span>
            <Link href={`/deals/${stateSlug}/${citySlug}`} className="hover:text-white">{city.name}</Link><span className="mx-2">/</span>
            <span className="text-white font-medium">{zip}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Cheapest Cannabis Near {zip}</h1>
          <p className="text-xl text-green-50 max-w-3xl">Compare real-time product prices from dispensaries near {zip} in {city.name}, {state.abbreviation}.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">{products.length} Products</span>
            {cheapest !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">From ${cheapest.toFixed(2)}</span>}
            {average !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">Avg ${average.toFixed(2)}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {freshnessText && <p className="text-sm text-gray-500 mb-6">Prices last updated: {freshnessText}</p>}

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Link key={cat} href={`/deals/${zip}/${cat}`} className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700 transition">
                {CATEGORY_EMOJIS[cat] || '🌱'} {formatCategoryName(cat)} ({products.filter((p) => p.category === cat).length})
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition relative flex flex-col">
                {p.isOnSale && p.originalPrice && p.originalPrice > p.price && (
                  <span className="absolute -top-3 right-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-sm">
                    {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium w-fit capitalize mb-2">{p.category}</span>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">{p.name}</h3>
                {p.brand && <p className="text-sm text-gray-500">{p.brand}</p>}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-bold text-green-600">${p.price.toFixed(2)}</span>
                  {p.originalPrice && p.isOnSale && <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                  {p.weight && <span className="text-sm text-gray-500">/ {p.weight}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.thcContent && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">THC: {p.thcContent}</span>}
                  {p.strainType && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{p.strainType}</span>}
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 mt-3">
                  <Link href={`/dispensary/${p.dispensary.slug}`} className="text-sm font-medium text-green-600 hover:text-green-700">{p.dispensary.name}</Link>
                  {(p.dispensary.rating ?? 0) > 0 && <span className="text-xs text-amber-500 ml-2">★ {p.dispensary.rating!.toFixed(1)}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mb-12">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products near {zip} yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Product data is being added daily. Browse dispensaries in {city.name} to find stores near you.</p>
            <Link href={`/dispensaries/${stateSlug}/${citySlug}`} className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">Browse {city.name} Dispensaries</Link>
          </div>
        )}

        {nearbyZips.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby ZIP Codes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {nearbyZips.map((d) => (
                <Link key={d.zipCode} href={`/deals/${stateSlug}/${citySlug}/${d.zipCode}`} className="bg-white rounded-xl p-4 border hover:shadow-md hover:border-green-500 transition text-center">
                  <p className="font-medium text-gray-900">{d.zipCode}</p>
                  <p className="text-sm text-green-600">View deals</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">More Deals in {city.name}</h2>
            <p className="text-gray-600 mb-4">See all cannabis deals and dispensary discounts in {city.name}, {state.abbreviation}.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/deals/${stateSlug}/${citySlug}`} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition">{city.name} Deals</Link>
              <Link href="/shop" className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-full text-sm font-medium hover:bg-green-50 transition">Compare Prices</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// ================================================================
// ZIP + CATEGORY PAGE (2-segment: /deals/[zip]/[category])
// ================================================================
async function renderZipCategoryPage(zip: string, categorySlug: string) {
  if (!isZipCode(zip)) notFound()
  const categoryName = formatCategoryName(categorySlug)

  const refDispensary = await prisma.dispensary.findFirst({
    where: { zipCode: zip, isActive: true },
    select: { city: { select: { name: true, slug: true } }, state: { select: { name: true, slug: true, abbreviation: true } } },
  })
  const locationLabel = refDispensary ? `${refDispensary.city.name}, ${refDispensary.state.abbreviation}` : `ZIP ${zip}`

  const products = await prisma.menuProduct.findMany({
    where: { dispensary: { zipCode: zip }, isActive: true, category: categorySlug },
    include: { dispensary: { select: { name: true, slug: true, rating: true, city: { select: { name: true } }, state: { select: { abbreviation: true } } } } },
    orderBy: { price: 'asc' },
    take: 50,
  })

  const mostRecent = products.length > 0
    ? products.reduce((latest, p) => (p.lastScrapedAt > latest ? p.lastScrapedAt : latest), products[0].lastScrapedAt)
    : null
  const hoursAgo = mostRecent ? Math.round((Date.now() - mostRecent.getTime()) / (1000 * 60 * 60)) : null
  const freshnessText = hoursAgo !== null ? (hoursAgo < 1 ? 'less than an hour ago' : `${hoursAgo} hours ago`) : null

  const prices = products.map((p) => p.price).filter((p) => p > 0)
  const cheapest = prices.length > 0 ? Math.min(...prices) : null
  const average = prices.length > 0 ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100 : null
  const highest = prices.length > 0 ? Math.max(...prices) : null

  const otherCategories = await prisma.menuProduct.groupBy({
    by: ['category'],
    where: { dispensary: { zipCode: zip }, isActive: true, NOT: { category: categorySlug } },
    _count: true,
  })

  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[]

  const productNames = products.reduce<Record<string, number>>((acc, p) => {
    const key = p.strain || p.name.toLowerCase().replace(/\s*\d+(\.\d+)?g\s*$/i, '').trim()
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const topProducts = Object.entries(productNames).filter(([, count]) => count >= 2).sort(([, a], [, b]) => b - a).slice(0, 12)

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: 'https://leefii.com/deals' },
      { '@type': 'ListItem', position: 3, name: `${categoryName} Near ${zip}` },
    ],
  }

  const itemListLd = products.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `Cheapest ${categoryName} Near ${zip}`, numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Product', name: p.name, ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
        offers: { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: p.dispensary.name } } },
    })),
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span>
            <Link href="/deals" className="hover:text-white">Deals</Link><span className="mx-2">/</span>
            <span className="text-white font-medium">{categoryName} Near {zip}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{CATEGORY_EMOJIS[categorySlug] || '🌱'}</span>
            <h1 className="text-3xl md:text-5xl font-bold">Cheapest {categoryName} Near {zip}</h1>
          </div>
          <p className="text-xl text-green-50 max-w-3xl">Compare {categoryName.toLowerCase()} prices from dispensaries near {zip} ({locationLabel}).</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">{products.length} Products</span>
            {cheapest !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">From ${cheapest.toFixed(2)}</span>}
            {average !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">Avg ${average.toFixed(2)}</span>}
            {highest !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">Up to ${highest.toFixed(2)}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {freshnessText && <p className="text-sm text-gray-500 mb-6">Prices last updated: {freshnessText}</p>}

        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition relative flex flex-col">
                {p.isOnSale && p.originalPrice && p.originalPrice > p.price && (
                  <span className="absolute -top-3 right-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-sm">{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF</span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">{p.name}</h3>
                {p.brand && <p className="text-sm text-gray-500">{p.brand}</p>}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-bold text-green-600">${p.price.toFixed(2)}</span>
                  {p.originalPrice && p.isOnSale && <span className="text-sm text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                  {p.weight && <span className="text-sm text-gray-500">/ {p.weight}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.thcContent && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">THC: {p.thcContent}</span>}
                  {p.strainType && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{p.strainType}</span>}
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 mt-3">
                  <Link href={`/dispensary/${p.dispensary.slug}`} className="text-sm font-medium text-green-600 hover:text-green-700">{p.dispensary.name}</Link>
                  {(p.dispensary.rating ?? 0) > 0 && <span className="text-xs text-amber-500 ml-2">★ {p.dispensary.rating!.toFixed(1)}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mb-12">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {categoryName.toLowerCase()} found near {zip}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Product data is being added daily. Try browsing other categories or expanding your search.</p>
            <Link href="/shop" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">Search All Products</Link>
          </div>
        )}

        {topProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular {categoryName} Near {zip}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {topProducts.map(([name, count]) => {
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                return (
                  <Link key={slug} href={`/deals/${zip}/${categorySlug}/${slug}`} className="bg-white rounded-xl p-4 border hover:shadow-md hover:border-green-500 transition">
                    <p className="font-medium text-gray-900 capitalize">{name}</p>
                    <p className="text-sm text-green-600">{count} listings &rarr;</p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {brands.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Brands Available</h2>
            <div className="flex flex-wrap gap-2">
              {brands.slice(0, 20).map((brand) => (
                <span key={brand} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">{brand}</span>
              ))}
            </div>
          </section>
        )}

        {otherCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Categories Near {zip}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {otherCategories.map((cat) => (
                <Link key={cat.category} href={`/deals/${zip}/${cat.category}`} className="bg-white rounded-xl p-4 text-center border hover:shadow-md hover:border-green-500 transition">
                  <span className="text-2xl block mb-1">{CATEGORY_EMOJIS[cat.category] || '🌱'}</span>
                  <p className="font-medium text-gray-900">{formatCategoryName(cat.category)}</p>
                  <p className="text-sm text-green-600">{cat._count} products</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare All Prices Near You</h2>
            <p className="text-gray-600 mb-4">Search across all categories and dispensaries to find the best deals.</p>
            <Link href="/shop" className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition">Open Price Comparison Tool</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

// ================================================================
// ZIP + CATEGORY + PRODUCT PAGE (3-segment: /deals/[zip]/[category]/[product])
// ================================================================
async function renderZipCategoryProductPage(zip: string, categorySlug: string, productSlug: string) {
  if (!isZipCode(zip)) notFound()
  const categoryName = formatCategoryName(categorySlug)
  const searchName = productSlug.replace(/-/g, ' ')
  const productDisplayName = searchName.replace(/\b\w/g, (c) => c.toUpperCase())

  const refDispensary = await prisma.dispensary.findFirst({
    where: { zipCode: zip, isActive: true },
    select: { city: { select: { name: true } }, state: { select: { abbreviation: true } } },
  })
  const locationLabel = refDispensary ? `${refDispensary.city.name}, ${refDispensary.state.abbreviation}` : `ZIP ${zip}`

  const products = await prisma.menuProduct.findMany({
    where: {
      dispensary: { zipCode: zip }, isActive: true, category: categorySlug,
      OR: [
        { name: { contains: searchName, mode: 'insensitive' } },
        { strain: { contains: searchName, mode: 'insensitive' } },
      ],
    },
    include: { dispensary: { select: { name: true, slug: true, rating: true, address: true, city: { select: { name: true } }, state: { select: { abbreviation: true } } } } },
    orderBy: { price: 'asc' },
    take: 20,
  })

  const matchingStrain = await prisma.strain.findUnique({ where: { slug: productSlug } }).catch(() => null)

  const prices = products.map((p) => p.price).filter((p) => p > 0)
  const cheapest = prices.length > 0 ? Math.min(...prices) : null
  const average = prices.length > 0 ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100 : null

  const mostRecent = products.length > 0
    ? products.reduce((latest, p) => (p.lastScrapedAt > latest ? p.lastScrapedAt : latest), products[0].lastScrapedAt)
    : null
  const hoursAgo = mostRecent ? Math.round((Date.now() - mostRecent.getTime()) / (1000 * 60 * 60)) : null
  const freshnessText = hoursAgo !== null ? (hoursAgo < 1 ? 'less than an hour ago' : `${hoursAgo} hours ago`) : null

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: 'https://leefii.com/deals' },
      { '@type': 'ListItem', position: 3, name: `${categoryName} Near ${zip}`, item: `https://leefii.com/deals/${zip}/${categorySlug}` },
      { '@type': 'ListItem', position: 4, name: productDisplayName },
    ],
  }

  const productLd = products.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'Product', name: productDisplayName, category: categoryName,
    offers: {
      '@type': 'AggregateOffer', lowPrice: cheapest?.toFixed(2), highPrice: prices.length > 0 ? Math.max(...prices).toFixed(2) : undefined,
      priceCurrency: 'USD', offerCount: products.length,
      offers: products.slice(0, 10).map((p) => ({
        '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: p.dispensary.name },
      })),
    },
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {productLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />}

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-green-100 mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span>
            <Link href="/deals" className="hover:text-white">Deals</Link><span className="mx-2">/</span>
            <Link href={`/deals/${zip}/${categorySlug}`} className="hover:text-white">{categoryName} Near {zip}</Link><span className="mx-2">/</span>
            <span className="text-white font-medium">{productDisplayName}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{productDisplayName} Near {zip}</h1>
          <p className="text-xl text-green-50 max-w-3xl">
            Compare {productDisplayName} prices at {products.length} dispensar{products.length === 1 ? 'y' : 'ies'} near {zip} ({locationLabel}).
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {cheapest !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">From ${cheapest.toFixed(2)}</span>}
            {average !== null && <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">Avg ${average.toFixed(2)}</span>}
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">{products.length} Listing{products.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {freshnessText && <p className="text-sm text-gray-500 mb-6">Prices last updated: {freshnessText}</p>}

        {matchingStrain && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-medium text-purple-900">Want to learn about this strain?</p>
              <p className="text-sm text-purple-700">Read reviews, effects, and growing info for {productDisplayName}.</p>
            </div>
            <Link href={`/strains/${matchingStrain.slug}`} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition whitespace-nowrap">View Strain</Link>
          </div>
        )}

        {products.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Dispensary</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Weight</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">THC</th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p, i) => (
                    <tr key={p.id} className={i === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4">
                        <Link href={`/dispensary/${p.dispensary.slug}`} className="text-sm font-medium text-green-600 hover:text-green-700">{p.dispensary.name}</Link>
                        <p className="text-xs text-gray-500">{p.dispensary.city.name}, {p.dispensary.state.abbreviation}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{p.name}</p>
                        {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.weight || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{p.thcContent || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-bold ${i === 0 ? 'text-green-600' : 'text-gray-900'}`}>${p.price.toFixed(2)}</span>
                        {p.isOnSale && p.originalPrice && <span className="block text-xs text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                {products[0].dispensary.name} has the best price at ${products[0].price.toFixed(2)}. Tell them you found it on Leefii!
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mb-12">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {productDisplayName} found near {zip}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Try browsing all {categoryName.toLowerCase()} near this ZIP code.</p>
            <Link href={`/deals/${zip}/${categorySlug}`} className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">Browse All {categoryName}</Link>
          </div>
        )}

        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">More {categoryName} Near {zip}</h2>
            <p className="text-gray-600 mb-4">Compare prices across all {categoryName.toLowerCase()} products from dispensaries near you.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/deals/${zip}/${categorySlug}`} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition">All {categoryName} Near {zip}</Link>
              <Link href="/shop" className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-full text-sm font-medium hover:bg-green-50 transition">Price Comparison Tool</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
