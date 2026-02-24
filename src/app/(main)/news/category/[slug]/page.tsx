import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  NEWS_CATEGORIES,
  getNewsCategoryBySlug,
  getAllNewsCategorySlugs,
} from '@/data/news-categories'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  return getAllNewsCategorySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getNewsCategoryBySlug(slug)
  if (!category) return {}

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `https://leefii.com/news/category/${slug}`,
      siteName: 'Leefii',
    },
    twitter: {
      card: 'summary_large_image',
      title: category.metaTitle,
      description: category.metaDescription,
    },
    alternates: {
      canonical: `https://leefii.com/news/category/${slug}`,
    },
  }
}

const BADGE_COLORS: Record<string, string> = {
  legalization: 'bg-green-100 text-green-700',
  federal: 'bg-blue-100 text-blue-700',
  business: 'bg-amber-100 text-amber-700',
  science: 'bg-purple-100 text-purple-700',
  culture: 'bg-pink-100 text-pink-700',
}

export default async function NewsCategoryPage({ params }: Props) {
  const { slug } = await params
  const category = getNewsCategoryBySlug(slug)
  if (!category) notFound()

  const articles = await prisma.newsArticle.findMany({
    where: {
      category: slug,
      isPublished: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  const mostReadArticles = await prisma.newsArticle.findMany({
    where: {
      isPublished: true,
    },
    orderBy: { viewCount: 'desc' },
    take: 5,
  })

  const otherCategories = NEWS_CATEGORIES.filter((c) => c.slug !== slug)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'News', item: 'https://leefii.com/news' },
      { '@type': 'ListItem', position: 3, name: `${category.name} News` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Cannabis News`,
    numberOfItems: articles.length,
    itemListElement: articles.slice(0, 20).map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://leefii.com/news/${article.slug}`,
      name: article.title,
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-green-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {category.name} News
          </h1>
          <p className="text-green-100 text-lg max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      {/* Quick Answer Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Quick Summary</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {slug === 'legalization' &&
                  'Cannabis legalization continues to expand across the United States. More than half of all states now permit some form of legal cannabis access, with multiple new states considering recreational or medical programs each year. This section tracks every law change, ballot measure, and legislative development as it happens.'}
                {slug === 'federal' &&
                  'Federal cannabis policy remains one of the most closely watched topics in the industry. The DEA rescheduling process, congressional banking reform bills, and executive branch directives all shape how state-legal markets operate. This section follows every federal development from Capitol Hill to agency rulings.'}
                {slug === 'business' &&
                  'The legal cannabis industry generates over $30 billion in annual U.S. revenue and continues to grow as new state markets open. This section covers mergers and acquisitions, dispensary openings, quarterly earnings from major operators, market analysis, and the business trends shaping the cannabis economy.'}
                {slug === 'science' &&
                  'Cannabis research is accelerating as regulatory barriers decrease and institutional support grows. Clinical trials are investigating cannabinoid therapies for conditions ranging from epilepsy to chronic pain. This section covers the latest peer-reviewed studies, FDA research milestones, and breakthroughs in cannabinoid science.'}
                {slug === 'culture' &&
                  'Cannabis culture encompasses events, advocacy, lifestyle trends, and community building across the United States. From 420 festivals and Cannabis Cup competitions to infused dining and cannabis tourism, the cultural landscape is evolving rapidly. This section covers the people, events, and social trends defining cannabis culture.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Article Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Latest {category.name} Articles
            </h2>

            {articles.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-5">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-3 ${BADGE_COLORS[article.category ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
                        {article.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Draft'}
                        </span>
                        {article.sourceName && (
                          <span className="text-gray-400 text-xs">{article.sourceName}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No {category.name} Articles Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  We&apos;re working on bringing you the latest {category.name.toLowerCase()} news. Check back soon.
                </p>
                <Link
                  href="/news"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Browse All News
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="mt-10 lg:mt-0">
            {/* News Categories */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">News Categories</h3>
              <nav className="space-y-2">
                {NEWS_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/news/category/${cat.slug}`}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      cat.slug === slug
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      cat.slug === 'legalization' ? 'bg-green-500' :
                      cat.slug === 'federal' ? 'bg-blue-500' :
                      cat.slug === 'business' ? 'bg-amber-500' :
                      cat.slug === 'science' ? 'bg-purple-500' :
                      'bg-pink-500'
                    }`} />
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Most Read */}
            {mostReadArticles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Most Read</h3>
                <div className="space-y-4">
                  {mostReadArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="flex gap-3 group"
                    >
                      <span className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About {category.name} Cannabis News
          </h2>
          <div
            className="prose prose-gray max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-headings:text-gray-900"
            dangerouslySetInnerHTML={{ __html: category.intro }}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {category.faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
