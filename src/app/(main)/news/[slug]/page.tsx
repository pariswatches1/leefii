import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ShareButtons from '@/components/ShareButtons'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  legalization: { bg: 'bg-purple-100', text: 'text-purple-700' },
  federal: { bg: 'bg-red-100', text: 'text-red-700' },
  business: { bg: 'bg-blue-100', text: 'text-blue-700' },
  science: { bg: 'bg-amber-100', text: 'text-amber-700' },
  culture: { bg: 'bg-pink-100', text: 'text-pink-700' },
}

function getCategoryColor(category: string | null) {
  if (!category) return { bg: 'bg-green-100', text: 'text-green-700' }
  return CATEGORY_COLORS[category.toLowerCase()] || { bg: 'bg-green-100', text: 'text-green-700' }
}

function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 225))
}

function extractFirstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  if (match) {
    return match[1].replace(/<[^>]*>/g, '').trim()
  }
  const plain = html.replace(/<[^>]*>/g, '').trim()
  const sentences = plain.split(/[.!?]\s+/)
  return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '')
}

function stateToSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  })

  if (!article) {
    return { title: 'Article Not Found | Leefii' }
  }

  const title = article.metaTitle || `${article.title} | Cannabis News | Leefii`
  const description =
    article.metaDescription || article.excerpt || extractFirstParagraph(article.content)

  return {
    title,
    description,
    keywords: article.tags || [],
    openGraph: {
      title,
      description,
      url: `https://leefii.com/news/${slug}`,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: ['Leefii Team'],
      section: article.category || 'Cannabis News',
      ...(article.imageUrl ? { images: [{ url: article.imageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(article.imageUrl ? { images: [article.imageUrl] } : {}),
    },
    alternates: {
      canonical: `https://leefii.com/news/${slug}`,
    },
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  })

  if (!article || !article.isPublished) {
    notFound()
  }

  // Increment view count non-blocking
  try {
    prisma.newsArticle
      .update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {})
  } catch {
    // silently ignore
  }

  // Fetch related articles from same category
  const relatedArticles = article.category
    ? await prisma.newsArticle.findMany({
        where: {
          isPublished: true,
          category: article.category,
          id: { not: article.id },
        },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      })
    : []

  const readingTime = estimateReadingTime(article.content)
  const quickSummary = article.excerpt || extractFirstParagraph(article.content)
  const colors = getCategoryColor(article.category)
  const articleUrl = `https://leefii.com/news/${article.slug}`

  const categoryBreadcrumb = article.category
    ? [
        {
          '@type': 'ListItem' as const,
          position: 3,
          name: article.category.charAt(0).toUpperCase() + article.category.slice(1),
          item: `https://leefii.com/news/category/${article.category.toLowerCase()}`,
        },
        {
          '@type': 'ListItem' as const,
          position: 4,
          name: article.title,
          item: articleUrl,
        },
      ]
    : [
        {
          '@type': 'ListItem' as const,
          position: 3,
          name: article.title,
          item: articleUrl,
        },
      ]

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Cannabis News', item: 'https://leefii.com/news' },
      ...categoryBreadcrumb,
    ],
  }

  const newsArticleLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.metaDescription || article.excerpt || quickSummary,
    datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Leefii Team',
      url: 'https://leefii.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Leefii',
      url: 'https://leefii.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://leefii.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    ...(article.imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: article.imageUrl,
          },
        }
      : {}),
  }

  // Share URLs handled by ShareButtons component

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }}
      />

      {/* Hero / Article Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-green-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/news" className="hover:text-white transition-colors">
              News
            </Link>
            {article.category && (
              <>
                <span>/</span>
                <Link
                  href={`/news/category/${article.category.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                >
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}
              >
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
            )}
            <span className="text-green-200 text-sm">{readingTime} min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-green-100 text-sm">
            {article.publishedAt && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
            )}
            {article.sourceName && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                {article.sourceUrl ? (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors underline decoration-green-300"
                  >
                    {article.sourceName}
                  </a>
                ) : (
                  <span>{article.sourceName}</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Leefii Team</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Answer Block */}
        {quickSummary && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-2">
              Quick Summary
            </h2>
            <p className="text-green-900 text-sm leading-relaxed">{quickSummary}</p>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-sm text-gray-500 mb-6">
          Last updated:{' '}
          {article.updatedAt.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/news?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Social Share */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <ShareButtons url={articleUrl} title={article.title} variant="full" heading="Share This Article" />
        </div>

        {/* Related Leefii Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Related Leefii Pages
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/news"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                  All Cannabis News
                </span>
                <p className="text-xs text-gray-500">Browse the latest articles</p>
              </div>
            </Link>
            {article.states &&
              article.states.length > 0 &&
              article.states.slice(0, 3).map((state) => (
                <Link
                  key={`laws-${state}`}
                  href={`/laws/${stateToSlug(state)}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                      {state} Cannabis Laws
                    </span>
                    <p className="text-xs text-gray-500">Legal status and regulations</p>
                  </div>
                </Link>
              ))}
            {article.states &&
              article.states.length > 0 &&
              article.states.slice(0, 2).map((state) => (
                <Link
                  key={`disp-${state}`}
                  href={`/dispensaries/${stateToSlug(state)}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                      {state} Dispensaries
                    </span>
                    <p className="text-xs text-gray-500">Find nearby locations</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => {
                const relColors = getCategoryColor(related.category)
                return (
                  <Link
                    key={related.id}
                    href={`/news/${related.slug}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      {related.imageUrl ? (
                        <img
                          src={related.imageUrl}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="p-4">
                      {related.category && (
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${relColors.bg} ${relColors.text}`}
                        >
                          {related.category}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {related.title}
                      </h3>
                      {related.publishedAt && (
                        <time
                          className="text-xs text-gray-500 mt-2 block"
                          dateTime={related.publishedAt.toISOString()}
                        >
                          {related.publishedAt.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Back to News */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All News
          </Link>
        </div>
      </div>
    </div>
  )
}
