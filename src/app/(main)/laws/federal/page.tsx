import { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Federal Cannabis Law 2026 — DEA Schedule, Banking & Rescheduling | Leefii',
  description: 'Current federal cannabis law status in 2026. DEA scheduling, SAFE Banking Act, federal vs state conflicts, interstate commerce, and what it means for consumers.',
  openGraph: { title: 'Federal Cannabis Law 2026 | Leefii', url: 'https://leefii.com/laws/federal', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/laws/federal' },
}

export default function FederalLawPage() {
  const lastUpdated = 'February 15, 2026'

  const faqData = [
    { q: 'Is cannabis legal at the federal level?', a: 'Cannabis remains a Schedule I controlled substance under federal law as of 2026. However, the federal government has generally not enforced federal cannabis laws in states that have legalized it through the Cole Memorandum guidelines.' },
    { q: 'What is cannabis rescheduling?', a: 'The DEA initiated rulemaking in 2024 to move cannabis from Schedule I to Schedule III under the Controlled Substances Act. Schedule III would acknowledge medical use and reduce regulatory burden, but would not legalize recreational use at the federal level.' },
    { q: 'Can I fly with cannabis?', a: 'TSA follows federal law, making it technically illegal to fly with cannabis even between two legal states. However, TSA has stated that their primary focus is security threats, not cannabis detection. If cannabis is found, they may refer it to local law enforcement.' },
    { q: 'What is the SAFE Banking Act?', a: 'The SAFE Banking Act would allow banks and financial institutions to serve cannabis businesses without fear of federal penalties. Cannabis companies currently operate largely in cash due to banking restrictions. Various versions of this legislation have been introduced in Congress.' },
    { q: 'Can I be fired for using cannabis in a legal state?', a: 'Federal law does not protect cannabis users from employment discrimination. Employers can maintain drug-free workplace policies. Some states have enacted protections for off-duty cannabis use, but federal employees and contractors face stricter rules.' },
    { q: 'Can I transport cannabis between states?', a: 'No. Transporting cannabis across state lines is a federal offense regardless of the legal status in either state. This applies to driving, flying, mailing, or any other form of interstate transport.' },
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
      { '@type': 'ListItem', position: 3, name: 'Federal Law' },
    ],
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Federal Cannabis Law 2026',
    datePublished: '2026-01-01T00:00:00Z',
    dateModified: '2026-02-15T00:00:00Z',
    author: { '@type': 'Organization', name: 'Leefii', url: 'https://leefii.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Leefii',
      url: 'https://leefii.com',
      logo: { '@type': 'ImageObject', url: 'https://leefii.com/og-image.png' },
    },
    mainEntityOfPage: 'https://leefii.com/laws/federal',
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
            <span className="text-gray-900 font-medium">Federal Law</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Federal Cannabis Law 2026</h1>
          <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold border border-red-200">
            Cannabis remains a Schedule I controlled substance under federal law
          </div>
        </div>
      </section>

      {/* Current Federal Status */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Federal Classification</h2>
            <p className="text-gray-600 mb-4">
              Cannabis (marijuana) is classified as a Schedule I substance under the federal Controlled Substances Act. This is the most restrictive category, shared with heroin and LSD, and legally means the substance has no accepted medical use and a high potential for abuse.
            </p>
            <p className="text-gray-600">
              Despite this classification, 38+ states have legalized cannabis in some form. The federal government has generally not interfered with state-legal cannabis operations, following guidance similar to the 2013 Cole Memorandum which prioritized enforcement resources elsewhere.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rescheduling Update</h2>
            <p className="text-gray-600 mb-4">
              In 2024, the DEA initiated formal rulemaking to reschedule cannabis from Schedule I to Schedule III, following a recommendation from the Department of Health and Human Services. Schedule III classification would acknowledge the medical value of cannabis and reduce some regulatory restrictions.
            </p>
            <p className="text-gray-600">
              Rescheduling to Schedule III would not legalize recreational cannabis at the federal level. However, it would have significant implications for the cannabis industry, including potential access to banking services, tax deductions under section 280E, and reduced research barriers.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Federal vs. State Conflicts</h2>
            <p className="text-gray-600 mb-4">
              The tension between federal prohibition and state legalization creates a complex legal landscape. While state-legal cannabis businesses operate openly, they face unique challenges due to federal law.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Banking:</strong> Most banks refuse to serve cannabis businesses due to federal money laundering concerns. Many businesses operate in cash, creating safety and accounting challenges.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Taxation (280E):</strong> Cannabis businesses cannot deduct ordinary business expenses under Section 280E of the tax code, resulting in effective tax rates of 50-70% for some businesses.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Interstate Commerce:</strong> Cannabis cannot legally cross state lines, even between two legal states. Each state operates as an isolated market.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Federal Employment:</strong> Federal employees, military personnel, and security clearance holders are prohibited from using cannabis regardless of state law.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Federal Land:</strong> Cannabis use and possession is illegal on all federal property including national parks, military bases, and federal buildings.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">SAFE Banking Act</h2>
            <p className="text-gray-600 mb-4">
              The Secure and Fair Enforcement (SAFE) Banking Act has been one of the most discussed pieces of cannabis legislation in Congress. The bill would prohibit federal banking regulators from penalizing banks for serving state-legal cannabis businesses.
            </p>
            <p className="text-gray-600">
              The SAFE Banking Act has passed the House multiple times but has faced challenges in the Senate. Various iterations and companion bills continue to be introduced. If passed, it would significantly improve the operational efficiency and safety of cannabis businesses by enabling standard banking and payment processing.
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact on Consumers</h2>
            <p className="text-gray-600 mb-4">For consumers in legal states, the federal-state conflict means:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>You can legally purchase and consume cannabis under state law in your state</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                <span>You cannot transport cannabis across state lines or onto federal property</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                <span>Employers may still enforce drug-free workplace policies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                <span>Federal student loan and housing assistance may be affected</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>The federal government has not prioritized enforcement against individual consumers in legal states</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore State Laws</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/laws" className="p-5 bg-white border rounded-xl hover:shadow-md transition text-center">
              <span className="font-semibold text-gray-900">All State Laws</span>
              <p className="text-sm text-gray-500 mt-1">Interactive map + comparison table</p>
            </Link>
            <Link href="/laws/recreational-states" className="p-5 bg-white border rounded-xl hover:shadow-md transition text-center">
              <span className="font-semibold text-gray-900">Recreational States</span>
              <p className="text-sm text-gray-500 mt-1">Where adults 21+ can buy cannabis</p>
            </Link>
            <Link href="/laws/medical-states" className="p-5 bg-white border rounded-xl hover:shadow-md transition text-center">
              <span className="font-semibold text-gray-900">Medical States</span>
              <p className="text-sm text-gray-500 mt-1">MMJ card requirements by state</p>
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
            Disclaimer: This page is for informational purposes only and does not constitute legal advice. Federal cannabis law is subject to change. Consult a legal professional for advice specific to your situation. Last updated: {lastUpdated}.
          </p>
        </div>
      </section>
    </div>
  )
}
