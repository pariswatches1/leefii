import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400

const title = 'Leefii Verified Dispensary Badges \u2014 Free Embeddable Trust Badges | Leefii'
const description = 'Get a free Leefii Verified badge for your dispensary website. Boost customer trust, earn a dofollow backlink, and stand out from the competition. Four badge types available for qualifying dispensaries.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/badges', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/badges' },
}

const badgeTypes = [
  {
    id: 'verified-dispensary',
    name: 'Leefii Verified Dispensary',
    color: 'Green',
    colorClass: 'bg-green-50 border-green-200',
    tagClass: 'bg-green-100 text-green-800',
    svg: '/badges/verified-dispensary-md.svg',
    description: 'Awarded to any dispensary that has been verified by the Leefii team. This badge signals to your customers that your business is licensed, legitimate, and actively managed. Verification includes confirming your license number, address, and contact information.',
  },
  {
    id: 'top-rated',
    name: 'Top Rated on Leefii 2026',
    color: 'Gold',
    colorClass: 'bg-yellow-50 border-yellow-200',
    tagClass: 'bg-yellow-100 text-yellow-800',
    svg: '/badges/top-rated-md.svg',
    description: 'Reserved for dispensaries with a 4.5-star rating or higher on Leefii. This badge tells visitors that real customers consistently rate your dispensary among the best. Maintain your high rating to keep this prestigious badge.',
  },
  {
    id: 'verified-delivery',
    name: 'Leefii Verified Delivery',
    color: 'Green',
    colorClass: 'bg-green-50 border-green-200',
    tagClass: 'bg-green-100 text-green-800',
    svg: '/badges/verified-delivery-md.svg',
    description: 'Displayed by dispensaries with a confirmed delivery service. Customers searching for delivery options will instantly recognize your dispensary offers this convenience. Delivery verification is confirmed through our team\'s review process.',
  },
  {
    id: 'city-choice',
    name: "Leefii's Choice 2026",
    color: 'Purple',
    colorClass: 'bg-purple-50 border-purple-200',
    tagClass: 'bg-purple-100 text-purple-800',
    svg: '/badges/city-choice-md.svg',
    description: 'The most exclusive badge on Leefii, awarded to the top dispensary in each city. Only one dispensary per city earns this distinction, determined by the highest verified rating. This badge is a powerful differentiator in competitive local markets.',
  },
]

