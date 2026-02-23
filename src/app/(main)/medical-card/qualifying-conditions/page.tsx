import { Metadata } from 'next'
import Link from 'next/link'
import { getAllStateLaws } from '@/data/cannabis-laws'
import { getMedicalCardGuide } from '@/data/medical-card-guides'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Medical Marijuana Qualifying Conditions by State 2026 | Leefii',
  description:
    'Compare medical marijuana qualifying conditions across all US states with medical programs. See which states cover cancer, chronic pain, PTSD, epilepsy, and more. Updated 2026.',
  openGraph: {
    title: 'Medical Marijuana Qualifying Conditions by State 2026 | Leefii',
    description:
      'Compare medical marijuana qualifying conditions across all US states with medical programs. See which states cover cancer, chronic pain, PTSD, epilepsy, and more.',
    url: 'https://leefii.com/medical-card/qualifying-conditions',
    siteName: 'Leefii',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Marijuana Qualifying Conditions by State 2026 | Leefii',
    description:
      'Compare medical marijuana qualifying conditions across all US states. See which states cover your condition.',
  },
  alternates: { canonical: 'https://leefii.com/medical-card/qualifying-conditions' },
}

export default function QualifyingConditionsPage() {
  const allLaws = getAllStateLaws()
  const medicalStates = allLaws
    .filter((s) => s.medical.hasProgram && s.medical.qualifyingConditions.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  // Build condition -> states map
  const conditionMap = new Map<string, { slug: string; abbreviation: string; name: string }[]>()
  for (const state of medicalStates) {
    for (const condition of state.medical.qualifyingConditions) {
      const normalized = condition.trim()
      if (!conditionMap.has(normalized)) {
        conditionMap.set(normalized, [])
      }
      conditionMap.get(normalized)!.push({
        slug: state.slug,
        abbreviation: state.abbreviation,
        name: state.name,
      })
    }
  }

  // Sort conditions by number of states (most common first)
  const sortedConditions = Array.from(conditionMap.entries()).sort((a, b) => b[1].length - a[1].length)
  const uniqueConditionsCount = sortedConditions.length
  const top10Conditions = sortedConditions.slice(0, 10)

  // For the comparison table, use top 20 most common conditions
  const tableConditions = sortedConditions.slice(0, 20)
  const stateAbbreviations = medicalStates.map((s) => ({
    slug: s.slug,
    abbreviation: s.abbreviation,
    name: s.name,
    conditions: new Set(s.medical.qualifyingConditions.map((c) => c.trim())),
  }))

  const faqData = [
    {
      q: 'What is the most common qualifying condition for medical marijuana?',
      a: sortedConditions.length > 0
        ? `${sortedConditions[0][0]} is the most common qualifying condition, recognized by ${sortedConditions[0][1].length} states with medical marijuana programs.`
        : 'Cancer and chronic pain are among the most commonly recognized qualifying conditions across state medical marijuana programs.',
    },
    {
      q: 'How many states have medical marijuana programs?',
      a: `Currently, ${medicalStates.length} states and jurisdictions have active medical marijuana programs with defined qualifying conditions. The specifics of each program, including qualifying conditions, costs, and application processes, vary by state.`,
    },
    {
      q: 'Can I qualify for medical marijuana with chronic pain?',
      a: `Chronic pain is one of the most widely recognized qualifying conditions for medical marijuana. ${conditionMap.get('Chronic pain')?.length ?? 'Many'} states include chronic pain as a qualifying condition. Check your specific state's program for details.`,
    },
    {
      q: 'Does PTSD qualify for medical marijuana?',
      a: `PTSD is recognized as a qualifying condition in ${conditionMap.get('PTSD')?.length ?? 'many'} states. It is one of the more commonly accepted conditions across state medical marijuana programs, reflecting growing recognition of cannabis as a potential therapeutic option for trauma-related disorders.`,
    },
    {
      q: 'What if my condition is not on my state\'s qualifying list?',
      a: 'Some states give physicians broad discretion to certify any condition they believe would benefit from medical cannabis. States like Oklahoma, Maryland, Virginia, and Washington, D.C. have no restrictive conditions list. Even in states with set lists, new conditions are periodically added through legislative or regulatory action.',
    },
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Medical Card', item: 'https://leefii.com/medical-card' },
      { '@type': 'ListItem', position: 3, name: 'Qualifying Conditions' },
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
            <Link href="/medical-card/qualifying-conditions" className="hover:text-white">Medical Card</Link>
            <span>/</span>
            <span className="text-white font-medium">Qualifying Conditions</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Medical Marijuana Qualifying Conditions by State
          </h1>
          <p className="text-green-100 text-lg max-w-3xl mb-8">
            Comprehensive comparison of qualifying conditions across all US states with medical marijuana programs. Find out if your condition qualifies in your state.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="bg-white/15 rounded-lg px-5 py-3 text-center">
              <div className="text-3xl font-bold">{medicalStates.length}</div>
              <div className="text-green-200 text-sm">States with Programs</div>
            </div>
            <div className="bg-white/15 rounded-lg px-5 py-3 text-center">
              <div className="text-3xl font-bold">{uniqueConditionsCount}</div>
              <div className="text-green-200 text-sm">Unique Conditions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Medical Marijuana Qualifying Conditions</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Medical marijuana qualifying conditions vary significantly from state to state. While some conditions like cancer, HIV/AIDS, and epilepsy are nearly universally recognized across all state medical programs, others are more limited in acceptance. Understanding which conditions qualify in your state is the essential first step toward obtaining a medical marijuana card.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                The trend in medical cannabis legislation has been toward broader access over time. Many states have expanded their qualifying conditions lists since launching their programs, and several states — including Oklahoma, Maryland, Virginia, and Washington, D.C. — have adopted physician-discretion models that allow doctors to recommend cannabis for any condition they deem appropriate. This approach removes the barrier of a restrictive conditions list and empowers physicians to make individualized treatment decisions.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Common qualifying conditions fall into several categories: oncological conditions such as cancer, neurological conditions including epilepsy and multiple sclerosis, pain-related conditions such as chronic pain and fibromyalgia, mental health conditions including PTSD and anxiety, gastrointestinal conditions such as Crohn\'s disease, and immunological conditions including HIV/AIDS. Some states also recognize conditions that produce secondary symptoms like severe nausea, cachexia, or persistent muscle spasms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If your condition is not explicitly listed in your state\'s program, consult with a licensed physician who specializes in medical cannabis evaluations. Many conditions that produce chronic pain, nausea, seizures, or other debilitating symptoms may qualify under broader category provisions even if not named specifically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions Comparison Table</h2>
          <p className="text-gray-500 text-sm mb-4">Scroll horizontally to view all states. Showing the top 20 most common qualifying conditions.</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10 min-w-[180px]">
                      Condition
                    </th>
                    {stateAbbreviations.map((s) => (
                      <th key={s.slug} className="px-2 py-3 text-center font-medium text-gray-600 min-w-[40px]">
                        <Link href={`/medical-card/${s.slug}`} className="hover:text-green-600" title={s.name}>
                          {s.abbreviation}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableConditions.map(([condition, states]) => (
                    <tr key={condition} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          <span>{condition}</span>
                          <span className="text-xs text-gray-400">({states.length})</span>
                        </div>
                      </td>
                      {stateAbbreviations.map((s) => (
                        <td key={s.slug} className="px-2 py-2.5 text-center">
                          {s.conditions.has(condition) ? (
                            <span className="text-green-600 font-bold" title={`${condition} qualifies in ${s.name}`}>&#10003;</span>
                          ) : (
                            <span className="text-gray-200">&mdash;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Top Conditions Detail Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Qualifying Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {top10Conditions.map(([condition, states]) => (
              <div key={condition} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{condition}</h3>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {states.length} states
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {states
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((s) => {
                      const hasGuide = !!getMedicalCardGuide(s.slug)
                      return hasGuide ? (
                        <Link
                          key={s.slug}
                          href={`/medical-card/${s.slug}`}
                          className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100 transition"
                        >
                          {s.abbreviation}
                        </Link>
                      ) : (
                        <span
                          key={s.slug}
                          className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium"
                        >
                          {s.abbreviation}
                        </span>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10">
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

      {/* CTA */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Your Medical Card?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Find a licensed medical marijuana doctor in your state who can evaluate your condition and help you through the application process.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Find an MMJ Doctor
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400">
            Disclaimer: This page is for informational purposes only and does not constitute medical or legal advice. Qualifying conditions and program requirements vary by state and are subject to change. Always verify current requirements with your state&#39;s official medical cannabis program and consult with a licensed physician. Last updated: February 2026.
          </p>
        </div>
      </section>
    </div>
  )
}
