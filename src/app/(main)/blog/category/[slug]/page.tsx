import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  getAllCategories,
  getAllCategorySlugs,
  getCategoryBySlug,
  getArticlesByCategory,
  BlogArticle,
  BlogCategory,
} from '@/data/blog'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

interface MergedArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  authorName: string
  readingTime: number
  publishedAt: string
  imageUrl?: string
  source: 'static' | 'db'
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  const title = `${category.name} - Cannabis ${category.name} Articles | Leefii`
  const description = `Browse expert-written ${category.name.toLowerCase()} articles on Leefii. ${category.description} Read guides, tips, and the latest information.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://leefii.com/blog/category/${slug}`,
      siteName: 'Leefii',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://leefii.com/blog/category/${slug}`,
    },
  }
}

const CATEGORY_FAQS: Record<string, { question: string; answer: string }[]> = {
  strains: [
    {
      question: 'How do I choose the right cannabis strain?',
      answer: 'Choosing the right strain depends on your desired effects, tolerance level, and preferred consumption method. Start by deciding if you want relaxing (indica), energizing (sativa), or balanced (hybrid) effects. Consider the THC and CBD percentages, terpene profile, and read user reviews. Beginners should start with lower-THC strains and work up gradually.',
    },
    {
      question: 'What is the difference between indica, sativa, and hybrid strains?',
      answer: 'Indica strains are traditionally associated with relaxing body effects, sativa strains with uplifting cerebral effects, and hybrids with a combination of both. However, modern cannabis science shows that terpene profiles and cannabinoid ratios are more reliable predictors of effects than the indica/sativa classification alone.',
    },
    {
      question: 'How do terpenes affect the cannabis experience?',
      answer: 'Terpenes are aromatic compounds in cannabis that influence both flavor and effects. Myrcene promotes relaxation, limonene elevates mood, pinene enhances alertness, and caryophyllene may reduce inflammation. The combination of terpenes and cannabinoids creates what scientists call the entourage effect, where compounds work together synergistically.',
    },
  ],
  edibles: [
    {
      question: 'How long do cannabis edibles take to kick in?',
      answer: 'Cannabis edibles typically take 30 minutes to 2 hours to produce effects, depending on factors like metabolism, recent food intake, and the type of edible. Sublingual products like tinctures may work faster (15-30 minutes), while traditional baked goods and gummies take longer. Always wait at least 2 hours before considering a second dose.',
    },
    {
      question: 'What is a good starting dose for cannabis edibles?',
      answer: 'For beginners, a starting dose of 2.5-5mg of THC is recommended. Experienced users may prefer 10-25mg. The golden rule is to start low and go slow. Edible effects are more intense and longer-lasting than smoking, so patience is essential. You can always take more, but you cannot take less once consumed.',
    },
    {
      question: 'How long do edible effects last?',
      answer: 'Edible effects typically last 4-8 hours, with peak effects occurring 2-3 hours after consumption. Some users report residual effects lasting up to 12 hours with higher doses. Factors like body weight, metabolism, tolerance, and the specific product all influence duration.',
    },
  ],
  medical: [
    {
      question: 'What medical conditions can cannabis help with?',
      answer: 'Research suggests cannabis may help manage chronic pain, nausea from chemotherapy, epilepsy, multiple sclerosis symptoms, PTSD, anxiety, and insomnia. However, effectiveness varies by individual and condition. Always consult with a healthcare provider before using cannabis for medical purposes.',
    },
    {
      question: 'How do I get a medical cannabis card?',
      answer: 'Requirements vary by state but generally involve getting a recommendation from a licensed physician, completing a state application, providing identification, and paying a registration fee. Many states now offer telehealth evaluations. Check your specific state laws for qualifying conditions and the application process.',
    },
    {
      question: 'Is CBD the same as medical cannabis?',
      answer: 'CBD is one of many cannabinoids found in cannabis. While CBD products derived from hemp (with less than 0.3% THC) are widely available, medical cannabis programs typically provide access to products with a full range of cannabinoids including THC. Full-spectrum products may offer broader therapeutic benefits through the entourage effect.',
    },
  ],
}

