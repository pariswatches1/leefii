import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  getAllStaticArticles,
  getAllCategories,
  BlogArticle,
  BlogCategory,
} from '@/data/blog'

export const revalidate = 86400

interface MergedArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  authorName: string
  readingTime: number
  publishedAt: string
  metaTitle: string
  metaDescription: string
  content: string
  relatedSlugs: string[]
  imageUrl?: string
  source: 'static' | 'db'
}

function mergeArticles(
  staticArticles: BlogArticle[],
  dbPosts: {
    slug: string
    title: string
    excerpt: string | null
    category: string | null
    tags: string[]
    authorName: string | null
    content: string
    imageUrl: string | null
    publishedAt: Date | null
    metaTitle: string | null
    metaDescription: string | null
  }[]
): MergedArticle[] {
  const slugSet = new Set<string>()
  const merged: MergedArticle[] = []

  for (const article of staticArticles) {
    slugSet.add(article.slug)
    merged.push({
      ...article,
      source: 'static',
    })
  }

  for (const post of dbPosts) {
    if (!slugSet.has(post.slug)) {
      const wordCount = post.content.split(/\s+/).length
      merged.push({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        category: post.category || 'general',
        tags: post.tags || [],
        authorName: post.authorName || 'Leefii Team',
        readingTime: Math.max(1, Math.ceil(wordCount / 200)),
        publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt || '',
        content: post.content,
        relatedSlugs: [],
        imageUrl: post.imageUrl || undefined,
        source: 'db',
      })
    }
  }

  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return merged
}

