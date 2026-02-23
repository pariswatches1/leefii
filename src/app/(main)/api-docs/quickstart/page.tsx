import { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

const title = 'Quick Start Guide \u2014 Leefii Cannabis Data API | Leefii'
const description =
  'Get started with the Leefii Cannabis Data API in minutes. Step-by-step guide with code examples in JavaScript, Python, and cURL. Learn authentication, pagination, and error handling.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/api-docs/quickstart', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/api-docs/quickstart' },
}

const STEPS = [
  {
    number: 1,
    title: 'Get an API Key',
    description:
      'Sign up for a free API key at leefii.com/api-docs/keys. You will receive a key that starts with lf_live_ followed by a 32-character string. Keep this key secure and never expose it in client-side code or public repositories.',
    code: `# Your API key will look like this:
lf_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Store it as an environment variable:
export LEEFII_API_KEY="lf_live_your_key_here"`,
    language: 'bash',
    link: { href: '/api-docs/keys', text: 'Get your free API key' },
  },
  {
    number: 2,
    title: 'Make Your First Request',
    description:
      'Test your API key with a simple cURL request to the strains endpoint. This returns a paginated list of cannabis strains with their THC/CBD content, effects, and flavors.',
    code: `curl -X GET \\
  'https://leefii.com/api/v1/strains?limit=3' \\
  -H 'X-API-Key: lf_live_your_key_here' \\
  -H 'Accept: application/json'

# Response:
# {
#   "success": true,
#   "data": [
#     { "slug": "blue-dream", "name": "Blue Dream", "type": "hybrid", "thc": 21.0 },
#     { "slug": "og-kush", "name": "OG Kush", "type": "hybrid", "thc": 23.0 },
#     { "slug": "girl-scout-cookies", "name": "Girl Scout Cookies", "type": "hybrid", "thc": 25.0 }
#   ],
#   "meta": { "total": 5632, "limit": 3, "offset": 0 }
# }`,
    language: 'bash',
  },
  {
    number: 3,
    title: 'Explore Strain Data',
    description:
      'Use JavaScript to search for indica strains with specific effects. The API supports filtering by type, effect, flavor, and THC/CBD range.',
    code: `// Search for relaxing indica strains with high THC
const response = await fetch(
  'https://leefii.com/api/v1/strains?type=indica&effect=relaxed&thc_min=20&limit=5',
  {
    headers: {
      'X-API-Key': process.env.LEEFII_API_KEY
    }
  }
);

const { data, meta } = await response.json();

data.forEach(strain => {
  console.log(\`\${strain.name} (\${strain.type}) - THC: \${strain.thc}%\`);
  console.log(\`  Effects: \${strain.effects.join(', ')}\`);
  console.log(\`  Flavors: \${strain.flavors.join(', ')}\`);
});

console.log(\`Showing \${data.length} of \${meta.total} results\`);`,
    language: 'javascript',
  },
  {
    number: 4,
    title: 'Search Dispensaries',
    description:
      'Use Python to find dispensaries in a specific state and city. The dispensary endpoint supports filtering by location, type (recreational/medical), and delivery availability.',
    code: `import requests
import os

API_KEY = os.environ['LEEFII_API_KEY']
BASE_URL = 'https://leefii.com/api/v1'

# Find dispensaries in Los Angeles, CA with delivery
response = requests.get(
    f'{BASE_URL}/dispensaries',
    params={
        'state': 'CA',
        'city': 'Los Angeles',
        'delivery': True,
        'limit': 10
    },
    headers={'X-API-Key': API_KEY}
)

data = response.json()

if data['success']:
    for disp in data['data']:
        print(f"{disp['name']}")
        print(f"  Address: {disp['address']}")
        print(f"  Rating: {disp['rating']}/5")
        print(f"  Delivery: {'Yes' if disp['delivery'] else 'No'}")
        print()
    print(f"Found {data['meta']['total']} dispensaries total")
else:
    print(f"Error: {data['error']['message']}")`,
    language: 'python',
  },
  {
    number: 5,
    title: 'Handle Pagination',
    description:
      'The API uses limit/offset pagination. Use the meta.total field to determine total results and iterate through pages.',
    code: `// Fetch all strains using pagination
async function fetchAllStrains(apiKey) {
  const PAGE_SIZE = 100;
  let allStrains = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const response = await fetch(
      \`https://leefii.com/api/v1/strains?limit=\${PAGE_SIZE}&offset=\${offset}\`,
      { headers: { 'X-API-Key': apiKey } }
    );

    const { data, meta } = await response.json();
    allStrains = allStrains.concat(data);
    total = meta.total;
    offset += PAGE_SIZE;

    console.log(\`Fetched \${allStrains.length} of \${total} strains\`);

    // Respect rate limits - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allStrains;
}`,
    language: 'javascript',
  },
  {
    number: 6,
    title: 'Error Handling',
    description:
      'Always check the success field in responses and handle errors gracefully. The API returns descriptive error messages with documentation links.',
    code: `async function safeApiCall(endpoint, params = {}) {
  const url = new URL(\`https://leefii.com/api/v1/\${endpoint}\`);
  Object.entries(params).forEach(([key, val]) =>
    url.searchParams.set(key, String(val))
  );

  try {
    const response = await fetch(url.toString(), {
      headers: { 'X-API-Key': process.env.LEEFII_API_KEY }
    });

    const data = await response.json();

    if (!data.success) {
      switch (data.error.code) {
        case 401:
          console.error('Invalid API key. Check your X-API-Key header.');
          break;
        case 429:
          console.error('Rate limited. Wait before retrying.');
          // Implement exponential backoff
          break;
        case 404:
          console.error('Resource not found.');
          break;
        default:
          console.error(\`API Error \${data.error.code}: \${data.error.message}\`);
      }
      return null;
    }

    return data;
  } catch (err) {
    console.error('Network error:', err.message);
    return null;
  }
}

// Usage:
const result = await safeApiCall('strains', { type: 'indica', limit: 10 });
if (result) {
  console.log(\`Found \${result.meta.total} strains\`);
}`,
    language: 'javascript',
  },
  {
    number: 7,
    title: 'Add Attribution',
    description:
      'The free tier requires a visible "Powered by Leefii" attribution with a dofollow link on any public-facing pages that display API data. Here is the recommended HTML embed code.',
    code: `<!-- Add this to any page displaying Leefii API data -->
<p style="font-size: 12px; color: #666; margin-top: 16px;">
  Data provided by
  <a href="https://leefii.com"
     rel="dofollow"
     style="color: #16a34a; text-decoration: underline;">
    Leefii
  </a>
  — Cannabis Dispensary Directory
</p>

<!-- Or use a compact badge style -->
<a href="https://leefii.com"
   rel="dofollow"
   style="display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 8px; background: #f0fdf4; border-radius: 4px;
          font-size: 11px; color: #166534; text-decoration: none;">
  Powered by Leefii
</a>`,
    language: 'html',
  },
]

