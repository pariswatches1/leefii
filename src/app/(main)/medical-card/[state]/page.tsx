import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMedicalCardGuide, getAllMedicalCardGuideSlugs } from '@/data/medical-card-guides'
import { getStateLawBySlug } from '@/data/cannabis-laws'

type Props = {
  params: Promise<{ state: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  return getAllMedicalCardGuideSlugs().map((slug) => ({ state: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const guide = getMedicalCardGuide(stateSlug)
  if (!guide) return {}

  const title = `How to Get a Medical Marijuana Card in ${guide.stateName} 2026 | Leefii`
  const description = `Step-by-step guide to getting your medical marijuana card in ${guide.stateName}. Processing time: ${guide.processingTime}. Renewal: ${guide.renewalPeriod}. Telehealth ${guide.telehealth ? 'accepted' : 'not accepted'}. Updated 2026.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://leefii.com/medical-card/${stateSlug}`, siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://leefii.com/medical-card/${stateSlug}` },
  }
}

export default async function MedicalCardStatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const guide = getMedicalCardGuide(stateSlug)
  if (!guide) notFound()

  const law = getStateLawBySlug(stateSlug)
  const qualifyingConditions = law?.medical.qualifyingConditions ?? []
  const cardCost = law?.medical.cardCost ?? 'Contact state program'
  const reciprocity = law?.medical.reciprocity ?? 'Check with state program'

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Medical Card', item: 'https://leefii.com/medical-card' },
      { '@type': 'ListItem', position: 3, name: guide.stateName },
    ],
  }

  const faqData = [
    {
      q: `How do I get a medical marijuana card in ${guide.stateName}?`,
      a: `To get a medical marijuana card in ${guide.stateName}, you need to visit a licensed physician for an evaluation, obtain a certification for a qualifying condition, and submit an application to the state. Processing takes approximately ${guide.processingTime}. ${guide.telehealth ? 'Telehealth evaluations are accepted.' : 'In-person evaluations are required.'}`,
    },
    {
      q: `What conditions qualify for MMJ in ${guide.stateName}?`,
      a: qualifyingConditions.length > 0
        ? `Qualifying conditions in ${guide.stateName} include ${qualifyingConditions.slice(0, 6).join(', ')}${qualifyingConditions.length > 6 ? ', and more' : ''}. Check with a licensed physician to confirm your eligibility.`
        : `${guide.stateName} recognizes various qualifying conditions. Consult a licensed physician to determine your eligibility.`,
    },
    {
      q: `How much does a medical card cost in ${guide.stateName}?`,
      a: `The state registration fee in ${guide.stateName} is ${cardCost}. Additional costs include the physician evaluation fee, which typically ranges from $100 to $300 depending on the provider. Renewal costs are ${guide.renewalCost} per ${guide.renewalPeriod.toLowerCase()} period.`,
    },
    {
      q: `Can I get a medical card online in ${guide.stateName}?`,
      a: guide.telehealth
        ? `Yes, ${guide.stateName} accepts telehealth evaluations for medical marijuana certifications. You can consult with a licensed physician from home via video call. The state application is also submitted online.`
        : `${guide.stateName} requires in-person physician evaluations for medical marijuana certifications. However, the state application can be submitted online after your in-person appointment.`,
    },
    {
      q: `How long does it take to get a medical card in ${guide.stateName}?`,
      a: `In ${guide.stateName}, the state processes medical marijuana card applications in approximately ${guide.processingTime}. The total timeline from physician evaluation to receiving your card depends on appointment availability and processing speed.`,
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to Get a Medical Marijuana Card in ${guide.stateName} 2026`,
    datePublished: '2026-01-01T00:00:00Z',
    dateModified: '2026-02-01T00:00:00Z',
    author: { '@type': 'Organization', name: 'Leefii', url: 'https://leefii.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Leefii',
      url: 'https://leefii.com',
      logo: { '@type': 'ImageObject', url: 'https://leefii.com/og-image.png' },
    },
    mainEntityOfPage: `https://leefii.com/medical-card/${guide.slug}`,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-green-100 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/medical-card/qualifying-conditions" className="hover:text-white">Medical Card</Link>
            <span>/</span>
            <span className="text-white font-medium">{guide.stateName}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                How to Get a Medical Marijuana Card in {guide.stateName}
              </h1>
              <p className="text-green-100 text-lg max-w-2xl">
                Complete 2026 guide with step-by-step instructions, costs, qualifying conditions, and tips for {guide.stateName} residents.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white/15 rounded-xl px-6 py-4 text-center">
              <div className="text-4xl font-bold">{guide.abbreviation}</div>
              <div className="text-green-200 text-sm mt-1">Medical Program</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">Processing Time</div>
              <div className="font-semibold">{guide.processingTime}</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">State Fee</div>
              <div className="font-semibold">{cardCost}</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">Renewal</div>
              <div className="font-semibold">{guide.renewalPeriod}</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-sm text-green-200">Telehealth</div>
              <div className="font-semibold">{guide.telehealth ? 'Accepted' : 'Not Accepted'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-sm text-gray-500">
          Last Updated: <time dateTime="2026-02-01">February 1, 2026</time>
        </p>
      </div>

      {/* Intro */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Marijuana Card Overview in {guide.stateName}</h2>
            <div className="prose prose-gray max-w-none">
              {guide.intro.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide to Getting Your Medical Card</h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block" />
            <div className="space-y-6">
              {guide.steps.map((step, i) => (
                <div key={i} className="relative flex gap-4 md:gap-6">
                  {/* Step number circle */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm z-10">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Qualifying Conditions */}
      {qualifyingConditions.length > 0 && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qualifying Conditions in {guide.stateName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {qualifyingConditions.map((condition) => (
                <div key={condition} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{condition}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This list may not be exhaustive. Consult a licensed physician in {guide.stateName} to discuss whether your condition qualifies.
            </p>
          </div>
        </section>
      )}

      {/* Cost Breakdown */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between items-center p-4">
                <span className="text-gray-600 font-medium">State Registration Fee</span>
                <span className="text-gray-900 font-semibold">{cardCost}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-gray-600 font-medium">Renewal Cost</span>
                <span className="text-gray-900 font-semibold">{guide.renewalCost}</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-gray-600 font-medium">Physician Evaluation (estimated)</span>
                <span className="text-gray-900 font-semibold">$100 - $300</span>
              </div>
              <div className="flex justify-between items-center p-4">
                <span className="text-gray-600 font-medium">Renewal Period</span>
                <span className="text-gray-900 font-semibold">{guide.renewalPeriod}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Physician evaluation fees vary by provider and are separate from the state registration fee. Some states offer reduced fees for veterans, low-income patients, or recipients of government assistance.
          </p>
        </div>
      </section>

      {/* Reciprocity */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reciprocity</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-800">{reciprocity}</p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for Applicants</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ul className="space-y-4">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Telehealth Badge */}
      {guide.telehealth && (
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Telehealth Evaluations Accepted</h3>
                <p className="text-green-700 text-sm">{guide.stateName} accepts telehealth physician evaluations for medical marijuana certifications. You can consult with a licensed physician from the comfort of your home.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Links */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/doctors/${guide.slug}`}
              className="flex items-center gap-4 bg-green-600 text-white rounded-xl p-5 hover:bg-green-700 transition"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg">Find MMJ Doctors in {guide.stateName}</div>
                <div className="text-green-100 text-sm">Browse certified physicians near you</div>
              </div>
            </Link>
            <Link
              href={`/dispensaries/${guide.slug}`}
              className="flex items-center gap-4 bg-gray-800 text-white rounded-xl p-5 hover:bg-gray-900 transition"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg">Browse Dispensaries in {guide.stateName}</div>
                <div className="text-gray-300 text-sm">Find licensed dispensaries near you</div>
              </div>
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

      {/* Disclaimer */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400">
            Disclaimer: This page is for informational purposes only and does not constitute medical or legal advice. Medical marijuana laws and program requirements change frequently. Always verify current requirements with the official {guide.stateName} medical cannabis program and consult with a licensed physician before applying. Leefii is not responsible for application outcomes. Last updated: February 2026.
          </p>
        </div>
      </section>
    </div>
  )
}
