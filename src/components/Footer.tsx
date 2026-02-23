import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="/api-docs" className="hover:text-white transition">API Docs</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/dispensaries" className="hover:text-white transition">Dispensaries</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition">Doctors</Link></li>
              <li><Link href="/strains" className="hover:text-white transition">Strains</Link></li>
              <li><Link href="/deals" className="hover:text-white transition">Deals</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition">Delivery</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/news" className="hover:text-white transition">News</Link></li>
              <li><Link href="/laws" className="hover:text-white transition">Cannabis Laws</Link></li>
              <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Comparisons</Link></li>
              <li><Link href="/badges" className="hover:text-white transition">Dispensary Badges</Link></li>
            </ul>
          </div>

          {/* Popular States */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular States</h3>
            <ul className="space-y-2">
              <li><Link href="/dispensaries/california" className="hover:text-white transition">California</Link></li>
              <li><Link href="/dispensaries/colorado" className="hover:text-white transition">Colorado</Link></li>
              <li><Link href="/dispensaries/florida" className="hover:text-white transition">Florida</Link></li>
              <li><Link href="/dispensaries/michigan" className="hover:text-white transition">Michigan</Link></li>
              <li><Link href="/dispensaries/new-york" className="hover:text-white transition">New York</Link></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li><Link href="/dispensaries/california/los-angeles" className="hover:text-white transition">Los Angeles</Link></li>
              <li><Link href="/dispensaries/colorado/denver" className="hover:text-white transition">Denver</Link></li>
              <li><Link href="/dispensaries/california/san-francisco" className="hover:text-white transition">San Francisco</Link></li>
              <li><Link href="/dispensaries/arizona/phoenix" className="hover:text-white transition">Phoenix</Link></li>
              <li><Link href="/dispensaries/illinois/chicago" className="hover:text-white transition">Chicago</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-bold">Leefii</span>
          </div>
          <p className="text-sm text-center md:text-right">
            © {new Date().getFullYear()} Leefii. All rights reserved.<br />
            <span className="text-xs">Must be 21+ to use this site. Please consume responsibly.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
