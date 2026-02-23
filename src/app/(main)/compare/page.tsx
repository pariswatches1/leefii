import { Metadata } from 'next'
import Link from 'next/link'
import {
  getAllCategoryComparisonSlugs,
  getAllPlatformComparisonSlugs,
  getCategoryComparisonBySlug,
  getPlatformComparisonBySlug,
  TOP_STRAIN_PAIRS,
} from '@/data/comparison-pages'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Cannabis Comparisons — Strains, Products & Platforms Compared | Leefii',
  description:
    'Compare cannabis strains, product categories, and platforms side by side. THC vs CBD, Indica vs Sativa, Leefii vs Leafly, and hundreds more honest comparisons.',
  openGraph: {
    title: 'Cannabis Comparisons — Strains, Products & Platforms Compared | Leefii',
    description:
      'Compare cannabis strains, product categories, and platforms side by side on Leefii.',
    url: 'https://leefii.com/compare',
    siteName: 'Leefii',
  },
  alternates: { canonical: 'https://leefii.com/compare' },
}

function formatPairForDisplay(slug: string): string {
  const idx = slug.indexOf('-vs-')
  if (idx === -1) return slug
  const a = slug.slice(0, idx)
  const b = slug.slice(idx + 4)
  const format = (s: string) =>
    s
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  return `${format(a)} vs ${format(b)}`
}

export default function ComparePage() {
  const categorySlugs = getAllCategoryComparisonSlugs()
  const platformSlugs = getAllPlatformComparisonSlugs()
  const strainPairs = TOP_STRAIN_PAIRS.slice(0, 20)

  const categoryCards = categorySlugs.slice(0, 8).map((slug) => {
    const data = getCategoryComparisonBySlug(slug)
    return { slug, title: data?.pageTitle || formatPairForDisplay(slug) }
  })

  const platformCards = platformSlugs.map((slug) => {
    const data = getPlatformComparisonBySlug(slug)
    return { slug, title: data?.pageTitle || formatPairForDisplay(slug) }
  })

  const existingPlatforms = [
    { slug: 'leefii-vs-leafly', title: 'Leefii vs Leafly' },
    { slug: 'leefii-vs-weedmaps', title: 'Leefii vs Weedmaps' },
  ]

  const allPlatformCards = [
    ...existingPlatforms,
    ...platformCards.filter(
      (p) => p.slug !== 'leefii-vs-leafly' && p.slug !== 'leefii-vs-weedmaps'
    ),
  ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cannabis Comparisons</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Side-by-side comparisons of strains, product categories, and cannabis platforms.
            Make informed decisions with honest, data-driven breakdowns.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Strain Comparisons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Strain Comparisons</h2>
          <p className="text-gray-600 mb-6">
            Compare popular cannabis strains head-to-head on THC, CBD, effects, terpenes, and more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {strainPairs.map((pair) => (
              <Link
                key={pair}
                href={`/compare/${pair}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center group"
              >
                <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition">
                  {formatPairForDisplay(pair)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Comparisons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Category Comparisons</h2>
          <p className="text-gray-600 mb-6">
            Understand the differences between cannabis product types, consumption methods, and strain categories.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryCards.map((card) => (
              <Link
                key={card.slug}
                href={`/compare/${card.slug}`}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 text-center group"
              >
                <p className="font-semibold text-gray-900 group-hover:text-green-700 transition">
                  {card.title}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Platform Comparisons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Comparisons</h2>
          <p className="text-gray-600 mb-6">
            See how cannabis platforms stack up on pricing, features, dispensary coverage, and consumer tools.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {allPlatformCards.map((card) => (
              <Link
                key={card.slug}
                href={`/compare/${card.slug}`}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 text-center group"
              >
                <p className="font-semibold text-gray-900 group-hover:text-green-700 transition">
                  {card.title}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Compare Any Two Strains */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Any Two Strains</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              You can compare any two cannabis strains on Leefii by visiting a URL in the format{' '}
              <code className="bg-gray-100 text-green-700 px-2 py-0.5 rounded text-sm">
                /compare/strain-a-vs-strain-b
              </code>
              . Simply replace the strain names with the slugs of the strains you want to compare.
              For example, visit{' '}
              <Link href="/compare/blue-dream-vs-og-kush" className="text-green-600 hover:underline font-medium">
                /compare/blue-dream-vs-og-kush
              </Link>{' '}
              to see a full side-by-side breakdown of Blue Dream and OG Kush.
            </p>
            <p className="text-gray-500 text-sm">
              Each comparison page shows THC/CBD levels, effects, terpene profiles, medical uses, ratings, and personalized recommendations.
            </p>
          </div>
        </section>

        {/* SEO Intro */}
        <section className="mb-16">
          <div className="prose prose-green max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The Complete Guide to Cannabis Comparisons
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Choosing the right cannabis product starts with understanding how different strains,
              categories, and platforms compare. Whether you are a first-time consumer deciding
              between indica and sativa, a medical patient weighing THC versus CBD options, or a
              dispensary owner evaluating listing platforms, side-by-side comparisons eliminate
              guesswork and help you make confident decisions. Leefii&apos;s comparison hub brings
              together data from thousands of strains, dozens of product categories, and every major
              cannabis platform into one centralized resource.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our strain comparisons pull real data directly from our database of thousands of
              verified cannabis strains. Each comparison includes THC and CBD potency ranges,
              terpene profiles across eight major terpenes, reported effects and medical uses,
              community ratings, and grow difficulty information. Instead of reading individual
              strain pages and trying to remember the details, our comparison pages place
              everything side by side so differences are immediately visible. We also calculate
              shared effects, unique properties, and provide tailored recommendations based on
              the specific attributes of each strain.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Category comparisons address the most common questions cannabis consumers face.
              What is the real difference between edibles and flower? How do vape cartridges
              compare to concentrates in terms of onset time and duration? Is live resin worth the
              premium over standard extracts? These pages break down each category with detailed
              comparison tables, expert analysis, and practical guidance so you can choose the
              right product type for your needs, tolerance, and lifestyle.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Platform comparisons provide honest, transparent evaluations of cannabis technology
              platforms from a dispensary and consumer perspective. We compare pricing structures,
              feature sets, dispensary coverage, strain databases, and unique tools across every
              major player in the space. As a platform ourselves, we believe in transparency, and
              that means acknowledging where competitors excel alongside highlighting our own
              strengths. Every comparison is designed to help you make the best choice for your
              specific situation, whether that means choosing Leefii, a competitor, or both.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
