import { Metadata } from 'next'
import Link from 'next/link'
import CodeTabs from './CodeTabs'

export const revalidate = 86400

const title = 'Leefii Cannabis Data API \u2014 Free Strain & Dispensary Data for Developers | Leefii'
const description =
  'Free cannabis data API with 8 endpoints for strains, dispensaries, deals, doctors, and state laws. 100 requests per hour on the free tier. Real-time data with JSON responses. Build cannabis apps, widgets, and integrations with the Leefii API.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/api-docs', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/api-docs' },
}

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/strains',
    description: 'List cannabis strains with filters for type, effects, flavors, THC/CBD content, and more.',
    params: [
      { name: 'type', type: 'string', description: 'Filter by strain type: indica, sativa, hybrid' },
      { name: 'effect', type: 'string', description: 'Filter by effect: relaxed, euphoric, creative, etc.' },
      { name: 'flavor', type: 'string', description: 'Filter by flavor: earthy, citrus, berry, etc.' },
      { name: 'thc_min', type: 'number', description: 'Minimum THC percentage' },
      { name: 'thc_max', type: 'number', description: 'Maximum THC percentage' },
      { name: 'limit', type: 'number', description: 'Results per page (default: 20, max: 100)' },
      { name: 'offset', type: 'number', description: 'Pagination offset (default: 0)' },
    ],
    example: `{
  "success": true,
  "data": [
    {
      "slug": "blue-dream",
      "name": "Blue Dream",
      "type": "hybrid",
      "thc": 21.0,
      "cbd": 0.2,
      "effects": ["relaxed", "euphoric", "creative"],
      "flavors": ["berry", "sweet", "vanilla"]
    }
  ],
  "meta": { "total": 5632, "limit": 20, "offset": 0 }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/strains/{slug}',
    description: 'Get detailed information about a specific cannabis strain by its URL slug.',
    params: [
      { name: 'slug', type: 'string', description: 'Strain URL slug (e.g., blue-dream)' },
    ],
    example: `{
  "success": true,
  "data": {
    "slug": "blue-dream",
    "name": "Blue Dream",
    "type": "hybrid",
    "thc": 21.0,
    "cbd": 0.2,
    "effects": ["relaxed", "euphoric", "creative"],
    "flavors": ["berry", "sweet", "vanilla"],
    "description": "Blue Dream is a sativa-dominant hybrid...",
    "terpenes": ["myrcene", "caryophyllene", "pinene"],
    "rating": 4.6,
    "reviewCount": 1247
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/dispensaries',
    description: 'Search for licensed cannabis dispensaries by location, type, and features.',
    params: [
      { name: 'state', type: 'string', description: 'Two-letter state code (e.g., CA, CO)' },
      { name: 'city', type: 'string', description: 'City name' },
      { name: 'zip', type: 'string', description: 'ZIP code for proximity search' },
      { name: 'type', type: 'string', description: 'recreational, medical, or both' },
      { name: 'delivery', type: 'boolean', description: 'Filter for delivery-enabled dispensaries' },
      { name: 'limit', type: 'number', description: 'Results per page (default: 20, max: 100)' },
      { name: 'offset', type: 'number', description: 'Pagination offset (default: 0)' },
    ],
    example: `{
  "success": true,
  "data": [
    {
      "id": "disp_8291",
      "name": "Green Valley Dispensary",
      "address": "123 Main St, Los Angeles, CA 90001",
      "type": "both",
      "rating": 4.8,
      "delivery": true,
      "hours": { "mon": "9:00-21:00" }
    }
  ],
  "meta": { "total": 342, "limit": 20, "offset": 0 }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/dispensaries/{id}',
    description: 'Get detailed information about a specific dispensary including hours, menu, and reviews.',
    params: [
      { name: 'id', type: 'string', description: 'Dispensary ID (e.g., disp_8291)' },
    ],
    example: `{
  "success": true,
  "data": {
    "id": "disp_8291",
    "name": "Green Valley Dispensary",
    "address": "123 Main St, Los Angeles, CA 90001",
    "phone": "(310) 555-0142",
    "website": "https://greenvalley.example.com",
    "type": "both",
    "rating": 4.8,
    "reviewCount": 312,
    "delivery": true,
    "hours": { "mon": "9:00-21:00", "tue": "9:00-21:00" }
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/deals',
    description: 'Browse active cannabis deals and discounts from dispensaries near you.',
    params: [
      { name: 'state', type: 'string', description: 'Two-letter state code' },
      { name: 'city', type: 'string', description: 'City name' },
      { name: 'category', type: 'string', description: 'Deal category: flower, edibles, concentrates, etc.' },
      { name: 'limit', type: 'number', description: 'Results per page (default: 20, max: 100)' },
      { name: 'offset', type: 'number', description: 'Pagination offset (default: 0)' },
    ],
    example: `{
  "success": true,
  "data": [
    {
      "id": "deal_4521",
      "title": "20% Off All Edibles",
      "dispensary": "Green Valley Dispensary",
      "category": "edibles",
      "discount": "20%",
      "expires": "2026-03-01"
    }
  ],
  "meta": { "total": 89, "limit": 20, "offset": 0 }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/doctors',
    description: 'Find medical marijuana doctors and cannabis-friendly physicians in your area.',
    params: [
      { name: 'state', type: 'string', description: 'Two-letter state code' },
      { name: 'city', type: 'string', description: 'City name' },
      { name: 'telehealth', type: 'boolean', description: 'Filter for telehealth-enabled doctors' },
      { name: 'limit', type: 'number', description: 'Results per page (default: 20, max: 50)' },
      { name: 'offset', type: 'number', description: 'Pagination offset (default: 0)' },
    ],
    example: `{
  "success": true,
  "data": [
    {
      "id": "doc_1192",
      "name": "Dr. Sarah Chen",
      "city": "Denver",
      "state": "CO",
      "telehealth": true,
      "rating": 4.9,
      "price": 149
    }
  ],
  "meta": { "total": 47, "limit": 20, "offset": 0 }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/laws/{state}',
    description: 'Get current cannabis laws, regulations, and legal status for a specific US state.',
    params: [
      { name: 'state', type: 'string', description: 'Two-letter state code (e.g., CA, CO, NY)' },
    ],
    example: `{
  "success": true,
  "data": {
    "state": "California",
    "stateCode": "CA",
    "recreational": true,
    "medical": true,
    "possession_limit_oz": 1.0,
    "home_grow": true,
    "home_grow_plants": 6,
    "delivery_legal": true,
    "updated": "2026-01-15"
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/search',
    description: 'Unified search across strains, dispensaries, doctors, and deals in a single query.',
    params: [
      { name: 'q', type: 'string', description: 'Search query (required)' },
      { name: 'type', type: 'string', description: 'Filter results: strains, dispensaries, doctors, deals' },
      { name: 'state', type: 'string', description: 'Two-letter state code to scope results' },
      { name: 'limit', type: 'number', description: 'Results per page (default: 20, max: 100)' },
    ],
    example: `{
  "success": true,
  "data": [
    { "type": "strain", "name": "Blue Dream", "slug": "blue-dream" },
    { "type": "dispensary", "name": "Blue Dream Dispensary", "id": "disp_221" }
  ],
  "meta": { "total": 14, "limit": 20, "offset": 0 }
}`,
  },
]

const PAGE_FAQS = [
  {
    question: 'Is the Leefii Cannabis Data API free to use?',
    answer:
      'Yes, Leefii offers a generous free tier that allows up to 100 API requests per hour at no cost. This is perfect for personal projects, prototypes, and small applications. The free tier requires a "Powered by Leefii" attribution link on any public-facing pages that use the data. Paid tiers are available for higher volume needs.',
  },
  {
    question: 'What are the rate limits for the Leefii API?',
    answer:
      'The free tier allows 100 requests per hour. The Pro tier increases this to 1,000 requests per hour for $29 per month. Enterprise plans offer custom rate limits, dedicated support, and SLA guarantees. All tiers include access to the same 8 endpoints and full dataset.',
  },
  {
    question: 'Do I need to provide attribution when using the API?',
    answer:
      'Yes, the free tier requires a visible "Powered by Leefii" attribution with a dofollow link to leefii.com on any public-facing pages that display data from the API. Pro and Enterprise tiers allow white-label use without attribution requirements.',
  },
  {
    question: 'What cannabis data is available through the API?',
    answer:
      'The Leefii API provides access to over 5,600 cannabis strains with THC/CBD content, effects, flavors, and terpene profiles; 6,800 plus licensed dispensaries with hours, ratings, and delivery options; active deals and discounts; medical marijuana doctor listings; and state-by-state cannabis law data for all 51 US states and territories.',
  },
  {
    question: 'Can I use the Leefii API for commercial applications?',
    answer:
      'Absolutely. The Leefii API is available for commercial use on all tiers. The free tier requires attribution, while Pro and Enterprise tiers allow full white-label integration. You may not resell the raw data as a competing data product, but building applications, websites, and tools that use the data is encouraged.',
  },
]

const CODE_EXAMPLES = {
  javascript: `// JavaScript (fetch)
const response = await fetch(
  'https://leefii.com/api/v1/strains?type=indica&limit=5',
  {
    headers: {
      'X-API-Key': 'lf_live_your_api_key_here'
    }
  }
);

const data = await response.json();
console.log(data.data); // Array of strain objects
console.log(data.meta.total); // Total matching strains`,

  python: `# Python (requests)
import requests

response = requests.get(
    'https://leefii.com/api/v1/strains',
    params={'type': 'indica', 'limit': 5},
    headers={'X-API-Key': 'lf_live_your_api_key_here'}
)

data = response.json()
for strain in data['data']:
    print(f"{strain['name']} - THC: {strain['thc']}%")`,

  curl: `# cURL
curl -X GET \\
  'https://leefii.com/api/v1/strains?type=indica&limit=5' \\
  -H 'X-API-Key: lf_live_your_api_key_here' \\
  -H 'Accept: application/json'`,
}

const ERROR_CODES = [
  { code: 400, name: 'Bad Request', description: 'Invalid parameters or missing required fields.' },
  { code: 401, name: 'Unauthorized', description: 'Missing or invalid API key.' },
  { code: 404, name: 'Not Found', description: 'The requested resource does not exist.' },
  { code: 429, name: 'Rate Limited', description: 'You have exceeded your rate limit. Wait and retry.' },
  { code: 500, name: 'Server Error', description: 'An internal server error occurred. Contact support if persistent.' },
]

export default function ApiDocsPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'API Documentation' },
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">API Documentation</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Leefii Cannabis Data API</h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Free access to comprehensive cannabis data. Strains, dispensaries, deals, doctors, and laws.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold">8</div>
              <div className="text-green-200 text-sm">Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100</div>
              <div className="text-green-200 text-sm">Requests/Hour Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Real-Time</div>
              <div className="text-green-200 text-sm">Data</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/api-docs/keys"
              className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Get Free API Key
            </Link>
            <Link
              href="/api-docs/quickstart"
              className="inline-block bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors border border-green-400"
            >
              Quick Start Guide
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SEO Intro */}
        <section className="mb-12">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The Leefii Cannabis Data API gives developers, researchers, and entrepreneurs free programmatic access
              to one of the most comprehensive cannabis datasets available. Whether you are building a dispensary finder,
              a strain recommendation engine, a cannabis news aggregator, or a compliance tool, the Leefii API delivers
              the structured data you need through clean, well-documented RESTful endpoints. Our database includes
              detailed profiles for over 5,600 cannabis strains, complete with THC and CBD percentages, terpene
              profiles, user-reported effects, flavor notes, and aggregate ratings collected from thousands of
              consumer reviews.
            </p>
            <p>
              Beyond strain data, the API provides real-time access to more than 6,800 licensed dispensary listings
              across all 51 US states and territories. Each dispensary record includes verified business hours,
              contact information, delivery availability, accepted payment methods, and customer ratings. The deals
              endpoint surfaces active promotions and discounts from participating dispensaries, making it easy to
              build price comparison tools and deal aggregation features. For medical cannabis applications, the
              doctors endpoint lists over 650 verified medical marijuana physicians, filterable by state, city,
              and telehealth availability. The laws endpoint provides up-to-date cannabis legislation data on a
              state-by-state basis, covering recreational and medical legality, possession limits, home cultivation
              rules, and delivery regulations. All responses are returned in consistent JSON format with pagination
              metadata, making integration straightforward for any programming language or framework.
            </p>
          </div>
        </section>

        {/* API Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Overview</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Base URL</h3>
              <code className="bg-gray-900 text-green-400 px-3 py-1.5 rounded font-mono text-sm">
                https://leefii.com/api/v1/
              </code>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Authentication</h3>
              <p className="text-gray-700">
                Include your API key in the <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">X-API-Key</code> request
                header or as a <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">?api_key=</code> query parameter.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Rate Limits</h3>
              <p className="text-gray-700">
                Free tier: 100 requests/hour. Pro: 1,000 requests/hour. Enterprise: custom limits with SLA.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Response Format</h3>
              <p className="text-gray-700">
                All responses are JSON with a consistent structure including <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">success</code>,{' '}
                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">data</code>, and{' '}
                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">meta</code> fields.
              </p>
            </div>
          </div>
        </section>

        {/* Endpoints Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Endpoints Reference</h2>
          <div className="space-y-6">
            {ENDPOINTS.map((ep, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono font-bold">
                      {ep.method}
                    </span>
                    <code className="text-gray-900 font-mono text-sm font-semibold">{ep.path}</code>
                  </div>
                  <p className="text-gray-600 mb-4">{ep.description}</p>

                  {/* Parameters */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Query Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 pr-4 font-medium text-gray-500">Parameter</th>
                            <th className="text-left py-2 pr-4 font-medium text-gray-500">Type</th>
                            <th className="text-left py-2 font-medium text-gray-500">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p) => (
                            <tr key={p.name} className="border-b border-gray-100">
                              <td className="py-2 pr-4">
                                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
                                  {p.name}
                                </code>
                              </td>
                              <td className="py-2 pr-4 text-gray-500">{p.type}</td>
                              <td className="py-2 text-gray-600">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Example Response */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Example Response</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <code>{ep.example}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-700 mb-4">
              Every request to the Leefii API requires a valid API key. You can include your key in one of two ways:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Option 1: Request Header (Recommended)</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>X-API-Key: lf_live_your_api_key_here</code>
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Option 2: Query Parameter</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code>https://leefii.com/api/v1/strains?api_key=lf_live_your_api_key_here</code>
                </pre>
              </div>
              <p className="text-sm text-gray-500">
                Using the header method is recommended because it keeps your API key out of server access logs and browser history.
              </p>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Limits</h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Tier</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Rate Limit</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Attribution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-6 font-medium text-gray-900">Free</td>
                  <td className="py-3 px-6 text-gray-600">100 requests/hour</td>
                  <td className="py-3 px-6 text-gray-600">$0</td>
                  <td className="py-3 px-6 text-gray-600">Required</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-6 font-medium text-gray-900">Pro</td>
                  <td className="py-3 px-6 text-gray-600">1,000 requests/hour</td>
                  <td className="py-3 px-6 text-gray-600">$29/month</td>
                  <td className="py-3 px-6 text-gray-600">Optional</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-6 font-medium text-gray-900">Enterprise</td>
                  <td className="py-3 px-6 text-gray-600">Custom</td>
                  <td className="py-3 px-6 text-gray-600">Contact us</td>
                  <td className="py-3 px-6 text-gray-600">Optional</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Rate limit headers are included in every response:{' '}
            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">X-RateLimit-Limit</code>,{' '}
            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">X-RateLimit-Remaining</code>, and{' '}
            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">X-RateLimit-Reset</code>.
          </p>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>
          <CodeTabs
            tabs={[
              { label: 'JavaScript', code: CODE_EXAMPLES.javascript },
              { label: 'Python', code: CODE_EXAMPLES.python },
              { label: 'cURL', code: CODE_EXAMPLES.curl },
            ]}
          />
        </section>

        {/* Response Format */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Response Format</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-700 mb-4">
              All successful API responses follow a consistent JSON structure:
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <code>{`{
  "success": true,
  "data": [ ... ],      // Array of results or single object
  "meta": {
    "total": 5632,      // Total matching results
    "limit": 20,        // Results per page
    "offset": 0         // Current pagination offset
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Codes</h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Code</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {ERROR_CODES.map((err) => (
                  <tr key={err.code} className="border-t border-gray-100">
                    <td className="py-3 px-6">
                      <code className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                        {err.code}
                      </code>
                    </td>
                    <td className="py-3 px-6 font-medium text-gray-900">{err.name}</td>
                    <td className="py-3 px-6 text-gray-600">{err.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Error responses follow this format:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <code>{`{
  "success": false,
  "error": {
    "code": 401,
    "message": "Invalid or missing API key.",
    "docs": "https://leefii.com/api-docs#authentication"
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms of Use</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">1.</span>
                <span>
                  <strong>Attribution required on free tier.</strong> Any public-facing page displaying data from
                  the Leefii API must include a visible &quot;Powered by Leefii&quot; text with a dofollow link
                  to <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">https://leefii.com</code>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">2.</span>
                <span>
                  <strong>No data resale.</strong> You may not redistribute raw API data as a standalone data
                  product or competing API service.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">3.</span>
                <span>
                  <strong>Rate limits must be respected.</strong> Automated retries should include exponential
                  backoff. Deliberate abuse of rate limits may result in key revocation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">4.</span>
                <span>
                  <strong>Comply with applicable laws.</strong> You are responsible for ensuring your use of
                  cannabis data complies with federal, state, and local regulations.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTAs */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to Build?</h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              Get your free API key in seconds and start building with cannabis data today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/api-docs/keys"
                className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                Get Free API Key
              </Link>
              <Link
                href="/api-docs/quickstart"
                className="inline-block bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors border border-green-400"
              >
                Quick Start Guide
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {PAGE_FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
