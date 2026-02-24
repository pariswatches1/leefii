import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

const STATE_NAMES: Record<string, string> = {
  'alabama': 'Alabama',
  'alaska': 'Alaska',
  'arizona': 'Arizona',
  'arkansas': 'Arkansas',
  'california': 'California',
  'colorado': 'Colorado',
  'connecticut': 'Connecticut',
  'delaware': 'Delaware',
  'district-of-columbia': 'District of Columbia',
  'florida': 'Florida',
  'georgia': 'Georgia',
  'hawaii': 'Hawaii',
  'idaho': 'Idaho',
  'illinois': 'Illinois',
  'indiana': 'Indiana',
  'iowa': 'Iowa',
  'kansas': 'Kansas',
  'kentucky': 'Kentucky',
  'louisiana': 'Louisiana',
  'maine': 'Maine',
  'maryland': 'Maryland',
  'massachusetts': 'Massachusetts',
  'michigan': 'Michigan',
  'minnesota': 'Minnesota',
  'mississippi': 'Mississippi',
  'missouri': 'Missouri',
  'montana': 'Montana',
  'nebraska': 'Nebraska',
  'nevada': 'Nevada',
  'new-hampshire': 'New Hampshire',
  'new-jersey': 'New Jersey',
  'new-mexico': 'New Mexico',
  'new-york': 'New York',
  'north-carolina': 'North Carolina',
  'north-dakota': 'North Dakota',
  'ohio': 'Ohio',
  'oklahoma': 'Oklahoma',
  'oregon': 'Oregon',
  'pennsylvania': 'Pennsylvania',
  'rhode-island': 'Rhode Island',
  'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota',
  'tennessee': 'Tennessee',
  'texas': 'Texas',
  'utah': 'Utah',
  'vermont': 'Vermont',
  'virginia': 'Virginia',
  'washington': 'Washington',
  'west-virginia': 'West Virginia',
  'wisconsin': 'Wisconsin',
  'wyoming': 'Wyoming',
}

const KEY_STATES = [
  'florida', 'oklahoma', 'virginia', 'pennsylvania', 'new-hampshire',
  'hawaii', 'california', 'colorado', 'new-york', 'texas',
  'illinois', 'ohio', 'michigan', 'arizona', 'new-jersey',
]

const BADGE_COLORS: Record<string, string> = {
  legalization: 'bg-green-100 text-green-700',
  federal: 'bg-blue-100 text-blue-700',
  business: 'bg-amber-100 text-amber-700',
  science: 'bg-purple-100 text-purple-700',
  culture: 'bg-pink-100 text-pink-700',
}

export async function generateStaticParams() {
  return KEY_STATES.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const stateName = STATE_NAMES[slug]
  if (!stateName) return {}

  const title = `${stateName} Cannabis News — Latest Updates & Law Changes | Leefii`
  const description = `Stay updated with the latest cannabis news from ${stateName}. Law changes, dispensary openings, legislation updates, and industry developments.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://leefii.com/news/state/${slug}`,
      siteName: 'Leefii',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://leefii.com/news/state/${slug}`,
    },
  }
}

function generateStateIntro(stateName: string, slug: string): string {
  return `<p>Cannabis news in ${stateName} reflects one of the most dynamic and closely watched regulatory environments in the United States. Whether tracking legislative proposals, dispensary licensing updates, enforcement changes, or market developments, staying informed about ${stateName}'s cannabis landscape is essential for residents, patients, business owners, and advocates throughout the state. Each session of the ${stateName} legislature brings new proposals that could reshape access, regulation, and enforcement for millions of people.</p><p>The cannabis policy conversation in ${stateName} encompasses medical marijuana program updates, potential or existing adult-use legalization frameworks, licensing and regulatory actions by state agencies, and the local government decisions that determine where dispensaries and cultivation facilities can operate. Court rulings, tax revenue reports, and law enforcement policy changes also play significant roles in shaping the on-the-ground reality for cannabis consumers and businesses in the state.</p><p>Leefii's ${stateName} cannabis news page compiles the most important and timely developments from across the state. We cover new legislation as it is introduced, report on regulatory agency decisions, track dispensary openings and licensing timelines, and highlight the stories that matter most to the ${stateName} cannabis community. Our coverage draws from local and national sources to provide a comprehensive picture of what is happening and what comes next. Whether you are a patient monitoring program changes, a business owner following licensing updates, or a citizen tracking the evolving legal landscape, this page provides the ${stateName}-specific intelligence you need to stay ahead of developments.</p>`
}

