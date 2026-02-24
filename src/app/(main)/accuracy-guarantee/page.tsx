import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accuracy Guarantee — Report It, We Fix It in 24 Hours | Leefii',
  description: 'Leefii guarantees dispensary information accuracy. If any listing is wrong, report it and our team will fix it within 24 hours. No other cannabis directory makes this promise.',
  keywords: ['dispensary accuracy guarantee', 'cannabis directory accuracy', 'leefii guarantee', 'dispensary information accuracy'],
  openGraph: {
    title: 'Accuracy Guarantee — Report It, We Fix It in 24 Hours | Leefii',
    description: 'If any dispensary info is wrong, report it and we fix it within 24 hours.',
    url: 'https://leefii.com/accuracy-guarantee',
    siteName: 'Leefii',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accuracy Guarantee — Report It, We Fix It in 24 Hours | Leefii',
    description: 'If any dispensary info is wrong, report it and we fix it within 24 hours.',
  },
  alternates: { canonical: 'https://leefii.com/accuracy-guarantee' },
}

export default function AccuracyGuaranteePage() {
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
        name: 'Accuracy Guarantee',
        item: 'https://leefii.com/accuracy-guarantee',
      },
    ],
  }

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Leefii Accuracy Guarantee',
    description: 'Leefii guarantees dispensary information accuracy. If any listing is wrong, report it and our team will fix it within 24 hours. No other cannabis directory makes this promise.',
    url: 'https://leefii.com/accuracy-guarantee',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b">
        <nav className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Accuracy Guarantee</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Accuracy Guarantee</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            If any dispensary information on Leefii is wrong, report it and we will fix it within 24 hours. No other cannabis directory makes this promise.
          </p>
        </div>
      </div>

      {/* The Promise */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-7xl font-bold text-green-600">24</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">Hours</div>
          <p className="text-gray-600 mt-3 text-lg">That&apos;s our promise. Report it, we fix it.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* Report It */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h3V6.5l7-3.5 8 4v12h3V3L14 0 3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8 4m0 0v14" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report It</h3>
            <p className="text-gray-600 text-sm">
              Click &apos;See something wrong?&apos; on any dispensary page and tell us what&apos;s incorrect.
            </p>
          </div>

          {/* We Investigate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">We Investigate</h3>
            <p className="text-gray-600 text-sm">
              Our team contacts the dispensary directly to verify the reported issue.
            </p>
          </div>

          {/* Fixed in 24 Hours */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fixed in 24 Hours</h3>
            <p className="text-gray-600 text-sm">
              The listing is updated with accurate information and re-verified.
            </p>
          </div>
        </div>
      </div>

      {/* How to Report */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How to Report an Inaccuracy</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find the Listing</h3>
              <p className="text-gray-600 text-sm">Visit any dispensary page on Leefii</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Click Report</h3>
              <p className="text-gray-600 text-sm">Click the &apos;See something wrong?&apos; button or &apos;Report an issue&apos; link</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Handle It</h3>
              <p className="text-gray-600 text-sm">Select the category, describe the issue, and submit. We do the rest.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Matters</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
          <p>
            Most cannabis directories let dispensary data go stale. Hours change, phone numbers get disconnected, locations move — and nobody updates the listing. Patients drive across town only to find a closed door.
          </p>
          <p>
            Leefii is the only cannabis directory with a public accuracy guarantee. We back our listings with a 24-hour fix commitment because we believe you deserve information you can trust.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Accurate Dispensary Info?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dispensaries"
              className="bg-green-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-green-700 transition-colors"
            >
              Find a Dispensary
            </Link>
            <Link
              href="/how-we-verify"
              className="border border-white text-white rounded-lg px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
            >
              See Our Full Verification Process
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
