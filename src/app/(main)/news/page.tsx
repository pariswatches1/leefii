import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Cannabis News — Latest Marijuana Legalization & Industry Updates | Leefii',
  description:
    'Breaking cannabis news, marijuana legalization updates, federal policy changes, and industry trends. Stay informed with daily coverage from Leefii.',
  keywords: [
    'cannabis news',
    'marijuana news',
    'weed legalization',
    'cannabis industry',
    'marijuana legalization updates',
    'federal cannabis policy',
    'dispensary news',
  ],
  openGraph: {
    title: 'Cannabis News — Latest Marijuana Legalization & Industry Updates | Leefii',
    description:
      'Breaking cannabis news, marijuana legalization updates, federal policy changes, and industry trends.',
    url: 'https://leefii.com/news',
    type: 'website',
  },
  alternates: {
    canonical: 'https://leefii.com/news',
  },
}

const CATEGORIES = [
  { label: 'All', slug: 'all' },
  { label: 'Legalization', slug: 'legalization' },
  { label: 'Federal', slug: 'federal' },
  { label: 'Business', slug: 'business' },
  { label: 'Science', slug: 'science' },
  { label: 'Culture', slug: 'culture' },
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  legalization: { bg: 'bg-purple-100', text: 'text-purple-700' },
  federal: { bg: 'bg-red-100', text: 'text-red-700' },
  business: { bg: 'bg-blue-100', text: 'text-blue-700' },
  science: { bg: 'bg-amber-100', text: 'text-amber-700' },
  culture: { bg: 'bg-pink-100', text: 'text-pink-700' },
}

const STATE_NEWS_LINKS = [
  { name: 'Florida', slug: 'florida' },
  { name: 'California', slug: 'california' },
  { name: 'Colorado', slug: 'colorado' },
  { name: 'New York', slug: 'new-york' },
  { name: 'Texas', slug: 'texas' },
  { name: 'Illinois', slug: 'illinois' },
  { name: 'Ohio', slug: 'ohio' },
  { name: 'Michigan', slug: 'michigan' },
  { name: 'Arizona', slug: 'arizona' },
  { name: 'New Jersey', slug: 'new-jersey' },
  { name: 'Pennsylvania', slug: 'pennsylvania' },
  { name: 'Virginia', slug: 'virginia' },
  { name: 'Oklahoma', slug: 'oklahoma' },
]

const FAQS = [
  {
    question: 'Where can I find the latest cannabis legalization news?',
    answer:
      'Leefii aggregates cannabis legalization news from trusted sources daily. Our news hub covers federal policy changes, state-level legalization updates, ballot initiatives, and court rulings affecting marijuana laws across the United States. Bookmark this page and check back regularly for the most current coverage.',
  },
  {
    question: 'How often is Leefii cannabis news updated?',
    answer:
      'Our cannabis news feed is updated multiple times per day as new stories break. We monitor federal agencies, state legislatures, industry publications, and scientific journals to ensure you receive timely and accurate reporting on every major development in the cannabis space.',
  },
  {
    question: 'Does Leefii cover cannabis news for every state?',
    answer:
      'Yes. Leefii tracks cannabis legislation, dispensary openings, and regulatory changes in all 50 states. Whether your state has legalized recreational use, offers a medical program, or is still prohibition-only, we cover the developments that matter to you and link to our state-specific law pages for deeper context.',
  },
  {
    question: 'What types of cannabis news does Leefii report on?',
    answer:
      'We cover five main categories: legalization and policy, federal government actions, cannabis business and industry trends, scientific research and medical studies, and cannabis culture. Each category is tagged so you can quickly filter stories relevant to your interests.',
  },
  {
    question: 'Can I get alerts for cannabis news in my state?',
    answer:
      'While we do not currently offer push notifications, you can visit our state-specific news pages or filter articles by state to stay up to date. We are working on an email newsletter that will allow you to subscribe to cannabis news by state and category.',
  },
]

function estimateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 225))
}

function getCategoryColor(category: string | null) {
  if (!category) return { bg: 'bg-green-100', text: 'text-green-700' }
  return CATEGORY_COLORS[category.toLowerCase()] || { bg: 'bg-green-100', text: 'text-green-700' }
}

