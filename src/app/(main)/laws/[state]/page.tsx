import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getStateLawBySlug, getStateLawSlugs, generateStateFaq } from '@/data/cannabis-laws'

type Props = {
  params: Promise<{ state: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  return getStateLawSlugs().map((slug) => ({ state: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const law = getStateLawBySlug(stateSlug)
  if (!law) return {}

  const title = `Cannabis Laws in ${law.name} 2026 — Is Weed Legal? | Leefii`
  const statusText = law.status === 'recreational' ? 'Recreational & medical legal' : law.status === 'medical' ? 'Medical only' : 'Illegal'
  const description = `Complete guide to cannabis laws in ${law.name}. ${statusText}, possession limits, where to buy, MMJ card info. Updated ${new Date(law.lastUpdated).toLocaleDateString('en-US', { month: 'long' })} 2026.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/laws/${stateSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/laws/${stateSlug}` },
  }
}

const STATUS_CONFIG = {
  recreational: { color: 'bg-green-100 text-green-800 border-green-300', icon: '&#x1F7E2;', label: 'RECREATIONAL LEGAL' },
  medical: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '&#x1F7E1;', label: 'MEDICAL ONLY' },
  decriminalized: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '&#x1F7E0;', label: 'DECRIMINALIZED' },
  illegal: { color: 'bg-red-100 text-red-800 border-red-300', icon: '&#x1F534;', label: 'ILLEGAL' },
}

