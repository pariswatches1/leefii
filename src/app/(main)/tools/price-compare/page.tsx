import { Metadata } from 'next'
import Link from 'next/link'
import PriceCompare from './PriceCompare'

export const metadata: Metadata = {
  title:
    'Cannabis Price Calculator — Compare Costs Per Dose (2026) | Leefii',
  description:
    'Calculate the true cost of cannabis products per gram, per milligram of THC, and per dose. Compare flower, edibles, concentrates, vapes, and pre-rolls against average market prices to find the best value.',
  openGraph: {
    title:
      'Cannabis Price Calculator — Compare Costs Per Dose (2026) | Leefii',
    description:
      'Calculate the true cost of cannabis products per gram, per mg of THC, and per dose. Compare against market averages.',
    url: 'https://leefii.com/tools/price-compare',
    siteName: 'Leefii',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/tools/price-compare' },
}

const faqItems = [
  {
    q: 'How is the cost per milligram of THC calculated?',
    a: 'We take the total price of the product and divide it by the total milligrams of THC it contains. For flower, THC percentage is converted to milligrams per gram (e.g., 20% THC flower contains 200 mg per gram). This gives you an apples-to-apples comparison across product types.',
  },
  {
    q: 'What counts as a standard cannabis dose?',
    a: 'A standard dose varies by product type and tolerance. For edibles, 5-10 mg of THC is considered a single dose. For flower, roughly 0.25 grams is one session for an average consumer. Concentrates are typically dosed in small dabs of around 0.05-0.1 grams. Our calculator uses these industry-standard estimates.',
  },
  {
    q: 'Why do cannabis prices vary so much between dispensaries?',
    a: 'Cannabis prices are influenced by state tax rates, local regulations, supply and demand, brand positioning, cultivation methods, and testing standards. Recreational products often carry higher taxes than medical products. Prices also vary by region, with mature markets like Colorado and Oregon generally offering lower prices than newer markets.',
  },
  {
    q: 'Are concentrates a better value than flower?',
    a: 'On a cost-per-milligram-of-THC basis, concentrates often offer better value because they contain 60-90% THC compared to 15-30% in flower. However, the upfront price is higher and concentrates require additional hardware. The best value depends on your consumption habits and tolerance level.',
  },
  {
    q: 'How can I find the best cannabis deals near me?',
    a: 'After using this calculator to understand fair pricing, visit our deals page to browse current dispensary promotions in your area. Many dispensaries offer first-time patient discounts, daily specials, and loyalty programs that can significantly reduce your overall costs.',
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
      name: 'Price Calculator',
      item: 'https://leefii.com/tools/price-compare',
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

export default function PriceComparePage() {
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
            <Link href="/tools/price-compare" className="hover:text-green-600">
              Tools
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Price Calculator</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cannabis Price Calculator
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Compare costs per gram, per milligram of THC, and per dose across
            every product type to find the best value
          </p>
        </div>
      </section>

      {/* Calculator */}
      <PriceCompare />

      {/* SEO Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Compare Cannabis Prices Like a Smart Shopper
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p>
              Understanding the true cost of cannabis goes well beyond the
              sticker price on a dispensary shelf. A gram of flower priced at
              twelve dollars and a hundred-milligram edible priced at twenty
              dollars may seem like entirely different products, yet both deliver
              THC to your system. The question every informed consumer should ask
              is how much am I paying per milligram of active cannabinoid and per
              individual dose. This calculator helps you answer that question
              with precision so you can stretch your budget without sacrificing
              quality.
            </p>
            <p>
              Dispensary pricing varies dramatically depending on your state,
              city, and even the day of the week. Tax structures play a major
              role as well. States like Oregon and Colorado have mature markets
              with competitive pricing, while newer markets in states like New
              York and New Jersey often carry higher price tags due to limited
              supply and steep regulatory costs. By calculating cost per
              milligram of THC, you create a universal metric that works across
              product types, brands, and dispensaries. A concentrate that costs
              fifty dollars per gram but contains eighty percent THC delivers far
              more value per milligram than a twenty-dollar eighth of flower
              testing at fifteen percent.
            </p>
            <p>
              Beyond raw cost, consider the efficiency of each consumption
              method. Vaporizing flower or concentrates delivers more
              cannabinoids per gram than combustion, which destroys a portion
              during the burning process. Edibles offer precise dosing and long
              duration but take longer to onset. Pre-rolls offer convenience but
              often carry a premium for the labor involved. Use this calculator
              to evaluate the options that fit your lifestyle and then head to
              our deals page to find dispensary promotions that bring the price
              down even further.
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