export default async function NewsPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  const featured = articles[0] || null
  const gridArticles = articles.slice(1)
  const articleCount = articles.length

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Cannabis News', item: 'https://leefii.com/news' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Latest Cannabis News',
    numberOfItems: articleCount,
    itemListElement: articles.slice(0, 20).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://leefii.com/news/${a.slug}`,
      name: a.title,
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
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cannabis News</h1>
          <p className="text-green-100 text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Daily coverage of marijuana legalization, federal policy, industry trends, and scientific
            research from trusted sources.
          </p>
          {articleCount > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-medium">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              {articleCount} articles published
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Answer Block */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Cannabis News at a Glance</h2>
          <p className="text-green-900 text-sm leading-relaxed">
            The cannabis industry is evolving rapidly across the United States. Federal rescheduling
            discussions, new state legalization efforts, and expanding medical programs are reshaping
            policy and business. Leefii tracks every major development so you can stay informed about
            the laws, dispensaries, and research that affect you. Browse by category or state below.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <nav className="flex flex-wrap gap-2 mb-10" aria-label="News categories">
          {CATEGORIES.map((cat) =>
            cat.slug === 'all' ? (
              <Link
                key={cat.slug}
                href="/news"
                className="px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white"
              >
                {cat.label}
              </Link>
            ) : (
              <Link
                key={cat.slug}
                href={`/news/category/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:text-green-700 transition-colors"
              >
                {cat.label}
              </Link>
            )
          )}
        </nav>

        {articles.length > 0 ? (
          <>
            {/* Featured Article */}
            {featured && (
              <Link
                href={`/news/${featured.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden mb-12 group"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center min-h-[240px]">
                    {featured.imageUrl ? (
                      <img
                        src={featured.imageUrl}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-white/80">
                        <svg
                          className="w-16 h-16 mx-auto mb-2"
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
                        <span className="text-sm font-medium">Featured Story</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Featured
                      </span>
                      {featured.category && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${getCategoryColor(featured.category).bg} ${getCategoryColor(featured.category).text}`}
                        >
                          {featured.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{featured.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {featured.publishedAt && (
                        <time dateTime={featured.publishedAt.toISOString()}>
                          {featured.publishedAt.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      )}
                      {featured.sourceName && <span>via {featured.sourceName}</span>}
                      <span>{estimateReadingTime(featured.content)} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            {gridArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {gridArticles.map((article) => {
                    const colors = getCategoryColor(article.category)
                    return (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
                      >
                        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-10 h-10 text-white/60"
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
                        <div className="p-5 flex flex-col flex-1">
                          {article.category && (
                            <span
                              className={`inline-block self-start px-2.5 py-0.5 text-xs font-medium rounded-full mb-2 ${colors.bg} ${colors.text}`}
                            >
                              {article.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {article.publishedAt && (
                                <time dateTime={article.publishedAt.toISOString()}>
                                  {article.publishedAt.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </time>
                              )}
                              {article.sourceName && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <span>{article.sourceName}</span>
                                </>
                              )}
                            </div>
                            <span>{estimateReadingTime(article.content)} min</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-6"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">News Coming Soon</h2>
              <p className="text-gray-600 mb-8">
                We are building a comprehensive cannabis news section with the latest industry
                updates, legalization news, and scientific research.
              </p>
              <Link
                href="/dispensaries"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Browse Dispensaries
              </Link>
            </div>
          </div>
        )}

        {/* State News Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">News by State</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-600 text-sm mb-4">
              Follow cannabis legislation, dispensary openings, and policy changes in your state.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {STATE_NEWS_LINKS.map((state) => (
                <Link
                  key={state.slug}
                  href={`/laws/${state.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  {state.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Source for Cannabis Industry News and Legalization Updates
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 text-sm leading-relaxed space-y-4">
              <p>
                The cannabis industry in the United States is undergoing a period of historic change.
                From new state legalization ballot measures to ongoing federal rescheduling efforts,
                the regulatory environment shifts constantly. Staying up to date with accurate,
                unbiased cannabis news has never been more important for patients, consumers, business
                owners, and advocates. Leefii provides daily coverage of these developments, curated
                from trusted sources and organized for quick consumption.
              </p>
              <p>
                On the federal front, the Drug Enforcement Administration and Department of Health
                and Human Services continue to evaluate cannabis scheduling under the Controlled
                Substances Act. Rescheduling or descheduling cannabis would have massive implications
                for banking, taxation, interstate commerce, and criminal justice reform. At the same
                time, Congress considers legislation like the SAFE Banking Act that would give
                cannabis businesses access to traditional financial services, reducing the risks of
                operating in a cash-heavy industry.
              </p>
              <p>
                At the state level, the landscape varies dramatically. States like California,
                Colorado, and Oregon have mature recreational markets with hundreds of licensed
                dispensaries. Meanwhile, states such as Florida, Ohio, and Pennsylvania are expanding
                their medical cannabis programs and considering adult-use legalization. Some states
                remain prohibition-only, though even these are seeing legislative proposals introduced
                each session. Leefii tracks all of these developments and connects the news to our
                comprehensive <Link href="/laws" className="text-green-600 hover:underline">state
                cannabis law guides</Link> and{' '}
                <Link href="/dispensaries" className="text-green-600 hover:underline">dispensary
                directory</Link>.
              </p>
              <p>
                Beyond policy, the cannabis industry is a rapidly growing economic sector. Market
                research firms project the U.S. legal cannabis market will generate tens of billions
                of dollars in annual revenue, supporting hundreds of thousands of jobs in cultivation,
                manufacturing, retail, and ancillary services. Leefii covers dispensary openings,
                mergers and acquisitions, public company earnings, and emerging trends like cannabis
                beverages, nano-emulsion technology, and craft cannabis brands.
              </p>
              <p>
                Scientific research on cannabis is also accelerating. Universities and research
                institutions are publishing studies on cannabinoids, terpenes, the endocannabinoid
                system, and the therapeutic potential of cannabis for conditions ranging from chronic
                pain and epilepsy to anxiety and PTSD. We report on these findings in our science
                category, translating complex research into accessible summaries that help readers
                make informed decisions about their health and wellness.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions About Cannabis News
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 group"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <svg
                    className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
