import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  getStaticArticleBySlug,
  getAllStaticArticleSlugs,
  getCategoryBySlug,
  BlogArticle,
} from '@/data/blog'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

interface TocItem {
  id: string
  text: string
}

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi
  let match = regex.exec(html)
  while (match !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    items.push({ id, text })
    match = regex.exec(html)
  }
  return items
}

function injectHeadingIds(html: string, toc: TocItem[]): string {
  let result = html
  let tocIndex = 0
  result = result.replace(/<h2([^>]*)>/gi, (fullMatch, attrs) => {
    if (tocIndex < toc.length) {
      const item = toc[tocIndex]
      tocIndex++
      // If there's already an id, replace; otherwise inject
      if (/id\s*=/.test(attrs)) {
        return `<h2${attrs.replace(/id\s*=\s*["'][^"']*["']/i, `id="${item.id}"`)}>`
      }
      return `<h2 id="${item.id}"${attrs}>`
    }
    return fullMatch
  })
  return result
}

export async function generateStaticParams() {
  return getAllStaticArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  // Check static first
  const staticArticle = getStaticArticleBySlug(slug)
  if (staticArticle) {
    const title = staticArticle.metaTitle || `${staticArticle.title} | Leefii`
    const description = staticArticle.metaDescription || staticArticle.excerpt
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://leefii.com/blog/${slug}`,
        type: 'article',
        siteName: 'Leefii',
        publishedTime: staticArticle.publishedAt,
        authors: [staticArticle.authorName],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `https://leefii.com/blog/${slug}`,
      },
    }
  }

  // Check DB
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        excerpt: true,
        metaTitle: true,
        metaDescription: true,
        imageUrl: true,
        publishedAt: true,
        authorName: true,
      },
    })

    if (post) {
      const title = post.metaTitle || `${post.title} | Leefii`
      const description = post.metaDescription || post.excerpt || ''
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://leefii.com/blog/${slug}`,
          type: 'article',
          siteName: 'Leefii',
          images: post.imageUrl ? [{ url: post.imageUrl, alt: post.title }] : undefined,
          publishedTime: post.publishedAt?.toISOString(),
          authors: post.authorName ? [post.authorName] : undefined,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
        },
        alternates: {
          canonical: `https://leefii.com/blog/${slug}`,
        },
      }
    }
  } catch {
    // DB unavailable
  }

  return {
    title: 'Article Not Found | Leefii',
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params

  // Resolve article: static first, then DB
  const staticArticle = getStaticArticleBySlug(slug)

  let dbPost: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    imageUrl: string | null
    authorName: string | null
    category: string | null
    tags: string[]
    isPublished: boolean
    publishedAt: Date | null
    metaTitle: string | null
    metaDescription: string | null
    viewCount: number
  } | null = null

  try {
    dbPost = await prisma.blogPost.findUnique({
      where: { slug },
    })
  } catch {
    // DB unavailable
  }

  // If found in DB, increment view count
  if (dbPost && dbPost.isPublished) {
    try {
      await prisma.blogPost.update({
        where: { id: dbPost.id },
        data: { viewCount: { increment: 1 } },
      })
    } catch {
      // View count increment is non-critical
    }
  }

  // If neither source has the article, 404
  if (!staticArticle && (!dbPost || !dbPost.isPublished)) {
    notFound()
  }

  // Normalize article data
  const title = staticArticle?.title || dbPost!.title
  const excerpt = staticArticle?.excerpt || dbPost!.excerpt || ''
  const content = staticArticle?.content || dbPost!.content
  const authorName = staticArticle?.authorName || dbPost?.authorName || 'Leefii Team'
  const categorySlug = staticArticle?.category || dbPost?.category || ''
  const tags = staticArticle?.tags || dbPost?.tags || []
  const publishedAt = staticArticle?.publishedAt || dbPost?.publishedAt?.toISOString() || ''
  const relatedSlugs = staticArticle?.relatedSlugs || []
  const imageUrl = dbPost?.imageUrl || undefined
  const viewCount = dbPost?.viewCount || 0

  // Reading time
  const readingTime = staticArticle
    ? staticArticle.readingTime
    : Math.max(1, Math.ceil(content.split(/\s+/).length / 200))

  // Category info
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined

  // Table of contents
  const toc = extractToc(content)
  const processedContent = injectHeadingIds(content, toc)

  // Related articles
  const relatedArticles: {
    slug: string
    title: string
    excerpt: string
    category: string
    readingTime: number
  }[] = []

  for (const relSlug of relatedSlugs.slice(0, 3)) {
    const relArticle = getStaticArticleBySlug(relSlug)
    if (relArticle) {
      relatedArticles.push({
        slug: relArticle.slug,
        title: relArticle.title,
        excerpt: relArticle.excerpt,
        category: relArticle.category,
        readingTime: relArticle.readingTime,
      })
    }
  }

  // If we have fewer than 3 related from static, try DB for same-category articles
  if (relatedArticles.length < 3 && dbPost && categorySlug) {
    try {
      const dbRelated = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          category: categorySlug,
          slug: { notIn: [slug, ...relatedArticles.map((a) => a.slug)] },
        },
        take: 3 - relatedArticles.length,
        orderBy: { publishedAt: 'desc' },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          content: true,
        },
      })
      for (const rp of dbRelated) {
        relatedArticles.push({
          slug: rp.slug,
          title: rp.title,
          excerpt: rp.excerpt || '',
          category: rp.category || '',
          readingTime: Math.max(1, Math.ceil(rp.content.split(/\s+/).length / 200)),
        })
      }
    } catch {
      // Non-critical
    }
  }

  // Share URLs
  const articleUrl = `https://leefii.com/blog/${slug}`
  const encodedUrl = encodeURIComponent(articleUrl)
  const encodedTitle = encodeURIComponent(title)
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

  // JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://leefii.com/blog' },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: category.name,
              item: `https://leefii.com/blog/category/${categorySlug}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: title,
              item: articleUrl,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 3,
              name: title,
              item: articleUrl,
            },
          ]),
    ],
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Leefii',
      url: 'https://leefii.com',
    },
    ...(imageUrl ? { image: imageUrl } : {}),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-green-200 hover:text-white mb-6 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Breadcrumb */}
          <nav className="text-green-200 text-sm mb-6">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/blog/category/${categorySlug}`}
                  className="hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-white truncate">{title}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {category && (
              <Link
                href={`/blog/category/${categorySlug}`}
                className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-400 transition-colors"
              >
                {category.icon} {category.name}
              </Link>
            )}
            <span className="inline-block px-3 py-1 bg-green-500/30 text-green-100 text-sm rounded-full">
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h1>

          {/* Author / Date / Views */}
          <div className="flex flex-wrap items-center gap-3 text-green-100 text-sm">
            <span>By {authorName}</span>
            {publishedAt && (
              <>
                <span>&#183;</span>
                <span>
                  {new Date(publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
            {viewCount > 0 && (
              <>
                <span>&#183;</span>
                <span>{viewCount.toLocaleString()} views</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-10">
          {/* Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">
                    Table of Contents
                  </h2>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-gray-600 hover:text-green-600 transition-colors leading-snug py-1"
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <div className={toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4 max-w-4xl mx-auto'}>
            {/* Mobile ToC */}
            {toc.length > 0 && (
              <div className="lg:hidden mb-8">
                <details className="bg-white rounded-xl border border-gray-200 p-5">
                  <summary className="font-bold text-gray-900 text-sm uppercase tracking-wide cursor-pointer">
                    Table of Contents
                  </summary>
                  <nav className="mt-3 space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-1"
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </details>
              </div>
            )}

            <article className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 md:p-12">
              {/* Article Body */}
              <div
                className="prose prose-lg prose-green max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-ul:my-4 prose-li:text-gray-700
                  prose-ol:my-4
                  prose-table:border-collapse prose-table:w-full
                  prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                  prose-td:p-3 prose-td:border-t prose-td:border-gray-200"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Share This Article
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white text-sm font-medium rounded-lg hover:bg-[#1a8cd8] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </a>
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white text-sm font-medium rounded-lg hover:bg-[#166FE5] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    data-copy-url={articleUrl}
                    title="Copy article link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relArticle) => {
                    const relCategory = getCategoryBySlug(relArticle.category)
                    return (
                      <Link
                        key={relArticle.slug}
                        href={`/blog/${relArticle.slug}`}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {relCategory && (
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              {relCategory.name}
                            </span>
                          )}
                          <span className="text-gray-400 text-xs">
                            {relArticle.readingTime} min read
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
                          {relArticle.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{relArticle.excerpt}</p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Find a Dispensary CTA */}
            <section className="mt-12">
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Find a Dispensary Near You</h2>
                <p className="text-green-100 mb-6 max-w-lg mx-auto">
                  Browse thousands of licensed cannabis dispensaries across every legal state.
                  Compare ratings, menus, hours, and deals.
                </p>
                <Link
                  href="/dispensaries"
                  className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                >
                  Find Dispensaries
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
