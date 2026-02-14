import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Leefii vs Weedmaps: Honest Comparison (2026) | Which Is Better?',
  description:
    'Leefii vs Weedmaps compared. Pricing, features, dispensary coverage. See why dispensaries are choosing Leefii over Weedmaps.',
  openGraph: {
    title: 'Leefii vs Weedmaps: Honest Comparison (2026)',
    description: 'Side-by-side comparison of Leefii and Weedmaps for dispensaries and consumers.',
    url: 'https://leefii.com/compare/leefii-vs-weedmaps',
    siteName: 'Leefii',
  },
  alternates: { canonical: 'https://leefii.com/compare/leefii-vs-weedmaps' },
}

export default async function LeefiiVsWeedmaps() {
  const [dispensaryCount, strainCount, stateCount, doctorCount] = await Promise.all([
    prisma.dispensary.count({ where: { isActive: true } }),
    prisma.strain.count({ where: { isActive: true } }),
    prisma.state.count(),
    prisma.doctor.count({ where: { isActive: true } }),
  ])

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Leefii cheaper than Weedmaps?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, significantly. Leefii starts at $20/month vs Weedmaps at roughly $300-$600/month.' },
      },
      {
        '@type': 'Question',
        name: 'Does Weedmaps have a strain quiz?',
        acceptedAnswer: { '@type': 'Answer', text: "No. Leefii's interactive Strain Quiz matches you with strains based on your preferences. It's free and takes about 60 seconds." },
      },
    ],
  }

  const rows = [
    { label: 'Free Listing', leefii: 'Yes', wm: 'Limited' },
    { label: 'Basic Plan', leefii: '$20/month', wm: '~$300/month', leefiiWin: true },
    { label: 'Premium Plan', leefii: '$50/month', wm: '$600-$1,000/month', leefiiWin: true },
    { label: 'Contract', leefii: 'No', wm: 'Varies', leefiiWin: true },
    { label: 'Dispensary Search', leefii: `${dispensaryCount.toLocaleString()}+`, wm: 'Large database' },
    { label: 'Strain Database', leefii: `${strainCount.toLocaleString()}+`, wm: 'Yes' },
    { label: 'Strain Quiz', leefii: 'Interactive', wm: 'No', leefiiWin: true },
    { label: 'Cannabis Journal', leefii: 'Yes', wm: 'No', leefiiWin: true },
    { label: 'Strain Comparisons', leefii: 'Side-by-side', wm: 'No', leefiiWin: true },
    { label: 'MMJ Doctors', leefii: `${doctorCount}+`, wm: 'Yes' },
    { label: 'Online Ordering', leefii: 'Coming soon', wm: 'Integrated', wmWin: true },
    { label: 'POS Integration', leefii: 'Planned', wm: 'Multiple', wmWin: true },
    { label: 'Terpene Profiles', leefii: '8 per strain', wm: 'Limited', leefiiWin: true },
    { label: 'Lead Tracking', leefii: 'Built-in', wm: 'Basic', leefiiWin: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Leefii vs Weedmaps</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Leefii vs Weedmaps</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Weedmaps dominated cannabis search for years. Here&apos;s how Leefii compares and where each platform shines.
          </p>
        </div>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b w-1/3 text-sm">Feature</th>
                  <th className="text-center p-4 bg-green-50 border-b w-1/3 font-bold text-green-800">Leefii</th>
                  <th className="text-center p-4 bg-gray-100 border-b w-1/3 font-bold text-gray-600">Weedmaps</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 border-b text-sm font-medium text-gray-700">{r.label}</td>
                    <td className={`p-4 border-b text-center text-sm ${r.leefiiWin ? 'font-bold text-green-700' : 'text-gray-600'}`}>{r.leefii}</td>
                    <td className={`p-4 border-b text-center text-sm ${r.wmWin ? 'font-bold text-gray-700' : 'text-gray-500'}`}>{r.wm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Where Weedmaps Wins */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Weedmaps Wins</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-3 text-gray-700">
            <p><span className="font-semibold">Online ordering:</span> Fully integrated ordering and delivery through their platform.</p>
            <p><span className="font-semibold">POS integration:</span> Connects with major cannabis POS systems for real-time menus.</p>
            <p><span className="font-semibold">Brand recognition:</span> Household name in cannabis since 2008.</p>
            <p><span className="font-semibold">Traffic:</span> Millions of monthly visits means more eyeballs on listings.</p>
          </div>
        </section>

        {/* Where Leefii Wins */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Leefii Wins</h2>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 space-y-3 text-green-800">
            <p><span className="font-semibold">Price:</span> 85-95% cheaper. $20/mo vs $300-$600/mo. Save $4,560/year.</p>
            <p><span className="font-semibold">Strain tools:</span> Strain Quiz, Cannabis Journal, 8-terpene profiles, side-by-side comparisons.</p>
            <p><span className="font-semibold">Lead system:</span> Built-in referral and conversion tracking with UTM support.</p>
            <p><span className="font-semibold">Transparency:</span> Published pricing. No sales calls required. No annual contracts.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10 bg-green-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">The Verdict</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Weedmaps is right if you need integrated online ordering today. Leefii is right if you want maximum value at a fraction of the cost. Most smart operators list on both.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dispensaries" className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition">Find Dispensaries</Link>
            <Link href="/sell" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">List Your Dispensary</Link>
          </div>
        </section>

        {/* More Comparisons */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More Comparisons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/compare/leefii-vs-leafly" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center">
              <p className="font-bold text-gray-900">Leefii vs Leafly</p>
              <p className="text-sm text-gray-500">Full comparison</p>
            </Link>
            <Link href="/strains" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center">
              <p className="font-bold text-gray-900">Browse {strainCount.toLocaleString()}+ Strains</p>
              <p className="text-sm text-gray-500">Find your perfect strain</p>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Is Leefii cheaper than Weedmaps?</summary>
              <p className="px-4 pb-4 text-gray-600">Yes, significantly. Leefii starts at $20/month vs roughly $300-$600/month for Weedmaps.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Does Weedmaps have a strain quiz?</summary>
              <p className="px-4 pb-4 text-gray-600">No. Leefii&apos;s Strain Quiz matches you with strains based on your preferences. It&apos;s free and takes about 60 seconds.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Can I order online through Leefii?</summary>
              <p className="px-4 pb-4 text-gray-600">Leefii currently focuses on dispensary discovery, reviews, and lead generation. Online ordering is on our roadmap.</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
