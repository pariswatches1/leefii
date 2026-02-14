import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Leefii vs Leafly: Honest Comparison (2026) | Which Is Better?',
  description:
    'Leefii vs Leafly compared side by side. Pricing, features, dispensary coverage. See why dispensaries save 90%+ by switching to Leefii.',
  openGraph: {
    title: 'Leefii vs Leafly: Honest Comparison (2026)',
    description: 'Side-by-side comparison of Leefii and Leafly for dispensaries and consumers.',
    url: 'https://leefii.com/compare/leefii-vs-leafly',
    siteName: 'Leefii',
  },
  alternates: { canonical: 'https://leefii.com/compare/leefii-vs-leafly' },
}

export default async function LeefiiVsLeafly() {
  const [dispensaryCount, strainCount, stateCount, doctorCount] = await Promise.all([
    prisma.dispensary.count({ where: { isActive: true } }),
    prisma.strain.count({ where: { isActive: true } }),
    prisma.state.count(),
    prisma.doctor.count({ where: { isActive: true } }),
  ])

  const stats = [
    { label: `${dispensaryCount.toLocaleString()}+ Dispensaries`, value: dispensaryCount },
    { label: `${strainCount.toLocaleString()}+ Strains`, value: strainCount },
    { label: `${stateCount} States`, value: stateCount },
    { label: `${doctorCount}+ Doctors`, value: doctorCount },
  ]

  const comparisonRows = [
    { label: 'Free Listing', leefii: 'Yes', leafly: 'Limited', leefiiWin: true },
    { label: 'Basic Plan', leefii: '$20/month', leafly: '~$500/month', leefiiWin: true },
    { label: 'Premium Plan', leefii: '$50/month', leafly: '$1,000-$4,000/month', leefiiWin: true },
    { label: 'Annual Contract', leefii: 'No', leafly: 'Often required', leefiiWin: true },
    { label: 'Dispensary Count', leefii: `${dispensaryCount.toLocaleString()}+`, leafly: '8,000+', leaflyWin: true },
    { label: 'Strain Database', leefii: `${strainCount.toLocaleString()}+`, leafly: '6,000+' },
    { label: 'Strain Quiz', leefii: 'Yes', leafly: 'No', leefiiWin: true },
    { label: 'Cannabis Journal', leefii: 'Yes', leafly: 'No', leefiiWin: true },
    { label: 'Strain Comparisons', leefii: 'Side-by-side', leafly: 'No', leefiiWin: true },
    { label: 'MMJ Doctors', leefii: `${doctorCount}+`, leafly: 'Limited' },
    { label: 'Marketplace', leefii: 'Yes', leafly: 'No', leefiiWin: true },
    { label: 'Terpene Profiles', leefii: '8 per strain', leafly: 'Limited', leefiiWin: true },
    { label: 'Traffic', leefii: 'Growing', leafly: '50M+/month', leaflyWin: true },
    { label: 'Content Library', leefii: 'Growing', leafly: '11,000+ articles', leaflyWin: true },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Leefii better than Leafly?',
        acceptedAnswer: { '@type': 'Answer', text: 'It depends. Leefii offers 90%+ lower pricing, unique tools (Strain Quiz, Cannabis Journal), and transparent pricing. Leafly has more traffic and content. Both are free for consumers.' },
      },
      {
        '@type': 'Question',
        name: 'Can I use both?',
        acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Many dispensaries list on multiple platforms. At $20/month, adding Leefii alongside Leafly is a no-brainer.' },
      },
      {
        '@type': 'Question',
        name: 'Is Leefii free for consumers?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, 100% free. Search dispensaries, browse strains, take the Strain Quiz, track usage, find deals -- all without paying.' },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Leefii vs Leafly</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Leefii vs Leafly</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Leafly pioneered the cannabis directory space. Here&apos;s how Leefii compares on price, features, and value.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 text-center border shadow-sm">
              <p className="text-sm text-green-600">{s.label}</p>
            </div>
          ))}
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
                  <th className="text-center p-4 bg-gray-100 border-b w-1/3 font-bold text-gray-600">Leafly</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 border-b text-sm font-medium text-gray-700">{row.label}</td>
                    <td className={`p-4 border-b text-center text-sm ${row.leefiiWin ? 'font-bold text-green-700' : 'text-gray-600'}`}>
                      {row.leefii}
                    </td>
                    <td className={`p-4 border-b text-center text-sm ${row.leaflyWin ? 'font-bold text-gray-700' : 'text-gray-500'}`}>
                      {row.leafly}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Where Leafly Wins */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Leafly Still Wins</h2>
          <p className="text-gray-600 mb-4">We&apos;re being honest. Leafly has been around since 2010 and has real advantages:</p>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-3 text-gray-700">
            <p><span className="font-semibold">Traffic:</span> Significantly more monthly visitors with a 14-year head start.</p>
            <p><span className="font-semibold">Content:</span> 11,000+ articles and news pieces.</p>
            <p><span className="font-semibold">Brand recognition:</span> More consumers know Leafly by name.</p>
            <p><span className="font-semibold">Menu integration:</span> Deep POS integrations for real-time inventory syncing.</p>
          </div>
        </section>

        {/* Where Leefii Wins */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Leefii Wins</h2>
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 space-y-3 text-green-800">
            <p><span className="font-semibold">Price:</span> 90%+ cheaper for dispensaries. $20/mo vs $500+/mo. No annual lock-in.</p>
            <p><span className="font-semibold">Unique tools:</span> Strain Quiz, Cannabis Journal, and Strain Comparisons.</p>
            <p><span className="font-semibold">Doctor finder:</span> Integrated MMJ doctor search.</p>
            <p><span className="font-semibold">Marketplace:</span> Sellers can list products directly with lead tracking.</p>
            <p><span className="font-semibold">Transparency:</span> Published pricing. No surprise costs.</p>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing: The Biggest Difference</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-green-500 shadow-sm">
              <h3 className="text-xl font-bold text-green-700 mb-3">Leefii</h3>
              <p className="text-gray-700"><span className="font-semibold">Free:</span> Basic listing with name, address, hours</p>
              <p className="text-gray-700 mt-2"><span className="font-semibold">Basic -- $20/mo:</span> Full profile, analytics, deal posting</p>
              <p className="text-gray-700 mt-2"><span className="font-semibold">Premium -- $50/mo:</span> Featured placement, priority ranking</p>
              <p className="text-green-700 font-medium mt-4">No contracts. Cancel anytime.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-600 mb-3">Leafly</h3>
              <p className="text-gray-700"><span className="font-semibold">Free:</span> Very limited listing</p>
              <p className="text-gray-700 mt-2"><span className="font-semibold">Base -- ~$500/mo:</span> Enhanced listing, basic analytics</p>
              <p className="text-gray-700 mt-2"><span className="font-semibold">Premium -- $1,000-$4,000/mo:</span> Featured placement</p>
              <p className="text-gray-500 mt-4">Often requires annual contract.</p>
            </div>
          </div>
          <p className="text-center mt-6 text-gray-600 font-medium">
            A dispensary paying Leafly $500/month would save $5,760/year by switching to Leefii Basic.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-10 bg-green-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">The Verdict</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Leafly is the established player with more traffic and content. Leefii is the modern alternative with dramatically lower prices and unique consumer tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dispensaries" className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition">
              Find Dispensaries
            </Link>
            <Link href="/sell" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">
              List Your Dispensary
            </Link>
          </div>
        </section>

        {/* More Comparisons */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More Comparisons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/compare/leefii-vs-weedmaps" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center">
              <p className="font-bold text-gray-900">Leefii vs Weedmaps</p>
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
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Is Leefii better than Leafly?</summary>
              <p className="px-4 pb-4 text-gray-600">It depends. Leefii offers 90%+ lower pricing, unique tools (Strain Quiz, Cannabis Journal), and transparent pricing. Leafly has more traffic and content. Both are free for consumers.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Can I use both?</summary>
              <p className="px-4 pb-4 text-gray-600">Absolutely. Many dispensaries list on multiple platforms. At $20/month, adding Leefii alongside Leafly is a no-brainer.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">Is Leefii free for consumers?</summary>
              <p className="px-4 pb-4 text-gray-600">Yes, 100% free. Search dispensaries, browse strains, take the Strain Quiz, track usage, find deals -- all without paying.</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
