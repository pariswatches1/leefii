import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import DispensaryListFilters from '@/components/DispensaryListFilters'
import { PHOENIX_NEIGHBORHOODS, PHOENIX_STRAINS, PHOENIX_BEST_FOR, PHOENIX_GUIDE, PHOENIX_FAQS } from '@/data/phoenix'

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

  // Phoenix-specific SEO override
  const isPhoenix = stateSlug === 'arizona' && citySlug === 'phoenix'
  const title = isPhoenix
    ? 'Verified Dispensaries in Phoenix, AZ — Menus Updated Daily | Leefii'
    : city.metaTitle || `Dispensaries in ${city.name}, ${state.abbreviation} | ${city.dispensaryCount} Dispensaries | Leefii`
  const description = isPhoenix
    ? `Find ${city.dispensaryCount}+ verified cannabis dispensaries in Phoenix, AZ. Every listing verified for accuracy. Compare menus, hours, delivery, and deals. Unlike other directories, Leefii manually verifies every Phoenix dispensary.`
    : city.metaDescription || `Find ${city.dispensaryCount} cannabis dispensaries in ${city.name}, ${state.abbreviation}. Compare ratings, hours, deals, and delivery options.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/dispensaries/${stateSlug}/${citySlug}` },
  }
}

function isCurrentlyOpen(businessHours: any[]): { open: boolean; closeTime?: string } {
  if (!businessHours || businessHours.length === 0) return { open: false }
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const now = new Date()
  const todayName = days[now.getDay()]
  const currentTime = now.toTimeString().slice(0, 5)
  const todayHours = businessHours.find((h) => h.dayOfWeek === todayName)
  if (!todayHours || todayHours.isClosed) return { open: false }
  const isOpen = currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
  return { open: isOpen, closeTime: todayHours.closeTime }
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
    take: 8,
    select: { name: true, slug: true, dispensaryCount: true },
  })

  const deliveryCount = dispensaries.filter((d) => d.hasDelivery).length
  const isPhoenix = stateSlug === 'arizona' && citySlug === 'phoenix'

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
        ...(d.rating && d.rating > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: d.rating, reviewCount: d.reviewsCount } } : {}),
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
    { q: `How many dispensaries are in ${city.name}?`, a: `There are ${dispensaries.length} active cannabis dispensaries in ${city.name}, ${state.abbreviation}.` },
    { q: `Which dispensaries in ${city.name} deliver?`, a: deliveryCount > 0 ? `${deliveryCount} dispensaries in ${city.name} offer delivery.` : `Currently no dispensaries in ${city.name} list delivery on Leefii.` },
    { q: `What are the best dispensaries in ${city.name}?`, a: `The top-rated dispensary is ${dispensaries[0].name}${dispensaries[0].rating ? ` with a ${dispensaries[0].rating.toFixed(1)} rating` : ''}.` },
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

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Dispensaries in {city.name}, {state.abbreviation}</h1>
          <p className="text-green-100 text-lg mb-6">
            Find {dispensaries.length} licensed cannabis dispensaries in {city.name}, {state.name}.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">Dispensaries</div>
            </div>
            {deliveryCount > 0 && (
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{deliveryCount}</div>
                <div className="text-green-100 text-sm">Deliver</div>
              </div>
            )}
          </div>
          <p className="text-sm text-green-200 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Dispensary Listings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DispensaryListFilters
          dispensaries={dispensaries.map((dispensary) => {
            const status = isCurrentlyOpen(dispensary.BusinessHours)
            return {
              id: dispensary.id,
              name: dispensary.name,
              slug: dispensary.slug,
              address: dispensary.address,
              isPremium: dispensary.isPremium,
              rating: dispensary.rating,
              reviewsCount: dispensary.reviewsCount,
              licenseType: dispensary.licenseType,
              hasDelivery: dispensary.hasDelivery,
              hasCurbside: dispensary.hasCurbside,
              acceptsCreditCard: dispensary.acceptsCreditCard,
              verificationDate: dispensary.verificationDate?.toISOString() ?? null,
              verificationMethod: dispensary.verificationMethod,
              verificationStatus: dispensary.verificationStatus,
              isClaimed: dispensary.isClaimed,
              isOpen: status.open,
              closeTime: status.closeTime,
            }
          })}
        />
      </div>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {nearbyCities.map((nc) => (
                <Link key={nc.slug} href={`/dispensaries/${state.slug}/${nc.slug}`} className="bg-white rounded-xl p-4 text-center border hover:shadow-md transition">
                  <p className="font-medium text-gray-900">{nc.name}</p>
                  <p className="text-sm text-gray-500">{nc.dispensaryCount} dispensaries</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phoenix Trust Banner */}
      {isPhoenix && (
        <section className="py-4 bg-green-50 border-y border-green-100">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-green-800">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Unlike other directories, Leefii manually verifies every Phoenix dispensary listing. See the green ✓ badge for dispensaries confirmed within 24 hours. <Link href="/how-we-verify" className="font-medium underline hover:text-green-900">Learn how →</Link></span>
          </div>
        </section>
      )}

      {/* Phoenix Neighborhoods Grid */}
      {isPhoenix && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Phoenix Neighborhood</h2>
            <p className="text-gray-600 mb-6">Find dispensaries in your area of the Phoenix metro.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {PHOENIX_NEIGHBORHOODS.map((n) => (
                <Link key={n.slug} href={`/dispensaries/arizona/phoenix/${n.slug}`} className="bg-gray-50 rounded-xl p-4 border hover:shadow-md hover:border-green-500 transition">
                  <p className="font-medium text-gray-900">{n.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.highlights[0]}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phoenix Popular Strains */}
      {isPhoenix && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Strains in Phoenix</h2>
            <p className="text-gray-600 mb-6">Find where to buy the most popular cannabis strains in the Phoenix metro area.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PHOENIX_STRAINS.slice(0, 9).map((s) => (
                <Link key={s.slug} href={`/strains/${s.slug}/phoenix-az`} className="bg-white rounded-xl p-5 border hover:shadow-md hover:border-green-500 transition">
                  <h3 className="font-bold text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.tagline}</p>
                  <span className="text-green-600 text-sm font-medium mt-2 inline-block">Find in Phoenix →</span>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {PHOENIX_STRAINS.slice(9).map((s) => (
                <Link key={s.slug} href={`/strains/${s.slug}/phoenix-az`} className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-green-50 hover:text-green-700 transition border">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phoenix "Best For" Links */}
      {isPhoenix && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find the Best Cannabis in Phoenix</h2>
            <p className="text-gray-600 mb-6">Curated recommendations for specific needs and occasions.</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {PHOENIX_BEST_FOR.map((b) => (
                <Link key={b.slug} href={`/best/${b.slug}/phoenix-az`} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:shadow-md hover:border-green-400 transition text-center">
                  <p className="font-semibold text-gray-900">Best for {b.name}</p>
                  <span className="text-green-600 text-xs font-medium mt-1 inline-block">View guide →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phoenix Cannabis Guide (2000+ words) */}
      {isPhoenix && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{PHOENIX_GUIDE.title}</h2>
            <div className="space-y-8">
              {PHOENIX_GUIDE.sections.map((section, i) => (
                <div key={i} className="bg-white rounded-xl p-6 md:p-8 border">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h3>
                  <div className="text-gray-600 space-y-4">
                    {section.content.split('\n\n').map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ — Enhanced for Phoenix */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {(isPhoenix ? PHOENIX_FAQS : faqData).map((f, i) => (
              <details key={i} className="bg-white rounded-xl border">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">{f.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Phoenix Explore More */}
      {isPhoenix && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore More Phoenix Cannabis</h2>
              <p className="text-gray-600 mb-4">Delivery, deals, doctors, and cannabis laws in Phoenix and Arizona.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/delivery/arizona/phoenix" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition">
                  Phoenix Delivery
                </Link>
                <Link href="/deals/arizona/phoenix" className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium hover:bg-amber-200 transition">
                  Phoenix Deals
                </Link>
                <Link href="/doctors/arizona/phoenix" className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                  Phoenix MMJ Doctors
                </Link>
                <Link href="/laws/arizona" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                  Arizona Cannabis Laws
                </Link>
                <Link href="/how-we-verify" className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition">
                  How We Verify
                </Link>
                <Link href="/accuracy-guarantee" className="px-4 py-2 bg-white text-green-700 rounded-full text-sm font-medium hover:bg-green-50 transition border border-green-200">
                  Accuracy Guarantee
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
