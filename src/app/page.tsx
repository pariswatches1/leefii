import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import HeroSearchV2 directly - it handles its own client-side features
import { HeroSearchV2 } from '@/components/search-v2/HeroSearchV2';
import { MobileNav } from '@/components/MobileNav';

// Dynamically import with SSR disabled to prevent hydration issues
// This component uses browser APIs (localStorage, geolocation) that don't exist on server
const NearbyDispensaries = dynamic(
  () => import('@/components/NearbyDispensaries'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40">
        <div className="animate-pulse">
          <div className="h-6 bg-white/50 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
);

const NearbyDoctors = dynamic(
  () => import('@/components/NearbyDoctors'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40">
        <div className="animate-pulse">
          <div className="h-6 bg-white/50 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
);

export default function Home() {
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Leefii',
    url: 'https://leefii.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://leefii.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      {/* Background blur effects */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-lime-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-green-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header - kept but visually lighter */}
      <header className="relative z-10 px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-lime-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-600/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-gray-800">Leefii</span>
            </Link>

            {/* Navigation - de-emphasized */}
            <nav className="hidden lg:flex items-center gap-4 text-sm">
              <Link href="/dispensaries" className="text-gray-700 hover:text-gray-900 transition">
                Dispensaries
              </Link>
              <Link href="/delivery" className="text-gray-700 hover:text-gray-900 transition">
                Delivery
              </Link>
              <Link href="/doctors" className="text-gray-700 hover:text-gray-900 transition">
                Doctors
              </Link>
              <Link href="/strains" className="text-gray-700 hover:text-gray-900 transition">
                Strains
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-gray-900 transition">
                Deals
              </Link>
              <Link href="/news" className="text-gray-700 hover:text-gray-900 transition">
                News
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition">
                Blog
              </Link>
              <Link href="/sell" className="px-4 py-2 bg-lime-700 text-white font-semibold rounded-full hover:bg-lime-800 transition text-sm">
                Sell on Leefii
              </Link>
              <Link href="/login" className="px-4 py-2 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition text-sm">
                Sign In
              </Link>
            </nav>

            {/* Mobile menu */}
            <MobileNav
              links={[
                { href: '/dispensaries', label: 'Dispensaries' },
                { href: '/delivery', label: 'Delivery' },
                { href: '/doctors', label: 'Doctors' },
                { href: '/strains', label: 'Strains' },
                { href: '/deals', label: 'Deals' },
                { href: '/news', label: 'News' },
                { href: '/blog', label: 'Blog' },
                { href: '/sell', label: 'Sell on Leefii', highlight: true },
                { href: '/login', label: 'Sign In' },
              ]}
              className="lg:hidden text-gray-800"
            />
          </div>
        </div>
      </header>

      {/* HERO SECTION - Search is now the dominant focal point */}
      <main className="relative z-10">
        {/* Primary Focus Area - Search Dominates */}
        <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-12 lg:pt-20 pb-8">
          {/* Headline - supports search, doesn't compete */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Find Cannabis <span className="text-lime-800">Near You</span>
            </h1>
            <p className="text-lg text-gray-800/70 max-w-xl mx-auto">
              Search dispensaries, strains, products, and more
            </p>
          </div>

          {/* SEARCH - The Primary Action */}
          <div className="max-w-2xl mx-auto">
            <HeroSearchV2 />
          </div>

          {/* Stats - smaller, de-emphasized */}
          <div className="flex justify-center gap-8 mt-8 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">6,891+</div>
              <div className="text-sm text-gray-700">Dispensaries</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">5,632+</div>
              <div className="text-sm text-gray-700">Strains</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">51</div>
              <div className="text-sm text-gray-700">States</div>
            </div>
          </div>
        </div>

        {/* AI Quick Answer Block */}
        <section aria-label="Quick Summary" className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
          <p className="text-gray-800/80 text-base leading-relaxed text-center">
            Leefii is a free cannabis dispensary directory covering 6,891+ licensed dispensaries and 5,632+ strains across all 51 US states. Find dispensaries near you, explore strain effects, compare deals, check state cannabis laws, and connect with MMJ doctors.
          </p>
        </section>

        {/* Secondary Content - Below the fold, accessible by scrolling */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Quick Actions - de-emphasized grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {/* Strain Quiz Card */}
            <Link
              href="/quiz"
              className="col-span-2 md:col-span-1 bg-white/30 backdrop-blur rounded-xl p-4 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900 text-sm group-hover:text-lime-800 transition">Strain Quiz</div>
            </Link>

            {/* Find Dispensaries Card */}
            <Link
              href="/dispensaries"
              className="bg-white/30 backdrop-blur rounded-xl p-4 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2">🏪</div>
              <div className="font-medium text-gray-900 text-sm group-hover:text-lime-800 transition">Dispensaries</div>
            </Link>

            {/* Explore Strains Card */}
            <Link
              href="/strains"
              className="bg-white/30 backdrop-blur rounded-xl p-4 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2">🌿</div>
              <div className="font-medium text-gray-900 text-sm group-hover:text-lime-800 transition">Strains</div>
            </Link>

            {/* Best Deals Card */}
            <Link
              href="/deals"
              className="bg-white/30 backdrop-blur rounded-xl p-4 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="font-medium text-gray-900 text-sm group-hover:text-lime-800 transition">Deals</div>
            </Link>

            {/* Latest News Card */}
            <Link
              href="/news"
              className="bg-white/30 backdrop-blur rounded-xl p-4 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-2xl mb-2">📰</div>
              <div className="font-medium text-gray-900 text-sm group-hover:text-lime-800 transition">News</div>
            </Link>
          </div>

          {/* Nearby Dispensaries Section */}
          <div className="mb-8">
            <NearbyDispensaries />
          </div>

          {/* Medical Marijuana Card Doctors Section */}
          <div className="mb-8">
            <NearbyDoctors />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-6 border border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Leefii</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-700">
              <Link href="/about" className="hover:text-gray-900 transition">About</Link>
              <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
              <Link href="/privacy" className="hover:text-gray-900 transition">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition">Terms</Link>
            </div>
            <div className="text-sm text-gray-600">
              © 2026 Leefii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