function getDefaultFaqs(categoryName: string): { question: string; answer: string }[] {
  return [
    {
      question: `What can I learn from ${categoryName.toLowerCase()} articles on Leefii?`,
      answer: `Our ${categoryName.toLowerCase()} articles cover everything from beginner basics to advanced topics. You will find expert-written guides, research summaries, practical tips, and the latest news to help you make informed decisions about cannabis.`,
    },
    {
      question: `How often are new ${categoryName.toLowerCase()} articles published?`,
      answer: `We regularly publish new ${categoryName.toLowerCase()} content, with our editorial team adding fresh articles weekly. All existing content is reviewed and updated periodically to ensure accuracy as research and regulations evolve.`,
    },
    {
      question: `Are these ${categoryName.toLowerCase()} articles suitable for beginners?`,
      answer: `Yes, our ${categoryName.toLowerCase()} content is written for all experience levels. Articles clearly indicate their complexity level, and we explain technical terms and concepts throughout to ensure accessibility for newcomers while still providing depth for experienced readers.`,
    },
  ]
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const allCategories = getAllCategories()
  const otherCategories = allCategories.filter((c) => c.slug !== slug)
  const staticArticles = getArticlesByCategory(slug)

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
  }[] = []

  try {
    dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true, category: slug },
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
      },
    })
  } catch {
    // DB may be unavailable at build time
  }

  // Merge: static articles take priority by slug
  const slugSet = new Set<string>()
  const articles: MergedArticle[] = []

  for (const article of staticArticles) {
    slugSet.add(article.slug)
    articles.push({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      authorName: article.authorName,
      readingTime: article.readingTime,
      publishedAt: article.publishedAt,
      source: 'static',
    })
  }

  for (const post of dbPosts) {
    if (!slugSet.has(post.slug)) {
      const wordCount = post.content.split(/\s+/).length
      articles.push({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        category: post.category || slug,
        tags: post.tags || [],
        authorName: post.authorName || 'Leefii Team',
        readingTime: Math.max(1, Math.ceil(wordCount / 200)),
        publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
        imageUrl: post.imageUrl || undefined,
        source: 'db',
      })
    }
  }

  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const faqItems = CATEGORY_FAQS[slug] || getDefaultFaqs(category.name)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://leefii.com/blog' },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://leefii.com/blog/category/${slug}`,
      },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
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
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold">{category.name}</h1>
          </div>
          <p className="text-green-100 text-lg md:text-xl max-w-3xl">
            {category.description}
          </p>
          {articles.length > 0 && (
            <div className="mt-6 bg-green-500/30 rounded-lg px-4 py-2 inline-block">
              <span className="font-bold text-xl text-white">{articles.length}</span>
              <span className="text-green-100 ml-2">
                {articles.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Intro */}
            <section className="mb-10">
              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About {category.name} Articles
                </h2>
                <p className="text-gray-700 leading-relaxed">{category.intro}</p>
              </div>
            </section>

            {/* Articles Grid */}
            {articles.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  All {category.name} Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {articles.map((article) => (
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
                            <span className="text-white text-4xl">{category.icon}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {category.name}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {article.readingTime} min read
                          </span>
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
                  ))}
                </div>
              </section>
            ) : (
              <section className="text-center py-16">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No {category.name} Articles Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  We are currently working on expert {category.name.toLowerCase()} content.
                  Check back soon for new articles.
                </p>
                <Link
                  href="/blog"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Browse All Articles
                </Link>
              </section>
            )}

            {/* FAQ Section */}
            <section className="mt-12 pt-10 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.name} FAQs
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Other Categories</h3>
                <div className="space-y-2">
                  {otherCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/blog/category/${cat.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Find a Dispensary</h3>
                <p className="text-green-100 text-sm mb-4">
                  Browse thousands of licensed dispensaries near you with ratings, menus, and deals.
                </p>
                <Link
                  href="/dispensaries"
                  className="inline-block w-full text-center bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
                >
                  Find Dispensaries
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
