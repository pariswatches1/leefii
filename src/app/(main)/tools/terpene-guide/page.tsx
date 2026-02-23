import { Metadata } from 'next'
import Link from 'next/link'
import TerpeneGuide from './TerpeneGuide'

export const metadata: Metadata = {
  title:
    'Cannabis Terpene Guide — Effects, Aromas & Strains (2026) | Leefii',
  description:
    'Explore the 8 most common cannabis terpenes and their effects. Learn about myrcene, limonene, caryophyllene, pinene, linalool, humulene, terpinolene, and ocimene — including aromas, benefits, and top strains.',
  openGraph: {
    title:
      'Cannabis Terpene Guide — Effects, Aromas & Strains (2026) | Leefii',
    description:
      'Learn about the 8 most common cannabis terpenes, their effects, aromas, and the strains that contain them.',
    url: 'https://leefii.com/tools/terpene-guide',
    siteName: 'Leefii',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://leefii.com/tools/terpene-guide' },
}

const faqItems = [
  {
    q: 'What are terpenes in cannabis?',
    a: 'Terpenes are aromatic compounds produced by the cannabis plant that give each strain its unique smell and flavor. They also influence the effects you feel, working alongside cannabinoids like THC and CBD in what researchers call the entourage effect. Over 200 terpenes have been identified in cannabis, though about 8 to 10 are most common.',
  },
  {
    q: 'Do terpenes get you high?',
    a: 'Terpenes themselves are not intoxicating in the way THC is, but they significantly influence how a cannabis high feels. For example, myrcene can enhance sedation while limonene may promote an uplifted mood. The interaction between terpenes and cannabinoids modulates the overall experience.',
  },
  {
    q: 'What is the entourage effect?',
    a: 'The entourage effect is the theory that cannabis compounds work better together than in isolation. Terpenes, cannabinoids, and flavonoids interact synergistically to produce effects that differ from what any single compound would deliver alone. This is why full-spectrum products often feel different from pure THC isolate.',
  },
  {
    q: 'Which terpene is best for anxiety?',
    a: 'Linalool and myrcene are most commonly associated with calming, anxiety-reducing effects. Linalool is the primary terpene found in lavender and has been studied for its anxiolytic properties. Caryophyllene also shows promise by interacting with CB2 receptors in the endocannabinoid system.',
  },
  {
    q: 'How do I choose a strain based on terpenes?',
    a: 'Start by identifying the effects you want. If you seek relaxation, look for strains high in myrcene or linalool. For energy and focus, try strains rich in pinene or terpinolene. Check the terpene profile on product labels at your dispensary or use our strain explorer to filter by dominant terpene.',
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
      name: 'Terpene Guide',
      item: 'https://leefii.com/tools/terpene-guide',
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

export default function TerpeneGuidePage() {
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
            <Link href="/tools/terpene-guide" className="hover:text-green-600">
              Tools
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Terpene Guide</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive Cannabis Terpene Guide
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Discover the aromatic compounds that shape how each cannabis strain
            smells, tastes, and feels
          </p>
        </div>
      </section>

      {/* Guide */}
      <TerpeneGuide />

      {/* SEO Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Cannabis Terpenes and Their Role in Your Experience
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p>
              Terpenes are the unsung heroes of the cannabis plant. While THC
              and CBD receive most of the attention, terpenes are responsible
              for the distinctive aromas and flavors that differentiate one
              strain from another. More importantly, a growing body of research
              suggests that terpenes actively influence the therapeutic and
              psychoactive effects of cannabis through a mechanism known as the
              entourage effect. This means that choosing a strain based solely
              on THC percentage misses a critical part of the picture.
            </p>
            <p>
              Every cannabis cultivar produces a unique terpene profile shaped
              by genetics, growing conditions, and harvest timing. A strain
              dominant in myrcene will lean toward sedation and full-body
              relaxation, while one rich in limonene tends to deliver a
              brighter, more energized experience. Caryophyllene stands out as
              the only terpene known to directly interact with the
              endocannabinoid system by binding to CB2 receptors, giving it
              notable anti-inflammatory properties. Pinene supports alertness
              and memory retention, making it a favorite for daytime consumers
              who want to stay sharp.
            </p>
            <p>
              Learning to read terpene profiles empowers you to make informed
              purchasing decisions rather than relying on indica-versus-sativa
              labels, which modern research shows are less predictive of
              effects than terpene composition. Many dispensaries now print
              terpene lab results on their product labels, and platforms like
              Leefii let you filter strains by dominant terpene so you can find
              exactly the experience you are looking for. Use the interactive
              guide above to explore each terpene, compare them side by side,
              and discover strains that match your ideal profile.
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