export default function QuickStartPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'API Documentation', item: 'https://leefii.com/api-docs' },
      { '@type': 'ListItem', position: 3, name: 'Quick Start Guide' },
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
            <span className="text-gray-900 font-medium">Quick Start</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Quick Start Guide</h1>
          <p className="text-lg text-green-100 max-w-xl mx-auto">
            Go from zero to your first API call in under five minutes. Follow these seven steps to get started.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Steps */}
        <div className="space-y-12">
          {STEPS.map((step) => (
            <section key={step.number} className="relative">
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {step.number}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h2>
                  <p className="text-gray-600 mb-4">{step.description}</p>

                  {step.link && (
                    <Link
                      href={step.link.href}
                      className="inline-block text-green-600 hover:text-green-700 font-medium text-sm mb-4 hover:underline"
                    >
                      {step.link.text} &rarr;
                    </Link>
                  )}

                  <div className="relative">
                    <div className="absolute top-3 right-3">
                      <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs font-mono uppercase">
                        {step.language}
                      </span>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* SDKs Coming Soon */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Official SDKs</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-700 font-bold text-sm">JS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">JavaScript SDK</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">Coming Soon</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                TypeScript-first SDK for Node.js and browser environments. Includes type definitions, pagination helpers, and automatic retry logic.
              </p>
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                <code>{`npm install @leefii/cannabis-api

import { Leefii } from '@leefii/cannabis-api';
const client = new Leefii('lf_live_...');
const strains = await client.strains.list({ type: 'indica' });`}</code>
              </pre>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-sm">PY</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Python SDK</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">Coming Soon</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Python SDK with async support, Pydantic models, and built-in pagination. Works with Python 3.8 and above.
              </p>
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                <code>{`pip install leefii

from leefii import LeefiiClient
client = LeefiiClient('lf_live_...')
strains = client.strains.list(type='indica')`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3 text-center">What&apos;s Next?</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <Link
                href="/api-docs"
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
              >
                <div className="font-semibold mb-1">Full API Reference</div>
                <div className="text-green-200 text-sm">All 8 endpoints documented</div>
              </Link>
              <Link
                href="/api-docs/examples"
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
              >
                <div className="font-semibold mb-1">Example Projects</div>
                <div className="text-green-200 text-sm">6 ready-to-use examples</div>
              </Link>
              <Link
                href="/api-docs/keys"
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
              >
                <div className="font-semibold mb-1">Manage API Keys</div>
                <div className="text-green-200 text-sm">Dashboard and usage stats</div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
