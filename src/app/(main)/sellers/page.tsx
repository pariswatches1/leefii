import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Browse Sellers - Cannabis & CBD Sellers | Leefii',
  description: 'Discover verified cannabis and CBD sellers on Leefii. Browse dispensaries, brands, and retailers near you.',
};

export const revalidate = 60;

export default async function SellersPage() {
  const sellers = await prisma.sellerProfile.findMany({
    where: { isActive: true },
    orderBy: [{ subscriptionTier: 'desc' }, { createdAt: 'desc' }],
    include: {
      products: {
        where: { isAvailable: true },
        select: { id: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Sellers</h1>
          <p className="text-green-100 text-lg">
            Discover verified cannabis and CBD sellers on Leefii
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sellers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/sellers/${seller.slug}`}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group"
              >
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 relative">
                  {seller.banner && (
                    <img
                      src={seller.banner}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  {seller.subscriptionTier === 'PREMIUM' && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                      Premium
                    </span>
                  )}
                </div>

                <div className="p-6 relative">
                  {/* Logo */}
                  <div className="absolute -top-8 left-6 w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center border-4 border-white">
                    {seller.logo ? (
                      <img
                        src={seller.logo}
                        alt={seller.businessName}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-green-600 font-bold text-2xl">
                        {seller.businessName[0]}
                      </span>
                    )}
                  </div>

                  <div className="pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
                      {seller.businessName}
                    </h2>
                    {(seller.city || seller.state) && (
                      <p className="text-gray-500 text-sm mt-1">
                        {[seller.city, seller.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {seller.description && (
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                        {seller.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {seller.products.length} product{seller.products.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        View Store →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Sellers Yet</h2>
            <p className="text-gray-600 mb-8">
              Be the first to sell on Leefii marketplace!
            </p>
            <Link
              href="/sell"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Become a Seller
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