const steps = [
  {
    step: 1,
    title: 'Claim Your Listing',
    description: 'Sign up on Leefii and claim your dispensary listing. Our team will verify your license, address, and business details within 48 hours.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Get Your Badge Code',
    description: 'Once verified, visit your badge page to see which badges you qualify for. Copy the embed code for your preferred badge size and format.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Embed on Your Website',
    description: 'Paste the embed code into your website HTML, WordPress widget, or Shopify theme. The badge links back to your Leefii profile for maximum trust.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
]

const benefits = [
  {
    title: 'Build Trust',
    description: 'A verified badge from an independent platform tells customers your dispensary is legitimate, licensed, and reviewed by real people. Trust badges increase conversion rates by up to 42%.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Boost SEO',
    description: 'Every Leefii badge includes a dofollow backlink to your dispensary profile on Leefii. Backlinks from trusted domains improve your search engine rankings and drive organic traffic to your site.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Stand Out',
    description: 'In a crowded market, badges differentiate your dispensary. A Top Rated or City\'s Choice badge instantly communicates quality to visitors who may be comparing multiple dispensaries in your area.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: 'Free Forever',
    description: 'Leefii badges are completely free for all verified dispensaries. There are no monthly fees, no premium tiers, and no hidden costs. We believe every legitimate dispensary deserves a trust signal.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const faqs = [
  {
    question: 'Are Leefii dispensary badges really free?',
    answer: 'Yes, all four badge types are completely free for qualifying dispensaries. There are no setup fees, monthly charges, or premium tiers. We offer badges as a service to the cannabis community to help build trust between dispensaries and their customers. The only requirement is that your dispensary meets the qualification criteria for each badge type.',
  },
  {
    question: 'How do I qualify for a Leefii badge?',
    answer: 'Each badge has different qualification criteria. The Verified Dispensary badge requires completing our verification process, which confirms your license, address, and contact information. The Top Rated badge requires maintaining a 4.5+ star rating on Leefii. The Verified Delivery badge requires a confirmed delivery service. The City\'s Choice badge is awarded to the highest-rated verified dispensary in each city.',
  },
  {
    question: 'Does adding a Leefii badge affect my SEO?',
    answer: 'Yes, positively. Each badge embed code includes a dofollow backlink to your Leefii dispensary profile. Backlinks from trusted, relevant domains are a key ranking factor in search engine algorithms. Additionally, the badge itself adds trust signals to your website, which can improve engagement metrics like time on site and reduce bounce rate \u2014 both indirect SEO factors.',
  },
  {
    question: 'Who can use Leefii badges?',
    answer: 'Any licensed cannabis dispensary that has been verified on Leefii can use our badges. Both medical and recreational dispensaries are eligible. The dispensary must be currently active and in good standing. If your verification is revoked for any reason, you should remove the badge from your website.',
  },
  {
    question: 'How do I embed a Leefii badge on my website?',
    answer: 'After qualifying for a badge, visit your dispensary\'s badge page on Leefii to get your unique embed code. We provide ready-to-use code snippets for HTML websites, WordPress, and Shopify. Simply copy the code and paste it into your website\'s HTML, a WordPress custom HTML widget, or your Shopify theme. The badge will display automatically and link back to your Leefii profile.',
  },
]

export default async function BadgesPage() {
  const [verifiedCount, totalCount] = await Promise.all([
    prisma.dispensary.count({ where: { isVerified: true, isActive: true } }),
    prisma.dispensary.count({ where: { isActive: true } }),
  ])

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Badges', item: 'https://leefii.com/badges' },
    ],
  }

  const faqSchema = {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <nav className="flex items-center space-x-2 text-sm text-green-200 mb-8">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">Badges</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Leefii Verified Badges
            </h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Show your customers they can trust you. Embed a free Leefii badge on your website to build credibility, earn a dofollow backlink, and stand out from the competition.
            </p>
          </div>
        </section>

        {/* Stats Row */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">{verifiedCount.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">Verified Dispensaries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalCount.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">Total Dispensaries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">4</div>
                <div className="text-sm text-gray-500 mt-1">Badge Types Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Badge Showcase */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Four Badge Types for Your Dispensary
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Each badge represents a different achievement. Qualify for multiple badges and let your customers see exactly what makes your dispensary special.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {badgeTypes.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-white rounded-xl shadow-sm border p-8 ${badge.colorClass}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={badge.svg}
                        alt={badge.name}
                        width={180}
                        height={60}
                        className="rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{badge.name}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badge.tagClass}`}>
                        {badge.color}
                      </span>
                      <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-green-600 mb-2">Step {step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Add a Badge */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Add a Leefii Badge?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Your Badge?</h2>
            <p className="text-green-100 max-w-xl mx-auto mb-8">
              Claim your dispensary listing on Leefii and start displaying verified badges on your website today. It takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sell"
                className="bg-white text-green-700 hover:bg-green-50 rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                Claim Your Listing
              </Link>
              <Link
                href="/badges/all"
                className="bg-green-500 hover:bg-green-400 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                View All Verified Dispensaries
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dispensary Badge Programs: Building Trust in the Cannabis Industry
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>
                In the rapidly growing cannabis industry, trust is one of the most valuable currencies a dispensary can hold. With thousands of new dispensaries opening across the United States each year, customers face an overwhelming number of choices. Badge programs like Leefii Verified provide an independent, third-party signal that helps consumers make confident purchasing decisions. When a customer sees a verified badge on your website, they know that an impartial organization has confirmed your legitimacy, reviewed your licensing, and validated your business operations.
              </p>
              <p>
                Trust badges are not new to e-commerce. Major platforms like Amazon, eBay, and Shopify have long used verification badges to signal seller quality. Studies consistently show that trust badges increase conversion rates significantly, with some research indicating improvements of 30 to 42 percent. For cannabis dispensaries, where regulatory complexity and stigma can make consumers hesitant, these trust signals are even more impactful. A Leefii Verified badge communicates not only that your dispensary is real, but that it meets the operational standards expected by a national cannabis directory.
              </p>
              <p>
                Beyond trust, Leefii badges provide a tangible SEO benefit. Each badge embed code includes a dofollow backlink pointing to your dispensary profile on Leefii.com. Backlinks from relevant, authoritative domains are a core ranking factor in Google's algorithm. By embedding a Leefii badge, you are adding a high-quality, contextually relevant link to your site's backlink profile. Over time, this can contribute to improved rankings for local search terms like "dispensary near me" or your city-specific keywords. Combined with the improved user engagement metrics that come from displaying trust signals, a Leefii badge is one of the simplest and most effective SEO actions a dispensary can take.
              </p>
              <p>
                The Leefii badge program currently offers four distinct badge types, each recognizing a different aspect of dispensary quality. The Verified Dispensary badge is available to all dispensaries that complete our verification process. The Top Rated badge recognizes dispensaries with a rating of 4.5 stars or higher. The Verified Delivery badge highlights dispensaries with confirmed delivery services. And the Leefii's Choice badge is the most exclusive, awarded only to the single highest-rated dispensary in each city. Together, these badges create a comprehensive trust framework that rewards quality across multiple dimensions.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
