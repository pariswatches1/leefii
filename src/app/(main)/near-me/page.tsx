import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import NearMeClient from './NearMeClient'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const totalCount = await prisma.dispensary.count({ where: { isActive: true } })

  const title = `Cannabis Dispensaries Near Me — ${totalCount.toLocaleString()}+ Stores Nationwide | Leefii`
  const description = `Find cannabis dispensaries near you. Search ${totalCount.toLocaleString()}+ licensed dispensaries by zip code or use your location. Compare recreational & medical stores, delivery, ratings, and hours.`

  return {
    title,
    description,
    openGraph: { title, description, url: 'https://leefii.com/near-me', siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: 'https://leefii.com/near-me' },
  }
}

export default async function NearMePage() {
  const totalCount = await prisma.dispensary.count({ where: { isActive: true } })
  const stateCount = await prisma.state.count({ where: { dispensaries: { some: { isActive: true } } } })

  // Get popular zip codes (most dispensaries per zip)
  const allDispensaries = await prisma.dispensary.findMany({
    where: { isActive: true },
    select: { zipCode: true, city: { select: { name: true } }, state: { select: { abbreviation: true } } },
  })

  const zipMap = new Map<string, { cityName: string; stateAbbr: string; count: number }>()
  for (const d of allDispensaries) {
    const existing = zipMap.get(d.zipCode)
    if (existing) {
      existing.count++
    } else {
      zipMap.set(d.zipCode, { cityName: d.city.name, stateAbbr: d.state.abbreviation, count: 1 })
    }
  }

  const popularZipCodes = Array.from(zipMap.entries())
    .filter(([, v]) => v.count >= 3)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 24)
    .map(([zipCode, v]) => ({ zipCode, cityName: v.cityName, stateAbbr: v.stateAbbr, count: v.count }))

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cannabis Dispensaries Near Me',
    description: `Find ${totalCount.toLocaleString()}+ cannabis dispensaries near you across ${stateCount} states.`,
    url: 'https://leefii.com/near-me',
    publisher: { '@type': 'Organization', name: 'Leefii', url: 'https://leefii.com' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Dispensaries Near Me' },
    ],
  }

  const faqData = [
    {
      q: 'How do I find dispensaries near me?',
      a: `Leefii automatically detects your location and shows cannabis dispensaries near you. You can also search by zip code to find dispensaries in any area. We list ${totalCount.toLocaleString()}+ licensed dispensaries across ${stateCount} states.`,
    },
    {
      q: 'What types of dispensaries are listed on Leefii?',
      a: 'Leefii lists recreational dispensaries, medical dispensaries, and dual-license stores that serve both. You can filter by license type, delivery availability, ratings, and hours to find exactly what you need.',
    },
    {
      q: 'Do I need a medical card to visit a dispensary near me?',
      a: 'It depends on your state. In recreational states like California, Colorado, and Illinois, adults 21+ can visit any licensed dispensary with a valid ID. In medical-only states, you need a valid medical marijuana card.',
    },
    {
      q: 'Can I get cannabis delivered to my address?',
      a: 'Many dispensaries offer delivery service. Search for dispensaries in your zip code and look for the "Delivery" badge. Delivery availability varies by state and local regulations.',
    },
    {
      q: 'How accurate are dispensary ratings on Leefii?',
      a: 'Dispensary ratings on Leefii are based on real customer reviews. We display the average rating and total review count for each dispensary so you can make informed decisions.',
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Dispensaries Near Me</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Cannabis Dispensaries Near Me</h1>
          <p className="text-green-100 text-lg max-w-2xl">
            Find licensed cannabis dispensaries near your location. Search {totalCount.toLocaleString()}+ stores across {stateCount} states by zip code, or let us detect your location automatically.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
              <div className="text-green-100 text-sm">Dispensaries</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{stateCount}</div>
              <div className="text-green-100 text-sm">States</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-3 text-center">
              <div className="text-2xl font-bold">{popularZipCodes.length > 0 ? `${popularZipCodes.reduce((s, z) => s + z.count, 0).toLocaleString()}+` : '—'}</div>
              <div className="text-green-100 text-sm">Near You</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <NearMeClient popularZipCodes={popularZipCodes} />
      </div>

      {/* Guide */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Find the Best Dispensary Near You</h2>
          <div className="bg-white rounded-xl p-6 border space-y-4 text-gray-600">
            <p>
              Finding the right cannabis dispensary starts with knowing what is available in your area. Leefii lists over {totalCount.toLocaleString()} licensed dispensaries
              across {stateCount} states, making it easy to compare options near your home, workplace, or anywhere you happen to be. Whether you are looking for recreational
              cannabis, medical marijuana, or delivery service, our directory helps you make informed choices.
            </p>
            <p>
              Start by searching your zip code or allowing Leefii to detect your location. You will see a list of nearby dispensaries sorted by distance,
              with key details like license type (recreational or medical), delivery availability, store ratings, and customer reviews. Each dispensary
              listing includes hours of operation, contact information, and a full address so you know exactly what to expect before visiting.
            </p>
            <p>
              When choosing a dispensary, consider what matters most to you. If convenience is a priority, look for stores with delivery or curbside pickup.
              If product quality is key, check ratings and reviews from real customers. Medical patients should verify that a dispensary accepts their state
              medical card and carries products appropriate for their condition. First-time visitors should bring a valid photo ID and, if applicable, their
              medical marijuana card.
            </p>
            <p>
              Leefii is updated regularly to reflect new dispensary openings, closures, and changing regulations. Bookmark this page to quickly find dispensaries
              near you anytime, or explore our strain encyclopedia, deals page, and state law guides for a complete cannabis resource.
            </p>
          </div>
        </div>
      </section>

      {/* Browse by State CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Location</h2>
            <p className="text-gray-600 mb-4">Explore dispensaries by state, city, or browse other resources.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dispensaries" className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition">All States</Link>
              <Link href="/delivery" className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition">Delivery</Link>
              <Link href="/doctors" className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition">MMJ Doctors</Link>
              <Link href="/strains" className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition">Strains</Link>
              <Link href="/laws" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition">Cannabis Laws</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="bg-white rounded-xl border">
                <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">{f.q}</summary>
                <p className="px-4 pb-4 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