export async function generateMetadata(): Promise<Metadata> {
  const staticArticles = getAllStaticArticles()
  let dbCount = 0
  try {
    dbCount = await prisma.blogPost.count({ where: { isPublished: true } })
  } catch {
    // DB may be unavailable at build time
  }
  const totalEstimate = Math.max(staticArticles.length, dbCount)

  const title = `Cannabis Blog - Guides, Education & News | ${totalEstimate}+ Articles | Leefii`
  const description = `Explore ${totalEstimate}+ cannabis articles covering strains, edibles, medical use, growing tips, dispensary guides, and more. Expert-written education for beginners and experienced users on Leefii.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://leefii.com/blog',
      siteName: 'Leefii',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: 'https://leefii.com/blog',
    },
  }
}

const FAQ_ITEMS = [
  {
    question: 'What topics does the Leefii cannabis blog cover?',
    answer: 'The Leefii blog covers a wide range of cannabis topics including strain reviews and comparisons, edible guides and dosing advice, medical cannabis research and conditions, growing and cultivation tips, dispensary guides by state, cannabis laws and regulations, terpene and cannabinoid education, consumption methods, and industry news. Our articles are written for both beginners and experienced cannabis enthusiasts.',
  },
  {
    question: 'Are the cannabis articles on Leefii written by experts?',
    answer: 'Yes, our articles are researched and written by cannabis educators, medical professionals, and experienced industry contributors. We prioritize accuracy, cite current research, and regularly update our content to reflect new findings and changing regulations. Every article is reviewed for factual correctness before publication.',
  },
  {
    question: 'How often is new content published on the Leefii blog?',
    answer: 'We publish new cannabis education content regularly, with multiple new articles added each week. Our editorial team continuously updates existing articles to ensure accuracy as cannabis research evolves and state laws change. You can browse our latest articles on this page or filter by category to find topics that interest you.',
  },
  {
    question: 'Can I use the Leefii blog to learn about cannabis as a beginner?',
    answer: 'Absolutely. The Leefii blog is designed to be accessible to everyone, from complete beginners to seasoned cannabis consumers. Our beginner-friendly articles explain fundamental concepts like the difference between indica, sativa, and hybrid strains, how THC and CBD work, proper dosing guidelines, and what to expect when visiting a dispensary for the first time.',
  },
  {
    question: 'Does Leefii provide medical cannabis advice?',
    answer: 'Leefii provides educational content about medical cannabis research, conditions commonly treated with cannabis, and general wellness information. However, our articles are for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider before using cannabis for medical purposes.',
  },
]

export default async function BlogPage() {
  const staticArticles = getAllStaticArticles()
  const categories = getAllCategories()

  let dbPosts: {
    slug: string
    title: string
    excerpt: string | null
    category: string | null
    tags: string[]
    authorName: string | null
    content: string
    imageUrl: string | null
    publishedAt: Date | null
    metaTitle: string | null
    metaDescription: string | null
  }[] = []

  try {
    dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        tags: true,
        authorName: true,
        content: true,
        imageUrl: true,
        publishedAt: true,
        metaTitle: true,
        metaDescription: true,
      },
    })
  } catch {
    // DB may be unavailable at build time
  }

  const allArticles = mergeArticles(staticArticles, dbPosts)
  const featuredArticles = allArticles.slice(0, 3)
  const remainingArticles = allArticles.slice(3)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://leefii.com/blog' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
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

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <nav className="text-green-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Blog</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cannabis Blog &mdash; Guides, Education &amp; News
          </h1>
          <p className="text-green-100 text-lg md:text-xl max-w-3xl mb-8">
            Expert-written cannabis education covering strains, medical use, edibles, growing,
            dispensary guides, and the latest industry news. Everything you need to make informed decisions.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="bg-green-500/30 rounded-lg px-4 py-2">
              <span className="font-bold text-xl text-white">{allArticles.length}+</span>
              <span className="text-green-100 ml-2">Articles</span>
            </div>
            <div className="bg-green-500/30 rounded-lg px-4 py-2">
              <span className="font-bold text-xl text-white">{categories.length}</span>
              <span className="text-green-100 ml-2">Categories</span>
            </div>
            <div className="bg-green-500/30 rounded-lg px-4 py-2">
              <span className="font-bold text-xl text-white">
                {Array.from(new Set(allArticles.map((a) => a.authorName))).length}
              </span>
              <span className="text-green-100 ml-2">Contributors</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => {
                const categoryData = categories.find((c) => c.slug === article.category)
                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <span className="text-white text-5xl">{categoryData?.icon || '📝'}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {categoryData && (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {categoryData.name}
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">{article.readingTime} min read</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{article.authorName}</span>
                        <span className="text-gray-400">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Category Grid */}
        {categories.length > 0 && (
          <section className="py-12 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Explore cannabis education topics organized by category. From strain guides to medical
              research, find the information you need.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category: BlogCategory) => {
                const count = allArticles.filter((a) => a.category === category.slug).length
                return (
                  <Link
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{category.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {category.description}
                        </p>
                        {count > 0 && (
                          <span className="inline-block mt-2 text-xs text-green-600 font-medium">
                            {count} {count === 1 ? 'article' : 'articles'}
                          </span>
                        )}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {remainingArticles.length > 0 && (
          <section className="py-12 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingArticles.map((article) => {
                const categoryData = categories.find((c) => c.slug === article.category)
                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                          <span className="text-white text-4xl">{categoryData?.icon || '📝'}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {categoryData && (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {categoryData.name}
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">{article.readingTime} min read</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{article.authorName}</span>
                        <span className="text-gray-400">
                          {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allArticles.length === 0 && (
          <section className="py-20 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h2>
            <p className="text-gray-600 mb-6">
              Our cannabis education content is coming soon. Check back for expert-written guides and articles.
            </p>
            <Link
              href="/strains"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Browse Strains
            </Link>
          </section>
        )}

        {/* SEO Intro Section */}
        <section className="py-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Your Trusted Source for Cannabis Education
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Welcome to the Leefii cannabis blog, your comprehensive resource for evidence-based cannabis
                education, strain guides, medical research summaries, and dispensary information. Whether you
                are a first-time consumer curious about the difference between indica and sativa or a seasoned
                enthusiast looking for the latest terpene research, our library of expert-written articles
                has something for every level of experience.
              </p>
              <p>
                Our editorial team includes cannabis educators, medical professionals, horticulturists, and
                industry analysts who bring deep expertise to every article we publish. We cover the full
                spectrum of cannabis topics: from understanding cannabinoids like THC, CBD, CBG, and CBN to
                practical guides on edible dosing, vaporizer selection, and responsible consumption practices.
                Our strain review articles break down genetics, terpene profiles, expected effects, and ideal
                use cases so you can make informed decisions before visiting your local dispensary.
              </p>
              <p>
                The cannabis landscape is constantly evolving, with new research, changing regulations, and
                innovative products entering the market every month. Leefii stays on top of these developments
                so you do not have to. Our state law guides track recreational and medical cannabis regulations
                across all 50 states, our dispensary articles help you find the best shops in your area, and
                our growing guides provide practical cultivation tips for home growers in legal jurisdictions.
                We also publish in-depth articles on cannabis and wellness, exploring how different strains and
                consumption methods may support sleep, pain management, anxiety relief, creativity, and focus.
              </p>
              <p>
                Every article on the Leefii blog is researched thoroughly, reviewed for accuracy, and written
                in clear, accessible language. We believe that better education leads to better cannabis
                experiences, and our mission is to empower consumers with the knowledge they need to use
                cannabis safely, effectively, and enjoyably. Browse our categories above, explore our featured
                articles, or use the search to find exactly what you are looking for.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{item.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
