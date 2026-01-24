import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seller = await prisma.sellerProfile.findUnique({
    where: { slug, isActive: true },
  });

  if (!seller) {
    return { title: 'Seller Not Found | Leefii' };
  }

  return {
    title: `${seller.businessName} | Leefii Marketplace`,
    description: seller.description?.slice(0, 160) || `Shop products from ${seller.businessName} on Leefii Marketplace.`,
  };
}

export const revalidate = 60;

export default async function SellerPage({ params }: Props) {
  const { slug } = await params;

  const seller = await prisma.sellerProfile.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          category: { select: { name: true } },
        },
      },
    },
  });

  if (!seller) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-green-500 to-green-600 relative">
        {seller.banner && (
          <img
            src={seller.banner}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-sm flex items-center justify-center border-4 border-white -mt-16 md:-mt-20">
                {seller.logo ? (
                  <img
                    src={seller.logo}
                    alt={seller.businessName}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-green-600 font-bold text-4xl">
                    {seller.businessName[0]}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {seller.businessName}
                  </h1>
                  {seller.subscriptionTier === 'PREMIUM' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                      Premium Seller
                    </span>
                  )}
                </div>
                {(seller.city || seller.state) && (
                  <p className="text-gray-500 mt-1">
                    {[seller.city, seller.state].filter(Boolean).join(', ')}
                  </p>
                )}
                {seller.description && (
                  <p className="text-gray-600 mt-3 max-w-2xl">
                    {seller.description}
                  </p>
                )}
              </div>

              {/* Contact */}
              <div className="flex gap-3">
                {seller.website && (
                  <a
                    href={seller.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Website
                  </a>
                )}
                {seller.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Contact
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="pb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Products ({seller.products.length})
          </h2>

          {seller.products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {seller.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/marketplace/product/${product.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        📦
                      </div>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    {product.category && (
                      <span className="text-xs text-gray-500">
                        {product.category.name}
                      </span>
                    )}
                    <h3 className="font-medium text-gray-900 mt-1 line-clamp-2 group-hover:text-green-600 transition">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-green-600 font-semibold">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-gray-400 text-sm line-through">
                          ${Number(product.compareAtPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600">
                This seller has not listed any products yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
