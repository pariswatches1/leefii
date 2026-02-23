import { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

const title = 'Example Projects \u2014 Leefii Cannabis Data API | Leefii'
const description =
  'Build cannabis applications with the Leefii API. Six ready-to-use example projects including a strain search widget, dispensary map, deal aggregator, state law checker, data dashboard, and mobile app integration.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: 'https://leefii.com/api-docs/examples', siteName: 'Leefii' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: 'https://leefii.com/api-docs/examples' },
}

const EXAMPLES = [
  {
    title: 'Strain Search Widget',
    description:
      'Embed a cannabis strain search directly on your website. Users can search by name, type, or effect and see results with THC/CBD percentages and flavor profiles. Ideal for dispensary websites and cannabis blogs.',
    language: 'JavaScript + HTML',
    languageColor: 'bg-yellow-100 text-yellow-800',
    code: `<!-- Strain Search Widget -->
<div id="leefii-strain-search">
  <input type="text" id="strain-query" placeholder="Search strains..."
    style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;" />
  <div id="strain-results" style="margin-top: 12px;"></div>
</div>

<script>
const API_KEY = 'lf_live_your_key_here';
const input = document.getElementById('strain-query');
const results = document.getElementById('strain-results');

let timeout;
input.addEventListener('input', (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => searchStrains(e.target.value), 300);
});

async function searchStrains(query) {
  if (!query || query.length < 2) {
    results.innerHTML = '';
    return;
  }

  const res = await fetch(
    \`https://leefii.com/api/v1/search?q=\${encodeURIComponent(query)}&type=strains&limit=5\`,
    { headers: { 'X-API-Key': API_KEY } }
  );
  const { data } = await res.json();

  results.innerHTML = data.map(strain => \`
    <div style="padding: 12px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 8px;">
      <strong>\${strain.name}</strong>
      <span style="background: #dcfce7; color: #166534; padding: 2px 8px;
        border-radius: 4px; font-size: 12px; margin-left: 8px;">\${strain.type}</span>
      <div style="color: #666; font-size: 14px; margin-top: 4px;">
        THC: \${strain.thc}% | CBD: \${strain.cbd}%
      </div>
    </div>
  \`).join('');
}
</script>

<p style="font-size: 12px; color: #666; margin-top: 16px;">
  Data by <a href="https://leefii.com" rel="dofollow" style="color: #16a34a;">Leefii</a>
</p>`,
  },
  {
    title: 'Dispensary Finder Map',
    description:
      'Build an interactive dispensary map using Google Maps and the Leefii dispensary API. Show dispensary locations as pins with info windows displaying name, rating, address, and delivery status.',
    language: 'JavaScript',
    languageColor: 'bg-yellow-100 text-yellow-800',
    code: `// Dispensary Finder Map with Google Maps
const API_KEY = 'lf_live_your_key_here';
const GOOGLE_MAPS_KEY = 'your_google_maps_key';

async function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    zoom: 12,
  });

  // Fetch dispensaries from Leefii API
  const response = await fetch(
    'https://leefii.com/api/v1/dispensaries?state=CA&city=Los+Angeles&limit=50',
    { headers: { 'X-API-Key': API_KEY } }
  );
  const { data } = await response.json();

  // Add markers for each dispensary
  data.forEach(dispensary => {
    const marker = new google.maps.Marker({
      position: { lat: dispensary.lat, lng: dispensary.lng },
      map,
      title: dispensary.name,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: \`
        <div style="max-width: 250px;">
          <h3 style="margin: 0 0 4px;">\${dispensary.name}</h3>
          <p style="color: #666; font-size: 13px; margin: 0 0 4px;">
            \${dispensary.address}
          </p>
          <p style="margin: 0;">
            Rating: \${dispensary.rating}/5
            \${dispensary.delivery ? ' | Delivery Available' : ''}
          </p>
        </div>
      \`,
    });

    marker.addListener('click', () => infoWindow.open(map, marker));
  });
}`,
  },
  {
    title: 'Deal Aggregator',
    description:
      'Display current cannabis deals from dispensaries on your blog or content site. This Python script fetches deals by state and generates HTML output you can embed or serve from your backend.',
    language: 'Python',
    languageColor: 'bg-blue-100 text-blue-800',
    code: `import requests
import os
from datetime import datetime

API_KEY = os.environ['LEEFII_API_KEY']

def fetch_deals(state, category=None, limit=20):
    """Fetch active cannabis deals for a given state."""
    params = {'state': state, 'limit': limit}
    if category:
        params['category'] = category

    response = requests.get(
        'https://leefii.com/api/v1/deals',
        params=params,
        headers={'X-API-Key': API_KEY}
    )
    return response.json()

def generate_html(deals_data):
    """Generate an HTML snippet for embedding deals."""
    if not deals_data['success']:
        return '<p>Unable to load deals.</p>'

    html = '<div class="leefii-deals">'
    for deal in deals_data['data']:
        html += f'''
        <div style="border: 1px solid #eee; padding: 16px;
                    border-radius: 8px; margin-bottom: 12px;">
          <div style="font-weight: bold; font-size: 18px; color: #16a34a;">
            {deal['discount']} Off
          </div>
          <div style="font-weight: 600; margin: 4px 0;">{deal['title']}</div>
          <div style="color: #666; font-size: 14px;">
            {deal['dispensary']} | {deal['category']}
          </div>
          <div style="color: #999; font-size: 12px; margin-top: 4px;">
            Expires: {deal['expires']}
          </div>
        </div>'''
    html += '</div>'
    html += '<p style="font-size: 12px;">Data by <a href="https://leefii.com">Leefii</a></p>'
    return html

# Fetch and display Colorado deals
deals = fetch_deals('CO', category='flower')
print(generate_html(deals))

# Fetch edible deals
edible_deals = fetch_deals('CA', category='edibles')
print(f"Found {edible_deals['meta']['total']} edible deals in California")`,
  },
  {
    title: 'State Law Checker',
    description:
      'Build a React component that lets users check cannabis laws for any US state. Displays recreational and medical legality, possession limits, home grow rules, and delivery regulations.',
    language: 'React + TypeScript',
    languageColor: 'bg-blue-100 text-blue-800',
    code: `import { useState } from 'react';

interface StateLaw {
  state: string;
  stateCode: string;
  recreational: boolean;
  medical: boolean;
  possession_limit_oz: number;
  home_grow: boolean;
  home_grow_plants: number;
  delivery_legal: boolean;
  updated: string;
}

export function StateLawChecker() {
  const [stateCode, setStateCode] = useState('');
  const [law, setLaw] = useState<StateLaw | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkLaw() {
    if (!stateCode) return;
    setLoading(true);
    try {
      const res = await fetch(
        \`https://leefii.com/api/v1/laws/\${stateCode.toUpperCase()}\`,
        { headers: { 'X-API-Key': process.env.NEXT_PUBLIC_LEEFII_KEY! } }
      );
      const { data } = await res.json();
      setLaw(data);
    } catch (err) {
      console.error('Failed to fetch law data:', err);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2>Cannabis Law Checker</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          placeholder="Enter state code (e.g., CA)"
          maxLength={2}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid #ddd',
                   borderRadius: 8 }}
        />
        <button onClick={checkLaw} disabled={loading}
          style={{ padding: '10px 20px', background: '#16a34a', color: '#fff',
                   border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {law && (
        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3>{law.state} ({law.stateCode})</h3>
          <p>Recreational: {law.recreational ? 'Legal' : 'Not Legal'}</p>
          <p>Medical: {law.medical ? 'Legal' : 'Not Legal'}</p>
          <p>Possession Limit: {law.possession_limit_oz} oz</p>
          <p>Home Grow: {law.home_grow
            ? \`Yes (up to \${law.home_grow_plants} plants)\`
            : 'Not Allowed'}</p>
          <p>Delivery: {law.delivery_legal ? 'Legal' : 'Not Legal'}</p>
          <p style={{ fontSize: 12, color: '#999' }}>
            Last updated: {law.updated}
          </p>
        </div>
      )}
    </div>
  );
}`,
  },
  {
    title: 'Cannabis Data Dashboard',
    description:
      'Create a data visualization dashboard using Chart.js and the Leefii API. Display strain distribution by type, average THC content trends, and top dispensaries by rating.',
    language: 'JavaScript + Chart.js',
    languageColor: 'bg-yellow-100 text-yellow-800',
    code: `import Chart from 'chart.js/auto';

const API_KEY = 'lf_live_your_key_here';
const BASE = 'https://leefii.com/api/v1';

async function buildDashboard() {
  // Fetch strain data for each type
  const types = ['indica', 'sativa', 'hybrid'];
  const counts = {};

  for (const type of types) {
    const res = await fetch(\`\${BASE}/strains?type=\${type}&limit=1\`, {
      headers: { 'X-API-Key': API_KEY }
    });
    const { meta } = await res.json();
    counts[type] = meta.total;
  }

  // Strain Type Distribution (Doughnut Chart)
  new Chart(document.getElementById('typeChart'), {
    type: 'doughnut',
    data: {
      labels: ['Indica', 'Sativa', 'Hybrid'],
      datasets: [{
        data: [counts.indica, counts.sativa, counts.hybrid],
        backgroundColor: ['#7c3aed', '#f59e0b', '#16a34a'],
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: 'Strains by Type' }
      }
    }
  });

  // Top Dispensaries by Rating (Bar Chart)
  const dispRes = await fetch(\`\${BASE}/dispensaries?limit=10\`, {
    headers: { 'X-API-Key': API_KEY }
  });
  const { data: dispensaries } = await dispRes.json();
  const sorted = dispensaries.sort((a, b) => b.rating - a.rating).slice(0, 8);

  new Chart(document.getElementById('ratingChart'), {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.name.slice(0, 20)),
      datasets: [{
        label: 'Rating',
        data: sorted.map(d => d.rating),
        backgroundColor: '#16a34a',
      }]
    },
    options: {
      scales: { y: { min: 3, max: 5 } },
      plugins: {
        title: { display: true, text: 'Top Rated Dispensaries' }
      }
    }
  });
}

buildDashboard();`,
  },
  {
    title: 'Mobile App Integration',
    description:
      'Use the Leefii API in a React Native mobile app. This example shows a strain list screen with search, infinite scroll pagination, and navigation to a strain detail screen.',
    language: 'React Native',
    languageColor: 'bg-purple-100 text-purple-800',
    code: `import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet
} from 'react-native';

const API_KEY = 'lf_live_your_key_here';

export function StrainListScreen({ navigation }) {
  const [strains, setStrains] = useState([]);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStrains = useCallback(async (reset = false) => {
    setLoading(true);
    const newOffset = reset ? 0 : offset;
    const url = query
      ? \`https://leefii.com/api/v1/search?q=\${query}&type=strains&limit=20&offset=\${newOffset}\`
      : \`https://leefii.com/api/v1/strains?limit=20&offset=\${newOffset}\`;

    const res = await fetch(url, {
      headers: { 'X-API-Key': API_KEY }
    });
    const { data, meta } = await res.json();

    setStrains(prev => reset ? data : [...prev, ...data]);
    setTotal(meta.total);
    setOffset(newOffset + 20);
    setLoading(false);
  }, [query, offset]);

  useEffect(() => { fetchStrains(true); }, [query]);

  const renderStrain = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StrainDetail', { slug: item.slug })}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.badge}>{item.type}</Text>
      </View>
      <Text style={styles.thc}>THC: {item.thc}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search strains..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={strains}
        renderItem={renderStrain}
        keyExtractor={item => item.slug}
        onEndReached={() => offset < total && fetchStrains()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
           padding: 12, marginBottom: 12, fontSize: 16 },
  card: { padding: 14, borderBottomWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  badge: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 12,
           paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  thc: { color: '#666', fontSize: 14, marginTop: 4 },
});`,
  },
]

