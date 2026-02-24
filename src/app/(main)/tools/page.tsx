import { Metadata } from 'next'
import Link from 'next/link'
import { getAllTools } from '@/data/tools'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Free Cannabis Tools & Calculators | Leefii'
  const description =
    'Free interactive cannabis tools including an edible dosage calculator, strain finder quiz, cannabis law checker, price calculator, terpene guide, tolerance break calculator, and grow room planner.'
  return {
    title,
    description,
    openGraph: { title, description, url: 'https://leefii.com/tools', siteName: 'Leefii' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: 'https://leefii.com/tools' },
  }
}

const PAGE_FAQS = [
  {
    question: 'Are these cannabis tools free to use?',
    answer:
      'Yes, every tool on Leefii is completely free to use with no account required. We built these tools to help cannabis consumers make safer, smarter, and more cost-effective decisions whether they are beginners or experienced users.',
  },
  {
    question: 'How accurate are the calculators and recommendations?',
    answer:
      'Our tools are built on established cannabis science, publicly available research data, and aggregated user reports. While individual results may vary due to personal biology, tolerance, and product variation, our tools provide reliable starting-point guidance that most users find helpful.',
  },
  {
    question: 'Do I need to create an account to use the tools?',
    answer:
      'No account is needed. All tools work instantly in your browser without sign-up or login. We do not collect personal health data or store your results on our servers unless you explicitly choose to save them to your Leefii profile.',
  },
  {
    question: 'Can I use these tools on my phone?',
    answer:
      'Absolutely. All Leefii tools are fully responsive and designed for mobile, tablet, and desktop use. The interactive elements are touch-friendly, and results display cleanly on any screen size for easy reference while shopping at a dispensary.',
  },
  {
    question: 'How often are the tools updated?',
    answer:
      'We update our tools regularly to reflect the latest cannabis research, state law changes, and market data. The cannabis law checker is updated as new legislation passes, and our strain database is refreshed continuously with new strain data and user reviews.',
  },
]

export default function ToolsIndexPage() {
  const tools = getAllTools()

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Cannabis Tools' },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PAGE_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Cannabis Tools</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Cannabis Tools</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Interactive calculators, quizzes, and guides to help you make better cannabis decisions — from dosing and
            strain selection to cost comparison and growing.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Tools &amp; Calculators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-6"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                <div className="mt-4 flex items-center text-green-600 font-medium text-sm">
                  Try it free
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Intro */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Use Cannabis Tools Before You Buy?
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
              <p>
                The cannabis market has grown rapidly, and with that growth comes an overwhelming number of choices for
                consumers. From hundreds of strains with different effects to dozens of product formats at wildly varying
                price points, making informed decisions requires more than guesswork. That is exactly why we built this
                suite of free interactive cannabis tools — to put data-driven guidance in your hands before you spend a
                dollar at the dispensary.
              </p>
              <p>
                Our <Link href="/tools/dose-calculator" className="text-green-600 hover:text-green-800 font-medium">Edible Dosage Calculator</Link> helps
                new and experienced consumers find the right milligram dose based on their unique profile, reducing the
                risk of an uncomfortable experience. The{' '}
                <Link href="/tools/strain-finder" className="text-green-600 hover:text-green-800 font-medium">Strain Finder Quiz</Link> matches you
                with strains tailored to your desired effects, flavor preferences, and tolerance — drawing from our
                extensive <Link href="/strains" className="text-green-600 hover:text-green-800 font-medium">strain database</Link> of
                hundreds of varieties with real user reviews and lab data.
              </p>
              <p>
                Navigating the legal landscape is equally important. Our{' '}
                <Link href="/tools/law-checker" className="text-green-600 hover:text-green-800 font-medium">Cannabis Law Checker</Link> provides
                instant answers about legality, possession limits, and medical versus recreational status for every US
                state, complementing our full{' '}
                <Link href="/laws" className="text-green-600 hover:text-green-800 font-medium">state cannabis law guide</Link>. Meanwhile,
                the <Link href="/tools/price-compare" className="text-green-600 hover:text-green-800 font-medium">Price Calculator</Link> helps you
                compare the true cost per dose across product types so you can stretch your budget further — especially
                when paired with our <Link href="/deals" className="text-green-600 hover:text-green-800 font-medium">deals page</Link> for
                current dispensary discounts.
              </p>
              <p>
                For those interested in the science behind their experience, the{' '}
                <Link href="/tools/terpene-guide" className="text-green-600 hover:text-green-800 font-medium">Terpene Guide</Link> breaks down
                the aromatic compounds that shape how each strain feels, smells, and tastes. Regular users looking to
                reset their sensitivity will find the{' '}
                <Link href="/tools/tolerance-break" className="text-green-600 hover:text-green-800 font-medium">Tolerance Break Calculator</Link>{' '}
                invaluable for planning an effective t-break. And for states that allow home cultivation, our{' '}
                <Link href="/tools/grow-calculator" className="text-green-600 hover:text-green-800 font-medium">Grow Room Calculator</Link> estimates
                yield, cost, and timeline so you can plan your grow with confidence.
              </p>
              <p>
                Every tool on Leefii is free, requires no account, and works on any device. Combine them with our{' '}
                <Link href="/dispensaries" className="text-green-600 hover:text-green-800 font-medium">dispensary finder</Link>,{' '}
                <Link href="/blog" className="text-green-600 hover:text-green-800 font-medium">cannabis blog</Link>, and{' '}
                <Link href="/deals" className="text-green-600 hover:text-green-800 font-medium">deal listings</Link> to
                get the complete picture before every purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl space-y-6">
            {PAGE_FAQS.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More on Leefii</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/strains"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Strain Database
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Browse hundreds of strains with effects, terpenes, and reviews.
              </p>
            </Link>
            <Link
              href="/dispensaries"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Find Dispensaries
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Locate licensed dispensaries with ratings, hours, and delivery info.
              </p>
            </Link>
            <Link
              href="/blog"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Cannabis Blog
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Guides, news, and tips for beginners and experienced users alike.
              </p>
            </Link>
            <Link
              href="/deals"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                Current Deals
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Save on cannabis products with deals from dispensaries near you.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
