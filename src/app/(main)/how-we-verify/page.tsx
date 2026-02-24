import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How Leefii Verifies Dispensary Menus — Accuracy You Can Trust',
  description: 'Leefii manually verifies dispensary hours, menus, and contact info. See our verification process and why accuracy matters when choosing a cannabis directory.',
  keywords: ['dispensary verification', 'cannabis menu accuracy', 'leefii verification process', 'accurate dispensary listings', 'reliable cannabis directory'],
  openGraph: {
    title: 'How Leefii Verifies Dispensary Menus — Accuracy You Can Trust',
    description: 'Learn how Leefii verifies dispensary hours, menus, and contact info for accuracy you can trust.',
    url: 'https://leefii.com/how-we-verify',
    siteName: 'Leefii',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Leefii Verifies Dispensary Menus — Accuracy You Can Trust',
    description: 'Learn how Leefii verifies dispensary hours, menus, and contact info for accuracy you can trust.',
  },
  alternates: { canonical: 'https://leefii.com/how-we-verify' },
}

export default function HowWeVerifyPage() {
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
        name: 'How We Verify',
        item: 'https://leefii.com/how-we-verify',
      },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How often does Leefii verify dispensary information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Leefii verifies dispensary information on a rolling schedule. High-traffic dispensaries are checked weekly, while all listings are reviewed at least monthly. When users report inaccuracies, we re-verify within 24 hours. Every listing displays a \'Last Verified\' timestamp so you always know how current the information is.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is it free for dispensaries to be listed on Leefii?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, being listed on Leefii is completely free. Unlike other platforms that charge $500 to $30,000 per month, Leefii provides free listings with verification badges at no cost. Dispensaries can claim their listing and manage their information without any fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I report wrong information about a dispensary?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On any dispensary page, click the \'See something wrong?\' button at the bottom right of the screen, or click \'Report an issue\' next to the hours, address, or phone number. Select what\'s incorrect, describe the issue, and submit. Our team will investigate and fix it within 24 hours.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does the \'Verified\' badge mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Verified badge means our team has independently confirmed the dispensary\'s hours, address, phone number, and menu availability. Green means verified within 24 hours, amber within the past week, and orange within the past month. Gray means the listing hasn\'t been verified yet.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Leefii different from Weedmaps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Leefii offers free listings for all dispensaries, visible verification timestamps, a 24-hour accuracy guarantee, and community-powered inaccuracy reporting. Weedmaps charges dispensaries $500 to $30,000 per month for premium placement and does not show when information was last verified.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can dispensaries update their own listing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Dispensaries can claim their listing on Leefii for free and update their hours, contact information, and menu details in real time. Claimed listings receive a \'Claimed by owner\' badge, and updates are reflected immediately.',
        },
      },
    ],
  }

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Leefii Verifies Dispensary Information',
    description: 'Our 5-step process ensures dispensary hours, menus, and contact info are accurate and up-to-date.',
    totalTime: 'PT24H',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Direct Dispensary Contact',
        text: 'We contact every dispensary directly by phone, email, or in-person visit to confirm their information is accurate and up-to-date.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Verify Hours, Address & Phone',
        text: 'We confirm business hours, street address, phone number, and menu availability. Every detail is cross-checked against state licensing databases.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Timestamp Every Verification',
        text: 'Every listing shows exactly when it was last verified. Green means today, amber means this week, orange means this month. No guessing.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Community Reporting',
        text: 'Users can report inaccuracies directly from any dispensary page. Every report triggers a re-verification within 24 hours.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Dispensary Self-Service',
        text: 'Dispensaries can claim their free listing and update their own information instantly. Claimed listings get a verified owner badge.',
      },
    ],
  }

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How Leefii Verifies Dispensary Menus — Accuracy You Can Trust',
    description: 'Leefii manually verifies dispensary hours, menus, and contact info. See our verification process and why accuracy matters when choosing a cannabis directory.',
    url: 'https://leefii.com/how-we-verify',
    dateModified: '2026-02-24',
    publisher: {
      '@type': 'Organization',
      name: 'Leefii',
      url: 'https://leefii.com',
    },
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">How We Verify</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">How We Verify Every Dispensary on Leefii</h1>
          <p className="text-green-100 text-lg">
            Every listing is checked against official sources, confirmed by our team, and monitored by the community. Here is exactly how we do it.
          </p>
        </div>
      </div>

      {/* Section 1: Why Accuracy Matters */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Accuracy Matters</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          You drive 20 minutes to a dispensary only to find it closed because the hours listed online were wrong. You browse a menu, find the exact strain you need, drive across town, and the budtender tells you it sold out three days ago. You call the phone number on the listing and get a disconnected line. You compare prices online, make a decision, and the in-store price is completely different. These are not minor inconveniences. For medical patients who depend on specific products for pain management, anxiety relief, or sleep, inaccurate dispensary information can mean wasted trips, wasted money, and delayed treatment. For recreational users, it erodes trust in every cannabis platform. Most cannabis directories treat verification as an afterthought. Listings go months without updates. Hours change for holidays and nobody fixes them. Menus display products that haven&apos;t been in stock for weeks. Leefii exists because we believe you deserve better. Your time matters. Your money matters. Your health matters. That is why we verify every listing, and that is why we show you exactly when it was last checked.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600">24 Hours</div>
            <div className="text-sm text-gray-600 mt-1">Our fix SLA for reported inaccuracies</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600">6,891+</div>
            <div className="text-sm text-gray-600 mt-1">Licensed dispensaries monitored</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600">Community</div>
            <div className="text-sm text-gray-600 mt-1">Users help keep listings accurate</div>
          </div>
        </div>
      </div>

      {/* Section 2: Our Verification Process */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our 5-Step Verification Process</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Dispensary Contact</h3>
                <p className="text-gray-600 leading-relaxed">We contact every dispensary directly by phone, email, or in-person visit to confirm their information is accurate and up-to-date.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Hours, Address &amp; Phone</h3>
                <p className="text-gray-600 leading-relaxed">We confirm business hours, street address, phone number, and menu availability. Every detail is cross-checked against state licensing databases.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Timestamp Every Verification</h3>
                <p className="text-gray-600 leading-relaxed">Every listing shows exactly when it was last verified. Green means today, amber means this week, orange means this month. No guessing.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Reporting</h3>
                <p className="text-gray-600 leading-relaxed">Users can report inaccuracies directly from any dispensary page. Every report triggers a re-verification within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">5</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dispensary Self-Service</h3>
                <p className="text-gray-600 leading-relaxed">Dispensaries can claim their free listing and update their own information instantly. Claimed listings get a verified owner badge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: How We Compare */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Leefii Compares</h2>
        <p className="text-gray-600 mb-8">See how our verification standards stack up against other cannabis directories.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Leefii</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Weedmaps</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Leafly</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">Free listings</td>
                <td className="py-4 px-4 text-green-600 font-semibold">Always free</td>
                <td className="py-4 px-4 text-gray-500">$500&ndash;$30K/mo</td>
                <td className="py-4 px-4 text-gray-500">$600&ndash;$4K/mo</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">Verification timestamps</td>
                <td className="py-4 px-4 text-green-600 font-semibold">Visible on every listing</td>
                <td className="py-4 px-4 text-gray-500">None</td>
                <td className="py-4 px-4 text-gray-500">None</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">Menu accuracy guarantee</td>
                <td className="py-4 px-4 text-green-600 font-semibold">24hr fix SLA</td>
                <td className="py-4 px-4 text-gray-500">POS lag</td>
                <td className="py-4 px-4 text-gray-500">No guarantee</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">User inaccuracy reports</td>
                <td className="py-4 px-4 text-green-600 font-semibold">Yes</td>
                <td className="py-4 px-4 text-gray-500">No</td>
                <td className="py-4 px-4 text-gray-500">No</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">Verified purchase reviews</td>
                <td className="py-4 px-4 text-green-600 font-semibold">Coming soon</td>
                <td className="py-4 px-4 text-gray-500">Fake review issues</td>
                <td className="py-4 px-4 text-gray-500">No</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">AI strain recommendations</td>
                <td className="py-4 px-4 text-green-600 font-semibold">AI-powered quiz</td>
                <td className="py-4 px-4 text-gray-500">None</td>
                <td className="py-4 px-4 text-gray-500">None</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-900 font-medium">Licensed dispensaries only</td>
                <td className="py-4 px-4 text-green-600 font-semibold">Yes</td>
                <td className="py-4 px-4 text-gray-500">Lawsuit history</td>
                <td className="py-4 px-4 text-green-600 font-semibold">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: For Dispensaries CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Own a Dispensary? Claim Your Free Listing</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Zero cost. Zero POS integration required. We call you, confirm your info, and your listing shows a green Verified badge to every customer searching for a dispensary near them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sell" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Claim Your Listing
            </Link>
            <Link href="/badges" className="inline-block border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Learn About Badges
            </Link>
          </div>
        </div>
      </div>

      {/* Section 5: FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
              How often does Leefii verify dispensary information?
            </summary>
            <div className="px-6 pb-4 text-gray-600">
              Leefii verifies dispensary information on a rolling schedule. High-traffic dispensaries are checked weekly, while all listings are reviewed at least monthly. When users report inaccuracies, we re-verify within 24 hours. Every listing displays a &quot;Last Verified&quot; timestamp so you always know how current the information is.
            </div>
          </details>
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
              Is it free for dispensaries to be listed on Leefii?
            </summary>
            <div className="px-6 pb-4 text-gray-600">
              Yes, being listed on Leefii is completely free. Unlike other platforms that charge $500 to $30,000 per month, Leefii provides free listings with verification badges at no cost. Dispensaries can claim their listing and manage their information without any fees.
            </div>
          </details>
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
              How do I report wrong information about a dispensary?
            </summary>
            <div className="px-6 pb-4 text-gray-600">
              On any dispensary page, click the &quot;See something wrong?&quot; button at the bottom right of the screen, or click &quot;Report an issue&quot; next to the hours, address, or phone number. Select what&apos;s incorrect, describe the issue, and submit. Our team will investigate and fix it within 24 hours.
            </div>
          </details>
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
              What does the &quot;Verified&quot; badge mean?
            </summary>
            <div className="px-6 pb-4 text-gray-600">
              The Verified badge means our team has independently confirmed the dispensary&apos;s hours, address, phone number, and menu availability. Green means verified within 24 hours, amber within the past week, and orange within the past month. Gray means the listing hasn&apos;t been verified yet.
            </div>
          </details>
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
              How is Leefii different from Weedmaps?
            </summary>
            <div className="px-6 pb-4 text-gray-600">
              Leefii offers free listings for all dispensaries, visible verification timestamps, a 24-hour accuracy guarantee, and community-powered inaccuracy reporting. Weedmaps charges dispensaries $500 to $30,000 per month for premium placement and does not show when information was last verified.
            </div>
          </details>
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
              Can dispensaries update their own listing?
            </summary>
            <div className="px-6 pb-4 text-gray-600">
              Yes. Dispensaries can claim their listing on Leefii for free and update their hours, contact information, and menu details in real time. Claimed listings receive a &quot;Claimed by owner&quot; badge, and updates are reflected immediately.
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
