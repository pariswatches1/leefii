import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AccountDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Get user stats
  const [favoriteCount, recentClicks, journalCount] = await Promise.all([
    prisma.favorite.count({
      where: { userId: session.user.id },
    }),
    prisma.leadReferral.findMany({
      where: { userId: session.user.id },
      orderBy: { clickedAt: 'desc' },
      take: 5,
      include: {
        product: { select: { name: true, slug: true, images: true } },
        seller: { select: { businessName: true, slug: true } },
      },
    }),
    prisma.journalEntry.count({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your saved items and track your activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/account/favorites"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{favoriteCount}</p>
              <p className="text-sm text-gray-500">Saved Items</p>
            </div>
          </div>
        </Link>

        <Link
          href="/account/history"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recentClicks.length}</p>
              <p className="text-sm text-gray-500">Recent Clicks</p>
            </div>
          </div>
        </Link>

        <Link
          href="/account/journal"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{journalCount}</p>
              <p className="text-sm text-gray-500">Journal Entries</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        </div>
        {recentClicks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentClicks.map((click) => (
              <div key={click.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {click.product?.images?.[0] ? (
                    <img
                      src={click.product.images[0]}
                      alt={click.product.name}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {click.product?.name || 'Product'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {click.seller?.businessName || 'Seller'} &middot; Clicked{' '}
                    {new Date(click.clickedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={click.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Visit →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-gray-500 mb-4">
              No activity yet. Start browsing products and dispensaries!
            </p>
            <Link
              href="/marketplace"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Browse Marketplace
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Link
          href="/marketplace"
          className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white hover:from-green-700 hover:to-green-600 transition"
        >
          <h3 className="text-lg font-semibold mb-2">Explore Marketplace</h3>
          <p className="text-green-100 text-sm">
            Discover products from verified sellers
          </p>
        </Link>
        <Link
          href="/dispensaries"
          className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl p-6 text-white hover:from-purple-700 hover:to-purple-600 transition"
        >
          <h3 className="text-lg font-semibold mb-2">Find Dispensaries</h3>
          <p className="text-purple-100 text-sm">
            Locate dispensaries near you
          </p>
        </Link>
      </div>
    </div>
  );
}