export default async function StateLawPage({ params }: Props) {
  const { state: stateSlug } = await params
  const law = getStateLawBySlug(stateSlug)
  if (!law) notFound()

  // Try to get dynamic data from Prisma (may not exist for illegal states)
  let dispensaryCount = 0
  let doctorCount = 0
  let deliveryCount = 0

  try {
    const dbState = await prisma.state.findUnique({ where: { slug: stateSlug } })
    if (dbState) {
      const [dispCount, docCount, delCount] = await Promise.all([
        prisma.dispensary.count({ where: { stateId: dbState.id, isActive: true } }),
        prisma.doctor.count({ where: { state: law.abbreviation, isActive: true } }),
        prisma.dispensary.count({ where: { stateId: dbState.id, isActive: true, hasDelivery: true } }),
      ])
      dispensaryCount = dispCount
      doctorCount = docCount
      deliveryCount = delCount
    }
  } catch {
    // State may not exist in DB (illegal states)
  }

  const statusConfig = STATUS_CONFIG[law.status]
  const faqData = generateStateFaq(law, dispensaryCount, doctorCount)
  const lastUpdatedFormatted = new Date(law.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  // JSON-LD schemas
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Cannabis Laws in ${law.name} 2026 — Is Weed Legal?`,
    datePublished: '2026-01-01T00:00:00Z',
    dateModified: new Date(law.lastUpdated).toISOString(),
    author: { '@type': 'Organization', name: 'Leefii', url: 'https://leefii.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Leefii',
      url: 'https://leefii.com',
      logo: { '@type': 'ImageObject', url: 'https://leefii.com/og-image.png' },
    },
    mainEntityOfPage: `https://leefii.com/laws/${law.slug}`,
    description: law.statusDescription,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Cannabis Laws', item: 'https://leefii.com/laws' },
      { '@type': 'ListItem', position: 3, name: law.name },
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/laws" className="text-gray-500 hover:text-gray-700">Cannabis Laws</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{law.name}</span>
          </nav>
        </div>
      </div>

      {/* Header with Status Badge */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {law.name} Cannabis Laws 2026
              </h1>
              <p className="text-sm text-gray-500">
                Last Updated: <time dateTime={law.lastUpdated}>{lastUpdatedFormatted}</time>
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl border-2 text-lg font-bold ${statusConfig.color}`}>
              <span dangerouslySetInnerHTML={{ __html: statusConfig.icon }} />
              {statusConfig.label}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <section className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-gray-800 text-lg leading-relaxed max-w-4xl">
            {law.statusDescription}
          </p>
        </div>
      </section>

      {/* Key Facts Table */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Legal Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig.color}`}>{law.statusLabel}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Possession Limit</span>
              <span className="text-gray-900 font-semibold text-right max-w-[60%]">{law.possessionLimit}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Purchase Limit</span>
              <span className="text-gray-900 font-semibold text-right max-w-[60%]">{law.purchaseLimit}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Home Grow</span>
              <span className="text-gray-900 font-semibold text-right max-w-[60%]">{law.homeGrow}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Minimum Age</span>
              <span className="text-gray-900 font-semibold">{law.minimumAge > 0 ? `${law.minimumAge}+` : 'N/A'}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Cannabis Tax Rate</span>
              <span className="text-gray-900 font-semibold text-right max-w-[60%]">{law.taxRate}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Dispensaries</span>
              <span className="text-gray-900 font-semibold">{dispensaryCount > 0 ? dispensaryCount : 'None listed'}</span>
            </div>
            <div className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Delivery Allowed</span>
              <span className="text-gray-900 font-semibold">{law.deliveryAllowed}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Marijuana Section */}
      {law.medical.hasProgram && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Marijuana in {law.name}</h2>
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">MMJ Card Cost</h3>
                  <p className="text-gray-600">{law.medical.cardCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Reciprocity</h3>
                  <p className="text-gray-600">{law.medical.reciprocity}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Qualifying Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {law.medical.qualifyingConditions.map((condition) => (
                    <span key={condition} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {doctorCount > 0 && (
                <div className="border-t pt-4">
                  <Link
                    href={`/doctors?state=${law.abbreviation}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Find MMJ Doctors in {law.name} ({doctorCount} listed)
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Where to Buy */}
      <section className={`py-12 ${law.medical.hasProgram ? '' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Where to Buy Cannabis in {law.name}</h2>
          {dispensaryCount > 0 ? (
            <div className="bg-white rounded-xl border p-6">
              <p className="text-gray-600 mb-4">
                There are <strong>{dispensaryCount} licensed cannabis dispensaries</strong> in {law.name} listed on Leefii.
                {deliveryCount > 0 ? ` ${deliveryCount} offer delivery service.` : ''}{' '}
                Browse dispensaries to compare ratings, hours, and services.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/dispensaries/${law.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Browse {dispensaryCount} Dispensaries in {law.name}
                </Link>
                {deliveryCount > 0 && (
                  <Link
                    href={`/delivery`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Delivery Options ({deliveryCount})
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-6">
              <p className="text-gray-600">
                {law.status === 'illegal'
                  ? `Cannabis dispensaries are not available in ${law.name} because cannabis remains illegal. Check neighboring states for legal options.`
                  : `Licensed dispensaries in ${law.name} are not yet listed on Leefii. Check back as we expand our directory.`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Consumption Rules */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Consumption Rules in {law.name}</h2>
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <p className="text-gray-600">{law.consumptionRules}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm font-medium">
                Important: Cannabis consumption is always illegal on federal property (national parks, military bases, federal buildings) regardless of state law. Driving under the influence of cannabis is illegal in all 50 states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Changes */}
      {law.recentChanges.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Changes in {law.name}</h2>
            <div className="bg-white rounded-xl border p-6">
              <ul className="space-y-3">
                {law.recentChanges.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Ballot Watch */}
      {law.ballotWatch && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2026 Ballot Watch</h2>
            <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
              <p className="text-gray-700">{law.ballotWatch}</p>
            </div>
          </div>
        </section>
      )}

      {/* Explore More */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/laws" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-900">All State Laws</span>
            </Link>
            <Link href="/laws/recreational-states" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-900">Recreational States</span>
            </Link>
            <Link href="/laws/medical-states" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-900">Medical States</span>
            </Link>
            <Link href="/laws/federal" className="p-4 bg-white border rounded-xl text-center hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-900">Federal Law</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">{f.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400">
            Disclaimer: This page is for informational purposes only and does not constitute legal advice. Cannabis laws change frequently. Always verify current laws with official state sources before purchasing or consuming cannabis. Last updated: {lastUpdatedFormatted}.
          </p>
        </div>
      </section>
    </div>
  )
}
