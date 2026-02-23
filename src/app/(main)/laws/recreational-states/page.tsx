import { Metadata } from 'next'
import Link from 'next/link'
import { getRecreationalStates } from '@/data/cannabis-laws'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Recreational Cannabis States 2026 — Where Is Weed Legal? | Leefii',
  description: 'Complete list of all states where recreational cannabis is legal in 2026. Possession limits, tax rates, home grow rules, and dispensary info.',
  openGraph: { title: 'Recreational Cannabis States 2026 | Leefii', url: 'https://leefii.com/laws/recreational-states', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/laws/recreational-states' },
}

export default function RecreationalStatesPage() {
  const states = getRecreationalStates().sort((a, b) => a.name.localeCompare(b.name))

  const faqData = [
    { q: 'How many states have legalized recreational cannabis?', a: `As of 2026, ${states.length} states plus Washington D.C. have legalized recreational cannabis for adults 21 and older.` },
    { q: 'What is the minimum age to buy recreational cannabis?', a: 'In all recreational states, the minimum age to purchase cannabis is 21 years old with a valid government-issued ID.' },
    { q: 'Can I bring cannabis between recreational states?', a: 'No. Transporting cannabis across state lines is a federal offense, even between two states where it is legal. Always purchase within the state where you plan to consume.' },
    { q: 'Do recreational states still have medical programs?', a: 'Yes. All recreational states maintain their medical marijuana programs. Medical patients often benefit from higher possession limits, lower taxes, and access to stronger products.' },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Cannabis Laws', item: 'https://leefii.com/laws' },
      { '@type': 'ListItem', position: 3, name: 'Recreational States' },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/laws" className="text-gray-500 hover:text-gray-700">Cannabis Laws</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Recreational States</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Recreational Cannabis States 2026</h1>
          <p className="text-green-100 text-lg max-w-3xl">
            {states.length} states have legalized recreational cannabis for adults 21+. Browse each state for detailed possession limits, tax rates, home grow rules, and dispensary information.
          </p>
        </div>
      </section>

      {/* State Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/laws/${state.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-green-500 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">{state.name}</h2>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">Recreational</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Possession:</span> {state.possessionLimit}</p>
                  <p><span className="font-medium text-gray-700">Home Grow:</span> {state.homeGrow}</p>
                  <p><span className="font-medium text-gray-700">Tax:</span> {state.taxRate}</p>
                </div>
              </Link>
            ))}
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
    </div>
  )
}
