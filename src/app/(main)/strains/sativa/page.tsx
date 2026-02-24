import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 86400

const PAGE_SIZE = 50

export const metadata: Metadata = {
  title: 'Sativa Cannabis Strains — Energizing & Uplifting | Leefii',
  description: 'Browse all sativa cannabis strains on Leefii. Sativa strains are known for energizing, cerebral effects ideal for daytime use, creativity, and focus. Compare THC levels, effects, and reviews.',
  openGraph: {
    title: 'Sativa Cannabis Strains — Energizing & Uplifting | Leefii',
    description: 'Browse all sativa cannabis strains on Leefii. Compare THC levels, effects, terpene profiles, and user reviews.',
    url: 'https://leefii.com/strains/sativa',
    siteName: 'Leefii',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/strains/sativa' },
}

export default async function SativaStrainsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10))
  const skip = (currentPage - 1) * PAGE_SIZE

  const [strains, totalCount] = await Promise.all([
    prisma.strain.findMany({
      where: { type: 'SATIVA', isActive: true },
      orderBy: [{ name: 'asc' }],
      skip,
      take: PAGE_SIZE,
      select: {
        slug: true, name: true, type: true, thcMin: true, thcMax: true,
        cbdMin: true, cbdMax: true, rating: true, reviewsCount: true,
        effects: true, description: true,
      },
    }),
    prisma.strain.count({ where: { type: 'SATIVA', isActive: true } }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: 'Sativa Strains' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a sativa strain?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sativa strains are cannabis varieties known for producing uplifting, cerebral effects. They typically have narrow leaves, taller stature, and longer flowering times compared to indica plants. Sativa strains are often used for daytime consumption, creativity, socializing, and focus.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many sativa strains does Leefii have?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Leefii lists ${totalCount}+ sativa strains with detailed information including THC/CBD levels, effects, terpene profiles, and user reviews.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What are the effects of sativa strains?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sativa strains are commonly associated with effects like euphoria, energy, creativity, focus, and uplifted mood. They tend to produce a cerebral high rather than a body high, making them popular for daytime use and social activities.',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/strains" className="hover:text-green-600">Strains</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Sativa</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Sativa Cannabis Strains</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Sativa cannabis strains are celebrated for their energizing, cerebral effects that make them perfect for
            daytime use. Originating from equatorial regions like Southeast Asia, Central America, and Africa, sativa
            plants grow tall with narrow leaves and longer flowering times. These strains are popular among consumers
            seeking creativity, focus, social energy, and mood elevation. With a wide range of THC potencies and
            terpene profiles, sativa strains offer diverse experiences for every preference. Browse {totalCount.toLocaleString()}+
            sativa strains below, sorted alphabetically, with detailed THC/CBD content, effects, and user reviews.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/strains/indica" className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">
            Indica Strains
          </Link>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            {totalCount.toLocaleString()} Sativa Strains
          </span>
          <Link href="/strains/hybrid" className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700 transition">
            Hybrid Strains
          </Link>
        </div>

        {/* Strain List */}
        <section className="mb-8">
          <div className="text-sm text-gray-500 mb-4">
            Page {currentPage} of {totalPages} — Showing {skip + 1}-{Math.min(skip + PAGE_SIZE, totalCount)} of {totalCount.toLocaleString()} strains
          </div>
          <div className="space-y-3">
            {strains.map((s) => (
              <Link
                key={s.slug}
                href={`/strains/${s.slug}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-lg">{s.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-800">Sativa</span>
                    </div>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{s.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      {s.thcMax && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          THC: {s.thcMin && s.thcMin !== s.thcMax ? `${s.thcMin}-${s.thcMax}` : s.thcMax}%
                        </span>
                      )}
                      {s.cbdMax && s.cbdMax > 0 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          CBD: {s.cbdMin && s.cbdMin !== s.cbdMax ? `${s.cbdMin}-${s.cbdMax}` : s.cbdMax}%
                        </span>
                      )}
                      {s.effects?.slice(0, 3).map((e) => (
                        <span key={e} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{e}</span>
                      ))}
                    </div>
                  </div>
                  {s.rating && s.rating > 0 && (
                    <div className="text-right ml-4 flex-shrink-0">
                      <span className="text-yellow-500 font-bold text-lg">★ {s.rating.toFixed(1)}</span>
                      {s.reviewsCount > 0 && <p className="text-xs text-gray-400">{s.reviewsCount} reviews</p>}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mb-12" aria-label="Pagination">
            {currentPage > 1 && (
              <Link
                href={`/strains/sativa?page=${currentPage - 1}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (currentPage <= 4) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = currentPage - 3 + i
              }
              return (
                <Link
                  key={pageNum}
                  href={`/strains/sativa?page=${pageNum}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    pageNum === currentPage
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
            {currentPage < totalPages && (
              <Link
                href={`/strains/sativa?page=${currentPage + 1}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Next
              </Link>
            )}
          </nav>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">What is a sativa strain?</summary>
              <p className="px-4 pb-4 text-gray-600">Sativa strains are cannabis varieties known for producing uplifting, cerebral effects. They typically have narrow leaves, taller stature, and longer flowering times compared to indica plants. Sativa strains are often used for daytime consumption, creativity, socializing, and focus.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">How many sativa strains does Leefii have?</summary>
              <p className="px-4 pb-4 text-gray-600">Leefii lists {totalCount.toLocaleString()}+ sativa strains with detailed information including THC/CBD levels, effects, terpene profiles, and user reviews.</p>
            </details>
            <details className="bg-white rounded-xl shadow-sm border border-gray-100">
              <summary className="p-4 font-semibold cursor-pointer hover:text-green-700">What are the effects of sativa strains?</summary>
              <p className="px-4 pb-4 text-gray-600">Sativa strains are commonly associated with effects like euphoria, energy, creativity, focus, and uplifted mood. They tend to produce a cerebral high rather than a body high, making them popular for daytime use and social activities.</p>
            </details>
          </div>
        </section>
      </div>
    </div>
  )
}
