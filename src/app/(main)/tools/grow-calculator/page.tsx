import { Metadata } from 'next'
import Link from 'next/link'
import GrowCalculator from './GrowCalculator'

export const metadata: Metadata = {
  title:
    'Cannabis Grow Calculator — Estimate Yield, Cost & Timeline (2026) | Leefii',
  description:
    'Estimate your cannabis grow yield, electricity costs, timeline, and recommended setup. Covers indoor LED/HPS and outdoor grows with soil, coco coir, and hydroponic mediums.',
  openGraph: {
    title:
      'Cannabis Grow Calculator — Estimate Yield, Cost & Timeline (2026) | Leefii',
    description:
      'Calculate expected yield, costs, and grow timeline for indoor and outdoor cannabis cultivation.',
    url: 'https://leefii.com/tools/grow-calculator',
    siteName: 'Leefii',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/tools/grow-calculator' },
}

const faqItems = [
  {
    q: 'How much cannabis can one plant yield?',
    a: 'Yields vary significantly based on growing conditions. Indoor plants under LED lighting typically produce 100 to 300 grams each, while well-maintained outdoor plants in warm climates can yield 500 to 1000 grams or more. Factors like genetics, lighting, nutrients, container size, and growing experience all influence the final harvest weight.',
  },
  {
    q: 'How much does it cost to grow cannabis at home?',
    a: 'Initial setup costs range from a few hundred dollars for a basic soil grow to several thousand for a fully equipped indoor grow room with LED lights and ventilation. Monthly electricity costs for a small indoor grow with LED lights typically run 30 to 80 dollars depending on your local rates and the number of lights. Outdoor grows have minimal ongoing energy costs.',
  },
  {
    q: 'How long does it take to grow cannabis from seed to harvest?',
    a: 'The total timeline from seed to harvest depends on the strain type and growing method. Auto-flowering varieties can finish in as little as 8 to 10 weeks total. Photoperiod indica strains typically take 12 to 16 weeks including a 4-week vegetative phase and an 8 to 10 week flowering phase. Sativa strains may need 16 to 24 weeks due to their longer flowering period.',
  },
  {
    q: 'Is it legal to grow cannabis at home?',
    a: 'Home cultivation laws vary by state and country. Many recreational-legal states permit adults to grow a limited number of plants, often 4 to 6 per household. Some medical states allow patient cultivation with a valid card. However, several states that have legalized cannabis for adult use still prohibit home growing. Always check your local and state regulations before starting a grow.',
  },
  {
    q: 'Which growing medium produces the best yields?',
    a: 'Hydroponic systems generally produce the highest yields, often 15 to 20 percent more than soil, because they deliver nutrients directly to the roots and allow for precise environmental control. Coco coir offers a balance between soil simplicity and hydroponic performance, typically yielding around 10 percent more than soil. Soil is the most forgiving medium for beginners and produces excellent flavor profiles.',
  },
]

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://leefii.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Tools',
      item: 'https://leefii.com/tools',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Grow Calculator',
      item: 'https://leefii.com/tools/grow-calculator',
    },
  ],
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function GrowCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/tools/grow-calculator"
              className="hover:text-green-600"
            >
              Tools
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Grow Calculator</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cannabis Grow Room Calculator
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Estimate your yield, electricity costs, timeline, and recommended
            setup for indoor and outdoor cannabis cultivation
          </p>
        </div>
      </section>

      {/* Calculator */}
      <GrowCalculator />

      {/* SEO Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Planning Your Cannabis Grow: What to Know Before You Start
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p>
              Growing cannabis at home has become increasingly accessible as
              more states legalize personal cultivation. Whether you are setting
              up a closet grow with a single LED light or planning a full-scale
              indoor garden, understanding the variables that affect yield,
              cost, and timeline is essential for a successful harvest. Our grow
              calculator takes the guesswork out of planning by estimating your
              expected results based on space dimensions, lighting type, growing
              medium, strain selection, and number of plants.
            </p>
            <p>
              Lighting is the single most important factor in indoor cannabis
              cultivation. Modern LED grow lights offer the best efficiency,
              producing one to two grams of dried flower per watt of power
              consumed. High-pressure sodium lights remain popular for their
              proven performance but generate more heat and consume more
              electricity. The size of your grow space determines how many
              lights you need and how many plants you can comfortably fit
              without overcrowding, which directly impacts airflow, plant
              health, and final yield. For outdoor grows, your local climate
              and the number of sunlight hours during the growing season play
              the dominant role.
            </p>
            <p>
              Your choice of growing medium also has a measurable impact on
              results. Soil is the most beginner-friendly option and produces
              excellent terpene profiles. Coco coir provides faster growth
              rates and a roughly ten percent yield increase over soil by
              improving oxygen availability at the root zone. Hydroponic
              systems push growth rates even higher but require more equipment,
              monitoring, and experience to manage properly. Use the calculator
              above to model different scenarios and find the setup that matches
              your goals, budget, and experience level before you invest in
              equipment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-gray-200"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900">
                {item.q}
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
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
              <div className="px-6 pb-6 text-gray-600">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