export default function ExamplesPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'API Documentation', item: 'https://leefii.com/api-docs' },
      { '@type': 'ListItem', position: 3, name: 'Example Projects' },
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
            <span className="text-gray-900 font-medium">Examples</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Example Projects</h1>
          <p className="text-lg text-green-100 max-w-xl mx-auto">
            Six ready-to-use projects showing how to build cannabis applications with the Leefii API.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Cards */}
        <div className="space-y-8">
          {EXAMPLES.map((example, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-gray-900">{example.title}</h2>
                  <span className={`${example.languageColor} px-2.5 py-0.5 rounded text-xs font-medium`}>
                    {example.language}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{example.description}</p>
                <details className="group">
                  <summary className="cursor-pointer text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1.5 select-none">
                    <svg
                      className="w-4 h-4 transition-transform group-open:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    View Full Code Example
                  </summary>
                  <div className="mt-4">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Section */}
        <section className="mt-16">
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 text-white mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Open Source Examples</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              All example projects are available on GitHub. Star the repo, fork it, and build something amazing.
            </p>
            <a
              href="https://github.com/leefii/cannabis-api-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Start Building Today</h2>
            <p className="text-green-100 mb-6 max-w-lg mx-auto">
              Get your free API key and bring these examples to life in your own projects.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/api-docs/keys"
                className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                Get Free API Key
              </Link>
              <Link
                href="/api-docs"
                className="inline-block bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors border border-green-400"
              >
                Full API Docs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
