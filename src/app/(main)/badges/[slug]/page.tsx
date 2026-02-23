import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BadgeEmbed from './BadgeEmbed'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const dispensaries = await prisma.dispensary.findMany({
    where: { isVerified: true, isActive: true },
    orderBy: { reviewsCount: 'desc' },
    select: { slug: true },
    take: 100,
  })
  return dispensaries.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const dispensary = await prisma.dispensary.findUnique({
    where: { slug },
    select: { name: true, slug: true },
  })

  if (!dispensary) {
    return { title: 'Dispensary Not Found | Leefii' }
  }

  const title = `Get Your Leefii Badge \u2014 ${dispensary.name} | Leefii`
  const description = `Get free embeddable Leefii trust badges for ${dispensary.name}. Copy the embed code for your website, WordPress, or Shopify store.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://leefii.com/badges/${dispensary.slug}`,
      siteName: 'Leefii',
    },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `https://leefii.com/badges/${dispensary.slug}` },
  }
}

export default async function BadgeSlugPage({ params }: Props) {
  const { slug } = await params

  const dispensary = await prisma.dispensary.findUnique({
    where: { slug },
    include: {
      city: { select: { id: true, name: true } },
      state: { select: { name: true, slug: true } },
    },
  })

  if (!dispensary) {
    notFound()
  }

  // Determine City's Choice: check if this dispensary is the top-rated verified in its city
  const topInCity = await prisma.dispensary.findFirst({
    where: {
      cityId: dispensary.city.id,
      isVerified: true,
      isActive: true,
    },
    orderBy: { rating: 'desc' },
    select: { id: true },
  })

  const isCityChoice = topInCity?.id === dispensary.id

  // Build badge list
  const badges = [
    {
      type: 'verified-dispensary',
      name: 'Leefii Verified Dispensary',
      alt: `${dispensary.name} - Leefii Verified Dispensary`,
      qualified: dispensary.isVerified === true,
    },
    {
      type: 'top-rated',
      name: 'Top Rated on Leefii 2026',
      alt: `${dispensary.name} - Top Rated on Leefii 2026`,
      qualified: (dispensary.rating ?? 0) >= 4.5,
    },
    {
      type: 'verified-delivery',
      name: 'Leefii Verified Delivery',
      alt: `${dispensary.name} - Leefii Verified Delivery`,
      qualified: dispensary.hasDelivery === true,
    },
    {
      type: 'city-choice',
      name: "Leefii's Choice 2026",
      alt: `${dispensary.name} - Leefii's Choice ${dispensary.city.name} 2026`,
      qualified: isCityChoice,
    },
  ]

  const qualifiedCount = badges.filter((b) => b.qualified).length

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Badges', item: 'https://leefii.com/badges' },
      {
        '@type': 'ListItem',
        position: 3,
        name: dispensary.name,
        item: `https://leefii.com/badges/${dispensary.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/badges" className="text-gray-500 hover:text-gray-700">Badges</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{dispensary.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Badges for {dispensary.name}
            </h1>
            <p className="text-green-100 text-lg">
              {dispensary.city.name}, {dispensary.state.name}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="bg-green-500/30 text-white px-3 py-1 rounded-full text-sm font-medium">
                {qualifiedCount} of 4 badges earned
              </span>
              {dispensary.rating != null && dispensary.rating > 0 && (
                <span className="flex items-center text-sm">
                  <span className="text-yellow-300 mr-1">&#9733;</span>
                  {dispensary.rating.toFixed(1)} rating
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Badge Embed Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Badge Embed Codes</h2>
              <p className="text-gray-600">
                Select a badge below, choose your preferred size and platform, then copy the embed code to add it to your website.
              </p>
            </div>

            <BadgeEmbed
              dispensarySlug={dispensary.slug}
              dispensaryName={dispensary.name}
              badges={badges}
            />

            {/* Links */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/dispensary/${dispensary.slug}`}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold text-center transition-colors"
              >
                View Dispensary Profile
              </Link>
              <Link
                href="/badges"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg px-6 py-3 font-semibold text-center transition-colors"
              >
                Learn About Badges
              </Link>
              <Link
                href="/badges/all"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg px-6 py-3 font-semibold text-center transition-colors"
              >
                All Verified Dispensaries
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
