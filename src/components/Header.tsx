import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Leefii</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dispensaries" className="text-gray-600 hover:text-green-600 transition">
              Dispensaries
            </Link>
            <Link href="/marketplace" className="text-gray-600 hover:text-green-600 transition">
              Marketplace
            </Link>
            <Link href="/strains" className="text-gray-600 hover:text-green-600 transition">
              Strains
            </Link>
            <Link href="/deals" className="text-gray-600 hover:text-green-600 transition">
              Deals
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-green-600 transition">
              News
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-green-600 transition">
              Blog
            </Link>
            <Link href="/sell" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">
              Sell on Leefii
            </Link>
          </div>

          {/* Search Icon */}
          <div className="flex items-center">
            <Link href="/search" className="p-2 text-gray-500 hover:text-green-600 transition" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
