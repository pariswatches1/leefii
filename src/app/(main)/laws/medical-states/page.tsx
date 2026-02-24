import { Metadata } from 'next'
import Link from 'next/link'
import { getMedicalOnlyStates } from '@/data/cannabis-laws'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Medical Marijuana States 2026 — MMJ Card Guide | Leefii',
  description: 'Complete list of all medical marijuana states in 2026. Qualifying conditions, card costs, possession limits, and how to get your MMJ card.',
  openGraph: { title: 'Medical Marijuana States 2026 | Leefii', url: 'https://leefii.com/laws/medical-states', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/laws/medical-states' },
}

export default function MedicalStatesPage() {
  const states = getMedicalOnlyStates().sort((a, b) => a.name.localeCompare(b.name))

  const faqData = [
    { q: 'How many states have medical marijuana programs?', a: `As of 2026, ${states.length} states have medical-only marijuana programs (not including states that also allow recreational use).` },
    { q: 'How do I get a medical marijuana card?', a: 'You need to be evaluated by a qualified physician who can certify that you have a qualifying condition. After receiving your certification, apply to your state\'s medical marijuana program and pay the registration fee.' },
    { q: 'What conditions qualify for medical marijuana?', a: 'Common qualifying conditions include chronic pain, cancer, epilepsy, PTSD, multiple sclerosis, Crohn\'s disease, and HIV/AIDS. Each state has its own list of qualifying conditions.' },
    { q: 'Can I use my medical card in another state?', a: 'Some states offer reciprocity for out-of-state medical marijuana cards, but most do not. Check the specific state\'s reciprocity policy before traveling.' },
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
      { '@type': 'ListItem', position: 3, name: 'Medical States' },
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
            <span className="text-gray-900 font-medium">Medical States</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Medical Marijuana States 2026</h1>
          <p className="text-blue-100 text-lg max-w-3xl">
            {states.length} states have medical-only marijuana programs. Learn about qualifying conditions, card costs, and how to access medical cannabis in your state.
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
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{state.name}</h2>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">{state.statusLabel}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Card Cost:</span> {state.medical.cardCost}</p>
                  <p><span className="font-medium text-gray-700">Possession:</span> {state.possessionLimit}</p>
                  <p><span className="font-medium text-gray-700">Conditions:</span> {state.medical.qualifyingConditions.slice(0, 3).join(', ')}{state.medical.qualifyingConditions.length > 3 ? '...' : ''}</p>
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
