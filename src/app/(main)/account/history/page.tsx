import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function ClickHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Get click history
  const clicks = await prisma.leadReferral.findMany({
    where: { userId: session.user.id },
    orderBy: { clickedAt: 'desc' },
    take: 50,
    include: {
      product: {
        select: {
          name: true,
          slug: true,
          images: true,
          price: true,
        },
      },
      seller: {
        select: {
          businessName: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  // Group by date
  const groupedClicks: Record<string, typeof clicks> = {};
  clicks.forEach((click) => {
    const date = new Date(click.clickedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groupedClicks[date]) {
      groupedClicks[date] = [];
    }
    groupedClicks[date].push(click);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Click History</h1>
        <p className="text-gray-500 mt-1">
          Track your interactions with products and sellers
        </p>
      </div>

      {clicks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🖱️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h2>
          <p className="text-gray-500 mb-6">
            When you click &quot;Buy Now&quot; on products, your activity will appear here.
          </p>
          <Link
            href="/marketplace"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedClicks).map(([date, dateClicks]) => (
            <div key={date}>
              <h2 className="text-sm font-medium text-gray-500 mb-3">{date}</h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {dateClicks.map((click) => (
                    <div key={click.id} className="px-6 py-4 flex items-center gap-4">
                      {/* Product/Seller Image */}
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {click.product?.images?.[0] ? (
                          <img
                            src={click.product.images[0]}
                            alt={click.product.name}
                            className="w-14 h-14 object-cover"
                          />
                        ) : click.seller?.logo ? (
                          <img
                            src={click.seller.logo}
                            alt={click.seller.businessName}
                            className="w-14 h-14 object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {click.product ? (
                          <>
                            <p className="font-medium text-gray-900 truncate">
                              {click.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {click.seller?.businessName || 'Unknown Seller'}
                            </p>
                            {click.product.price && (
                              <p className="text-sm text-green-600 font-medium">
                                ${Number(click.product.price).toFixed(2)}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900 truncate">
                              {click.seller?.businessName || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">Store visit</p>
                          </>
                        )}
                      </div>

                      {/* Time */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(click.clickedAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          click.status === 'CLICKED' ? 'bg-blue-100 text-blue-700' :
                          click.status === 'CONVERTED' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {click.status === 'CLICKED' ? 'Visited' : click.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {click.product?.slug && (
                          <Link
                            href={`/marketplace/product/${click.product.slug}`}
                            className="text-gray-400 hover:text-green-600 transition"
                            title="View product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        )}
                        <a
                          href={click.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-green-600 transition"
                          title="Visit seller website"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">About Click Tracking</h3>
        <p className="text-sm text-blue-700">
          When you click &quot;Buy Now&quot; on a product, we redirect you to the seller&apos;s website
          to complete your purchase. We track these clicks to help you keep a record of
          products you&apos;ve shown interest in. No checkout happens on Leefii - all purchases
          are completed directly with the seller.
        </p>
      </div>
    </div>
  );
}
