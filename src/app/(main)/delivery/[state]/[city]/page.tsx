import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getStateLawBySlug } from '@/data/cannabis-laws'

interface Props {
  params: Promise<{ state: string; city: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) return {}
  const city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
  if (!city) return {}

  const title = `Cannabis Delivery in ${city.name}, ${state.abbreviation} — Weed Delivered to Your Door | Leefii`
  const description = `Find dispensaries that deliver cannabis in ${city.name}, ${state.abbreviation}. Compare delivery options, ratings, and hours. Same-day weed delivery available.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/delivery/${stateSlug}/${citySlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/delivery/${stateSlug}/${citySlug}` },
  }
}

export default async function DeliveryCityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params

  let state, city, dispensaries, totalInCity, nearbyCities

  try {
    state = await prisma.state.findUnique({ where: { slug: stateSlug } })
    if (!state) notFound()
    city = await prisma.city.findFirst({ where: { slug: citySlug, stateId: state.id } })
    if (!city) notFound()

    dispensaries = await prisma.dispensary.findMany({
      where: { cityId: city.id, isActive: true, hasDelivery: true },
      orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }, { reviewsCount: 'desc' }],
      include: { BusinessHours: true },
    })

    if (dispensaries.length === 0) notFound()

    totalInCity = await prisma.dispensary.count({ where: { cityId: city.id, isActive: true } })

    nearbyCities = await prisma.city.findMany({
      where: {
        stateId: state.id,
        NOT: { id: city.id },
        dispensaries: { some: { isActive: true, hasDelivery: true } },
      },
      take: 6,
      select: {
        name: true,
        slug: true,
        _count: { select: { dispensaries: { where: { isActive: true, hasDelivery: true } } } },
      },
    })
  } catch {
    notFound()
  }

  if (!state || !city || !dispensaries || dispensaries.length === 0) notFound()

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = days[new Date().getDay()]

  const stateLaw = getStateLawBySlug(stateSlug)
  const deliveryAllowed = stateLaw?.deliveryAllowed ?? 'Check local regulations'
  const isDeliveryLegal = deliveryAllowed.toLowerCase().startsWith('yes')
  const isRecreational = stateLaw?.status === 'recreational'
  const isMedicalOnly = stateLaw?.status === 'medical'
  const minimumAge = stateLaw?.minimumAge ?? 21

  const faqData = [
    {
      q: `How many dispensaries deliver in ${city.name}?`,
      a: `Currently ${dispensaries.length} dispensaries offer delivery in ${city.name}, ${state.abbreviation} as listed on Leefii.`,
    },
    {
      q: `Can I get weed delivered in ${city.name}?`,
      a: isDeliveryLegal
        ? `Yes, cannabis delivery is legal in ${state.name}. There are currently ${dispensaries.length} licensed dispensaries offering weed delivery in ${city.name}, ${state.abbreviation}. ${isRecreational ? `Adults ${minimumAge}+ with a valid government-issued ID can place delivery orders from recreational dispensaries.` : isMedicalOnly ? `You will need a valid medical marijuana card to order delivery in ${state.name}.` : ''} Browse the listings above to compare delivery options, ratings, and hours.`
        : `Cannabis delivery availability in ${city.name} depends on ${state.name} state regulations. ${deliveryAllowed}. Check with individual dispensaries listed above for the most current delivery options.`,
    },
    {
      q: `How fast is cannabis delivery?`,
      a: `Most dispensaries offering cannabis delivery in ${city.name} provide same-day delivery, typically within 1 to 3 hours of placing your order. Delivery windows vary by dispensary and may depend on your distance from the store, order volume, and time of day. Some dispensaries in ${city.name} also offer scheduled delivery for next-day or specific time-slot drop-offs. Check each dispensary's listing above for their current delivery hours and estimated delivery times.`,
    },
    {
      q: `Do I need a medical card for delivery in ${city.name}?`,
      a: isRecreational
        ? `${state.name} allows recreational cannabis. Adults ${minimumAge}+ can order delivery from recreational dispensaries without a medical card. You will need a valid government-issued photo ID to verify your age upon delivery. Medical card holders may still benefit from lower taxes or higher purchase limits at some dispensaries.`
        : isMedicalOnly
        ? `${state.name} currently only allows medical cannabis. You will need a valid MMJ card to order delivery in ${city.name}. To get a medical card, consult with a qualified physician about qualifying conditions in ${state.name}.`
        : `Check individual dispensary requirements and local ${state.name} regulations regarding medical card requirements for delivery.`,
    },
    {
      q: `What's the minimum order for delivery?`,
      a: `Minimum order amounts for cannabis delivery in ${city.name} vary by dispensary. Most delivery dispensaries in ${state.abbreviation} set minimums between $30 and $75 to cover delivery logistics. Some dispensaries waive delivery fees for orders over a certain amount. Check each of the ${dispensaries.length} delivery dispensaries listed above for their specific minimum order requirements and delivery fee policies.`,
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Delivery', item: 'https://leefii.com/delivery' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://leefii.com/dispensaries/${state.slug}` },
      { '@type': 'ListItem', position: 4, name: `${city.name} Delivery` },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/delivery" className="hover:text-green-600">Delivery</Link>
          <span className="mx-2">/</span>
          <Link href={`/dispensaries/${state.slug}`} className="hover:text-green-600">{state.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{city.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Cannabis Delivery in {city.name}, {state.abbreviation}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {dispensaries.length} Deliver{dispensaries.length === 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {totalInCity} Total in {city.name}
          </span>
        </div>

        <p className="text-gray-600 text-lg mb-8 max-w-3xl">
          {dispensaries.length} licensed cannabis {dispensaries.length === 1 ? 'dispensary delivers' : 'dispensaries deliver'} in {city.name}, {state.abbreviation}.
          Compare ratings, check delivery hours, and find the best option near you. Must be 21+ with valid ID.
        </p>

        {/* Quick Answer Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-green-900 font-semibold text-lg">
            There {dispensaries.length === 1 ? 'is' : 'are'} {dispensaries.length} {dispensaries.length === 1 ? 'dispensary' : 'dispensaries'} offering cannabis delivery in {city.name}. Same-day delivery available from select locations.
          </p>
        </div>

        {/* Delivery Dispensaries */}
        <section className="mb-12">
          <div className="space-y-3">
            {dispensaries.map((d) => {
              const todayHours = d.BusinessHours.find((bh) => bh.dayOfWeek === today)
              const isOpen = todayHours && !todayHours.isClosed

              return (
                <Link
                  key={d.slug}
                  href={`/dispensary/${d.slug}`}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {d.isPremium && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Featured</span>
                        )}
                        <h3 className="font-semibold text-gray-900 text-lg">{d.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{d.address}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="text-blue-600 font-medium">Delivers</span>
                        {isOpen ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Open · Closes {todayHours?.closeTime}</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Closed</span>
                        )}
                        {d.hasStorefront && <span className="text-gray-500">Also has storefront</span>}
                        {d.hasCurbside && <span className="text-gray-500">Curbside</span>}
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
              )
            })}
          </div>
        </section>

        {/* How Cannabis Delivery Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Cannabis Delivery Works in {city.name}</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Cannabis delivery in {city.name}, {state.abbreviation} allows you to order legal cannabis products
              directly to your doorstep from licensed dispensaries.{' '}
              {isDeliveryLegal
                ? `${state.name} state law permits licensed dispensaries to deliver cannabis products to customers. Delivery status: ${deliveryAllowed}.`
                : `Delivery regulations in ${state.name} may vary. Current status: ${deliveryAllowed}.`}{' '}
              All deliveries must comply with {state.name} cannabis regulations and are conducted by licensed operators
              who follow strict chain-of-custody and product safety protocols.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Age Verification and ID Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every cannabis delivery in {city.name} requires age verification at the point of delivery.{' '}
              {isRecreational
                ? `As ${state.name} allows recreational cannabis, you must be ${minimumAge} or older with a valid, unexpired government-issued photo ID such as a driver's license, state ID, or passport. The delivery driver will verify your identity and age before handing over your order.`
                : isMedicalOnly
                ? `Since ${state.name} only permits medical cannabis, you will need to present both a valid government-issued photo ID and your current ${state.name} medical marijuana card at the time of delivery. The driver will verify both documents before releasing your order.`
                : `You must be of legal age with a valid government-issued photo ID. Check ${state.name} state requirements for any additional documentation needed for cannabis delivery.`}{' '}
              Orders cannot be left unattended or delivered to someone other than the verified customer. If the driver cannot verify your age and identity, the delivery will be refused.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">What to Expect When You Order</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To place a delivery order in {city.name}, browse the {dispensaries.length} delivery{' '}
              {dispensaries.length === 1 ? 'dispensary' : 'dispensaries'} listed on this page, select your products
              through the dispensary&apos;s online menu, and complete your order. Most dispensaries accept
              debit cards, and some offer cashless payment options including ACH transfers or mobile payment
              apps. Cash payment upon delivery is also commonly accepted. After placing your order, you will
              typically receive a confirmation with a delivery window, and many dispensaries provide real-time
              tracking so you know when your order is on the way.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Delivery Windows and Scheduling</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Delivery times in {city.name} vary depending on the dispensary, your distance from their location,
              and current order volume. Most dispensaries offer delivery windows between 1 and 3 hours for
              same-day orders placed during business hours. Some dispensaries also offer scheduled delivery
              for specific time slots or next-day delivery. Delivery hours generally follow each dispensary&apos;s
              regular operating hours, though some may have separate, more limited delivery windows.
              Check the business hours listed for each dispensary above to plan your order accordingly.
              Keep in mind that peak times such as evenings and weekends may result in longer wait times.
            </p>
          </div>
        </section>

        {/* Browse All + Nearby */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">All Dispensaries in {city.name}</h2>
            <Link
              href={`/dispensaries/${state.slug}/${city.slug}`}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              View All {totalInCity} Dispensaries
            </Link>
          </div>
          {nearbyCities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Nearby Delivery</h2>
              <div className="space-y-2">
                {nearbyCities.map((nc) => (
                  <Link
                    key={nc.slug}
                    href={`/delivery/${state.slug}/${nc.slug}`}
                    className="block text-green-600 hover:text-green-800 hover:underline text-sm"
                  >
                    {nc.name} Delivery ({nc._count.dispensaries})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Link to State Delivery Page */}
        <div className="mb-12">
          <Link
            href={`/delivery/${state.slug}`}
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium hover:underline"
          >
            View all delivery cities in {state.name} &rarr;
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            {faqData.map((faq, idx) => (
              <details key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">
                  {faq.q}
                </summary>
                <p className="px-4 pb-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
