import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-lime-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-green-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/30">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-lime-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-600/20">
                  <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                <span className="text-3xl font-extrabold text-gray-500">Leefii</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dispensaries" className="text-gray-800 hover:text-gray-900 transition font-medium">
                  Dispensaries
                </Link>
                <Link href="/strains" className="text-gray-800 hover:text-gray-900 transition font-medium">
                  Strains
                </Link>
                <Link href="/deals" className="text-gray-800 hover:text-gray-900 transition font-medium">
                  Deals
                </Link>
                <Link href="/news" className="text-gray-800 hover:text-gray-900 transition font-medium">
                  News
                </Link>
                <Link href="/blog" className="text-gray-800 hover:text-gray-900 transition font-medium">
                  Blog
                </Link>
                <button className="px-5 py-2 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition">
                  Sign In
                </button>
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/10 backdrop-blur rounded-full text-gray-900 text-sm mb-6">
              <span className="w-2 h-2 bg-lime-600 rounded-full animate-pulse"></span>
              Trusted by 100,000+ users
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Find Cannabis
              <span className="block text-lime-800">Near You</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-800/70 mb-8 max-w-lg">
              Discover dispensaries, explore strains, and find the best deals in your area.
            </p>

            {/* Search Bar */}
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-2 border border-white/50 mb-8 shadow-lg">
              <form className="flex" action="/search" method="GET">
                <input 
                  type="text"
                  name="q"
                  placeholder="Search dispensaries, strains..." 
                  className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder-gray-600 outline-none"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-lime-700 text-white font-semibold rounded-xl hover:bg-lime-800 transition shadow-lg shadow-lime-700/20"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">2,897+</div>
                <div className="text-gray-700">Dispensaries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">5,632+</div>
                <div className="text-gray-700">Strains</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50</div>
                <div className="text-gray-700">States</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Find Dispensaries Card */}
            <Link 
              href="/dispensaries"
              className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-3xl mb-3">🏪</div>
              <div className="font-semibold text-gray-900 group-hover:text-lime-800 transition">Find Dispensaries</div>
              <div className="text-gray-700 text-sm">Near you</div>
            </Link>

            {/* Explore Strains Card */}
            <Link 
              href="/strains"
              className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-3xl mb-3">🌿</div>
              <div className="font-semibold text-gray-900 group-hover:text-lime-800 transition">Explore Strains</div>
              <div className="text-gray-700 text-sm">All types</div>
            </Link>

            {/* Best Deals Card */}
            <Link 
              href="/deals"
              className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-3xl mb-3">💰</div>
              <div className="font-semibold text-gray-900 group-hover:text-lime-800 transition">Best Deals</div>
              <div className="text-gray-700 text-sm">Daily</div>
            </Link>

            {/* Latest News Card */}
            <Link 
              href="/news"
              className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40 hover:bg-white/50 transition cursor-pointer group"
            >
              <div className="text-3xl mb-3">📰</div>
              <div className="font-semibold text-gray-900 group-hover:text-lime-800 transition">Latest News</div>
              <div className="text-gray-700 text-sm">Updates</div>
            </Link>
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





