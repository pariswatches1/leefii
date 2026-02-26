import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getStateLawBySlug, getStateLawSlugs } from '@/data/cannabis-laws'

type Props = {
  params: Promise<{ state: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const states = await prisma.state.findMany({ select: { slug: true } })
  const deliverySlugs = states
    .map((s) => s.slug)
    .filter((slug) => {
      const law = getStateLawBySlug(slug)
      return law && law.deliveryAllowed.startsWith('Yes')
    })
  return deliverySlugs.map((slug) => ({ state: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } })
  if (!state) return {}

  const title = `Cannabis Delivery in ${state.name} — Order Weed Online | Leefii`
  const description = `Find dispensaries that deliver cannabis in ${state.name}. Browse cities with delivery, compare options, and order weed online.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/delivery/${stateSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/delivery/${stateSlug}` },
  }
}

export default async function DeliveryStatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const law = getStateLawBySlug(stateSlug)
  if (!law) notFound()

  const deliveryAllowed = law.deliveryAllowed
  const isDeliveryLegal = deliveryAllowed.startsWith('Yes') || deliveryAllowed.toLowerCase().includes('delivery')
  if (!isDeliveryLegal) notFound()

  let state: Awaited<ReturnType<typeof prisma.state.findUnique>>
  let citiesWithDelivery: { id: string; name: string; slug: string; _count: { dispensaries: number } }[] = []
  let totalDeliveryDispensaries = 0

  try {
    state = await prisma.state.findUnique({ where: { slug: stateSlug } })
    if (!state) notFound()

    citiesWithDelivery = await prisma.city.findMany({
      where: {
        stateId: state.id,
        dispensaries: { some: { isActive: true, hasDelivery: true } },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { dispensaries: { where: { isActive: true, hasDelivery: true } } } },
      },
    })

    citiesWithDelivery.sort((a, b) => b._count.dispensaries - a._count.dispensaries)

    totalDeliveryDispensaries = await prisma.dispensary.count({
      where: { stateId: state.id, isActive: true, hasDelivery: true },
    })
  } catch {
    notFound()
  }

  if (!state) notFound()

  const faqData = [
    {
      q: `Is cannabis delivery legal in ${state.name}?`,
      a: `Yes, cannabis delivery is legal in ${state.name}. The state allows licensed dispensaries to deliver cannabis products directly to customers. The current delivery policy is: ${deliveryAllowed}. All delivery drivers must be licensed, and customers must be 21 or older (or hold a valid medical card) and present a government-issued ID upon delivery.`,
    },
    {
      q: `How do I order cannabis delivery in ${state.name}?`,
      a: `To order cannabis delivery in ${state.name}, browse the delivery dispensaries listed on Leefii for your city. Visit the dispensary's page to see their menu, place your order online or by phone, provide your delivery address, and have your valid ID ready when the driver arrives. Most dispensaries offer same-day delivery within a certain radius.`,
    },
    {
      q: `Do I need a medical card for delivery in ${state.name}?`,
      a: state.isLegal && !state.medicalOnly
        ? `In ${state.name}, adults 21 and older can order recreational cannabis delivery without a medical card. Medical patients with a valid MMJ card may access additional products, higher possession limits, and potential tax savings on delivery orders.`
        : state.medicalOnly
          ? `Yes, you need a valid medical marijuana card to order cannabis delivery in ${state.name}. The state currently only permits medical cannabis sales, including delivery. You must register with the state program and have an active card to place delivery orders.`
          : `Requirements vary by dispensary in ${state.name}. Check with your local dispensary or visit the state laws page for the latest information on medical card requirements for delivery.`,
    },
    {
      q: `What's the minimum order for delivery in ${state.name}?`,
      a: `Minimum order amounts for cannabis delivery in ${state.name} vary by dispensary. Most dispensaries set minimum orders between $25 and $75. Some may waive minimums for medical patients or offer free delivery above a certain order total. Check individual dispensary pages on Leefii for specific minimum order details and delivery fee information.`,
    },
    {
      q: `How fast is cannabis delivery in ${state.name}?`,
      a: `Cannabis delivery times in ${state.name} typically range from 30 minutes to 2 hours depending on your location, the dispensary's distance, and current demand. Many dispensaries offer scheduled delivery windows and same-day service. Urban areas like major cities tend to have faster delivery options. Check your local dispensary's estimated delivery times on their Leefii page.`,
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Delivery', item: 'https://leefii.com/delivery' },
      { '@type': 'ListItem', position: 3, name: state.name },
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

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-green-100 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/delivery" className="hover:text-white">Delivery</Link>
            <span>/</span>
            <span className="text-white font-medium">{state.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Cannabis Delivery in {state.name}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mb-8">
            Browse {citiesWithDelivery.length} {citiesWithDelivery.length === 1 ? 'city' : 'cities'} with cannabis delivery in {state.name}. Compare dispensaries, check delivery areas, and order online.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">Cities with Delivery</div>
              <div className="text-2xl font-bold">{citiesWithDelivery.length}</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">Dispensaries Delivering</div>
              <div className="text-2xl font-bold">{totalDeliveryDispensaries}</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">Delivery Law Status</div>
              <div className="font-semibold text-sm">{deliveryAllowed}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Law Summary */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cannabis Delivery Laws in {state.name}</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                Cannabis delivery is legal in {state.name}, where the state has established a regulatory framework allowing licensed dispensaries to transport cannabis products directly to consumers. The current state policy on delivery is classified as: {deliveryAllowed}. This means that qualified cannabis retailers who hold the appropriate state delivery licenses can fulfill orders placed online, by phone, or through mobile apps and deliver them to residential addresses throughout {state.name}.
              </p>
              <p>
                {state.isLegal && !state.medicalOnly
                  ? `As a state with fully legalized recreational and medical cannabis, ${state.name} permits delivery for both adult-use customers aged 21 and older and registered medical marijuana patients. Recreational customers can order up to the state's possession limit per delivery, while medical patients may access higher limits and additional product categories. All customers must present a valid government-issued photo ID at the time of delivery, and delivery drivers are required to verify the recipient's age and identity before completing the handoff.`
                  : state.medicalOnly
                    ? `${state.name} currently limits cannabis delivery to registered medical marijuana patients with a valid MMJ card. To receive delivery, patients must be enrolled in the state's medical cannabis program and present their medical card along with a government-issued photo ID at the time of delivery. Delivery drivers are required to verify patient credentials before completing the handoff, and only products approved under the medical program are eligible for delivery.`
                    : `${state.name} regulates cannabis delivery under its current state laws. Customers should verify their eligibility and consult the latest state regulations before placing delivery orders. A valid government-issued photo ID is required at the time of delivery for age and identity verification.`}
              </p>
              <p>
                Dispensaries offering delivery in {state.name} must comply with strict state regulations including GPS tracking of all deliveries, secure transport containers, mandatory background checks for drivers, and limits on the total value of products carried per delivery run. Delivery hours are generally limited to the dispensary's operating hours, and most deliveries must be completed within the same day the order is placed. {state.name} law prohibits delivery to public spaces, federal property, schools, and anywhere minors are present without a legal guardian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      {citiesWithDelivery.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cities with Cannabis Delivery in {state.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {citiesWithDelivery.map((city) => (
                <Link
                  key={city.id}
                  href={`/delivery/${state.slug}/${city.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-green-500 hover:shadow-lg transition-all"
                >
                  <div className="font-semibold text-gray-900 group-hover:text-green-600">{city.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {city._count.dispensaries} {city._count.dispensaries === 1 ? 'dispensary' : 'dispensaries'} delivering
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How Delivery Works */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How Cannabis Delivery Works in {state.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse & Order</h3>
              <p className="text-gray-600 text-sm">
                Find a delivery dispensary in your city on Leefii. Browse their menu, select your products, and place your order online or by phone.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Verify & Confirm</h3>
              <p className="text-gray-600 text-sm">
                Provide your delivery address and confirm your order. The dispensary will verify your {state.medicalOnly ? 'medical card and ' : ''}ID and send you a delivery estimate.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Receive Delivery</h3>
              <p className="text-gray-600 text-sm">
                A licensed driver delivers your order. Show your government-issued ID{state.medicalOnly ? ' and medical card' : ''} at the door. Must be 21+ to receive cannabis delivery in {state.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More in {state.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/dispensaries/${state.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">All Dispensaries in {state.name}</h3>
              <p className="text-sm text-gray-500">Browse all cannabis dispensaries, including storefront and curbside options.</p>
            </Link>
            <Link
              href={`/laws/${state.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Cannabis Laws in {state.name}</h3>
              <p className="text-sm text-gray-500">Possession limits, purchase limits, consumption rules, and more.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 group">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700 flex items-center justify-between">
                  <span>{f.q}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
