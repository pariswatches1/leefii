import { Metadata } from 'next'
import Link from 'next/link'
import ApiKeyForm from './ApiKeyForm'

const title = 'Get Your Free API Key \u2014 Leefii Cannabis Data API | Leefii'
const description =
  'Sign up for a free Leefii API key and start building with cannabis strain, dispensary, and deal data. 100 requests per hour at no cost. Instant setup with no credit card required.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/api-docs/keys', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/api-docs/keys' },
}

export default function ApiKeysPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'API Documentation', item: 'https://leefii.com/api-docs' },
      { '@type': 'ListItem', position: 3, name: 'API Keys' },
    ],
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span>/</span>
            <Link href="/api-docs" className="hover:text-green-700">API Docs</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">API Keys</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Get Your API Key</h1>
          <p className="text-lg text-green-100 max-w-xl mx-auto">
            Sign up in seconds and start building with cannabis data. No credit card required.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Your Free Account</h2>
            <ApiKeyForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You Get */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What You Get</h3>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Access to all 8 API endpoints
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 requests per hour
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5,600+ strains with full data
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  6,800+ dispensary listings
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time deals and doctor data
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  JSON responses with pagination
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/api-docs" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                  Full API Documentation
                </Link>
                <Link href="/api-docs/quickstart" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                  Quick Start Guide
                </Link>
                <Link href="/api-docs/examples" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                  Example Projects
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limit Tiers */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">API Pricing Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">$0<span className="text-sm font-normal text-gray-500">/month</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  100 requests/hour
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  All 8 endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Attribution required
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Community support
                </li>
              </ul>
              <div className="text-xs text-gray-500 bg-green-50 rounded-lg px-3 py-2 text-center font-medium text-green-700">
                Current Plan
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Pro</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">$29<span className="text-sm font-normal text-gray-500">/month</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  1,000 requests/hour
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  All 8 endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  No attribution required
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Priority email support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Usage analytics dashboard
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Enterprise</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">Custom</div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Custom rate limits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  All 8 endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  No attribution required
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  SLA guarantee (99.9%)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Bulk data exports
                </li>
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Usage Dashboard (Mock) */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Dashboard</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-6">Example of what your API usage dashboard looks like after signing up.</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">247</div>
                <div className="text-sm text-gray-500">Requests Today</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">68</div>
                <div className="text-sm text-gray-500">Remaining This Hour</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">4,821</div>
                <div className="text-sm text-gray-500">Requests This Month</div>
              </div>
            </div>

            {/* Mock Chart */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">API Requests (Last 7 Days)</h3>
              <div className="flex items-end gap-2 h-32">
                {[45, 72, 58, 91, 67, 83, 54].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(val / 100) * 100}%` }}
                    />
                    <span className="text-xs text-gray-400">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Endpoint Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Endpoints</h3>
              <div className="space-y-2">
                {[
                  { endpoint: '/strains', pct: 42 },
                  { endpoint: '/dispensaries', pct: 28 },
                  { endpoint: '/deals', pct: 15 },
                  { endpoint: '/search', pct: 10 },
                  { endpoint: '/laws', pct: 5 },
                ].map((item) => (
                  <div key={item.endpoint} className="flex items-center gap-3">
                    <code className="text-xs font-mono text-gray-600 w-28">{item.endpoint}</code>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
