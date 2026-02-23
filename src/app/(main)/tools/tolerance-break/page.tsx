import { Metadata } from 'next'
import Link from 'next/link'
import ToleranceBreak from './ToleranceBreak'

export const metadata: Metadata = {
  title:
    'Tolerance Break Calculator — How Long Should Your T-Break Be? (2026) | Leefii',
  description:
    'Calculate how long your cannabis tolerance break should be based on your usage frequency, duration, and consumption method. See a week-by-week CB1 receptor recovery timeline and tips to make your T-break easier.',
  openGraph: {
    title:
      'Tolerance Break Calculator — How Long Should Your T-Break Be? (2026) | Leefii',
    description:
      'Calculate the ideal T-break duration based on your usage habits. See a CB1 receptor recovery timeline.',
    url: 'https://leefii.com/tools/tolerance-break',
    siteName: 'Leefii',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/tools/tolerance-break' },
}

const faqItems = [
  {
    q: 'What happens to your body during a tolerance break?',
    a: 'When you stop consuming cannabis, your CB1 receptors begin to upregulate, or return to their normal density and sensitivity. Within 48 hours, the recovery process starts. After about two weeks, studies show significant receptor recovery in most brain regions. Heavy, long-term users may take three to four weeks to reach baseline levels.',
  },
  {
    q: 'Will I experience withdrawal symptoms during a T-break?',
    a: 'Some regular users experience mild withdrawal symptoms including difficulty sleeping, irritability, decreased appetite, vivid dreams, and mild anxiety. These symptoms typically peak during the first three days and improve significantly by the end of the first week. Staying hydrated, exercising, and maintaining a consistent sleep schedule can help manage these effects.',
  },
  {
    q: 'Can I use CBD during a tolerance break?',
    a: 'Yes, CBD does not activate CB1 receptors the same way THC does, so it should not interfere with your tolerance reset. Some people find CBD helpful for managing mild withdrawal symptoms like anxiety or difficulty sleeping during the first few days of a break. However, avoid full-spectrum products that contain trace amounts of THC.',
  },
  {
    q: 'How often should I take a tolerance break?',
    a: 'The ideal frequency depends on your consumption habits. Daily users may benefit from a two to four week break every three to six months. Moderate users might find a one to two week break twice a year sufficient. Pay attention to how your body responds — if you notice diminishing effects, increasing dosages, or less enjoyment, it may be time for a break.',
  },
  {
    q: 'What should I do on my first session after a tolerance break?',
    a: 'Start with a significantly lower dose than what you were using before the break. Your CB1 receptors have reset, so your sensitivity to THC will be much higher. A dose that previously felt mild could now feel quite strong. Begin with one small hit or a low-dose edible of five milligrams or less, wait at least fifteen minutes, and increase slowly if needed.',
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
      name: 'Tolerance Break Calculator',
      item: 'https://leefii.com/tools/tolerance-break',
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

export default function ToleranceBreakPage() {
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
              href="/tools/tolerance-break"
              className="hover:text-green-600"
            >
              Tools
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">
            Tolerance Break Calculator
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tolerance Break Calculator
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Find out exactly how long your T-break should be based on your
            habits, and get a week-by-week recovery timeline
          </p>
        </div>
      </section>

      {/* Calculator */}
      <ToleranceBreak />

      {/* SEO Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The Science Behind Cannabis Tolerance Breaks
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p>
              Cannabis tolerance develops when repeated exposure to THC causes
              your CB1 cannabinoid receptors to downregulate. In simple terms,
              the receptors become less abundant and less sensitive over time,
              which means you need more cannabis to achieve the same effect.
              This process is well documented in neuroscience research and
              affects virtually every regular consumer to some degree. A
              tolerance break, often called a T-break, gives your endocannabinoid
              system time to reset by allowing CB1 receptors to return to their
              normal density and responsiveness.
            </p>
            <p>
              The speed and completeness of receptor recovery depend on several
              factors including how frequently you consume, how long you have
              been consuming, the potency of the products you use, and your
              individual metabolism. Studies using PET brain imaging have shown
              that CB1 receptor availability begins increasing within the first
              forty-eight hours of abstinence and reaches near-normal levels
              after approximately four weeks in heavy daily users. For lighter
              or more moderate consumers, significant recovery can occur in as
              little as one to two weeks.
            </p>
            <p>
              Our tolerance break calculator uses these research-backed
              timelines to give you a personalized recommendation. It factors
              in your usage frequency, how long you have been consuming,
              your preferred consumption method, and your current subjective
              tolerance level to estimate the optimal break duration. The
              week-by-week timeline shows what to expect at each stage of
              recovery, including the initial adjustment period, the peak of
              receptor upregulation, and the point where your system has
              substantially reset. Follow the tips provided to make your break
              as comfortable and effective as possible.
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
