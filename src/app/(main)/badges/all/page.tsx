import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400

const title = "Leefii Verified Dispensaries \u2014 All Badge Holders | Leefii"
const description = 'Browse all Leefii Verified dispensaries. See which dispensaries have earned Top Rated, Verified Delivery, and City\'s Choice badges. Find trusted dispensaries near you.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/badges/all', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/badges/all' },
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating || rating <= 0) return null
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${
            i < fullStars
              ? 'text-yellow-500'
              : i === fullStars && hasHalf
              ? 'text-yellow-300'
              : 'text-gray-300'
          }`}
        >
          &#9733;
        </span>
      ))}
      <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function BadgesAllPage() {
  const dispensaries = await prisma.dispensary.findMany({
    where: { isVerified: true, isActive: true },
    include: {
      city: { select: { id: true, name: true } },
      state: { select: { name: true, slug: true } },
    },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 200,
  })

  // Calculate stats
  const totalVerified = dispensaries.length
  const topRated = dispensaries.filter((d) => (d.rating ?? 0) >= 4.5)
  const deliveryVerified = dispensaries.filter((d) => d.hasDelivery)

  // Determine City's Choice: group by city, find highest-rated in each
  const cityTopMap = new Map<string, string>()
  for (const d of dispensaries) {
    const cityId = d.city.id
    if (!cityTopMap.has(cityId)) {
      // First dispensary per city is the top since the list is already sorted by rating desc
      cityTopMap.set(cityId, d.id)
    }
  }
  const cityChoiceIds = new Set(cityTopMap.values())
  const cityChoiceDispensaries = dispensaries.filter((d) => cityChoiceIds.has(d.id))

  // Helper to get badge icons for a dispensary
  function getBadgeIcons(d: (typeof dispensaries)[0]) {
    const icons: { src: string; alt: string }[] = []
    icons.push({ src: '/badges/verified-dispensary-md.svg', alt: 'Verified' })
    if ((d.rating ?? 0) >= 4.5) {
      icons.push({ src: '/badges/top-rated-md.svg', alt: 'Top Rated' })
    }
    if (d.hasDelivery) {
      icons.push({ src: '/badges/verified-delivery-md.svg', alt: 'Delivery' })
    }
    if (cityChoiceIds.has(d.id)) {
      icons.push({ src: '/badges/city-choice-md.svg', alt: "City's Choice" })
    }
    return icons
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Badges', item: 'https://leefii.com/badges' },
      { '@type': 'ListItem', position: 3, name: 'All Verified', item: 'https://leefii.com/badges/all' },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Leefii Verified Dispensaries',
    numberOfItems: totalVerified,
    itemListElement: dispensaries.slice(0, 50).map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
      url: `https://leefii.com/dispensary/${d.slug}`,
    })),
  }

  const sections = [
    {
      id: 'all',
      label: 'All Verified',
      count: totalVerified,
      dispensaries: dispensaries,
    },
    {
      id: 'top-rated',
      label: 'Top Rated',
      count: topRated.length,
      dispensaries: topRated,
    },
    {
      id: 'delivery',
      label: 'Delivery Verified',
      count: deliveryVerified.length,
      dispensaries: deliveryVerified,
    },
    {
      id: 'city-choice',
      label: "City's Choice",
      count: cityChoiceDispensaries.length,
      dispensaries: cityChoiceDispensaries,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div>
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <nav className="flex items-center space-x-2 text-sm text-green-200 mb-8">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/badges" className="hover:text-white">Badges</Link>
              <span>/</span>
              <span className="text-white font-medium">All Verified</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Verified Dispensaries
            </h1>
            <p className="text-xl text-green-100 max-w-2xl">
              These dispensaries have been verified by Leefii. Browse by badge type to find the most trusted dispensaries in your area.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalVerified}</div>
                <div className="text-sm text-gray-500 mt-1">Verified Dispensaries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{topRated.length}</div>
                <div className="text-sm text-gray-500 mt-1">Top Rated (4.5+)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{deliveryVerified.length}</div>
                <div className="text-sm text-gray-500 mt-1">Delivery Verified</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs (anchor links) */}
        <section className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-0">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex-shrink-0 px-5 py-4 text-sm font-medium text-gray-600 hover:text-green-700 border-b-2 border-transparent hover:border-green-500 transition-colors whitespace-nowrap"
                >
                  {section.label}
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {section.count}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Dispensary Sections */}
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="py-12 bg-gray-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {section.label}
              </h2>
              <p className="text-gray-600 mb-8">
                {section.id === 'all' && `All ${section.count} dispensaries verified by Leefii.`}
                {section.id === 'top-rated' && `${section.count} dispensaries with a 4.5+ star rating.`}
                {section.id === 'delivery' && `${section.count} dispensaries with verified delivery service.`}
                {section.id === 'city-choice' && `${section.count} dispensaries recognized as the top choice in their city.`}
              </p>

              {section.dispensaries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No dispensaries in this category yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.dispensaries.map((d) => {
                    const icons = getBadgeIcons(d)
                    return (
                      <div
                        key={`${section.id}-${d.id}`}
                        className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link
                              href={`/dispensary/${d.slug}`}
                              className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors"
                            >
                              {d.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {d.city.name}, {d.state.name}
                            </p>
                          </div>
                        </div>

                        <StarRating rating={d.rating} />

                        {/* Badge Icons */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {icons.map((icon) => (
                            <Image
                              key={icon.alt}
                              src={icon.src}
                              alt={icon.alt}
                              width={90}
                              height={30}
                              className="rounded"
                            />
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                          <Link
                            href={`/dispensary/${d.slug}`}
                            className="text-sm font-medium text-green-600 hover:text-green-700"
                          >
                            View Profile
                          </Link>
                          <Link
                            href={`/badges/${d.slug}`}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800"
                          >
                            Get Badge
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* SEO Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About Leefii Verified Dispensaries
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>
                The Leefii Verified Dispensaries directory is a curated list of cannabis dispensaries that have completed our independent verification process. Every dispensary on this page has had its business license, physical address, contact information, and operational status confirmed by the Leefii team. This verification provides an additional layer of trust for consumers navigating the rapidly expanding cannabis market, where new dispensaries open regularly and accurate information can be difficult to find.
              </p>
              <p>
                Our verification process goes beyond simply confirming that a dispensary exists. We check active licensing status with state regulatory bodies, verify that the listed address matches the actual business location, confirm phone numbers and websites are working, and review that the dispensary is actively serving customers. This multi-step process ensures that when you see the Leefii Verified badge, you can be confident that the dispensary meets a baseline standard of legitimacy and operational quality.
              </p>
              <p>
                Beyond basic verification, dispensaries can earn additional badges that recognize specific achievements. The Top Rated badge is reserved for dispensaries that have maintained a 4.5-star rating or higher based on authentic customer reviews on Leefii. The Verified Delivery badge confirms that a dispensary offers delivery services, verified through our review process. And the most exclusive distinction, Leefii's Choice, is awarded to the single highest-rated verified dispensary in each city, making it a powerful differentiator in competitive local markets.
              </p>
              <p>
                For dispensary owners, earning verification and badges is completely free. There are no paid tiers, no monthly fees, and no premium requirements. We believe that trust infrastructure should be accessible to all legitimate cannabis businesses, regardless of size. If you own or manage a dispensary and would like to get verified, you can start by claiming your listing on Leefii. Our team typically completes the verification process within 48 business hours, after which you will gain access to your embeddable badge codes and your enhanced profile.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Own a Dispensary?</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Get verified on Leefii and earn your free trust badges. Join {totalVerified} other verified dispensaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sell"
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                Claim Your Listing
              </Link>
              <Link
                href="/badges"
                className="bg-white hover:bg-gray-100 text-gray-900 border rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                Learn About Badges
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
