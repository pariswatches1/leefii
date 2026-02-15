import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Leefii | Cannabis Dispensary Directory',
  description: 'Leefii is the leading cannabis dispensary directory with 6,891+ dispensaries, 5,632+ strains, and 650+ doctors across 51 states. A modern alternative to Leafly and Weedmaps.',
  alternates: { canonical: 'https://leefii.com/about' },
}

export default function AboutPage() {
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Leefii',
    url: 'https://leefii.com',
    logo: 'https://leefii.com/icon.svg',
    description: 'Leefii is a comprehensive cannabis dispensary directory helping users find licensed dispensaries, strains, doctors, and products across all 51 US states. A modern alternative to Leafly and Weedmaps.',
    foundingDate: '2024',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://leefii.com/contact',
    },
    knowsAbout: [
      'Cannabis dispensaries',
      'Cannabis strains',
      'Medical marijuana doctors',
      'Cannabis delivery services',
      'Cannabis deals and discounts',
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Leefii?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Leefii is a comprehensive cannabis dispensary directory with 6,891+ licensed dispensaries, 5,632+ cannabis strains, and 650+ medical marijuana doctors across 51 US states. It helps users find dispensaries, compare strains, locate delivery services, and connect with MMJ doctors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many dispensaries does Leefii list?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Leefii lists over 6,891 licensed cannabis dispensaries across 51 US states and territories. Each listing includes verified business hours, ratings, reviews, delivery options, and contact information.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Leefii free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Leefii is completely free for consumers. You can search dispensaries, browse strains, find doctors, and view deals without creating an account or paying any fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Leefii different from Leafly and Weedmaps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Leefii offers a cleaner, faster experience with comprehensive dispensary coverage across all 51 states. Features include an AI-powered strain quiz, cannabis delivery finder, medical marijuana doctor directory, and no paywall for basic information.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Leefii collect its data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Leefii aggregates data from public business registrations, state licensing databases, user submissions, and direct partnerships with dispensaries. All listings are verified for active licensing. Data is updated regularly to ensure accuracy of hours, contact info, and availability.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I find a medical marijuana doctor on Leefii?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Leefii lists over 650 medical marijuana doctors across multiple states. You can find licensed physicians for cannabis recommendations, compare reviews, and book telehealth or in-person consultations.',
        },
      },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">About Leefii</h1>
          <p className="text-green-100 text-lg">
            Your trusted guide to finding the best cannabis dispensaries, strains, and doctors across the United States.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At Leefii, we believe everyone deserves access to accurate, up-to-date information about licensed cannabis dispensaries. Our mission is to connect consumers with trusted, legal dispensaries while providing comprehensive strain information to help you make informed decisions. Leefii is a modern alternative to Leafly and Weedmaps, built for speed, accuracy, and ease of use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Leefii by the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">6,891+</div>
                <div className="text-sm text-gray-600 mt-1">Dispensaries</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">5,632+</div>
                <div className="text-sm text-gray-600 mt-1">Strains</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">650+</div>
                <div className="text-sm text-gray-600 mt-1">Doctors</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">51</div>
                <div className="text-sm text-gray-600 mt-1">States</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🏪</div>
                <h3 className="font-semibold text-gray-900 mb-2">Dispensary Directory</h3>
                <p className="text-gray-600 text-sm">
                  Browse 6,891+ licensed dispensaries across 51 states with real-time hours, contact information, and customer reviews.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="font-semibold text-gray-900 mb-2">Strain Database</h3>
                <p className="text-gray-600 text-sm">
                  Explore 5,632+ cannabis strains with detailed information on effects, THC/CBD content, terpene profiles, and user ratings.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">👨‍⚕️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Doctor Finder</h3>
                <p className="text-gray-600 text-sm">
                  Connect with 650+ medical marijuana doctors for consultations, MMJ card evaluations, and telehealth appointments.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🚗</div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Finder</h3>
                <p className="text-gray-600 text-sm">
                  Find dispensaries that deliver cannabis to your location. Browse by state and city to find delivery options near you.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Strain Quiz</h3>
                <p className="text-gray-600 text-sm">
                  Take our AI-powered strain quiz to get personalized recommendations based on your desired effects, flavors, and experience level.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Deals & Specials</h3>
                <p className="text-gray-600 text-sm">
                  Find the best cannabis deals and discounts from dispensaries in your area, including daily specials and first-time patient offers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Collect Our Data</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Leefii aggregates data from multiple verified sources to ensure accuracy and completeness:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>State licensing databases:</strong> We cross-reference active cannabis business licenses from state regulatory agencies to verify every dispensary listing.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Public business registrations:</strong> Business hours, addresses, and contact information are sourced from verified public records.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Direct partnerships:</strong> Many dispensaries directly update their profiles on Leefii, ensuring real-time accuracy for hours, menus, and deals.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>User reviews:</strong> Customer ratings and reviews provide community-driven quality signals for each listing.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Regular updates:</strong> Data is refreshed regularly to maintain accuracy of operating hours, availability, and contact details.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>Accuracy:</strong> We verify dispensary information regularly to ensure you have the most current details.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>Legal Compliance:</strong> We only list licensed, legally operating dispensaries.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>User Privacy:</strong> Your privacy matters. We never sell your personal information.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span><strong>Education:</strong> We promote responsible cannabis use through accurate information and resources.</span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <details className="bg-gray-50 rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">What is Leefii?</summary>
                <p className="px-4 pb-4 text-gray-600">Leefii is a comprehensive cannabis dispensary directory with 6,891+ licensed dispensaries, 5,632+ cannabis strains, and 650+ medical marijuana doctors across 51 US states. It helps users find dispensaries, compare strains, locate delivery services, and connect with MMJ doctors.</p>
              </details>
              <details className="bg-gray-50 rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">Is Leefii free to use?</summary>
                <p className="px-4 pb-4 text-gray-600">Yes, Leefii is completely free for consumers. You can search dispensaries, browse strains, find doctors, and view deals without creating an account or paying any fees.</p>
              </details>
              <details className="bg-gray-50 rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">How is Leefii different from Leafly and Weedmaps?</summary>
                <p className="px-4 pb-4 text-gray-600">Leefii offers a cleaner, faster experience with comprehensive dispensary coverage across all 51 states. Features include an AI-powered strain quiz, cannabis delivery finder, medical marijuana doctor directory, and no paywall for basic information.</p>
              </details>
              <details className="bg-gray-50 rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">How does Leefii collect its data?</summary>
                <p className="px-4 pb-4 text-gray-600">Leefii aggregates data from public business registrations, state licensing databases, user submissions, and direct partnerships with dispensaries. All listings are verified for active licensing and updated regularly.</p>
              </details>
              <details className="bg-gray-50 rounded-xl border">
                <summary className="p-4 font-semibold text-gray-900 cursor-pointer hover:text-green-700">Can I find a medical marijuana doctor on Leefii?</summary>
                <p className="px-4 pb-4 text-gray-600">Yes, Leefii lists over 650 medical marijuana doctors across multiple states. You can find licensed physicians for cannabis recommendations, compare reviews, and book telehealth or in-person consultations.</p>
              </details>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Have questions, feedback, or want to partner with us? We&apos;d love to hear from you.
              Visit our <Link href="/contact" className="text-green-600 hover:underline">contact page</Link> to get in touch.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