function generateStateFaqs(stateName: string): { question: string; answer: string }[] {
  return [
    {
      question: `Is cannabis legal in ${stateName}?`,
      answer: `Cannabis laws in ${stateName} are subject to ongoing changes. Visit our ${stateName} cannabis laws page for the most current information on recreational and medical cannabis legality, possession limits, and purchasing rules in the state.`,
    },
    {
      question: `Where can I find ${stateName} dispensary locations?`,
      answer: `Leefii maintains a directory of licensed dispensaries in ${stateName}. Visit our ${stateName} dispensaries page for verified locations, hours, menus, and patient reviews to find a dispensary near you.`,
    },
    {
      question: `How do I get a medical marijuana card in ${stateName}?`,
      answer: `The process for obtaining a medical marijuana card in ${stateName} typically involves obtaining a physician certification, submitting a state application, and paying the required fees. Visit our ${stateName} doctors page to find certified cannabis physicians and learn the step-by-step process.`,
    },
    {
      question: `What are the latest cannabis law changes in ${stateName}?`,
      answer: `Cannabis legislation in ${stateName} can change with each legislative session. This news page tracks all significant law changes, regulatory updates, and policy developments as they happen. Check back regularly for the most current information.`,
    },
    {
      question: `How does ${stateName} regulate cannabis businesses?`,
      answer: `${stateName} regulates cannabis businesses through state licensing agencies that oversee cultivation, processing, testing, and retail operations. Regulations cover product safety testing, packaging requirements, advertising restrictions, and operational standards. Specific rules vary based on license type and local jurisdiction.`,
    },
  ]
}

export default async function StateNewsPage({ params }: Props) {
  const { slug } = await params
  const stateName = STATE_NAMES[slug]
  if (!stateName) notFound()

  const articles = await prisma.newsArticle.findMany({
    where: {
      states: { has: slug },
      isPublished: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  const stateIntro = generateStateIntro(stateName, slug)
  const stateFaqs = generateStateFaqs(stateName)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'News', item: 'https://leefii.com/news' },
      { '@type': 'ListItem', position: 3, name: `${stateName} News` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: stateFaqs.map((faq) => ({
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
    name: `${stateName} Cannabis News`,
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
            <span className="text-white">{stateName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {stateName} Cannabis News
          </h1>
          <p className="text-green-100 text-lg max-w-2xl">
            Latest cannabis news, law changes, and industry updates from {stateName}
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
                This page tracks the latest cannabis news and developments specific to {stateName}. Coverage includes
                legislative updates, regulatory changes, dispensary and licensing news, market reports, and community
                developments. Articles are sourced from state and national outlets and updated regularly to keep you
                informed about what is happening in {stateName}&apos;s cannabis landscape.
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
              Latest {stateName} Articles
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
                      {article.category && (
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-3 ${BADGE_COLORS[article.category] ?? 'bg-gray-100 text-gray-700'}`}>
                          {article.category}
                        </span>
                      )}
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
                  No {stateName} Articles Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  We&apos;re working on bringing you the latest cannabis news from {stateName}. Check back soon.
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
            {/* Related Links */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{stateName} Resources</h3>
              <nav className="space-y-2">
                <Link
                  href={`/laws/${slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  {stateName} Cannabis Laws
                </Link>
                <Link
                  href={`/dispensaries/${slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {stateName} Dispensaries
                </Link>
                <Link
                  href={`/doctors/${slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {stateName} MMJ Doctors
                </Link>
              </nav>
            </div>

            {/* Other State News */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Other State News</h3>
              <nav className="space-y-1">
                {KEY_STATES.filter((s) => s !== slug).slice(0, 10).map((stateSlug) => (
                  <Link
                    key={stateSlug}
                    href={`/news/state/${stateSlug}`}
                    className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                  >
                    {STATE_NAMES[stateSlug]}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Cannabis News in {stateName}
          </h2>
          <div
            className="prose prose-gray max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-headings:text-gray-900"
            dangerouslySetInnerHTML={{ __html: stateIntro }}
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
            {stateFaqs.map((faq, index) => (
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
