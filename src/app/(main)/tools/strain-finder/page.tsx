import { Metadata } from 'next'
import Link from 'next/link'
import StrainFinder from './StrainFinder'

const title = 'Strain Finder Quiz — Find Your Perfect Cannabis Strain (2026) | Leefii'
const description = 'Take our free strain finder quiz to discover the best cannabis strains for your needs. Answer 5 quick questions about effects, tolerance, and preferences to get personalized recommendations.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/tools/strain-finder', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/tools/strain-finder' },
}

const faqs = [
  {
    question: 'How does the strain finder quiz work?',
    answer: 'Our strain finder quiz asks you five quick questions about your desired effects, time of use, THC tolerance, medical needs, and flavor preferences. Based on your answers, our algorithm scores and matches you with the best cannabis strain type (indica, sativa, or hybrid) and provides three specific strain recommendations ranked by match percentage.',
  },
  {
    question: 'What is the difference between indica, sativa, and hybrid strains?',
    answer: 'Indica strains are traditionally associated with relaxing, body-heavy effects and are often used in the evening for unwinding and sleep. Sativa strains tend to produce uplifting, energetic, and creative effects suited for daytime use. Hybrid strains combine genetics from both and can lean indica or sativa depending on their parent strains. Modern research suggests that terpene profiles and cannabinoid content matter more than indica/sativa classification alone.',
  },
  {
    question: 'Can this quiz replace talking to a budtender?',
    answer: 'This quiz is a helpful starting point to narrow down your options, but it does not replace the personalized guidance of an experienced budtender at a licensed dispensary. Budtenders can take into account product availability, local growing conditions, and your specific situation in ways that an online quiz cannot. We recommend using your quiz results as a conversation starter with your budtender.',
  },
  {
    question: 'How accurate are the strain recommendations?',
    answer: 'Our recommendations are based on well-established knowledge about cannabis strain effects, terpene profiles, and user reports. However, individual experiences with any cannabis strain can vary significantly based on your unique biology, tolerance, the specific batch, and growing conditions. Think of our recommendations as a strong starting point rather than an absolute guarantee.',
  },
  {
    question: 'Should beginners use the strain finder quiz?',
    answer: 'Absolutely. The quiz is especially useful for beginners because it helps narrow down the overwhelming number of available strains into a manageable set of recommendations. We recommend that beginners select lower tolerance levels and milder effect preferences. Starting with our suggested strains and working with a knowledgeable budtender is the best approach for new consumers.',
  },
]

export default function StrainFinderPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://leefii.com/tools' },
      { '@type': 'ListItem', position: 3, name: 'Strain Finder Quiz' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/tools/strain-finder" className="text-gray-500 hover:text-gray-700">Tools</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Strain Finder Quiz</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Strain Finder Quiz</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Not sure which cannabis strain is right for you? Answer 5 quick questions and get personalized
            strain recommendations based on your effects, tolerance, and preferences.
          </p>
        </div>
      </section>

      {/* Strain Finder Component */}
      <StrainFinder />

      {/* SEO Content */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Find the Right Cannabis Strain for You</h2>
            <p className="text-gray-700 mb-4">
              With thousands of cannabis strains available at dispensaries across the country, finding the right one
              can feel overwhelming, especially if you are new to cannabis or exploring new options. Each strain has
              its own unique combination of cannabinoids, terpenes, and flavonoids that produce different effects,
              flavors, and therapeutic benefits. Our strain finder quiz simplifies this process by matching your
              personal preferences with strains that are most likely to deliver the experience you are looking for.
            </p>
            <p className="text-gray-700 mb-4">
              The traditional classification of cannabis into indica, sativa, and hybrid categories remains a useful
              starting point. Indica strains generally produce relaxing, sedating effects that make them popular for
              evening use, pain management, and sleep. Sativa strains are associated with uplifting, energizing
              effects that are well-suited for creative activities, social gatherings, and daytime productivity.
              Hybrid strains fall somewhere in between, offering a blend of characteristics from both parent types.
            </p>
            <p className="text-gray-700 mb-4">
              However, modern cannabis science shows that the effects of a strain are determined by more than just
              its indica or sativa classification. Terpenes, the aromatic compounds found in cannabis, play a
              significant role in shaping the experience. For example, myrcene is associated with sedation,
              limonene with mood elevation, and pinene with mental clarity. When our quiz asks about your flavor
              preferences, it is actually helping match you with strains that have complementary terpene profiles.
            </p>
            <p className="text-gray-700 mb-4">
              Your THC tolerance is another critical factor. New consumers or those with low tolerance should
              start with strains that have moderate THC levels, generally below 20 percent. Experienced users may
              prefer higher-potency options. Medical users may also want to consider strains with higher CBD
              content, which can provide therapeutic benefits without an intense psychoactive experience. Our quiz
              takes all of these factors into account when generating your personalized recommendations.
            </p>
            <p className="text-gray-700">
              Remember that everyone responds to cannabis differently due to individual biochemistry, tolerance
              levels, and even mood. Use our strain recommendations as a guide and starting point for your
              exploration. Keep a journal of what you try and how it makes you feel, and do not hesitate to
              ask budtenders at your local dispensary for additional guidance based on what is available in your area.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
