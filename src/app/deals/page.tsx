import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cannabis Deals & Discounts | Leefii',
  description: 'Find the best cannabis deals and discounts at dispensaries near you. Daily specials, first-time patient offers, and more.',
};

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Cannabis Deals</h1>
          <p className="text-green-100 text-lg">
            Find the best discounts and specials at dispensaries near you
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="text-6xl mb-6">💰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deals Coming Soon!</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're working hard to bring you the best cannabis deals from dispensaries across the country. Check back soon!
          </p>
          <Link
            href="/dispensaries"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Browse Dispensaries
          </Link>
        </div>
      </div>
    </div>
  );
}
